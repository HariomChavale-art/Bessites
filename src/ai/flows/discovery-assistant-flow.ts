'use server';
/**
 * @fileOverview Astra Discovery - AI search engine for Bessites.
 */

import { ai, z } from '@/ai/genkit';
import { initializeFirebase } from '@/firebase/init';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { MOCK_WEBSITES } from '@/lib/mock-data';

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
});

export type DiscoveryOutput = z.infer<typeof DiscoveryOutputSchema>;

/**
 * Astra Discovery Flow
 * Searches Firestore registry and uses Genkit for intelligent matching.
 */
export async function askDiscoveryAssistant(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }) {
  // We removed the manual API key check here to allow Genkit to handle the execution.
  // Standard error handling in the UI will catch any missing key issues.
  return discoveryFlow(input);
}

const discoveryPrompt = ai.definePrompt({
  name: 'discoveryPrompt',
  input: { schema: DiscoveryInputSchema },
  output: { schema: DiscoveryOutputSchema },
  prompt: `You are Astra, the official discovery AI for Bessites. 
  Your mission is to help users find tools from the provided REGISTRY.

  STRICT RULES:
  1. ONLY recommend websites listed in the REGISTRY below.
  2. Do NOT invent URLs, features, prices, or websites.
  3. If no suitable match exists, tell the user you couldn't find a exact match in the registry and suggest the closest alternative.

  CONTEXT:
  Registry Data:
  {{{registry}}}

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
    const { firestore } = initializeFirebase();
    let registryData: any[] = [];

    if (firestore) {
      try {
        const q = query(collection(firestore, 'submissions'), where('status', '==', 'approved'), limit(50));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const d = doc.data();
          registryData.push({
            id: doc.id,
            name: d.websiteName || d.name || 'Unknown',
            url: d.url || '',
            description: d.description || '',
            categories: d.categories || []
          });
        });
      } catch (dbErr) {
        console.warn("[Astra] Firestore fallback triggered.");
      }
    }

    if (registryData.length === 0) {
      registryData = MOCK_WEBSITES.map(s => ({
        id: s.id,
        name: s.websiteName || s.name,
        url: s.url,
        description: s.description,
        categories: s.categories
      }));
    }

    const { output } = await discoveryPrompt({
      ...input,
      registry: JSON.stringify(registryData.slice(0, 40))
    });

    return output!;
  }
);
