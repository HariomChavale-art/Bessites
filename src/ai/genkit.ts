import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Handles server-side AI initialization securely using available API keys.
 */

// Explicitly retrieve the API key from multiple possible sources for robustness
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey && typeof window === 'undefined') {
  console.warn("[Bessites AI] CRITICAL: No Gemini API Key found in environment variables (GOOGLE_GENAI_API_KEY, GOOGLE_API_KEY, or GEMINI_API_KEY). AI features will fail.");
}

export const ai = genkit({
  plugins: [
    googleAI({ apiKey }),
  ],
  model: 'googleai/gemini-1.5-flash', // Using a stable, fully-qualified model identifier
});

export { z } from 'genkit';
