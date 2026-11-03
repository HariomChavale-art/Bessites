
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

/**
 * @fileOverview Secure License Verification Node.
 * Verifies Gumroad License keys and unlocks Pro status in Firestore.
 */

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { licenseKey, uid } = await req.json();

    if (!licenseKey || !uid) {
      return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ ok: false, message: 'System nodes offline' }, { status: 500 });
    }

    // 1. Handshake with Gumroad API
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_permalink: 'Bessites',
        license_key: licenseKey
      })
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ 
        ok: false, 
        message: data.message || 'Verification failed. Please check your key.' 
      });
    }

    // 2. Unlock User Node in Firestore
    const userRef = adminDb.collection('users').doc(uid);
    await userRef.set({
      isPro: true,
      hasPaidAccess: true,
      licenseKey: licenseKey,
      unlockedAt: new Date().toISOString(),
      planType: 'pro_subscription'
    }, { merge: true });

    return NextResponse.json({ ok: true, message: 'Registry Unlocked!' });

  } catch (error: any) {
    console.error("[License Verification Error]:", error.message);
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
