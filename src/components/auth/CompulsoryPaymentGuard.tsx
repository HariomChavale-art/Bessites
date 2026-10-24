'use client';

import React, { useEffect } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * @fileOverview Route Protection for Compulsory Payment Phase.
 * Locks non-paid users to /unlock-access during mandatory launch.
 */

export function CompulsoryPaymentGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userRef = user ? doc(db!, 'users', user.uid) : null;
  const { data: userDoc, loading: docLoading } = useDoc<any>(userRef);

  useEffect(() => {
    if (userLoading || docLoading) return;

    // Allowed paths even if not paid
    const isPublicPath = pathname === '/login' || pathname === '/unlock-access' || pathname?.startsWith('/api');
    
    if (user && !userDoc?.hasPaidAccess && !isPublicPath) {
      router.replace('/unlock-access');
    }
    
    if (user && userDoc?.hasPaidAccess && pathname === '/unlock-access') {
      router.replace('/');
    }

  }, [user, userDoc, userLoading, docLoading, pathname, router]);

  if (userLoading || docLoading) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
        <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic">
          Synchronizing Security Nodes...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
