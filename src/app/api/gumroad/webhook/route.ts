import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview Gumroad Webhook Handler for Bessites.
 * Confirms payment and unlocks the user account in Firestore.
 */

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    
    // 1. Basic Metadata Extraction
    const email = data.get('email')?.toString();
    const uid = data.get('custom_fields[uid]')?.toString(); // Assumes uid was passed in checkout
    const saleId = data.get('sale_id')?.toString();

    if (!uid) {
      console.error('[Gumroad Webhook] Missing UID in checkout data');
      return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
    }

    // 2. Atomic Firestore Transaction to update stats and user
    const systemRef = adminDb.collection('system').doc('billingState');
    const userRef = adminDb.collection('users').doc(uid);

    await adminDb.runTransaction(async (transaction) => {
      const systemSnap = await transaction.get(systemRef);
      const currentCount = systemSnap.exists ? systemSnap.data()?.paidUserCount || 0 : 0;
      const newCount = currentCount + 1;

      // Update System Stats
      transaction.set(systemRef, {
        paidUserCount: newCount,
        // If we reach the requested limit (e.g., 6), we could toggle isFreeTierUnlocked here
        isFreeTierUnlocked: false, // Keeping it locked per request
        lastUpdated: FieldValue.serverTimestamp()
      }, { merge: true });

      // Unlock User
      transaction.set(userRef, {
        hasPaidAccess: true,
        planType: 'founding_pass',
        gumroadSaleId: saleId,
        paymentEmail: email,
        unlockedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    });

    return NextResponse.json({ status: 'success', unlocked: true });

  } catch (error: any) {
    console.error('[Gumroad Webhook Error]:', error.message);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
