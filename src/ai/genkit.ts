import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Hardened to handle missing keys gracefully.
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || '';

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: (apiKey && !apiKey.includes('YOUR_API_KEY')) ? apiKey : undefined }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

export { z } from 'genkit';
