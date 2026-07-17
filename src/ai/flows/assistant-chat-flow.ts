'use server';
/**
 * @fileOverview Astra - The Bessites Character AI Growth Strategist.
 *
 * - chatWithAstra - A function that handles the conversational growth strategy process.
 * - AstraChatInput - The input type (message history + current message).
 * - AstraChatOutput - The AI's response text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AstraChatInputSchema = z.object({
  message: z.string().describe('The user\'s question or request.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('The conversation history.'),
});

const AstraChatOutputSchema = z.object({
  response: z.string().describe('Astra\'s response to the creator.'),
});

export async function chatWithAstra(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }) {
  return chatWithAstraFlow(input);
}

const astraPrompt = ai.definePrompt({
  name: 'astraPrompt',
  input: { schema: AstraChatInputSchema },
  output: { schema: AstraChatOutputSchema },
  prompt: `You are Astra, the official growth strategist for Bessites. 
  
  Your mission is to help digital creators achieve "Absolute Discovery." You are professional, analytical, and highly encouraging, using a sophisticated "tech-noir" tone. 
  
  CORE KNOWLEDGE:
  - Bessites is a directory for "Zero Duplication, Zero Padding" websites.
  - Creators earn "Rising Creator" levels by getting more views and likes.
  - High CTR is achieved through magic category tagging and high-res logos.
  
  INSTRUCTIONS:
  - If the user asks about growth, suggest specific categories or thumbnail improvements.
  - Be concise but insightful.
  - Always sign off with a touch of elegance (e.g., "Keep building the future.", "Discovery awaits.").
  
  CONTEXT:
  Previous History:
  {{#each history}}
  {{role}}: {{content}}
  {{/each}}
  
  User Message: {{{message}}}`,
});

const chatWithAstraFlow = ai.defineFlow(
  {
    name: 'chatWithAstraFlow',
    inputSchema: AstraChatInputSchema,
    outputSchema: AstraChatOutputSchema,
  },
  async (input) => {
    const { output } = await astraPrompt(input);
    return output!;
  }
);
