import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Standardized to pick up keys from environment variables.
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: apiKey }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

export { z } from 'genkit';
