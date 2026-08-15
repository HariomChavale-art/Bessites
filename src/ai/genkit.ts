import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Note: GOOGLE_GENAI_API_KEY must be set in environment variables.
 * This file handles server-side AI initialization securely.
 */

// Explicitly retrieve the API key from multiple possible sources for robustness
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({ apiKey }),
  ],
  model: googleAI.model('gemini-1.5-flash'), // Using a stable, well-supported model identifier
});

export { z } from 'genkit';
