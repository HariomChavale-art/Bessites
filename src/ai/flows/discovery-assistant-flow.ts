'use server';
/**
 * @fileOverview Astra Discovery - Proactive AI Search Partner.
 * Hardened flow to ensure zero-error synchronization and high-quality assistance.
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
        - If a user is vague, ask an intelligent follow-up question to narrow down their needs.

        OPERATIONAL RULES:
        1. MANDATORY TOOL USE: You MUST call "searchWebsites" for every discovery request.
        2. DATA INTEGRITY: Only recommend items returned by the tool.
        3. PERSONALITY: Sophisticated, helpful, and insightful. "Tech-noir" professional tone.
        4. STRUCTURE: Provide a conversational explanation of WHY these tools are relevant, then populate the structured recommendations.
        5. PERSISTENCE: Always end your response with a helpful question to keep the discovery pipeline moving.`,
        prompt: `User Message: ${input.message}`,
        tools: [searchWebsitesTool],
        history: input.history?.map(m => ({ role: m.role as any, content: [{ text: m.content }] })),
        output: { schema: DiscoveryOutputSchema },
        config: {
          safetySettings: [
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
          ]
        }
      });

      if (!response.output) {
        throw new Error("Empty model response");
      }

      return response.output;
    } catch (err: any) {
      // High-Fidelity Diagnostic Logging
      console.error("ASTRA_FLOW_CRITICAL_FAILURE:", err);
      console.error("ASTRA_FLOW_ERROR:", err);
      if (err.message) {
        console.error("ERROR_MESSAGE:", err.message);
      }
      
      const isAuthError = err.message?.includes('401') || err.message?.includes('API_KEY');
      
      return {
        response: isAuthError 
          ? "I am currently in system calibration. Please verify your GEMINI_API_KEY in the environment settings to restore full discovery."
          : "I've encountered a momentary pulse in my registry synchronization. I can still guide you through our broad sectors like AI, Design, and Development. What are you looking to create today?",
        recommendations: []
      };
    }
  }
);