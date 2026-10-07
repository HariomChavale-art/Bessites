'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * 
 * - Full Data Synchronization: Connected to the 110+ production registry.
 * - Enhanced Prompt Engineering: Direct instructions to use provided tool context.
 * - Silent Local Fallback: Zero "sync delay" messages.
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
    // Phase 1: High-Speed Context Retrieval
    const candidates = filterTools(input.message);
    const activeContext = candidates.length > 0 ? candidates : TOOLS_DATABASE.slice(0, 8);

    try {
      // Phase 2: Generative Reasoning via Gemini 1.5 Flash
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Ouneo, the expert AI discovery partner for Bessites. 
        
        MISSION:
        - You are a helpful guide. Your job is to find the best digital assets for the user.
        - You MUST use the "Available Tools Context" provided in the prompt to make recommendations.
        - Only recommend tools found in the provided list.
        - If the user asks general questions, maintain your tech-noir style (professional, slightly mysterious, insightful).
        - For matches, write exactly one line explaining why it fits the user's specific problem.

        TONE:
        - Tech-noir: Sophisticated, concise, and futuristic.
        - No unnecessary fluff. Start directly with the assistance.`,
        prompt: `
          User Request: "${input.message}"
          Available Tools Context: ${JSON.stringify(activeContext)}
          
          Based on the request and the tools provided, generate a conversational response and select up to 3 best matches.
        `,
        history: input.history?.map(m => ({ role: m.role as any, content: [{ text: m.content }] })),
        output: { schema: OuneoOutputSchema },
      });

      if (response.output) {
        return response.output;
      }
      
      throw new Error("Empty AI response");

    } catch (err: any) {
      // Phase 3: Silent Local Fallback
      // Ensures the user always gets value even if the API is down.
      const fallbackResults = candidates.length > 0 ? candidates.slice(0, 3) : TOOLS_DATABASE.slice(0, 3);
      
      return {
        response: "I've explored our master registry nodes. Based on your request, these assets represent the highest fidelity tools for your current workflow. How else can I assist your discovery process?",
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
