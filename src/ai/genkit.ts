
import { genkit } from 'genkit';

/**
 * @fileOverview Genkit core configuration.
 * Refactored to act as a generic orchestration layer.
 * Generative tasks are now routed directly to Groq for speed.
 */

export const ai = genkit({
  plugins: [],
});

export { z } from 'genkit';
