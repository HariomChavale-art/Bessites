
'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * 
 * - Full Data Synchronization: Connected to the 405+ production registry.
 * - Hybrid Search: Context retrieval + Generative reasoning.
 * - Enhanced Fallback: Silently handles API failures with high-relevance matches.
 */

import { ai, z } from '@/ai/genkit';
import { filterTools } from '@/lib/toolFilter';
import { TOOLS_DATABASE } from '@/data/toolsDatabase';
import { OuneoOutputSchema, type OuneoOutput } from '@/ai/schemas';

const OuneoInputSchema = z.object({
  message: z.string().describe('The user\'s request or chat message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Chat history for conversational context.'),
});

export async function askOuneo(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }): Promise<OuneoOutput> {
  return ouneoFlow(input);
}

const ouneoFlow = ai.defineFlow(
  {
    name: 'ouneoFlow',
    inputSchema: OuneoInputSchema,
    outputSchema: OuneoOutputSchema,
  },
  async (input) => {
    console.log(`[Ouneo] Processing Request: "${input.message}"`);
    
    // Step 1: Pre-fetch relevant candidates from the master registry (405 tools)
    const candidates = filterTools(input.message);
    const activeContext = candidates.length > 0 ? candidates : TOOLS_DATABASE.slice(0, 10);

    try {
      // Step 2: Generative reasoning with strict output control
      const response = await ai.generate({
        model: 'googleai/gemini-flash-latest',
        system: `You are Ouneo, the professional AI discovery partner for Bessites. 
        
        MISSION:
        - Identify and recommend the best websites from the Bessites registry (405 verified items).
        - DO NOT echo or repeat the user's question back to them.
        - Be a helpful, professional guide.

        CONSTRAINTS:
        - ONLY use the websites listed in the provided registry context.
        - For every website recommended, provide a sharp, one-sentence reason why it is a great fit.`,
        prompt: `
          REGISTRY CONTEXT: ${JSON.stringify(activeContext)}
          USER REQUEST: "${input.message}"
          
          TASK: Pick the best 3 matches. If they are just chatting, guide them towards website discovery.
        `,
        history: input.history?.map(m => ({ 
          role: m.role as any, 
          content: [{ text: m.content }] 
        })),
        output: { schema: OuneoOutputSchema },
      });

      if (response.output) {
        return response.output;
      }
      
      throw new Error("API returned null output");

    } catch (err: any) {
      // Step 3: High-Fidelity Local Fallback
      console.error("[Ouneo] API Connection Interrupted:", err.message);
      
      const fallbackMatches = candidates.length > 0 ? candidates.slice(0, 3) : TOOLS_DATABASE.slice(0, 3);
      const isSearch = candidates.length > 0;
      const responseText = isSearch 
        ? `I've analyzed our registry for "${input.message}". These verified websites represent the highest fidelity tools for your current workflow.`
        : `Welcome to Ouneo. I'm here to help you navigate our registry of 405 professional websites. What are you looking to create today?`;

      return {
        response: responseText,
        matches: fallbackMatches.map(t => ({
          name: t.name,
          url: t.url,
          category: t.category,
          reason: t.description
        }))
      };
    }
  }
);
