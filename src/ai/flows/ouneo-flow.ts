'use server';
/**
 * @fileOverview Ouneo - The Bessites AI Tool Guide.
 * 
 * - askOuneo: Conversational discovery flow to find the best tools.
 */

import { ai, z } from '@/ai/genkit';
import { searchWebsitesTool } from '@/ai/tools/search-websites';

const OuneoInputSchema = z.object({
  message: z.string().describe('The user\'s problem or tool request in natural language.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Conversation history for context.'),
});

const OuneoOutputSchema = z.object({
  response: z.string().describe('A brief, helpful conversational response.'),
  matches: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    reason: z.string().describe('One line explaining why this is perfect for the user.'),
    url: z.string(),
    category: z.string(),
  })).max(3).describe('Top 3 best matching tools from the registry.'),
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
    try {
      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        system: `You are Ouneo, the expert AI discovery partner for Bessites. 
        
        MISSION:
        - Solve user problems by finding the 3 most relevant tools from our registry.
        - You MUST use the "searchWebsites" tool to find candidate websites.
        - Analyze the search results and pick the best 3.
        - For each match, provide a one-sentence "reason" why it specifically solves their input.
        
        TONE:
        - Professional, insightful, and concise. 
        - Minimalist "tech-noir" vibe.
        
        FALLBACK:
        - If no direct match is found, say "I couldn't find a direct match in our registry yet, but you might find these relevant..." and suggest the closest categories.`,
        prompt: input.message,
        tools: [searchWebsitesTool],
        history: input.history?.map(m => ({ role: m.role as any, content: [{ text: m.content }] })),
        output: { schema: OuneoOutputSchema },
      });

      if (!response.output) {
        throw new Error("No response from Ouneo engine.");
      }

      return response.output;
    } catch (err: any) {
      console.error("OUNEO_ENGINE_FAILURE:", err);
      return {
        response: "I've encountered a sync delay with our tool registry. Please try searching for specific categories like 'AI Image' or 'Design'.",
        matches: []
      };
    }
  }
);
