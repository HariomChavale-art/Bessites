'use server';
/**
 * @fileOverview Ouneo - Rebuilt Website Recommender.
 * Strictly anchored to the Bessites database. 
 * Enforces human-like conversation and clarifying questions.
 */

import { ai, z } from '@/ai/genkit';
import { filterTools } from '@/lib/toolFilter';
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
    const candidates = filterTools(input.message);
    const registryContext = candidates.length > 0 ? candidates : TOOLS_DATABASE.slice(0, 10);
    
    // Determine if we should ask a clarifying question (usually on first message or broad query)
    const isInitialMessage = !input.history || input.history.length === 0;

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-flash-latest',
        system: `You are Ouneo, a friend who knows the best websites on Bessites.
        
        RULES:
        - You ONLY recommend sites from the provided registry.
        - NEVER recommend ChatGPT, Claude, or anything not in the list.
        - NO AI SLOP. Do not say "I've found," "match your request," or "industry-standard."
        - Be short and human.
        - MANDATORY: If this is a new topic or the user is broad, ask ONE short question to narrow it down before giving links.
        - If query doesn't match any site, say: "No site for that yet. What are you trying to do?" and ask a question.
        - Max 8 words per site description.`,
        prompt: `
          REGISTRY: ${JSON.stringify(registryContext)}
          USER: "${input.message}"
          
          TASK: If the user is broad, ask a clarifying question. If they answered your question, give 2-3 sites from the REGISTRY above. 
          Use human descriptions like "Makes logos in 30 sec. Free."
        `,
        history: input.history?.map(m => ({ 
          role: m.role as any, 
          content: [{ text: m.content }] 
        })),
        output: { schema: OuneoOutputSchema },
      });

      if (response.output) return response.output;
      throw new Error("No output");

    } catch (err) {
      // Fallback
      return {
        response: "What are you trying to build today? Need something free or pro?",
        matches: []
      };
    }
  }
);
