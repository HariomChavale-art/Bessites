
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * @fileOverview Security Node: Enforces the Bessites Pro Access Gate.
 * Optimized with memoized references to prevent infinite re-render loops.
 */
export function CompulsoryPaymentGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  // Memoize document references to ensure stability across renders
  const userRef = useMemo(() => 
    user && db ? doc(db, 'users', user.uid) : null, 
    [user?.uid, !!db]
  );
  const { data: userDoc, loading: docLoading } = useDoc<any>(userRef);

  const billingRef = useMemo(() => 
    db ? doc(db, 'system', 'billingState') : null, 
    [!!db]
  );
  const { data: billingState, loading: billingLoading } = useDoc<any>(billingRef);

  useEffect(() => {
    // Wait for auth and essential document synchronization
    if (userLoading || (user && (docLoading || billingLoading)) || !db) return;

    const isPublicPath = 
      pathname === '/login' || 
      pathname === '/unlock-access' || 
      pathname === '/onboarding' || 
      pathname === '/pro-success' || 
      pathname?.startsWith('/api');

    if (!user) {
      if (!isPublicPath) {
        router.replace('/login');
      } else {
        setIsReady(true);
      }
      return;
    }

    // New verification logic: check for Pro status
    const hasPaid = userDoc?.isPro === true || userDoc?.hasPaidAccess === true;
    const isFreeTierUnlocked = billingState?.isFreeTierUnlocked === true;

    // Direct paywall enforcement
    if (!hasPaid && !isFreeTierUnlocked && !isPublicPath) {
      console.log("[Guard] Access Denied: Pro License Required");
      router.replace('/unlock-access');
    } else {
      setIsReady(true);
    }
  }, [user?.uid, !!userDoc, !!billingState, userLoading, docLoading, billingLoading, pathname, router, !!db]);

  if (userLoading || (user && (docLoading || billingLoading)) || (!isReady && pathname !== '/login' && pathname !== '/unlock-access')) {
    return (
      <div className="min-h-screen bg-[#0B0A0F] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic">
          Synchronizing Discovery Pass...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
