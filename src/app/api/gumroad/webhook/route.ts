import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview Gumroad Sale Webhook.
 * Handles the server-to-server handshake to atomically grant access.
 */

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    
    // 1. Basic Verification (Use Gumroad Seller ID if available in env)
    const sellerId = data.get('seller_id')?.toString();
    // if (process.env.GUMROAD_SELLER_ID && sellerId !== process.env.GUMROAD_SELLER_ID) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const email = data.get('email')?.toString();
    const uid = data.get('custom_fields[uid]')?.toString();
    const saleId = data.get('sale_id')?.toString();

    if (!uid || !email) {
      console.error("[Gumroad Webhook] Critical Error: Missing UID or Email in metadata");
      return NextResponse.json({ error: 'Missing Metadata' }, { status: 400 });
    }

    const systemRef = adminDb.collection('system').doc('billingState');
    const userRef = adminDb.collection('users').doc(uid);

    // 2. Atomic Transaction for Founding Member Spot
    await adminDb.runTransaction(async (transaction) => {
      const systemSnap = await transaction.get(systemRef);
      const currentCount = systemSnap.exists ? systemSnap.data()?.paidUserCount || 0 : 0;
      const newCount = currentCount + 1;

      // Increment Global Spots
      transaction.set(systemRef, {
        paidUserCount: newCount,
        isFreeTierUnlocked: newCount >= 6,
        lastUpdated: FieldValue.serverTimestamp()
      }, { merge: true });

      // Grant User Founder Access
      transaction.set(userRef, {
        hasPaidAccess: true,
        isFoundingMember: true,
        founderSpotNumber: newCount,
        gumroadSaleId: saleId,
        unlockedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    });

    console.log(`[Gumroad Webhook] Success: User ${uid} unlocked as Founder #${uid}`);
    return NextResponse.json({ status: 'success', unlocked: true });

  } catch (error: any) {
    console.error('[Gumroad Webhook Error]:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
