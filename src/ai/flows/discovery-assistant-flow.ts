'use server';
/**
 * @fileOverview Astra Discovery - AI search engine for Bessites.
 * Migrated to the modern Interactions API architecture using Gemini 2.0 Flash.
 * Hardened with diagnostic logging and detailed error reporting.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
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

/**
 * Core interaction logic using the Genkit Chat API (Interactions Architecture).
 */
export async function askDiscoveryAssistant(input: { message: string, history?: any[] }) {
  console.log(`[Astra] Interaction initiated: "${input.message}"`);
  
  try {
    // Initialize a chat session to leverage the modern Interactions API path
    const chat = ai.chat({
      model: 'googleai/gemini-2.0-flash',
      system: `You are Astra, the Bessites Discovery AI. 
      Your goal is to find tools from the registry using the searchWebsites tool.

      RULES:
      1. ONLY recommend websites returned by the tool.
      2. If the tool returns nothing, tell the user you couldn't find matches in the registry and ask them to refine their request.
      3. Be professional and tech-focused.
      4. Always return structured data matching the output schema.
      5. Do NOT invent URLs, ratings, or features that are not explicitly provided by the tool.`,
      tools: [searchWebsitesTool],
      history: input.history,
    });

    // Execute the interaction
    const { output } = await chat.send({
      text: input.message,
      output: { schema: DiscoveryOutputSchema }
    });
    
    if (!output) {
      throw new Error("Interaction completed but returned empty output.");
    }
    
    return output;
  } catch (error: any) {
    // Log complete error object for server-side diagnosis
    console.error("[Astra System Error] Full Trace:", error);
    
    const errorMessage = error.message || "Unknown Genkit/Gemini failure.";
    let userDisplayError = `[Astra Error] ${errorMessage}`;

    // Map specific technical codes to helpful messages
    if (errorMessage.includes("403") || errorMessage.includes("PERMISSION_DENIED")) {
      userDisplayError = "[Astra Access Error] Permission denied. Verify your API Key permissions for Gemini 2.0 Flash.";
    } else if (errorMessage.includes("404") || errorMessage.includes("NOT_FOUND")) {
      userDisplayError = "[Astra Model Error] The Gemini 2.0 model is not found. Verify model availability in your region.";
    } else if (errorMessage.includes("429") || errorMessage.includes("QUOTA")) {
      userDisplayError = "[Astra Quota Error] Speed limit reached. Please wait a moment before trying again.";
    }

    return { 
      response: userDisplayError,
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
