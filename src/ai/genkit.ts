import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Server-only Genkit configuration.
 * GOOGLE_GENAI_API_KEY is the documented Google GenAI environment variable;
 * GEMINI_API_KEY remains supported for existing deployments.
 */
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey && typeof window === 'undefined') {
  console.warn('[Bessites AI] No Google AI API key configured. Falmido will use its local website-search fallback.');
}

export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  model: 'googleai/gemini-2.5-flash',
});

export { z } from 'genkit';
