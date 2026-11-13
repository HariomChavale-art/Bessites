import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview Email-based Membership Verification Node.
 * Listens for purchase email and checks against Gumroad Subscriber Ledger.
 */

const PRODUCT_ID = 'JILFDGTEz9RAiXZmJOnHFg==';

export async function POST(req: NextRequest) {
  try {
    const { email: purchaseEmail } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ ok: false, message: 'Authentication required.' }, { status: 401 });
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ ok: false, message: 'System node offline.' }, { status: 500 });
    }

    // 1. Verify User Identity
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const accountEmail = decodedToken.email;

    if (!accountEmail || accountEmail.toLowerCase() !== purchaseEmail.toLowerCase()) {
      return NextResponse.json({ 
        ok: false, 
        message: "That email doesn't match your Bessites account. Email bessitesofficial@gmail.com and we'll help." 
      });
    }

    // 2. Query Gumroad Subscribers Ledger
    const GUMROAD_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;
    if (!GUMROAD_TOKEN) {
      console.error("[Verify] GUMROAD_ACCESS_TOKEN secret is missing.");
      return NextResponse.json({ ok: false, message: 'Registry verification node misconfigured.' }, { status: 500 });
    }

    let allSubscribers: any[] = [];
    let page = 1;
    let hasMore = true;

    // Handle pagination for product subscribers
    while (hasMore) {
      const response = await fetch(`https://api.gumroad.com/v2/products/${PRODUCT_ID}/subscribers?access_token=${GUMROAD_TOKEN}&page=${page}`);
      const data = await response.json();

      if (!data.success) {
        console.error("[Gumroad API Error]:", data);
        break;
      }

      allSubscribers = allSubscribers.concat(data.subscribers);
      
      if (data.subscribers.length < 20) {
        hasMore = false;
      } else {
        page++;
      }
      
      // Safety break for loop
      if (page > 50) break; 
    }

    // 3. Find Active Membership
    const subscriber = allSubscribers.find(s => s.email.toLowerCase() === purchaseEmail.toLowerCase());

    if (!subscriber) {
      return NextResponse.json({ 
        ok: false, 
        message: "We couldn't find an active membership for that email. Check the email on your Gumroad receipt." 
      });
    }

    // Log fields once for logic confirmation as requested
    console.log("[Verify] Subscriber Node Check:", {
      status: subscriber.status,
      failed_at: subscriber.failed_at,
      ended_at: subscriber.ended_at,
      cancelled_at: subscriber.cancelled_at
    });

    const isFailed = !!subscriber.failed_at;
    const hasEnded = subscriber.ended_at && new Date(subscriber.ended_at).getTime() < Date.now();
    
    // Status Logic: Active if not failed and not past ended date
    const isActive = !isFailed && !hasEnded;

    if (isActive) {
      const userRef = adminDb.collection('users').doc(uid);
      await userRef.set({
        membershipActive: true,
        lastVerifiedAt: FieldValue.serverTimestamp(),
        planType: 'yearly_membership',
        gumroadId: subscriber.id
      }, { merge: true });

      return NextResponse.json({ ok: true, message: 'Welcome. You have full access.' });
    } else {
      return NextResponse.json({ 
        ok: false, 
        message: "This membership is no longer active. You can renew with the Get full access button." 
      });
    }

  } catch (error: any) {
    console.error("[Membership Verification Error]:", error.message);
    return NextResponse.json({ ok: false, message: 'Internal verification loop failure.' }, { status: 500 });
  }
}