'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowRight, ShieldCheck, Zap, LogOut } from 'lucide-react';
import Script from 'next/script';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

/**
 * @fileOverview The Payment Portal.
 * Refocused as a full-page checkout experience for the $19.99 Founding Pass.
 */
export default function UnlockAccessPage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (!mounted || userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#0B0A0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Script src="https://gumroad.com/js/gumroad-embed.js" strategy="lazyOnload" />

      <div className="max-w-3xl w-full space-y-10 relative z-10 animate-in fade-in zoom-in duration-1000">
        <header className="text-center space-y-4">
           <Logo className="text-5xl sm:text-7xl" />
           <div className="space-y-2">
             <h2 className="text-3xl sm:text-5xl font-black italic text-white uppercase tracking-tighter">Founding Pass</h2>
             <p className="text-muted-foreground font-medium italic text-lg sm:text-xl">
               Get lifetime access to our registry of 1,000+ high-fidelity digital tools.
             </p>
           </div>
        </header>

        <Card className="bg-[#12111A]/80 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="p-8 sm:p-10 bg-white/5 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(123,51,255,1)]" />
              <span className="text-xs font-black uppercase tracking-widest text-white/60 italic">Identity Verified</span>
            </div>
            <span className="text-[11px] font-bold text-primary italic uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              {user.email}
            </span>
          </div>
          
          <div className="min-h-[500px] relative p-6 bg-white/[0.01]">
            {/* Gumroad payment tool */}
            <div 
              className="gumroad-product-embed" 
              data-gumroad-product-id="bessites_pass" 
              data-gumroad-single-product="true"
            >
              <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-xs font-black uppercase text-white/20 tracking-[0.4em] italic">
                  Initializing Checkout Terminal...
                </p>
              </div>
            </div>
          </div>

          <div className="p-10 bg-black/40 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-8">
             <div className="flex items-center gap-4 text-emerald-400">
                <div className="p-3 rounded-2xl bg-emerald-500/10"><ShieldCheck className="w-6 h-6" /></div>
                <div className="space-y-0.5">
                   <p className="text-[11px] font-black uppercase tracking-widest italic">Secure Processing</p>
                   <p className="text-[9px] text-white/40 font-bold uppercase">PCI Compliant Terminal</p>
                </div>
             </div>
             <div className="flex items-center gap-4 text-primary">
                <div className="p-3 rounded-2xl bg-primary/10"><Zap className="w-6 h-6 fill-current" /></div>
                <div className="space-y-0.5">
                   <p className="text-[11px] font-black uppercase tracking-widest italic">Instant Unlock</p>
                   <p className="text-[9px] text-white/40 font-bold uppercase">Real-time Node Activation</p>
                </div>
             </div>
          </div>
        </Card>

        <footer className="flex flex-col items-center gap-8">
           <div className="flex flex-col items-center gap-4 w-full">
             <p className="text-xs text-muted-foreground font-medium italic opacity-50">Already purchased? Refresh to activate your pass.</p>
             <Button 
               onClick={() => window.location.reload()}
               className="h-16 px-12 rounded-full bg-white text-black hover:bg-white/90 font-black uppercase italic tracking-widest text-sm shadow-2xl transition-all hover:scale-105 active:scale-95"
             >
               CHECK ACTIVATION STATUS <ArrowRight className="w-5 h-5 ml-2" />
             </Button>
           </div>
           
           <button 
             onClick={handleLogout}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-rose-500 transition-colors group"
           >
             <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" /> Sign out and change account
           </button>
        </footer>
      </div>
    </main>
  );
}