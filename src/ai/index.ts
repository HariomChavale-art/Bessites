'use server';
/**
 * @fileOverview Server Action registry for Ouneo AI.
 * This file is marked with 'use server' to ensure all Node.js-dependent 
 * logic (Genkit, Opentelemetry) stays on the server.
 */

import { ai } from './genkit';
import { askOuneo } from './flows/ouneo-flow';

// Re-export the Ouneo flow as a server action
export { askOuneo };

/**
 * askGemini - Direct query function for Ouneo's AI responses.
 * This is a Server Action that communicates with the Gemini model.
 * 
 * @param prompt - The user's input message.
 * @returns A promise resolving to the AI's text response.
 */
export async function askGemini(prompt: string): Promise<string> {
  try {
    // Utilize the global Genkit instance for the query
    const response = await ai.generate(prompt);
    
    if (!response.text) {
      throw new Error("No text returned from model");
    }

    return response.text;
  } catch (error) {
    console.error("Ouneo AI Action Error:", error);
    return "I encountered an error while processing your request through our AI node. Please verify your connection.";
  }
}
