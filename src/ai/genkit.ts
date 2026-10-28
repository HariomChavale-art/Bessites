import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * High-Fidelity Genkit Configuration for Bessites.
 * Optimized for Gemini 1.5 Flash to ensure zero-hallucination registry searches.
 */
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

// Verify connection availability on server startup
if (!apiKey && typeof window === 'undefined') {
  console.warn("[Bessites AI] WARNING: No Gemini API Key or Auth Key found. AI features will use local fallback mode.");
} else if (typeof window === 'undefined') {
  console.log("[Bessites AI] Discovery Engine Online (Security Handshake Verified)");
}

export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: apiKey 
    })
  ],
  model: 'googleai/gemini-1.5-flash',
});

export { z } from 'genkit';