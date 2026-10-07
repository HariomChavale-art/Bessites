import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Optimized for standard GEMINI_API_KEY environment variable.
 * Supports all valid Google AI Studio key formats (AQ.Ab8 and AIzaSy).
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

// Connection Verification (Server Console only)
if (!apiKey) {
  console.warn("[Ouneo] GEMINI_API_KEY is missing. Operating in local fallback mode.");
} else {
  console.log("[Ouneo] Gemini Connection Initialized");
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
