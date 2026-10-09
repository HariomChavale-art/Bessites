
import { z } from 'zod';

/**
 * @fileOverview Shared schemas for Ouneo AI.
 * Uses 'zod' directly instead of 'genkit' to prevent transitive imports 
 * of Node.js-only modules (like async_hooks) into client components.
 */

export const OuneoOutputSchema = z.object({
  response: z.string().describe('A helpful conversational response from Ouneo.'),
  matches: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    reason: z.string().describe('One line explaining why this tool is a great fit.'),
    url: z.string(),
    category: z.string(),
  })).max(3).describe('Top best-matching tools from the registry.'),
});

export type OuneoOutput = z.infer<typeof OuneoOutputSchema>;
