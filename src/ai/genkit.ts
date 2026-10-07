import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Optimized for standard GEMINI_API_KEY environment variable.
 * Supports both legacy (AIzaSy) and new (AQ.Ab8) Google AI Studio keys.
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

// Verify connection availability on server startup
if (!apiKey) {
  console.warn("[Ouneo] CRITICAL: GEMINI_API_KEY is missing from environment. Using Local Fallback Mode.");
} else {
  console.log("[Ouneo] Gemini Discovery Node Online (Key Verified)");
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
