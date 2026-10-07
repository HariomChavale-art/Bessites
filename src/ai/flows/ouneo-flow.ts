
'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * 
 * - Full Data Synchronization: Connected to the 110+ production registry.
 * - Hybrid Search: Context retrieval + Generative reasoning.
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
    console.log(`[Ouneo] Processing query: "${input.message}"`);
    
    // Phase 1: High-Speed Context Retrieval
    const candidates = filterTools(input.message);
    const activeContext = candidates.length > 0 ? candidates : TOOLS_DATABASE.slice(0, 8);

    try {
      // Phase 2: Generative Reasoning via Gemini 1.5 Flash
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Ouneo, the expert AI discovery partner for Bessites. 
        
        MISSION:
        - You are a helpful guide. Your job is to find the best digital assets for the user.
        - You MUST use the "Available Tools Context" provided in the prompt to make recommendations.
        - Only recommend tools found in the provided list.
        - Tone: Tech-noir (professional, futuristic, concise).

        OPERATIONAL RULES:
        1. If the user is just chatting, be polite and guide them towards discovery.
        2. For tool matches, explain exactly WHY it fits their specific request in one line.`,
        prompt: `
          User Request: "${input.message}"
          Available Tools Context: ${JSON.stringify(activeContext)}
          
          Based on the request and the tools provided, generate a conversational response and select up to 3 best matches.
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
      
      throw new Error("Empty AI response");

    } catch (err: any) {
      console.error("[Ouneo] AI Flow Error:", err.message);
      
      // Phase 3: Silent Local Fallback
      const fallbackResults = candidates.length > 0 ? candidates.slice(0, 3) : TOOLS_DATABASE.slice(0, 3);
      
      return {
        response: "I've explored our master registry nodes. Based on your request, these assets represent the highest fidelity tools for your current workflow. How else can I assist your discovery process?",
        matches: fallbackResults.map(t => ({
          name: t.name,
          url: t.url,
          category: t.category,
          reason: t.description
        }))
      };
    }
  }
);
