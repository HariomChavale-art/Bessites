
'use server';
/**
 * @fileOverview Server Action registry for Bessites AI.
 * Now powered by Groq Llama 3.1.
 */

import { groq } from '@/lib/groq';
import { askOuneo } from './flows/ouneo-flow';

export { askOuneo };

/**
 * askGroq - Direct query function for AI responses.
 * 
 * @param prompt - The user's input message.
 * @returns A promise resolving to the AI's text response.
 */
export async function askGroq(prompt: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });
    
    return completion.choices[0].message.content || "I am unable to process that request.";
  } catch (error) {
    console.error("Groq AI Action Error:", error);
    return "I encountered an error while processing your request through our AI system.";
  }
}
