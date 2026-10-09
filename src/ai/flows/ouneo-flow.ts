
'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * 
 * - Full Data Synchronization: Connected to the 110+ production registry.
 * - Hybrid Search: Context retrieval + Generative reasoning.
 * - Enhanced Fallback: Silently handles API failures with high-relevance matches.
 */

import { ai } from '@/ai/genkit';
import { filterTools } from '@/lib/toolFilter';
import { TOOLS_DATABASE } from '@/data/toolsDatabase';
import { OuneoOutputSchema, type OuneoOutput } from '@/ai/schemas';

const OuneoInputSchema = OuneoOutputSchema.extend({
  message: (await import('genkit')).z.string().describe('The user\'s request or chat message.'),
  history: (await import('genkit')).z.array((await import('genkit')).z.object({
    role: (await import('genkit')).z.enum(['user', 'assistant']),
    content: (await import('genkit')).z.string()
  })).optional().describe('Chat history for conversational context.'),
});

// Since the client needs the type but not the schema execution, we use OuneoOutput from schemas.ts
export async function askOuneo(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }): Promise<OuneoOutput> {
  return ouneoFlow(input);
}

const ouneoFlow = ai.defineFlow(
  {
    name: 'ouneoFlow',
    inputSchema: (await import('genkit')).z.object({
      message: (await import('genkit')).z.string(),
      history: (await import('genkit')).z.array((await import('genkit')).z.object({
        role: (await import('genkit')).z.enum(['user', 'assistant']),
        content: (await import('genkit')).z.string()
      })).optional(),
    }),
    outputSchema: OuneoOutputSchema,
  },
  async (input) => {
    console.log(`[Ouneo] Node Processing: "${input.message}"`);
    
    // Step 1: Pre-fetch relevant candidates from the master registry
    const candidates = filterTools(input.message);
    const activeContext = candidates.length > 0 ? candidates : TOOLS_DATABASE.slice(0, 10);

    try {
      // Step 2: Generative reasoning with strict output control
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Ouneo, the futuristic AI discovery node for Bessites. 
        
        MISSION:
        - Identify and recommend the best digital assets from the provided registry.
        - DO NOT echo or repeat the user's question back to them.
        - DO NOT talk about technical failures or "recalibration."
        - Be a helpful, professional, and concise tech-noir guide.

        CONSTRAINTS:
        - ONLY use the tools listed in the "Available Tools Context".
        - For every tool recommended, provide a sharp, one-sentence reason why it is the "Absolute Discovery" for their request.`,
        prompt: `
          CONTEXT REGISTRY: ${JSON.stringify(activeContext)}
          USER REQUEST: "${input.message}"
          
          TASK: Based on the registry context, generate a conversational response that helps the user. If they asked for a tool, pick the best 3 matches. If they are just chatting, guide them towards tool discovery.
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
        ? `I've analyzed our discovery nodes for "${input.message}". These verified assets represent the highest fidelity tools for your current workflow.`
        : `Welcome to the Bessites Discovery Node. I'm here to help you navigate our registry of 100+ professional digital tools. What are you looking to build today?`;

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
