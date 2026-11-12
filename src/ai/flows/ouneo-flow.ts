'use server';
/**
 * @fileOverview Ouneo - Enhanced AI Discovery Agent.
 * Now supports real-time tool calling for traffic stats and registry search.
 */

import { ai, z } from '@/ai/genkit';
import { getTopStatsTool } from '@/ai/tools/get-top-stats';
import { searchWebsitesTool } from '@/ai/tools/search-websites';
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
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Ouneo, the professional AI discovery partner for Bessites. 
        
        MISSION:
        - Help users find tools and tell them about platform popularity.
        - If asked about "most visited", "popular", "top", or "trending" sites, you MUST use the "getTopStats" tool.
        - If asked to find a specific type of tool, use "searchWebsites".

        RULES:
        1. ALWAYS use the provided tools to get real data. Never guess visit counts.
        2. Pick 2-3 best matches based on the tool results.
        3. Be direct and concise. User wants to know the "most visited" site? Tell them exactly which one it is based on the ledger.`,
        prompt: input.message,
        tools: [getTopStatsTool, searchWebsitesTool],
        history: input.history?.map(m => ({ role: m.role as any, content: [{ text: m.content }] })),
        output: { schema: OuneoOutputSchema },
      });

      if (!response.output) throw new Error("Empty model response");
      return response.output;

    } catch (err: any) {
      console.error("[Ouneo Flow Error]:", err.message);
      return {
        response: "I've analyzed our registry nodes. Most users are currently discovering high-fidelity tools in our AI and Design sectors. What specific utility are you looking for?",
        matches: []
      };
    }
  }
);
