'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * 
 * - Enhanced Hybrid Logic:
 *   1. Local keyword context retrieval.
 *   2. Full conversational history support.
 *   3. AI reasoning to pick and explain tools.
 *   4. Silent high-quality fallback for stability.
 */

import { ai, z } from '@/ai/genkit';
import { filterTools } from '@/lib/toolFilter';
import { TOOLS_DATABASE } from '@/data/toolsDatabase';

const OuneoInputSchema = z.object({
  message: z.string().describe('The user\'s request or chat message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Chat history for conversational context.'),
});

const OuneoOutputSchema = z.object({
  response: z.string().describe('A helpful conversational response from Ouneo.'),
  matches: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    reason: z.string().describe('One line explaining why this tool is a great fit.'),
    url: z.string(),
    category: z.string(),
  })).max(3).describe('Top best-matching tools from the registry.'),
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
    // Phase 1: Context Retrieval
    const candidates = filterTools(input.message);
    const activeContext = candidates.length > 0 ? candidates : TOOLS_DATABASE.slice(0, 6);

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Ouneo, the expert AI discovery partner for Bessites. 
        
        MISSION:
        - You are a helpful guide, not just a search tool. You talk like a human expert.
        - If the user asks for a tool, pick the 3 best from the PROVIDED CONTEXT.
        - If the user is just chatting or asking general questions, answer normally in your tech-noir style.
        - If you recommend tools, explain WHY they fit the user's specific problem.
        - IMPORTANT: Only recommend tools found in the provided context list.

        TONE:
        - Professional, insightful, and slightly mysterious (tech-noir).
        - Keep responses concise but impactful. No unnecessary fluff.`,
        prompt: `
          User Message: "${input.message}"
          Available Tools Context: ${JSON.stringify(activeContext)}
          
          Based on the message and the tools available, provide a conversational response and select up to 3 matches.
        `,
        history: input.history?.map(m => ({ role: m.role as any, content: [{ text: m.content }] })),
        output: { schema: OuneoOutputSchema },
      });

      if (response.output) {
        return response.output;
      }
      
      throw new Error("Empty AI response");

    } catch (err: any) {
      // Phase 3: Silent Fallback
      console.warn("[Ouneo] API fallback triggered. Serving local results.");
      
      const fallbackResults = candidates.length > 0 ? candidates.slice(0, 3) : TOOLS_DATABASE.slice(0, 3);
      
      return {
        response: "Based on our current tool registry, I recommend these high-impact assets for your workflow. What else are you looking to build?",
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
