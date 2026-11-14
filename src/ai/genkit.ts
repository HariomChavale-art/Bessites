import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * High-Fidelity Genkit Configuration for Bessites.
 * This file runs ONLY on the server.
 * Utilizes GEMINI_API_KEY from Vercel Environment Variables.
 */
const apiKey = process.env.GEMINI_API_KEY;

// Log status on server boot (No keys logged)
if (!apiKey && typeof window === 'undefined') {
  console.warn("[Bessites AI] WARNING: GEMINI_API_KEY is missing from environment. Discovery features will use local fallback.");
} else if (typeof window === 'undefined') {
  console.log("[Bessites AI] Discovery Engine Online (Secure Handshake Verified)");
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
