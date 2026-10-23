'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * Powered by Gemini 1.5 Flash for high-velocity results across the full registry.
 */

import { ai, z } from '@/ai/genkit';
import allSites from '@/data/allSites.json';
import { OuneoOutputSchema, type OuneoOutput } from '@/ai/schemas';

const OuneoInputSchema = z.object({
  message: z.string().describe('The user\'s request.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Chat history.'),
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
    try {
      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Bessites AI (Ouneo). You have full access to our registry of 1,000 real websites. 
        
        REGISTRY DATA: ${JSON.stringify(allSites)}

        INSTRUCTIONS:
        1. Be direct, efficient, and professional. 
        2. Recommend exactly 2-3 REAL websites from the registry that match the user's intent.
        3. Provide the website name, a sharp reason for the recommendation, and the correct URL.
        4. No preachy language. No "As an AI...". Just provide high-fidelity discovery.
        5. If no perfect match exists, guide the user to a relevant broad category.`,
        prompt: `User Request: ${input.message}`,
        output: { schema: OuneoOutputSchema },
        config: { temperature: 0.1 }
      });

      return output || { response: "I've analyzed our registry and couldn't find a direct match. Try exploring our broad categories like Design or Development.", matches: [] };

    } catch (err: any) {
      console.error("[Ouneo Flow Error]:", err.message);
      return {
        response: "The discovery system is currently undergoing synchronization. Please try your request again in a moment.",
        matches: []
      };
    }
  }
);
