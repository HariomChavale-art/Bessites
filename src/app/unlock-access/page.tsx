'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import Script from 'next/script';
import { Logo } from '@/components/logo';

export default function UnlockAccessPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = user ? doc(db!, 'users', user.uid) : null;
  const { data: userDoc } = useDoc<any>(userRef);

  const billingRef = doc(db!, 'system', 'billingState');
  const { data: billingState } = useDoc<any>(billingRef);

  useEffect(() => {
    if (userDoc?.hasPaidAccess || billingState?.isFreeTierUnlocked) {
      router.push('/');
    }
  }, [userDoc, billingState, router]);

  if (!mounted || userLoading || !user) return null;

  const paidUserCount = billingState?.paidUserCount || 0;

  return (
    <main className="min-h-screen w-full bg-[#09090B] text-white flex flex-col items-center p-4 py-20">
      <Script src="https://gumroad.com/js/gumroad-embed.js" strategy="lazyOnload" />

      <div className="max-w-xl w-full space-y-12">
        <header className="text-center space-y-6">
           <Logo className="text-4xl" />
           <div className="space-y-2">
             <h2 className="text-3xl font-semibold italic text-white uppercase tracking-tighter">October Founding Pass</h2>
             <p className="text-zinc-500 font-medium italic">$19.99 once, yours forever. Limited to the first 100 members.</p>
           </div>
        </header>

        <Card className="bg-[#111116] border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>{user.email}</span>
            <button onClick={() => router.push('/login')} className="text-primary hover:text-white transition-colors">Switch account</button>
          </div>
          
          <div className="min-h-[500px] relative">
            <div className="gumroad-product-embed" data-gumroad-product-id={process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_PERMALINK}>
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
                <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">Awaiting checkout handshake...</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border-t border-white/[0.06]">
            <div className="flex justify-between items-center mb-3">
               <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">{paidUserCount} / 100 claimed</span>
               <span className="text-[11px] font-mono text-primary uppercase tracking-widest">Founding Tier</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${paidUserCount}%` }} />
            </div>
          </div>
        </Card>

        <footer className="text-center space-y-6">
           <button 
             onClick={() => window.location.reload()}
             className="text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2 mx-auto transition-colors"
           >
             Already completed payment? Verify access <ArrowRight className="w-3 h-3" />
           </button>
        </footer>
      </div>
    </main>
  );
}