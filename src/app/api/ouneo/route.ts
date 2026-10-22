
import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';
import allSites from '@/data/allSites.json';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are Bessites AI. Registry: ${JSON.stringify(allSites.slice(0, 500))}. 
      History: ${JSON.stringify(history)}.
      Message: "${message}". 
      Pick 3 REAL sites. Return JSON format.`,
      config: { temperature: 0.1 }
    });

    return NextResponse.json(JSON.parse(text || "{}"));

  } catch (error: any) {
    console.error('[Ouneo API Error]:', error.message);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
