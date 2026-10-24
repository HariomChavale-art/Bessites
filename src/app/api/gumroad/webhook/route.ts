import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview Gumroad Webhook Handler.
 * Receives POST ping from Gumroad on successful sale.
 * Atomically increments counters and unlocks user access.
 */

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    
    // 1. Basic Verification (In production, verify Gumroad signature or Seller ID)
    const sellerId = data.get('seller_id');
    if (sellerId !== process.env.GUMROAD_SELLER_ID) {
      return NextResponse.json({ error: 'Unauthorized Seller' }, { status: 401 });
    }

    const email = data.get('email')?.toString();
    const uid = data.get('custom_fields[uid]')?.toString();
    const saleId = data.get('sale_id')?.toString();
    const productPermalink = data.get('permalink')?.toString();

    if (!uid || !email) {
      return NextResponse.json({ error: 'Missing Identity Data' }, { status: 400 });
    }

    // 2. Atomic Firestore Update
    const systemRef = adminDb.collection('system').doc('billingState');
    const userRef = adminDb.collection('users').doc(uid);

    await adminDb.runTransaction(async (transaction) => {
      const systemSnap = await transaction.get(systemRef);
      const currentCount = systemSnap.exists ? systemSnap.data()?.paidUserCount || 0 : 0;
      const newCount = currentCount + 1;

      // Determine plan type
      const isLifetime = productPermalink === process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_PRODUCT_ID;
      const planType = isLifetime ? 'halloween_lifetime' : 'annual_pro';

      // Update System Stats
      transaction.set(systemRef, {
        paidUserCount: newCount,
        isFreeTierUnlocked: newCount >= 6,
        lastUpdated: FieldValue.serverTimestamp()
      }, { merge: true });

      // Update User Doc
      transaction.set(userRef, {
        hasPaidAccess: true,
        planType,
        founderNumber: newCount,
        gumroadSaleId: saleId,
        paymentEmail: email,
        unlockedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    });

    console.log(`[Gumroad Webhook] Successfully unlocked user ${uid} (Order: ${saleId})`);
    return NextResponse.json({ status: 'success', unlocked: true });

  } catch (error: any) {
    console.error('[Gumroad Webhook Error]:', error.message);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
