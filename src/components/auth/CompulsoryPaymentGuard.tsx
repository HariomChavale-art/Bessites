'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * @fileOverview Security Hub for Login and Payment.
 * Sends users to /login if they aren't signed in.
 * Sends users to /unlock-access if they haven't paid the $19.99 fee.
 */

export function CompulsoryPaymentGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  // 1. Check user info for payment status
  const userRef = user && db ? doc(db, 'users', user.uid) : null;
  const { data: userDoc, loading: docLoading } = useDoc<any>(userRef);

  // 2. Check if the system still requires payments
  const billingRef = db ? doc(db, 'system', 'billingState') : null;
  const { data: billingState, loading: billingLoading } = useDoc<any>(billingRef);

  useEffect(() => {
    // Wait for all information to load from the server
    if (userLoading || (user && (docLoading || billingLoading)) || !db) return;

    const isPublicPath = 
      pathname === '/login' || 
      pathname === '/unlock-access' || 
      pathname === '/onboarding' ||
      pathname?.startsWith('/api');

    // Case 1: If user is not logged in, send them to login page
    if (!user) {
      if (pathname !== '/login') {
        router.replace('/login');
      } else {
        setIsReady(true);
      }
      return;
    }

    // Case 2: User is logged in, check if they paid the $19.99 fee
    const hasPaid = userDoc?.hasPaidAccess === true;
    const isFreeTierUnlocked = billingState?.isFreeTierUnlocked === true;
    const canAccess = hasPaid || isFreeTierUnlocked;
    
    if (!canAccess && !isPublicPath) {
      // Not paid? Send them to the unlock page
      router.replace('/unlock-access');
    } else if (canAccess && pathname === '/unlock-access') {
      // Already paid? Send them to the home page
      router.replace('/');
    } else {
      // Everything looks good!
      setIsReady(true);
    }

  }, [user, userDoc, billingState, userLoading, docLoading, billingLoading, pathname, router, db]);

  // Show a loading screen while we verify access
  if (userLoading || (user && (docLoading || billingLoading)) || (!isReady && pathname !== '/login')) {
    return (
      <div className="min-h-screen bg-[#0B0A0F] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic">
          Checking your access pass...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
