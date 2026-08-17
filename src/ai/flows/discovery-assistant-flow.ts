'use server';
/**
 * @fileOverview Astra Discovery - AI search engine for Bessites.
 * Powered by the official @google/genai SDK for production reliability.
 * Uses gemini-2.0-flash for high-speed registry indexing.
 */

import { initializeFirebase } from '@/firebase/init';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { MOCK_WEBSITES } from '@/lib/mock-data';
import { createGoogleAI } from '@google/genai';

export type DiscoveryOutput = {
  response: string;
  recommendations?: {
    id: string;
    name: string;
    url: string;
    reason: string;
    pros?: string[];
  }[];
};

/**
 * Core discovery logic using the official Google GenAI SDK.
 * Searches Firestore registry and uses Gemini for intelligent matching.
 */
export async function askDiscoveryAssistant(input: { message: string, history?: {role: 'user' | 'assistant', content: string}[] }) {
  console.log(`[Astra] Discovery interaction initiated: "${input.message}"`);
  
  // Check multiple possible env var names for robustness
  const apiKey = process.env.GEMINI_API_KEY || 
                 process.env.GOOGLE_GENAI_API_KEY || 
                 process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE' || apiKey === 'undefined') {
    console.error("[Astra Error] GEMINI_API_KEY is missing or unconfigured.");
    return { 
      response: "[Astra Error] System configuration error: API Key not found. Please add your GEMINI_API_KEY to the .env file and restart the server.",
      recommendations: [] 
    };
  }

  try {
    // 1. Initialize the official SDK
    const aiClient = createGoogleAI({ apiKey });

    // 2. Fetch approved websites from Firestore for context
    const { firestore } = initializeFirebase();
    let registryData: any[] = [];

    if (firestore) {
      try {
        const q = query(collection(firestore, 'submissions'), where('status', '==', 'approved'), limit(50));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const d = doc.data();
          registryData.push({
            id: doc.id,
            name: d.websiteName || d.name || 'Unknown',
            url: d.url || '',
            description: d.description || '',
            categories: d.categories || []
          });
        });
      } catch (dbErr) {
        console.warn("[Astra] Firestore query failed, falling back to mock data.", dbErr);
      }
    }

    // 3. Fallback to mock data if registry is empty
    if (registryData.length === 0) {
      registryData = MOCK_WEBSITES.map(s => ({
        id: s.id,
        name: s.websiteName || s.name,
        url: s.url,
        description: s.description,
        categories: s.categories
      }));
    }

    // 4. Construct Instructions and Data Context
    const systemPrompt = `You are Astra, the official discovery AI for Bessites. 
    Your mission is to help users find tools from the provided REGISTRY.

    STRICT RULES:
    1. ONLY recommend websites listed in the REGISTRY below.
    2. Do NOT invent URLs, features, prices, or websites.
    3. If no suitable match exists, tell the user you couldn't find a match in the registry and ask for more details.
    4. Provide the response as a valid JSON object.

    OUTPUT SCHEMA:
    {
      "response": "Conversational text for the user",
      "recommendations": [
        { "id": "ID from registry", "name": "Name", "url": "URL", "reason": "Why it fits", "pros": ["advantage 1", "advantage 2"] }
      ]
    }

    REGISTRY:
    ${JSON.stringify(registryData.slice(0, 40))}
    `;

    // 5. Call the model using generateContent
    const result = await aiClient.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...(input.history || []).map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: input.message }] }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsedData = JSON.parse(responseText);

    return {
      response: parsedData.response || "I've analyzed the registry for your request.",
      recommendations: parsedData.recommendations || []
    } as DiscoveryOutput;

  } catch (error: any) {
    console.error("[Astra System Failure]", error);
    
    let userMsg = `[Astra Error] ${error.message || "I encountered a synchronization error in the discovery pipeline."}`;
    
    // Check for common API errors
    if (error.message?.includes('404')) {
      userMsg = "[Astra Error] Model not found or unavailable. Please verify API access.";
    } else if (error.message?.includes('401') || error.message?.includes('403')) {
      userMsg = "[Astra Error] Access denied. Your API key might be invalid or restricted.";
    } else if (error.message?.includes('429')) {
      userMsg = "[Astra Error] Quota exceeded. Please wait a moment.";
    }

    return { 
      response: userMsg,
      recommendations: [] 
    } as DiscoveryOutput;
  }
}
