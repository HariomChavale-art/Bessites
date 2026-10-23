
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * High-Fidelity Genkit Configuration for Bessites.
 * Optimized for Gemini 1.5 Flash to ensure zero-hallucination registry searches.
 */
export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: process.env.GOOGLE_API_KEY 
    })
  ],
  model: 'googleai/gemini-1.5-flash',
});

export { z } from 'genkit';
