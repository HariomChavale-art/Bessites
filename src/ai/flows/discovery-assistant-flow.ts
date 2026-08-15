'use server';
/**
 * @fileOverview Astra Discovery - The AI search engine for Bessites.
 * Handles natural language discovery requests by calling Firestore tools.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
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
  model: googleAI.model('gemini-1.5-flash'),
  input: { schema: DiscoveryInputSchema },
  output: { schema: DiscoveryOutputSchema },
  tools: [searchWebsitesTool],
  prompt: `You are Astra, the Bessites Discovery Assistant. Your mission is to find the most useful web tools from our curated registry.

CORE RULES:
1. ONLY recommend websites found using the searchWebsites tool. 
2. Use the tool results to populate the recommendations array.
3. If no websites are found via the tool, provide a helpful response and ask for more details.
4. DO NOT invent websites, ratings, or features that do not exist in the provided tool data.
5. Keep reasoning concise and professional ("tech-noir" style).
6. Ensure your response is valid JSON matching the schema.

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
 */
export async function askDiscoveryAssistant(input: { message: string, history?: any[] }) {
  try {
    console.log(`[Astra] Processing discovery request: "${input.message}"`);
    
    // Check for API key availability
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[Astra] Model call aborted: Missing Gemini API Key.");
      return {
        response: "I apologize, but my intelligence core is not powered. Please configure the GOOGLE_GENAI_API_KEY.",
        recommendations: []
      };
    }

    const { output } = await discoveryPrompt(input);
    
    if (!output) {
      console.error("[Astra] Model returned empty output.");
      throw new Error("AI returned empty output");
    }

    return output;
  } catch (error: any) {
    // Advanced diagnostic logging
    const errorType = error.constructor.name;
    const errorMessage = error.message || "Unknown error";
    
    console.error("[Bessites AI Error]", {
      type: errorType,
      message: errorMessage,
      stack: error.stack?.split('\n').slice(0, 2).join('\n')
    });

    // Detect common issues
    if (errorMessage.includes('429')) {
      return { response: "I am receiving too many discovery requests at once. Please try again in a minute.", recommendations: [] };
    }
    if (errorMessage.includes('SAFETY') || errorMessage.includes('blocked')) {
      return { response: "I apologize, but I cannot process that request due to my safety protocols. Please try a different query.", recommendations: [] };
    }
    if (errorMessage.includes('401') || errorMessage.includes('API_KEY')) {
      return { response: "I am unable to authenticate with the discovery network. Please verify system credentials.", recommendations: [] };
    }
    
    return {
      response: "I apologize, but my discovery link is currently experiencing interference. This usually happens during high network load or if the request is ambiguous. Please try rephrasing your request.",
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
