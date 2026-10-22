
'use server';
/**
 * @fileOverview Ouneo - The Bessites Conversational AI Discovery Partner.
 * Now powered by Groq Llama 3.1 for high-velocity results.
 */

import { ai, z } from '@/ai/genkit';
import { groq } from '@/lib/groq';
import allSites from '@/data/allSites.json';
import { OuneoOutputSchema, type OuneoOutput } from '@/ai/schemas';

const OuneoInputSchema = z.object({
  message: z.string().describe('The user\'s request.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Chat history.'),
});

export async function askOuneo(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }): Promise<OuneoOutput> {
  return ouneoFlow(input);
}

const ouneoFlow = ai.defineFlow(
  {
    name: 'ouneoFlow',
    inputSchema: OuneoInputSchema,
    outputSchema: OuneoOutputSchema,
  },
  async (input) => {
    try {
      const systemPrompt = `You are Bessites AI (Ouneo). You have 1000 real websites in database. 
      Database: ${JSON.stringify(allSites.slice(0, 1000))}

      INSTRUCTIONS:
      1. Talk like a professional discovery partner.
      2. Ask 1 follow-up question if needed to refine the search.
      3. Pick 2-3 sites from the registry.
      4. Give name, reason, and a clean score.
      5. NO FAKE SITES.
      
      OUTPUT FORMAT (JSON ONLY):
      {
        "response": "Conversational reply",
        "matches": [
          { "name": "Name", "url": "URL", "reason": "Why perfect", "category": "Category" }
        ]
      }`;

      const chatHistory = input.history?.map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant' as any,
        content: h.content
      })) || [];

      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          { role: "user", content: input.message }
        ],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");

      return {
        response: result.response || "I've analyzed our registry for you.",
        matches: result.matches || []
      };

    } catch (err: any) {
      console.error("[Ouneo Flow Error]:", err.message);
      return {
        response: "I'm experiencing a high-velocity recalibration. What are you looking to discover today?",
        matches: []
      };
    }
  }
);
