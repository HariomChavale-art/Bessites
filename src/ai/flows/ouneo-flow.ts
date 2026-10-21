'use server';
/**
 * @fileOverview Ouneo - The Bessites Website Recommender.
 * Uses the full 405+ website registry to provide human-like recommendations.
 */

import { ai, z } from '@/ai/genkit';
import { TOOLS_DATABASE } from '@/data/toolsDatabase';
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
    // Provide the full registry context to the model
    const registryContext = TOOLS_DATABASE;

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-flash-latest',
        system: `You are Ouneo, a friend who knows every website on Bessites.
        
        REGISTRY: ${JSON.stringify(registryContext)}

        RULES:
        - You ONLY recommend sites from the REGISTRY above. Never make up names.
        - Talk like a human friend. No AI jargon. 
        - NEVER say "I've found," "match your request," or "here are some sites."
        - MANDATORY: If the user is broad (e.g. "I need help" or "hello"), ask ONE short question to narrow it down (e.g. "For work or fun?").
        - After they answer your question, give 2-3 specific sites.
        - Descriptions must be human and max 8 words (e.g. "Makes logos in 30 sec. Free.").
        - If no site fits, say: "Don't have a site for that yet. What else you working on?"`,
        prompt: `User Message: "${input.message}"`,
        history: input.history?.map(m => ({ 
          role: m.role as any, 
          content: [{ text: m.content }] 
        })),
        output: { schema: OuneoOutputSchema },
      });

      if (response.output) return response.output;
      throw new Error("Empty AI response");

    } catch (err) {
      console.error("Ouneo Server Error:", err);
      return {
        response: "I'm having a quick reset. What are you looking to build today?",
        matches: []
      };
    }
  }
);
