'use client';

import React, { useEffect, useState } from 'react';
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
  const [isReady, setIsReady] = useState(false);

  // 1. Check User Account for Payment Status
  const userRef = user && db ? doc(db, 'users', user.uid) : null;
  const { data: userDoc, loading: docLoading } = useDoc<any>(userRef);

  // 2. Check Global System State (threshold for paid phase)
  const billingRef = db ? doc(db, 'system', 'billingState') : null;
  const { data: billingState, loading: billingLoading } = useDoc<any>(billingRef);

  useEffect(() => {
    // Wait for all auth and billing data to load
    if (userLoading || docLoading || billingLoading || !db) return;

    // Allowed paths that bypass the payment check
    const isPublicPath = 
      pathname === '/login' || 
      pathname === '/unlock-access' || 
      pathname === '/onboarding' ||
      pathname?.startsWith('/api');
    
    const hasPaid = userDoc?.hasPaidAccess === true;
    const isFreeTierUnlocked = billingState?.isFreeTierUnlocked === true;
    
    if (user && !hasPaid && !isFreeTierUnlocked && !isPublicPath) {
      // Force redirect to unlock page if payment is missing
      router.replace('/unlock-access');
    } else if (user && (hasPaid || isFreeTierUnlocked) && pathname === '/unlock-access') {
      // If already paid, move away from unlock page
      router.replace('/');
    } else {
      // Access granted
      setIsReady(true);
    }

  }, [user, userDoc, billingState, userLoading, docLoading, billingLoading, pathname, router, db]);

  // Loading state prevents layout shift and unauthorized data exposure
  if (userLoading || docLoading || billingLoading || (!isReady && pathname !== '/login' && pathname !== '/unlock-access' && pathname !== '/onboarding')) {
    return (
      <div className="min-h-screen bg-[#0B0A0F] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic">
          Verifying Access...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
