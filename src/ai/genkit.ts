import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Optimized to rely on standard environment variables (GEMINI_API_KEY or GOOGLE_GENAI_API_KEY).
 * Explicitly passing apiKey to ensure compatibility with Firebase Secrets and various environments.
 */

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

export { z } from 'genkit';
