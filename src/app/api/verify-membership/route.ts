import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview Email-based Membership Verification Node.
 * Updated with correct Product ID casing and enhanced debug logging.
 */

const PRODUCT_ID = 'JILFDGTEz9RAiXZmJOnhFg==';
const WHITELISTED_EMAILS = ['harrypixels40@gmail.com'];

export async function POST(req: NextRequest) {
  try {
    const { email: purchaseEmail } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ ok: false, message: 'Identity node missing. Please log in again.' }, { status: 401 });
    }

    if (!adminAuth || !adminDb) {
      console.error("[Verify] Admin SDK not initialized. Check your Firebase Secrets.");
      return NextResponse.json({ ok: false, message: 'Server node misconfigured. Check Secret Manager.' }, { status: 500 });
    }

    // 1. Verify User Identity
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (err: any) {
      console.error("[Verify] JWT Fail:", err.message);
      return NextResponse.json({ ok: false, message: 'Invalid session. Please log in again.' }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const accountEmail = decodedToken.email?.toLowerCase().trim();
    const normalizedInputEmail = purchaseEmail?.toLowerCase().trim();

    console.log(`[Verify Attempt] UID: ${uid} | Acc: ${accountEmail} | Input: ${normalizedInputEmail}`);

    if (!accountEmail || accountEmail !== normalizedInputEmail) {
      return NextResponse.json({ 
        ok: false, 
        message: "That email doesn't match your Bessites account. Use the email you are logged in with." 
      });
    }

    // 2. Manual Whitelist Bypass
    if (WHITELISTED_EMAILS.includes(accountEmail)) {
      console.log(`[Verify] Whitelist Success for: ${accountEmail}`);
      const userRef = adminDb.collection('users').doc(uid);
      await userRef.set({
        membershipActive: true,
        lastVerifiedAt: FieldValue.serverTimestamp(),
        planType: 'whitelisted_access'
      }, { merge: true });
      return NextResponse.json({ ok: true, message: 'Welcome back. Access granted.' });
    }

    // 3. Query Gumroad Subscribers
    const GUMROAD_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;
    if (!GUMROAD_TOKEN) {
      console.error("[Verify] GUMROAD_ACCESS_TOKEN missing from Secrets.");
      return NextResponse.json({ ok: false, message: 'Gumroad gateway offline. Admin notified.' }, { status: 500 });
    }

    let allSubscribers: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`https://api.gumroad.com/v2/products/${PRODUCT_ID}/subscribers?access_token=${GUMROAD_TOKEN}&page=${page}`);
      const data = await response.json();

      if (!data.success) {
        console.error("[Verify] Gumroad API error:", data);
        break;
      }

      allSubscribers = allSubscribers.concat(data.subscribers);
      hasMore = data.subscribers.length === 20; // Gumroad standard page size
      page++;
      if (page > 50) break; 
    }

    console.log(`[Verify] Found ${allSubscribers.length} total subscribers in ledger.`);

    const subscriber = allSubscribers.find(s => s.email?.toLowerCase().trim() === accountEmail);

    if (!subscriber) {
      return NextResponse.json({ 
        ok: false, 
        message: "No active membership found for this email on Gumroad." 
      });
    }

    const isFailed = !!subscriber.failed_at;
    const hasEnded = subscriber.ended_at && new Date(subscriber.ended_at).getTime() < Date.now();
    const isActive = !isFailed && !hasEnded;

    const userRef = adminDb.collection('users').doc(uid);

    if (isActive) {
      await userRef.set({
        membershipActive: true,
        lastVerifiedAt: FieldValue.serverTimestamp(),
        planType: 'yearly_membership'
      }, { merge: true });
      return NextResponse.json({ ok: true, message: 'Welcome. You have full access.' });
    } else {
      await userRef.set({ membershipActive: false }, { merge: true });
      return NextResponse.json({ ok: false, message: "This membership is no longer active." });
    }

  } catch (error: any) {
    console.error("[Verify] Critical Error:", error.message);
    return NextResponse.json({ ok: false, message: 'Internal verification loop failure.' }, { status: 500 });
  }
}
