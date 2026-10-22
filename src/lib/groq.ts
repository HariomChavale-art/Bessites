
import Groq from "groq-sdk";

/**
 * @fileOverview Groq AI Client Initialization.
 * Powers the high-velocity discovery engine with Llama 3.1.
 */

if (!process.env.GROQ_API_KEY) {
  console.warn("[Bessites AI] CRITICAL: GROQ_API_KEY is missing from environment.");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});
