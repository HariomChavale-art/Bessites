import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview Gumroad Webhook Security Hub.
 * Hardened with global error boundaries and forced dynamic rendering.
 */

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      console.warn("[Webhook] Firebase Admin node is unavailable.");
      return NextResponse.json({ ok: false, message: 'System nodes synchronizing' }, { status: 200 });
    }

    const data = await req.formData();
    const email = data.get('email')?.toString();
    const uid = data.get('custom_fields[uid]')?.toString();
    const saleId = data.get('sale_id')?.toString();

    if (!uid) {
      return NextResponse.json({ ok: false, message: 'Identification required' }, { status: 200 });
    }

    const systemRef = adminDb.collection('system').doc('billingState');
    const userRef = adminDb.collection('users').doc(uid);

    await adminDb.runTransaction(async (transaction) => {
      const systemSnap = await transaction.get(systemRef);
      const currentCount = systemSnap.exists ? systemSnap.data()?.paidUserCount || 0 : 0;
      
      transaction.set(systemRef, {
        paidUserCount: currentCount + 1,
        lastInteraction: FieldValue.serverTimestamp()
      }, { merge: true });

      transaction.set(userRef, {
        hasPaidAccess: true,
        planType: 'founding_pass',
        gumroadSaleId: saleId,
        paymentEmail: email,
        unlockedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    });

    return NextResponse.json({ ok: true, status: 'authorized' });

  } catch (error: any) {
    console.error("[Webhook Critical Error]:", error.message);
    // Return 200 to prevent Next.js build crash and satisfy webhook retries
    return NextResponse.json({ ok: false, error: 'Internal node error' }, { status: 200 });
  }
}