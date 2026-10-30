'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * @fileOverview Security Node for Authentication and Paid Access.
 * Redirects unauthenticated users to /login.
 * Redirects unpaid users to /unlock-access ($19.99).
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

    const isPublicPath = 
      pathname === '/login' || 
      pathname === '/unlock-access' || 
      pathname === '/onboarding' ||
      pathname?.startsWith('/api');

    // Case 1: Not logged in
    if (!user) {
      if (pathname !== '/login') {
        router.replace('/login');
      } else {
        setIsReady(true);
      }
      return;
    }

    // Case 2: Logged in - check payment
    const hasPaid = userDoc?.hasPaidAccess === true;
    const isFreeTierUnlocked = billingState?.isFreeTierUnlocked === true;
    const canAccess = hasPaid || isFreeTierUnlocked;
    
    if (!canAccess && !isPublicPath) {
      router.replace('/unlock-access');
    } else if (canAccess && pathname === '/unlock-access') {
      router.replace('/');
    } else {
      // Access granted
      setIsReady(true);
    }

  }, [user, userDoc, billingState, userLoading, docLoading, billingLoading, pathname, router, db]);

  // Loading state prevents flickering and layout shifts
  // Note: On the server, this will always return loading state which is safe
  if (userLoading || docLoading || billingLoading || (!isReady && pathname !== '/login')) {
    return (
      <div className="min-h-screen bg-[#0B0A0F] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic">
          Checking access...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
