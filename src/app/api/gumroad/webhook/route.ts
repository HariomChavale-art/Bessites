import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview Resilient Gumroad Webhook Handler.
 * Wrap in try/catch to prevent Next.js data collection crashes.
 */

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ ok: false, error: 'Admin SDK not initialized' }, { status: 200 });
    }

    const data = await req.formData();
    const email = data.get('email')?.toString();
    const uid = data.get('custom_fields[uid]')?.toString();
    const saleId = data.get('sale_id')?.toString();

    if (!uid) {
      return NextResponse.json({ ok: false, error: 'Missing UID' }, { status: 200 });
    }

    const systemRef = adminDb.collection('system').doc('billingState');
    const userRef = adminDb.collection('users').doc(uid);

    await adminDb.runTransaction(async (transaction) => {
      const systemSnap = await transaction.get(systemRef);
      const currentCount = systemSnap.exists ? systemSnap.data()?.paidUserCount || 0 : 0;
      const newCount = currentCount + 1;

      transaction.set(systemRef, {
        paidUserCount: newCount,
        isFreeTierUnlocked: false,
        lastUpdated: FieldValue.serverTimestamp()
      }, { merge: true });

      transaction.set(userRef, {
        hasPaidAccess: true,
        planType: 'founding_pass',
        gumroadSaleId: saleId,
        paymentEmail: email,
        unlockedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    });

    return NextResponse.json({ ok: true, status: 'success', unlocked: true });

  } catch (error: any) {
    console.error('[Gumroad Webhook Error]:', error.message);
    // Return 200 even on error to satisfy webhook retry logic and prevent Next.js routing crashes
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
}
