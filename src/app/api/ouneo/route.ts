
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import allSites from '@/data/allSites.json';

/**
 * @fileOverview Secure Ouneo AI API with full 400+ site registry memory.
 * Implements freemium daily limits for free users.
 */

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const isPro = userData?.isPro === true;

    // Daily Limit Logic for Free Users
    if (!isPro) {
      const today = new Date().toISOString().split('T')[0];
      const usageRef = adminDb.collection('users').doc(userId).collection('usage').doc(today);
      const usageDoc = await usageRef.get();
      const count = usageDoc.exists ? usageDoc.data()?.ouneoCount || 0 : 0;

      if (count >= 3) {
        return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403 });
      }
      await usageRef.set({ ouneoCount: count + 1 }, { merge: true });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const { message, history } = await req.json();

    const systemPrompt = `You are Ouneo for Bessites.

You know ALL 400+ websites. Here is the full list:
${JSON.stringify(allSites)}

RULES:
- You can ONLY recommend from this list. Never make up, never recommend sites not in list.
- When user says something, first ask 1 short human question to understand better. Examples: "For phone or laptop?" "Free or paid is okay?" "For work or personal?"
- After user answers, recommend best 2-3 sites from the list that match.
- Description max 8 words, human, no AI slop.
- If user says hi/hello, say: "Hey, what kind of site you looking for?"
- Never say: "I've found these websites in our registry", "delve", "elevate", "tapestry" etc.
- Hide total count. Never say "400 sites" or "we have X sites".
- Talk short, friend to friend.`;

    const chat = model.startChat({
      history: history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
    });

    const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${message}`);
    const response = await result.response;
    const text = response.text();

    const matches = allSites.filter(s => 
      text.toLowerCase().includes(s.title.toLowerCase()) || 
      text.toLowerCase().includes(s.url.toLowerCase())
    ).slice(0, 3);

    return NextResponse.json({
      response: text,
      matches: matches.map(m => ({
        name: m.title,
        url: m.url,
        category: m.category,
        reason: m.description
      }))
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
