'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Script from 'next/script';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

/**
 * @fileOverview The Bessites Paywall.
 * Simple, professional, and clear.
 */
export default function UnlockAccessPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#0B0A0F] text-white flex flex-col items-center p-4 py-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Script src="https://gumroad.com/js/gumroad-embed.js" strategy="lazyOnload" />

      <div className="max-w-xl w-full space-y-12 relative z-10">
        <header className="text-center space-y-6">
           <Logo className="text-5xl" />
           <div className="space-y-3">
             <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Get Your Access Pass</h2>
             <p className="text-muted-foreground font-medium italic text-lg">
               Pay once, keep it forever. Get the full list of 1,000+ best websites.
             </p>
           </div>
        </header>

        <Card className="bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-8 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Founding Member Account</span>
            </div>
            <span className="text-[10px] font-bold text-primary italic uppercase">{user.email}</span>
          </div>
          
          <div className="min-h-[450px] relative p-6">
            {/* Gumroad Embed Node */}
            <div 
              className="gumroad-product-embed" 
              data-gumroad-product-id="bessites_pass" 
              data-gumroad-single-product="true"
            >
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Connecting to Payment Node...</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-6">
             <div className="flex items-center gap-3 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Secure Payment</span>
             </div>
             <div className="flex items-center gap-3 text-primary">
                <Zap className="w-5 h-5 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Instant Unlock</span>
             </div>
          </div>
        </Card>

        <footer className="text-center space-y-8">
           <div className="flex flex-col gap-4">
             <p className="text-xs text-muted-foreground italic">Already paid? Refresh to sync your account.</p>
             <Button 
               onClick={() => window.location.reload()}
               className="h-14 px-10 rounded-full bg-white text-black font-black uppercase italic tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
             >
               CHECK STATUS NOW <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
           </div>
           <button onClick={() => router.push('/login')} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-colors">Sign out and switch account</button>
        </footer>
      </div>
    </main>
  );
}
