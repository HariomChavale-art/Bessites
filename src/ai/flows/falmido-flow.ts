'use server';
/**
 * @fileOverview Falmido - The Guided AI Discovery Partner.
 * Handles conversational refinement and high-fidelity registry searching.
 */

import { ai, z } from '@/ai/genkit';
import { searchWebsitesTool } from '@/ai/tools/search-websites';

const FalmidoInputSchema = z.object({
  message: z.string().describe('The user\'s request or response to Falmido.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Conversation history.'),
});

const FalmidoOutputSchema = z.object({
  response: z.string().describe('Falmido\'s conversational response.'),
  results: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    description: z.string(),
    pricing: z.string(),
  })).optional().describe('A list of verified matches from the registry.'),
});

export type FalmidoOutput = z.infer<typeof FalmidoOutputSchema>;

export async function chatWithFalmido(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }): Promise<FalmidoOutput> {
  return falmidoFlow(input);
}

const falmidoFlow = ai.defineFlow(
  {
    name: 'falmidoFlow',
    inputSchema: FalmidoInputSchema,
    outputSchema: FalmidoOutputSchema,
  },
  async (input) => {
    try {
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Falmido, a helpful human-like discovery assistant for Bessites. 
        
        MISSION:
        Your goal is to guide users through a 3-step conversation to find the perfect website:
        1. Discover their Interests: Ask what they are currently into or what field they work in.
        2. Identify Specialty & Purpose: Suggest criteria like 'no login required', 'newly launched', 'ai integrated', 'most popular', or 'easy to use'.
        3. Confirm Pricing: Ask if they prefer Free, Freemium, or Paid tools.

        OPERATIONAL RULES:
        - Talk like a helpful, professional human.
        - Start by introducing yourself if history is empty: "Hi, I'm Falmido. Answer three quick questions and I'll find sites that fit you."
        - Once you have enough info, ALWAYS call the "searchWebsites" tool to find the best 3-5 matches.
        - Present the results within the structured output.
        - If no matches are found, encourage the user to try a different category or specialty.`,
        prompt: input.message,
        tools: [searchWebsitesTool],
        history: input.history?.map(m => ({ 
          role: m.role as any, 
          content: [{ text: m.content }] 
        })),
        output: { schema: FalmidoOutputSchema },
      });

      if (!response.output) {
        throw new Error("Empty model response");
      }

      return response.output;
    } catch (err: any) {
      console.error("[Falmido Flow Error]:", err.message);
      return {
        response: "I'm having a bit of trouble synchronizing with the registry right now. What interests or categories were you looking for today?",
        results: []
      };
    }
  }
);
