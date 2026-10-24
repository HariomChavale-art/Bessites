'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Star, Sparkles, Globe } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function FoundingSuccessPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = user ? doc(db!, 'users', user.uid) : null;
  const { data: userDoc } = useDoc<any>(userRef);

  if (!mounted || userLoading || !user) return null;

  return (
    <main className="min-h-screen w-full bg-[#09090B] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-12 text-center animate-in zoom-in duration-700">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto shadow-2xl ring-8 ring-primary/10">
            <Check className="w-16 h-16 text-white" strokeWidth={5} />
          </div>
        </div>

        <div className="space-y-4">
          <header className="space-y-2">
             <Logo className="text-4xl" />
             <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">Access Unlocked.</h1>
          </header>
          <p className="text-zinc-400 font-medium italic text-lg max-w-sm mx-auto">
            Welcome to the inner circle, Founding Member <span className="text-white font-black">#{userDoc?.founderSpotNumber || '...'}</span>. Your lifetime access is now active.
          </p>
        </div>

        <Card className="bg-[#111116] border border-white/[0.07] rounded-3xl p-8 flex flex-col gap-6 shadow-2xl">
           <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Status</p>
                 <p className="text-xs font-bold text-emerald-400 uppercase">Verified</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Plan</p>
                 <p className="text-xs font-bold text-white uppercase">Lifetime</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Legacy</p>
                 <p className="text-xs font-bold text-primary uppercase">Founder</p>
              </div>
           </div>
        </Card>

        <div className="space-y-4 pt-4">
          <Button 
            onClick={() => router.push('/')}
            className="w-full h-20 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-xl italic shadow-2xl transition-all hover:scale-105 group"
          >
            ENTER THE DIRECTORY <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
          </Button>
          <div className="flex items-center justify-center gap-6 text-zinc-600">
             <Sparkles className="w-4 h-4" />
             <Globe className="w-4 h-4" />
             <Star className="w-4 h-4" />
          </div>
        </div>
      </div>
    </main>
  );
}
