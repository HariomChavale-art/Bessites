
'use server';
/**
 * @fileOverview Ouneo - Rebuilt from scratch.
 * Strictly anchored to the Bessites verified registry.
 */

import { ai, z } from '@/ai/genkit';
import { filterTools } from '@/lib/toolFilter';
import { TOOLS_DATABASE } from '@/data/toolsDatabase';
import { OuneoOutputSchema, type OuneoOutput } from '@/ai/schemas';

const OuneoInputSchema = z.object({
  message: z.string().describe('The user\'s discovery request.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Contextual history.'),
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
    // Step 1: High-speed local retrieval from your verified registry
    const candidates = filterTools(input.message);
    const contextRegistry = candidates.length > 0 ? candidates : TOOLS_DATABASE.slice(0, 10);

    try {
      // Step 2: Generative reasoning using ONLY the provided registry items
      const response = await ai.generate({
        model: 'googleai/gemini-flash-latest',
        system: `You are Ouneo, the professional discovery AI for Bessites. 
        
        MISSION:
        - Recommend only the best websites from the provided registry.
        - You have access to a registry of verified high-utility websites.
        - DO NOT suggest websites that are not in the provided context.

        OUTPUT RULES:
        - Be professional, concise, and helpful.
        - For every recommendation, provide a one-sentence reason why it is perfect for the user.`,
        prompt: `
          REGISTRY CONTEXT: ${JSON.stringify(contextRegistry)}
          USER REQUEST: "${input.message}"
          
          TASK: Based ON ONLY the registry above, pick 3 websites. If the user is just saying hello, invite them to search the verified registry.
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
      
      throw new Error("Registry sync error");

    } catch (err: any) {
      // Step 3: Reliable local fallback if API fails
      const fallbackMatches = candidates.slice(0, 3);
      return {
        response: candidates.length > 0 
          ? `I've found these websites in our registry that match your request for "${input.message}".`
          : "Welcome to Ouneo. I'm connected to our registry of professional websites. What are you looking to discover today?",
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
