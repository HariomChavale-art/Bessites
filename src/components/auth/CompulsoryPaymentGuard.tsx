'use client';

import React, { useEffect } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * @fileOverview Security Node for Paid Access.
 * Redirects users to the payment gate if they haven't bought the Founding Pass.
 */

export function CompulsoryPaymentGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Check User Account for Payment Status
  const userRef = user && db ? doc(db, 'users', user.uid) : null;
  const { data: userDoc, loading: docLoading } = useDoc<any>(userRef);

  // 2. Check Global System State (threshold for paid phase)
  const billingRef = db ? doc(db, 'system', 'billingState') : null;
  const { data: billingState, loading: billingLoading } = useDoc<any>(billingRef);

  useEffect(() => {
    if (userLoading || docLoading || billingLoading || !db) return;

    // Allowed paths during the lock phase
    const isPublicPath = pathname === '/login' || pathname === '/unlock-access' || pathname?.startsWith('/api');
    
    // Logic: If user is logged in but hasn't paid, and we are in the "Paid Only" phase
    const hasPaid = userDoc?.hasPaidAccess === true;
    const isFreeTierUnlocked = billingState?.isFreeTierUnlocked === true; // Set to true after limit reached
    
    if (user && !hasPaid && !isFreeTierUnlocked && !isPublicPath) {
      router.replace('/unlock-access');
    }
    
    // Redirect away from paywall if already paid
    if (user && (hasPaid || isFreeTierUnlocked) && pathname === '/unlock-access') {
      router.replace('/');
    }

  }, [user, userDoc, billingState, userLoading, docLoading, billingLoading, pathname, router, db]);

  if (userLoading || docLoading || billingLoading) {
    return (
      <div className="min-h-screen bg-[#0B0A0F] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic">
          Verifying Access Node...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
