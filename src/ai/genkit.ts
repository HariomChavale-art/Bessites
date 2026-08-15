import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Robust initialization that checks multiple environment variable names.
 */

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({ apiKey }),
  ],
  model: 'googleai/gemini-2.0-flash', // Migrated to Gemini 2.0 Flash for production stability
});

export { z } from 'genkit';
