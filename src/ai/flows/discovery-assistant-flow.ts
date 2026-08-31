'use server';
/**
 * @fileOverview Astra Discovery - AI search engine for Bessites.
 * Refactored to use tool-calling for high-fidelity registry searching.
 * 
 * - askDiscoveryAssistant - Orchestrates the conversational search.
 */

import { ai, z } from '@/ai/genkit';
import { searchWebsitesTool } from '@/ai/tools/search-websites';

const DiscoveryInputSchema = z.object({
  message: z.string().describe('The user\'s request.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Conversation history.'),
});

const DiscoveryOutputSchema = z.object({
  response: z.string().describe('The AI\'s conversational response.'),
  recommendations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    reason: z.string(),
    pros: z.array(z.string()).optional(),
  })).optional().describe('List of recommended websites from the registry.'),
  error: z.boolean().optional().describe('Whether a sync error occurred.'),
});

export type DiscoveryOutput = z.infer<typeof DiscoveryOutputSchema>;

export async function askDiscoveryAssistant(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }): Promise<DiscoveryOutput> {
  return discoveryFlow(input);
}

const discoveryPrompt = ai.definePrompt({
  name: 'discoveryPrompt',
  input: { schema: DiscoveryInputSchema },
  output: { schema: DiscoveryOutputSchema },
  tools: [searchWebsitesTool],
  prompt: `You are Astra, the official discovery AI for Bessites. 
  Your mission is to help users find high-quality digital tools from our verified registry.

  CAPABILITIES:
  - You can search the real-time registry using the "searchWebsites" tool.
  - Always search the registry if the user is looking for a specific tool, category, or recommendation.
  - We organize tools into 100 human-friendly interests (AI Tools, Gaming, Coding, etc.).

  STRICT RULES:
  1. ONLY recommend websites you find via the "searchWebsites" tool.
  2. If no suitable match is found in the registry, suggest the closest broad category alternative we have.
  3. Maintain a sophisticated, "tech-noir" professional tone.
  4. Always format your output with a conversational response and a structured list of recommendations if applicable.

  CONTEXT:
  Conversation History:
  {{#each history}}
  {{role}}: {{content}}
  {{/each}}

  User Request: {{{message}}}`,
});

const discoveryFlow = ai.defineFlow(
  {
    name: 'discoveryFlow',
    inputSchema: DiscoveryInputSchema,
    outputSchema: DiscoveryOutputSchema,
  },
  async (input) => {
    try {
      // Execute the prompt with tool-calling capabilities enabled
      const { output } = await discoveryPrompt(input);
      
      if (!output) {
        throw new Error("Model returned null output");
      }

      return output;
    } catch (err: any) {
      console.error("[Astra Flow Error]:", err);
      
      // Check for missing API Key specific error strings
      const isApiKeyError = err.message?.includes('API_KEY') || err.message?.includes('403') || err.message?.includes('unauthorized');

      return {
        response: isApiKeyError 
          ? "I am currently in system calibration mode because the API key is not fully synchronized. Please ensure your Gemini API key is active in the .env file."
          : "I encountered a synchronization error within the neural engine. Please try again in a moment.",
        error: true,
        recommendations: []
      };
    }
  }
);
