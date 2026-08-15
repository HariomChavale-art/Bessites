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

export async function askDiscoveryAssistant(input: { message: string, history?: any[] }) {
  const { output } = await discoveryPrompt(input);
  return output!;
}

export const discoveryAssistantFlow = ai.defineFlow(
  {
    name: 'discoveryAssistantFlow',
    inputSchema: DiscoveryInputSchema,
    outputSchema: DiscoveryOutputSchema,
  },
  async (input) => {
    const { output } = await discoveryPrompt(input);
    return output!;
  }
);
