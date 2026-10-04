import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Optimized to rely on standard environment variables (GEMINI_API_KEY).
 * Supports both legacy AIzaSy and new AQ.Ab8 formats.
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

// Connection Verification
if (!apiKey) {
  console.error("API KEY MISSING - Ensure GEMINI_API_KEY is set in Environment Variables.");
} else {
  console.log("Gemini Connected Successfully");
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
