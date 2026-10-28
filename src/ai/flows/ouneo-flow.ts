'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * Powered by Gemini 1.5 Flash with high-speed local filtering for accuracy.
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
    // Local Filter Step: Narrow down the registry to prevent "Unexpected end of JSON" 
    // and context window overflow during LLM processing.
    const query = input.message.toLowerCase();
    const relevantSites = allSites
      .map(site => {
        let score = 0;
        if (site.title.toLowerCase().includes(query)) score += 10;
        if (site.category.toLowerCase().includes(query)) score += 5;
        if (site.description.toLowerCase().includes(query)) score += 2;
        return { ...site, score };
      })
      .filter(s => s.score > 0 || query.length < 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    const contextRegistry = relevantSites.length > 0 ? relevantSites : allSites.slice(0, 10);

    try {
      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Ouneo, the professional AI discovery partner for Bessites. 
        
        MISSION:
        - Identify the best digital assets from the provided registry subset.
        - Be direct, professional, and efficient.

        RULES:
        1. ONLY recommend real websites from the AVAILABLE REGISTRY below.
        2. Pick exactly 2-3 best matches.
        3. Provide a clear reason for each recommendation.
        4. If no good matches exist in the subset, guide the user to browse our broad categories.`,
        prompt: `
          AVAILABLE REGISTRY: ${JSON.stringify(contextRegistry)}
          USER REQUEST: "${input.message}"
        `,
        output: { schema: OuneoOutputSchema },
        config: { temperature: 0.1 }
      });

      if (!output) throw new Error("Empty model response");
      return output;

    } catch (err: any) {
      console.error("[Ouneo Flow Error]:", err.message);
      return {
        response: "I've analyzed our registry and suggest exploring our broad categories for the best tools. How else can I assist your discovery journey?",
        matches: []
      };
    }
  }
);
