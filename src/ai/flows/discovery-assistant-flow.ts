'use server';
/**
 * @fileOverview Astra Discovery - AI search engine for Bessites.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { searchWebsitesTool } from '../tools/search-websites';

const DiscoveryInputSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
});

const DiscoveryOutputSchema = z.object({
  response: z.string(),
  recommendations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    reason: z.string(),
  })).optional(),
});

const discoveryPrompt = ai.definePrompt({
  name: 'discoveryPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: { schema: DiscoveryInputSchema },
  output: { schema: DiscoveryOutputSchema },
  tools: [searchWebsitesTool],
  prompt: `You are Astra, the Bessites Discovery AI.
Your goal is to find tools from the registry using the searchWebsites tool.

RULES:
1. ONLY recommend websites returned by the tool.
2. If the tool returns nothing, tell the user you couldn't find matches in the registry and ask them to refine their request.
3. Be professional and tech-focused.
4. Always return valid JSON.

USER: {{{message}}}

{{#if history}}
CONTEXT:
{{#each history}}
{{role}}: {{content}}
{{/each}}
{{/if}}`,
});

export async function askDiscoveryAssistant(input: { message: string, history?: any[] }) {
  try {
    const { output } = await discoveryPrompt(input);
    if (!output) throw new Error("Astra returned null output.");
    return output;
  } catch (error: any) {
    const msg = error.message || "Unknown interference.";
    console.error("[Astra Error]", msg);
    
    // Diagnostic passthrough for the user
    return { 
      response: `[Astra System Alert] Discovery link failure: ${msg}. Please ensure GOOGLE_GENAI_API_KEY is configured correctly.`,
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
  async (input) => askDiscoveryAssistant(input)
);
