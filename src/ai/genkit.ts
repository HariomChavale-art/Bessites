import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit instance configuration.
 * Note: GOOGLE_GENAI_API_KEY must be set in environment variables.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-flash-latest'),
});

export { z } from 'genkit';
