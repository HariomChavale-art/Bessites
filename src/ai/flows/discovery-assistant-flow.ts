'use server';
/**
 * @fileOverview Astra Discovery - AI search engine for Bessites.
 * Migrated to the current Interactions API architecture using Gemini 2.0 Flash-Lite.
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
    pros: z.array(z.string()).optional(),
  })).optional(),
});

export type DiscoveryOutput = z.infer<typeof DiscoveryOutputSchema>;

const discoveryPrompt = ai.definePrompt({
  name: 'discoveryPrompt',
  model: googleAI.model('gemini-2.0-flash-lite-preview-02-05'),
  input: { schema: DiscoveryInputSchema },
  output: { schema: DiscoveryOutputSchema },
  tools: [searchWebsitesTool],
  prompt: `You are Astra, the Bessites Discovery AI.
Your goal is to find tools from the registry using the searchWebsites tool.

RULES:
1. ONLY recommend websites returned by the tool.
2. If the tool returns nothing, tell the user you couldn't find matches in the registry and ask them to refine their request.
3. Be professional and tech-focused.
4. Always return valid JSON matching the output schema.
5. Do NOT invent URLs, ratings, or features that are not explicitly provided by the tool.

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
    // Generate interaction using the newest SDK architecture
    const { output } = await discoveryPrompt(input);
    
    if (!output) {
      throw new Error("Interaction completed but returned empty output.");
    }
    
    return output;
  } catch (error: any) {
    // Report actual underlying error for development visibility
    const errorDetail = error.message || "Unknown API interference.";
    console.error("[Astra API Error]", errorDetail);
    
    return { 
      response: `[Astra System Alert] Discovery link failure: ${errorDetail}`,
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
