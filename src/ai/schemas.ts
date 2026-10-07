
import { z } from 'genkit';

/**
 * @fileOverview Shared schemas for Ouneo AI.
 * Defined here to prevent transitive imports of the Genkit instance into client components.
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
