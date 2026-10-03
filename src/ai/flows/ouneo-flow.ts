'use server';
/**
 * @fileOverview Ouneo - The Bessites AI Tool Guide.
 * 
 * - askOuneo: Conversational discovery flow to find the best tools.
 * - Updated to use gemini-1.5-flash and include a trending fallback.
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

// Default trending tools to use as fallback if no results are found
const TRENDING_FALLBACK = [
  {
    name: "Aceternity UI",
    reason: "A trending collection of modern animated UI components for high-end web design.",
    url: "https://ui.aceternity.com",
    category: "Design"
  },
  {
    name: "Spline 3D",
    reason: "The easiest way to build and publish interactive 3D web experiences.",
    url: "https://spline.design",
    category: "3D Design"
  },
  {
    name: "Godly",
    reason: "A strictly curated gallery of the world's best web design projects.",
    url: "https://godly.website",
    category: "Inspiration"
  }
];

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
        model: 'googleai/gemini-1.5-flash',
        system: `You are Ouneo, the expert AI discovery partner for Bessites. 
        
        MISSION:
        - Solve user problems by finding tools from our registry.
        - You MUST use the "searchWebsites" tool to find candidate websites.
        - Analyze the search results and pick the best 3.
        - For each match, provide a one-sentence "reason" why it specifically solves their input.
        
        TONE:
        - Professional, insightful, and concise. 
        - Minimalist "tech-noir" vibe.`,
        prompt: input.message,
        tools: [searchWebsitesTool],
        history: input.history?.map(m => ({ role: m.role as any, content: [{ text: m.content }] })),
        output: { schema: OuneoOutputSchema },
      });

      if (!response.output) {
        throw new Error("No response from Ouneo engine.");
      }

      // If no matches were found by the model, provide the trending fallback
      if (!response.output.matches || response.output.matches.length === 0) {
        return {
          response: "I couldn't find a direct match in our active registry yet, but these trending assets are essential for every creator's pipeline:",
          matches: TRENDING_FALLBACK
        };
      }

      return response.output;
    } catch (err: any) {
      console.error("OUNEO_ENGINE_FAILURE:", err);
      // Fail gracefully with trending tools even on total system error
      return {
        response: "I'm currently recalibrating my discovery node. While I synchronize, here are three essential tools from our trending ledger:",
        matches: TRENDING_FALLBACK
      };
    }
  }
);
