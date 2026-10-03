import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Optimized to rely on standard environment variables (GEMINI_API_KEY).
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

// Debug Log for API Key presence
if (!apiKey) {
  console.error("API KEY MISSING - Check Env Variables in Firebase Studio");
} else {
  console.log("Ouneo API Connected - Node Synchronized");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});

export { z } from 'genkit';
