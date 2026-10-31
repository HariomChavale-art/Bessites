'use client';
import React, { useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
export function CompulsoryPaymentGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const userRef = user && db ? doc(db, 'users', user.uid) : null;
  const { data: userDoc, loading: docLoading } = useDoc<any>(userRef);
  const billingRef = db ? doc(db, 'system', 'billingState') : null;
  const { data: billingState, loading: billingLoading } = useDoc<any>(billingRef);
  useEffect(() => {
    if (userLoading || (user && (docLoading || billingLoading)) || !db) return;
    const isPublicPath = pathname === '/login' || pathname === '/unlock-access' || pathname === '/onboarding' || pathname?.startsWith('/api');
    if (!user) {
      if (pathname !== '/login') router.replace('/login');
      else setIsReady(true);
      return;
    }
    const hasPaid = userDoc?.hasPaidAccess === true;
    const isFreeTierUnlocked = billingState?.isFreeTierUnlocked === true;
    if (!hasPaid && !isFreeTierUnlocked && !isPublicPath) router.replace('/unlock-access');
    else setIsReady(true);
  }, [user, userDoc, billingState, userLoading, docLoading, billingLoading, pathname, router, db]);
  if (userLoading || (user && (docLoading || billingLoading)) || (!isReady && pathname !== '/login')) {
    return (<div className="min-h-screen bg-[#0B0A0F] flex flex-col items-center justify-center space-y-6"><Loader2 className="animate-spin text-primary w-10 h-10" /><p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em]">Checking your access pass...</p></div>);
  }
  return <>{children}</>;
}
