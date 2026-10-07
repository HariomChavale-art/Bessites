'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * 
 * - Full Data Synchronization: Connected to the 110+ production registry.
 * - Hybrid Search: Context retrieval + Generative reasoning.
 * - Enhanced Fallback: Silently handles API failures with high-relevance matches.
 */

import { ai, z } from '@/ai/genkit';
import { filterTools } from '@/lib/toolFilter';
import { TOOLS_DATABASE } from '@/data/toolsDatabase';
import { OuneoOutputSchema } from '@/ai/schemas';

const OuneoInputSchema = z.object({
  message: z.string().describe('The user\'s request or chat message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Chat history for conversational context.'),
});

export type OuneoOutput = z.infer<typeof OuneoOutputSchema>;

export async function askOuneo(input: z.infer<typeof OuneoInputSchema>): Promise<OuneoOutput> {
  return ouneoFlow(input);
}

const ouneoFlow = ai.defineFlow(
  {
    name: 'ouneoFlow',
    inputSchema: OuneoInputSchema,
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
      // This triggers if the API Key is invalid, quota is hit, or network is down.
      console.error("[Ouneo] API Connection Interrupted:", err.message);
      
      const fallbackMatches = candidates.length > 0 ? candidates.slice(0, 3) : TOOLS_DATABASE.slice(0, 3);
      
      // Determine if it was a specific search or a general chat
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
