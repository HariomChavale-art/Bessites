'use server';
/**
 * @fileOverview Astra Discovery - The AI search engine for Bessites.
 * Handles natural language discovery requests by calling Firestore tools.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { searchWebsitesTool } from '../tools/search-websites';

const DiscoveryInputSchema = z.object({
  message: z.string().describe('The user\'s discovery request.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
});

const DiscoveryOutputSchema = z.object({
  response: z.string().describe('The conversational response from the assistant.'),
  recommendations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    reason: z.string().describe('Why this matches the user request.'),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
  })).optional(),
});

export type DiscoveryOutput = z.infer<typeof DiscoveryOutputSchema>;

const discoveryPrompt = ai.definePrompt({
  name: 'discoveryPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: DiscoveryInputSchema },
  output: { schema: DiscoveryOutputSchema },
  tools: [searchWebsitesTool],
  prompt: `You are Astra, the Bessites Discovery Assistant. Your goal is to help users find the perfect web tools from our curated registry.

CORE RULES:
1. ONLY recommend websites found using the searchWebsites tool.
2. If no websites are found, politely inform the user and suggest broader search terms.
3. DO NOT invent ratings, features, or websites that do not exist in the database.
4. Keep match reasoning concise and insightful.
5. Identify pros (advantages) and cons (limitations) based ONLY on the provided description.
6. Always return a valid JSON object matching the requested schema.

TONE: 
Professional, "tech-noir", helpful, and concise.

USER REQUEST: {{{message}}}

{{#if history}}
CONTEXT:
{{#each history}}
{{role}}: {{content}}
{{/each}}
{{/if}}`,
});

/**
 * Main exported function for client-side consumption.
 * This runs exclusively on the server as a Next.js Server Action.
 */
export async function askDiscoveryAssistant(input: { message: string, history?: any[] }) {
  try {
    console.log(`[Astra] Processing discovery request: "${input.message}"`);
    
    // Check for API key availability before calling the model to provide better error feedback
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[Astra] Model call aborted: Missing Gemini API Key.");
      return {
        response: "I apologize, but my intelligence core is not currently powered. Please ensure the GOOGLE_GENAI_API_KEY is configured in the environment.",
        recommendations: []
      };
    }

    const { output } = await discoveryPrompt(input);
    
    if (!output) {
      console.error("[Astra] Model returned empty output.");
      throw new Error("AI returned empty output");
    }

    console.log(`[Astra] Successfully generated response with ${output.recommendations?.length || 0} recommendations.`);
    return output;
  } catch (error: any) {
    // Detailed server-side logging for diagnosis
    console.error("[Bessites AI Error] Discovery Assistant Failure:", {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'), // Log only the top of the stack for brevity
      input: input.message
    });

    // Provide a slightly more descriptive error if it's a known configuration issue
    const isAuthError = error.message?.includes('401') || error.message?.includes('API_KEY_INVALID');
    
    return {
      response: isAuthError 
        ? "I am currently unable to authenticate with the discovery network. Please verify the system credentials."
        : "I apologize, but my discovery link is currently experiencing interference. Please check your connection or try again in a moment.",
      recommendations: []
    };
  }
}

export const discoveryAssistantFlow = ai.defineFlow(
  {
    name: 'discoveryAssistantFlow',
    inputSchema: DiscoveryInputSchema,
    outputSchema: DiscoveryOutputSchema,
  },
  async (input) => {
    return askDiscoveryAssistant(input);
  }
);
