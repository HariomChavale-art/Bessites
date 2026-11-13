import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview Email-based Membership Verification Node.
 * Hardened with manual bypass for testing and detailed debug logging.
 */

const PRODUCT_ID = 'JILFDGTEz9RAiXZmJOnHFg==';
const WHITELISTED_EMAILS = ['harrypixels40@gmail.com'];

export async function POST(req: NextRequest) {
  try {
    const { email: purchaseEmail } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      console.error("[Verify] No Bearer token found in headers.");
      return NextResponse.json({ ok: false, message: 'Identity node offline. Please log in again.' }, { status: 401 });
    }

    if (!adminAuth || !adminDb) {
      console.error("[Verify] Firebase Admin SDK failed to initialize.");
      return NextResponse.json({ ok: false, message: 'System node initializing. Please retry in 30s.' }, { status: 500 });
    }

    // 1. Verify User Identity via Token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (err: any) {
      console.error("[Verify] JWT Verification failed:", err.message);
      return NextResponse.json({ ok: false, message: 'Session expired. Please log in again.' }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const accountEmail = decodedToken.email?.toLowerCase().trim();
    const normalizedInputEmail = purchaseEmail?.toLowerCase().trim();

    console.log(`[Verify Debug] Received Input: ${normalizedInputEmail} | Auth Email: ${accountEmail}`);

    if (!accountEmail || accountEmail !== normalizedInputEmail) {
      console.warn(`[Verify] Identity Mismatch: Account(${accountEmail}) vs Entered(${normalizedInputEmail})`);
      return NextResponse.json({ 
        ok: false, 
        message: "That email doesn't match your Bessites account. Email bessitesofficial@gmail.com and we'll help." 
      });
    }

    // 2. Manual Whitelist Bypass (Immediate Activation)
    if (WHITELISTED_EMAILS.includes(accountEmail)) {
      console.log(`[Verify] Manual Bypass Triggered for: ${accountEmail}`);
      const userRef = adminDb.collection('users').doc(uid);
      await userRef.set({
        membershipActive: true,
        lastVerifiedAt: FieldValue.serverTimestamp(),
        planType: 'whitelisted_access'
      }, { merge: true });
      return NextResponse.json({ ok: true, message: 'Welcome back. Whitelist access granted.' });
    }

    // 3. Query Gumroad Subscribers Ledger
    const GUMROAD_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;
    if (!GUMROAD_TOKEN) {
      console.error("[Verify] CRITICAL: GUMROAD_ACCESS_TOKEN secret is not set in environment.");
      return NextResponse.json({ ok: false, message: 'Registry connection misconfigured. Admin notified.' }, { status: 500 });
    }

    let allSubscribers: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`https://api.gumroad.com/v2/products/${PRODUCT_ID}/subscribers?access_token=${GUMROAD_TOKEN}&page=${page}`);
      const data = await response.json();

      if (!data.success) {
        console.error("[Verify] Gumroad API Error:", data);
        break;
      }

      allSubscribers = allSubscribers.concat(data.subscribers);
      
      if (data.subscribers.length < 20) {
        hasMore = false;
      } else {
        page++;
      }
      if (page > 50) break; 
    }

    console.log(`[Verify Debug] Gumroad Ledger Count: ${allSubscribers.length}`);

    // 4. Find Active Membership in Ledger
    const subscriber = allSubscribers.find(s => s.email && s.email.toLowerCase().trim() === accountEmail);

    if (!subscriber) {
      console.log(`[Verify] No subscriber found in Gumroad for ${accountEmail}`);
      return NextResponse.json({ 
        ok: false, 
        message: "We couldn't find an active membership for that email. Check the email on your Gumroad receipt." 
      });
    }

    // Validation Logic: Active if not failed and not past ended date
    const isFailed = !!subscriber.failed_at;
    const hasEnded = subscriber.ended_at && new Date(subscriber.ended_at).getTime() < Date.now();
    const isActive = !isFailed && !hasEnded;

    console.log(`[Verify Debug] Found Subscriber: ${subscriber.email} | Status: ${subscriber.status} | FailedAt: ${subscriber.failed_at} | EndedAt: ${subscriber.ended_at} | IsActive: ${isActive}`);

    const userRef = adminDb.collection('users').doc(uid);

    if (isActive) {
      await userRef.set({
        membershipActive: true,
        lastVerifiedAt: FieldValue.serverTimestamp(),
        planType: 'yearly_membership',
        gumroadId: subscriber.id
      }, { merge: true });

      return NextResponse.json({ ok: true, message: 'Welcome. You have full access.' });
    } else {
      await userRef.set({
        membershipActive: false,
        lastVerifiedAt: FieldValue.serverTimestamp()
      }, { merge: true });

      return NextResponse.json({ 
        ok: false, 
        message: "This membership is no longer active. You can renew with the Get full access button." 
      });
    }

  } catch (error: any) {
    console.error("[Verify] Critical Node Failure:", error.message);
    return NextResponse.json({ ok: false, message: 'Internal verification loop failure.' }, { status: 500 });
  }
}
