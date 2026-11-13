
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview Secure License Verification Node for Bessites.
 * Handshakes with Gumroad API and updates user membership status.
 */

const PRODUCT_ID = 'JILFDGTEz9RAiXZmJOnhFg==';

export async function POST(req: NextRequest) {
  try {
    const { licenseKey, uid } = await req.json();

    if (!licenseKey || !uid) {
      return NextResponse.json({ ok: false, message: 'Please paste your membership key.' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ ok: false, message: 'System nodes offline. Please retry later.' }, { status: 500 });
    }

    // 1. Check if key is already used by another account
    const existingKeyQuery = await adminDb.collection('users')
      .where('licenseKey', '==', licenseKey.trim())
      .limit(1)
      .get();

    if (!existingKeyQuery.empty && existingKeyQuery.docs[0].id !== uid) {
      return NextResponse.json({ 
        ok: false, 
        message: "This key is already used by another account. Email bessitesofficial@gmail.com and we'll help." 
      });
    }

    // 2. Handshake with Gumroad API
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_id: PRODUCT_ID,
        license_key: licenseKey.trim()
      })
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ 
        ok: false, 
        message: "That key isn't valid. Check the key in your receipt email and try again." 
      });
    }

    const { purchase } = data;

    // 3. Status Checks
    if (purchase.refunded || purchase.chargebacked) {
      return NextResponse.json({ ok: false, message: "This membership is no longer active." });
    }

    if (purchase.subscription_failed_at) {
      return NextResponse.json({ ok: false, message: "Your payment didn't go through. Update your payment method through the Gumroad receipt link." });
    }

    if (purchase.subscription_ended_at) {
      const endedAt = new Date(purchase.subscription_ended_at).getTime();
      if (endedAt < Date.now()) {
        return NextResponse.json({ ok: false, message: "This membership has ended. You can renew from the Get full access button." });
      }
    }

    // 4. Unlock User Node in Firestore
    const userRef = adminDb.collection('users').doc(uid);
    await userRef.set({
      membershipActive: true,
      licenseKey: licenseKey.trim(),
      lastVerifiedAt: FieldValue.serverTimestamp(),
      planType: 'yearly_membership'
    }, { merge: true });

    return NextResponse.json({ ok: true, message: 'Welcome. You have full access.' });

  } catch (error: any) {
    console.error("[License Verification Error]:", error.message);
    return NextResponse.json({ ok: false, message: 'Internal verification loop failure.' }, { status: 500 });
  }
}
