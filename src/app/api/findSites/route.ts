
import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import allSites from '@/data/allSites.json';

/**
 * @fileOverview Discovery Endpoint for natural language website search.
 * Refactored to use Gemini 1.5 Flash.
 */

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are Bessites AI. Registry: ${JSON.stringify(allSites.slice(0, 500))}. 
      User: "${query}". Pick 3 REAL sites. Return JSON: { "response": "string", "matches": [{ "name": "string", "url": "string", "reason": "string", "score": number }] }`,
      config: { temperature: 0.2 }
    });

    return NextResponse.json(JSON.parse(text || "{}"));

  } catch (error: any) {
    console.error('[FindSites API Error]:', error.message);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
