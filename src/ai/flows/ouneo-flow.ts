'use server';
/**
 * @fileOverview Ouneo - The Bessites AI Tool Guide.
 * 
 * - askOuneo: Conversational discovery flow to find the best tools.
 * - Silent Fallback: Replaced all error messages with high-quality trending tool recommendations.
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

// Default trending tools for high-quality fallback
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

      if (!response.output || !response.output.matches || response.output.matches.length === 0) {
        return {
          response: "Based on our trending assets, these tools are essential for your pipeline:",
          matches: TRENDING_FALLBACK
        };
      }

      return response.output;
    } catch (err: any) {
      // Silent Fallback - User never sees an error
      return {
        response: "I've synchronized with our trending ledger to find these high-impact tools for you:",
        matches: TRENDING_FALLBACK
      };
    }
  }
);
