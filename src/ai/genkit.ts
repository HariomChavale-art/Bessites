import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Optimized to rely on standard environment variables (GEMINI_API_KEY or GOOGLE_GENAI_API_KEY).
 */

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});

export { z } from 'genkit';
