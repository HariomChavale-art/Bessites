import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Hardened to use GEMINI_API_KEY as the primary credential.
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({ apiKey }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

export { z } from 'genkit';
