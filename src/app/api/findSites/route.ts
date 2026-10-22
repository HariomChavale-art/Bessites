
import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@/lib/groq';
import allSites from '@/data/allSites.json';

/**
 * @fileOverview Discovery Endpoint for natural language website search.
 * Anchored to the 1000-website registry.
 */

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const systemPrompt = `You are Bessites AI. You have 1000 real websites in your database. 
    Here is the database summary: ${JSON.stringify(allSites.slice(0, 1000))}

    MISSION:
    1. Analyze user request.
    2. Ask 1 follow-up question if needed (budget/purpose/device).
    3. Pick exactly 2-3 perfect websites from the database provided.
    4. For each, give: name, why perfect, clean score (0-100).
    5. NO FAKE SITES. ONLY FROM DATABASE.

    Return your response in a clean JSON format:
    {
      "response": "Your conversational answer + follow-up question",
      "matches": [
        { "name": "Site Name", "url": "URL", "reason": "Why perfect", "score": 95 }
      ]
    }`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[FindSites API Error]:', error.message);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
