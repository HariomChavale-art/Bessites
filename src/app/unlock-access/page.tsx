'use client';

import React, { useEffect, useMemo } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader2, ShieldCheck, Flame, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import Script from 'next/script';
import { Logo } from '@/components/logo';

export default function UnlockAccessPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // User Doc Listener
  const userRef = user ? doc(db!, 'users', user.uid) : null;
  const { data: userDoc } = useDoc<any>(userRef);

  // System Billing Listener for Scarcity
  const billingRef = doc(db!, 'system', 'billingState');
  const { data: billingState } = useDoc<any>(billingRef);

  // Auto-Unlock Effect
  useEffect(() => {
    if (userDoc?.hasPaidAccess || billingState?.isFreeTierUnlocked) {
      router.push('/');
    }
  }, [userDoc, billingState, router]);

  const paidUserCount = billingState?.paidUserCount || 0;
  const isLifetime = paidUserCount < 100;
  
  const gumroadPermalink = isLifetime 
    ? process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_PERMALINK 
    : process.env.NEXT_PUBLIC_GUMROAD_ANNUAL_PERMALINK;

  if (userLoading || !user) {
    return <div className="min-h-screen bg-[#070709] flex items-center justify-center text-white"><Loader2 className="animate-spin text-orange-500" /></div>;
  }

  return (
    <main className="min-h-screen w-full bg-[#070709] text-white flex flex-col items-center p-4 py-12 font-body selection:bg-orange-500/30">
      <Script src="https://gumroad.com/js/gumroad-embed.js" strategy="lazyOnload" />

      <div className="max-w-4xl w-full space-y-12">
        {/* Scarcity Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <ShieldCheck className="w-8 h-8 text-orange-500" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Authorized Curator</p>
              <p className="text-lg font-bold text-white italic">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 relative z-10">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-500 animate-flame-flicker fill-current" />
              <span className="text-base font-black uppercase tracking-tighter italic text-orange-500">
                {isLifetime ? `HALLOWEEN LIFETIME PASS: $19.99` : 'ANNUAL PRO MEMBERSHIP: $19.99'}
              </span>
            </div>
            <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                 {isLifetime ? `Spot #${paidUserCount + 1} of 100 Remaining` : 'Secure 1-Year Discovery License'}
               </p>
            </div>
          </div>
        </header>

        <div className="text-center space-y-4">
           <Logo className="text-6xl glow-pumpkin" />
           <h2 className="text-3xl font-black italic uppercase tracking-tighter">Unlock the <span className="text-orange-500">Registry.</span></h2>
           <p className="text-white/40 font-medium italic max-w-lg mx-auto">Absolute discovery requires a verified curator node. Claim your spot in the founding circle.</p>
        </div>

        {/* Gumroad Embed Container */}
        <Card className="bg-[#12111A] border border-orange-500/20 rounded-[3.5rem] p-1 overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-orange-500/5 blur-[100px] pointer-events-none" />
          <div className="bg-[#070709] rounded-[3.4rem] min-h-[600px] relative z-10">
            <div 
              className="gumroad-product-embed" 
              data-gumroad-product-id={gumroadPermalink}
              data-outbound-embed="true"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                <div className="space-y-2 text-center">
                  <p className="text-sm font-black text-white/30 uppercase tracking-[0.4em] animate-pulse">
                    Synchronizing Secure Checkout...
                  </p>
                  <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest">Awaiting Handshake from server node</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Support & Fallback */}
        <footer className="text-center space-y-8 pb-12">
          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
            <Sparkles className="w-4 h-4" /> Account Unlocks the Millisecond Transaction Completes <Sparkles className="w-4 h-4" />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href={`https://gumroad.com/l/${gumroadPermalink}?email=${encodeURIComponent(user.email || '')}&custom_fields[uid]=${user.uid}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-orange-500 hover:text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-orange-500/20 pb-2 transition-all hover:border-orange-500"
            >
              POPUP BLOCKED? OPEN EXTERNAL VAULT <ExternalLink className="w-4 h-4" />
            </a>
            <button 
              onClick={() => router.push('/login')}
              className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
            >
              SWITCH ACCOUNT <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}