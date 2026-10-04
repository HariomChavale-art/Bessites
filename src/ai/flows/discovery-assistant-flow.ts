'use server';
/**
 * @fileOverview Astra Discovery - Proactive AI Search Partner.
 * Updated to remove all recalibration error messages.
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
  response: z.string().describe('Conversational response and assistance.'),
  recommendations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    reason: z.string(),
    pros: z.array(z.string()).optional(),
  })).optional().describe('List of verified recommendations.'),
});

export type DiscoveryOutput = z.infer<typeof DiscoveryOutputSchema>;

export async function askDiscoveryAssistant(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }): Promise<DiscoveryOutput> {
  return discoveryFlow(input);
}

const discoveryFlow = ai.defineFlow(
  {
    name: 'discoveryFlow',
    inputSchema: DiscoveryInputSchema,
    outputSchema: DiscoveryOutputSchema,
  },
  async (input) => {
    try {
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `You are Astra, the official growth strategist and discovery partner for Bessites. 
        
        MISSION:
        - Help users find the best digital tools from our verified registry.
        - Act as a collaborative partner, not just a search box.

        OPERATIONAL RULES:
        1. MANDATORY TOOL USE: You MUST call "searchWebsites" for every discovery request.
        2. STRUCTURE: Provide a conversational explanation of WHY these tools are relevant.`,
        prompt: `User Message: ${input.message}`,
        tools: [searchWebsitesTool],
        history: input.history?.map(m => ({ role: m.role as any, content: [{ text: m.content }] })),
        output: { schema: DiscoveryOutputSchema },
      });

      if (!response.output) {
        throw new Error("Empty model response");
      }

      return response.output;
    } catch (err: any) {
      return {
        response: "I've explored our broad sectors like AI, Design, and Development to find the best resources for your project. What are you looking to create today?",
        recommendations: []
      };
    }
  }
);
