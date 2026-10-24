'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from '@/components/logo';
import { GumroadOverlayButton } from '@/components/auth/GumroadOverlayButton';

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
    <main className="min-h-screen w-full bg-[#09090B] text-white flex flex-col items-center p-4 py-24">
      <div className="max-w-xl w-full space-y-12">
        <header className="text-center space-y-6">
           <Logo className="text-4xl" />
           <div className="space-y-2">
             <h2 className="text-3xl font-semibold italic text-white uppercase tracking-tighter">October Founding Pass</h2>
             <p className="text-zinc-500 font-medium italic">Unlocked access for life. Join the first 100 curators.</p>
           </div>
        </header>

        <Card className="bg-[#111116] border border-white/[0.07] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] p-10 space-y-10">
          <div className="space-y-6">
            <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Signed in as</p>
                 <p className="text-sm font-semibold text-white">{user.email}</p>
              </div>
              <button onClick={() => router.push('/login')} className="text-[10px] font-black uppercase text-primary hover:text-white transition-colors">Switch</button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Founding Pool</p>
                    <p className="text-2xl font-black italic text-white tabular-nums">{paidUserCount} / 100 claimed</p>
                 </div>
                 <Badge className="bg-orange-500/10 text-orange-400 border-none px-3 py-1 text-[10px] font-black uppercase">Lifetime Access</Badge>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${paidUserCount}%` }} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <GumroadOverlayButton 
                email={user.email || ''} 
                uid={user.uid}
                className="w-full h-20 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-xl italic shadow-2xl shadow-white/5 group transition-all"
             />
             <p className="text-center text-[10px] font-medium text-zinc-600 uppercase tracking-widest italic">
                Secure 256-bit encrypted checkout via Gumroad
             </p>
          </div>
        </Card>

        <footer className="flex flex-col items-center gap-6">
           <div className="flex items-center gap-8 opacity-20">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Safe</span></div>
              <div className="flex items-center gap-2"><Zap className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Instant</span></div>
           </div>
           
           <button 
             onClick={() => window.location.reload()}
             className="text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors border-b border-white/5 pb-1"
           >
             Already completed payment? Verify access <ArrowRight className="w-3 h-3" />
           </button>
        </footer>
      </div>
    </main>
  );
}
