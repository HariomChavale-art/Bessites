'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * Powered by Gemini 1.5 Flash for high-velocity, hallucination-free results.
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
        system: `You are Bessites AI (Ouneo). You have 1000 real websites in database: ${JSON.stringify(allSites.slice(0, 500))}. 

        INSTRUCTIONS:
        1. Talk like a professional discovery partner.
        2. Pick 2-3 sites from the registry provided.
        3. Give name, reason, and url.
        4. NO FAKE SITES. NO HALLUCINATION.`,
        prompt: `User Request: ${input.message}`,
        output: { schema: OuneoOutputSchema },
        config: { temperature: 0.1 }
      });

      return output || { response: "No perfect match found in the registry.", matches: [] };

    } catch (err: any) {
      console.error("[Ouneo Flow Error]:", err.message);
      return {
        response: "I'm experiencing a high-velocity recalibration. What are you looking to discover today?",
        matches: []
      };
    }
  }
);
