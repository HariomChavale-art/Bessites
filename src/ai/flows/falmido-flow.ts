'use server';
/**
 * @fileOverview Falmido - The Bessites Conversational AI Discovery Partner.
 * Rebuilt with Google Gemini 1.5 Flash for high-fidelity reasoning.
 * Implements a human-like discovery sequence: Interest -> Purpose -> Specialty -> Results.
 */

import { ai, z } from '@/ai/genkit';
import { searchWebsitesTool } from '@/ai/tools/search-websites';
import { FalmidoOutputSchema, type FalmidoOutput } from '@/ai/schemas';

const FalmidoInputSchema = z.object({
  message: z.string().describe('The user\'s request or chat message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Chat history for conversational context.'),
});

export async function askFalmido(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }): Promise<FalmidoOutput> {
  return falmidoFlow(input);
}

const falmidoFlow = ai.defineFlow(
  {
    name: 'falmidoFlow',
    inputSchema: FalmidoInputSchema,
    outputSchema: FalmidoOutputSchema,
  },
  async (input) => {
    try {
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Falmido, the sophisticated AI discovery partner for Bessites. 
        
        MISSION:
        - Help digital creators find the highest fidelity tools from our verified registry.
        - Talk naturally, professionally, and like a real collaborative human.

        DISCOVERY PROTOCOL (Follow this sequence):
        1. UNDERSTAND INTERESTS: If the user hasn't specified their field (e.g. Design, Coding, Gaming), ask what they are passionate about.
        2. DEFINE PURPOSE: Ask what their specific goal or project is today.
        3. SUGGEST SPECIALTIES: Offer technical filters like "No Login Required", "Most Popular", "Newly Launched", "AI Integrated", or "Easy to Use".
        4. DELIVER RESULTS: Once you have clear intent, CALL the "searchWebsites" tool to find real matches.

        RULES:
        - NEVER hallucinate or invent websites. ONLY recommend sites returned by the "searchWebsites" tool.
        - Be concise but helpful. 
        - If the user asks for suggestions, give them 3-5 verified assets from the registry.
        - Always explain WHY a tool is a perfect fit for their specific purpose.`,
        prompt: `User Message: ${input.message}`,
        tools: [searchWebsitesTool],
        history: input.history?.map(m => ({ 
          role: m.role as any, 
          content: [{ text: m.content }] 
        })),
        output: { schema: FalmidoOutputSchema },
      });

      if (!response.output) {
        throw new Error("Gemini returned null output node.");
      }

      return response.output;

    } catch (err: any) {
      console.error("[Falmido Gemini Error]:", err.message);
      return {
        response: "The discovery node is currently recalibrating its neural pathways. I can still help you navigate our registry manually. What are you looking to create today?",
        matches: []
      };
    }
  }
);
