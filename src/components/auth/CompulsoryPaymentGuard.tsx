'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useUser, useDoc, useFirestore, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * @fileOverview Security Node: Enforces the Bessites Pro Access Gate.
 * Validates membershipActive status and triggers 7-day re-verification.
 */
export function CompulsoryPaymentGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const userRef = useMemo(() => 
    user && db ? doc(db, 'users', user.uid) : null, 
    [user?.uid, !!db]
  );
  const { data: userDoc, loading: docLoading } = useDoc<any>(userRef);

  useEffect(() => {
    if (userLoading || (user && docLoading) || !db) return;

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

    const hasPaid = userDoc?.membershipActive === true || userDoc?.isPro === true || userDoc?.hasPaidAccess === true;

    // Handle 7-day re-verification logic
    if (hasPaid && userDoc?.membershipActive && !isPublicPath) {
      const lastVerified = userDoc.lastVerifiedAt?.toDate()?.getTime() || 0;
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      if (Date.now() - lastVerified > sevenDaysInMs) {
        console.log("[Guard] Triggering 7-day re-verification...");
        
        auth?.currentUser?.getIdToken().then(token => {
          fetch('/api/verify-membership', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email: user.email })
          }).catch(err => console.error("Background re-verify failed:", err));
        });
      }
    }

    if (!hasPaid && !isPublicPath) {
      console.log("[Guard] Access Denied: Membership Required");
      router.replace('/unlock-access');
    } else {
      setIsReady(true);
    }
  }, [user?.uid, !!userDoc, userLoading, docLoading, pathname, router, !!db, auth]);

  if (userLoading || (user && docLoading) || (!isReady && pathname !== '/login' && pathname !== '/unlock-access')) {
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