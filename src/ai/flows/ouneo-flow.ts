'use server';
/**
 * @fileOverview Ouneo - The Bessites AI Tool Guide.
 * 
 * - Enhanced Hybrid Discovery Logic:
 *   1. Local keyword filtration for speed and candidate selection.
 *   2. AI Semantic re-ranking and reasoning.
 *   3. Silent high-quality fallback to local registry if API fails.
 */

import { ai, z } from '@/ai/genkit';
import { filterTools } from '@/lib/toolFilter';
import { TOOLS_DATABASE } from '@/data/toolsDatabase';

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
    // Phase 1: Local candidate filtration
    const candidates = filterTools(input.message);
    
    // If no local matches, use a curated set of popular tools for the AI to work with
    const activeContext = candidates.length > 0 ? candidates : TOOLS_DATABASE.slice(0, 6);

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Ouneo, the expert AI discovery partner for Bessites. 
        
        MISSION:
        - Analyze the user request and select the best 3 tools from the PROVIDED CONTEXT.
        - You MUST only recommend tools from the provided context list.
        - For each match, provide a one-sentence "reason" why it solves their problem.
        
        TONE:
        - Professional, insightful, and concise. 
        - No fluff. Minimalist tech-noir vibe.`,
        prompt: `
          User Request: "${input.message}"
          Available Tools Context: ${JSON.stringify(activeContext)}
          
          Pick the 3 most relevant tools and explain why they fit.
        `,
        history: input.history?.map(m => ({ role: m.role as any, content: [{ text: m.content }] })),
        output: { schema: OuneoOutputSchema },
      });

      if (response.output && response.output.matches && response.output.matches.length > 0) {
        return response.output;
      }
      
      throw new Error("Empty AI output");

    } catch (err: any) {
      // Phase 3: Silent Fallback - User gets real results even if AI fails
      console.warn("[Ouneo] API fallback triggered. Serving local results.");
      
      const fallbackResults = candidates.length > 0 ? candidates.slice(0, 3) : TOOLS_DATABASE.slice(0, 3);
      
      return {
        response: "Based on our current tool registry, these high-impact assets are perfect for your workflow:",
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
