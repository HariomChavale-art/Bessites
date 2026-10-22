
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { groq } from '@/lib/groq';
import allSites from '@/data/allSites.json';

/**
 * @fileOverview Secure Ouneo AI API with Groq Llama 3.1.
 * Implements usage limits and registry-anchored discovery.
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

      if (count >= 5) { // Increased limit for faster Groq model
        return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403 });
      }
      await usageRef.set({ ouneoCount: count + 1 }, { merge: true });
    }

    const { message, history } = await req.json();

    const systemPrompt = `You are Bessites AI. You have 1000 real websites in database. 
    User says: {userInput}. Ask 1 follow-up question if needed (budget/purpose/device) 
    then from the 1000 sites pick exactly 2-3 perfect ones. 
    For each give: name, why perfect for this user specifically, clean score. 
    No fake sites, only from database.
    
    Database Context: ${JSON.stringify(allSites.slice(0, 1000))}

    Return JSON:
    {
      "response": "Conversational part",
      "matches": [
        { "name": "Site", "url": "URL", "reason": "Why", "category": "Category" }
      ]
    }`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((h: any) => ({ role: h.role, content: h.content })),
        { role: "user", content: message }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));

  } catch (error: any) {
    console.error('[Ouneo API Error]:', error.message);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
