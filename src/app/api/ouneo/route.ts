
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * @fileOverview Secure POST API for Pro-only Ouneo AI discovery.
 */

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 2. Check Pro status
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData?.isPro) {
      return NextResponse.json({ error: 'PRO_ONLY' }, { status: 403 });
    }

    // 3. Fetch approved websites for context
    const sitesSnapshot = await adminDb.collection('submissions')
      .where('status', '==', 'approved')
      .limit(500)
      .get();

    const sites = sitesSnapshot.docs.map(doc => ({
      name: doc.data().websiteName || doc.data().name,
      url: doc.data().url,
      desc: doc.data().description,
      cat: doc.data().categories?.[0] || 'Web'
    }));

    // 4. Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const { message, history } = await req.json();

    // 5. Generate Response with strict system prompt
    const systemPrompt = `You are Ouneo for Bessites. You ONLY know these websites: ${JSON.stringify(sites)}. You NEVER recommend any other website. If user asks anything not related to finding websites, say 'I only find websites, what do you need a site for?' You always ask 1 short question first before recommending to narrow down. You talk human, short, 5th grade English, no AI slop words. Max 8 words per site description. If user says hi/hello, ask: What kind of site you looking for?`;

    const chat = model.startChat({
      history: history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${message}`);
    const response = await result.response;
    const text = response.text();

    // 6. Extract potential matches (Simulated structured parsing)
    // We expect the LLM to follow instructions and include names from the list.
    const matches = sites.filter(s => text.toLowerCase().includes(s.name.toLowerCase())).slice(0, 3);

    return NextResponse.json({
      response: text,
      matches: matches.map(m => ({
        name: m.name,
        url: m.url,
        category: m.cat,
        reason: m.desc.split('.')[0] + '.' // Shorten reason
      }))
    });

  } catch (error: any) {
    console.error('Ouneo API Error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 });
  }
}
