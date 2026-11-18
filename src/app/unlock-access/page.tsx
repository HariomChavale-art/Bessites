'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Check, 
  ShieldCheck, 
  Loader2,
  Lock
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { ProCTA } from '@/components/ProCTA';

export default function UnlockAccessPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [activating, setActivating] = useState(false);

  const userRef = useMemo(() => 
    user && db ? doc(db, 'users', user.uid) : null, 
    [user?.uid, !!db]
  );
  const { data: userDoc, loading: docLoading } = useDoc<any>(userRef);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
    if (user?.email) {
      setPurchaseEmail(user.email);
    }
  }, [user, authLoading, router]);

  const handleActivate = async () => {
    if (!user || !auth?.currentUser) {
      router.push('/login');
      return;
    }

    if (!purchaseEmail.trim()) {
      toast({ variant: "destructive", title: "Input Required", description: "Please enter your purchase email." });
      return;
    }

    setActivating(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/verify-membership', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: purchaseEmail.trim() })
      });

      const data = await response.json();

      if (data.ok) {
        toast({ title: "Access Unlocked", description: "Welcome. You have full access." });
        router.push('/');
      } else {
        toast({ variant: "destructive", title: "Activation Failed", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not connect to verification node." });
    } finally {
      setActivating(false);
    }
  };

  if (authLoading || docLoading) {
    return (
      <div className="min-h-screen bg-[#0B0A0F] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic">
          Synchronizing Discovery Pass...
        </p>
      </div>
    );
  }

  const isPro = userDoc?.membershipActive === true || userDoc?.isPro === true || userDoc?.hasPaidAccess === true;

  return (
    <div className="min-h-screen bg-black text-[#f8f5ff] flex flex-col font-body selection:bg-purple-600 selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#020105]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-gradient-to-b from-purple-900/5 to-transparent blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-20">
        <div className="mb-12">
          <Logo className="text-4xl" />
        </div>

        {isPro ? (
          <Card className="w-full max-w-md bg-[#0d0c12] border border-emerald-500/20 rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <Check className="w-12 h-12 text-emerald-500" strokeWidth={5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Full Access Active</h2>
              <p className="text-zinc-400 font-medium italic">Your curator membership node is verified.</p>
            </div>
            <Button 
              onClick={() => router.push('/')}
              className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase italic text-lg shadow-xl hover:bg-zinc-200 transition-all"
            >
              Enter Home Feed
            </Button>
            <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/60">
              <ShieldCheck className="w-3.5 h-3.5" /> SECURE GATEWAY VERIFIED
            </div>
          </Card>
        ) : (
          <div className="w-full max-w-2xl space-y-20">
            <div className="flex justify-center">
              <Card className="w-full max-w-md bg-[#0d0c12] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50">
                <div className="p-10 sm:p-12 space-y-10">
                  <header className="text-center space-y-2">
                    <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-4">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter leading-none">Unlock Access</h2>
                    <p className="text-sm text-zinc-400 font-medium">Full access to the 2,000-node registry.</p>
                  </header>

                  <div className="text-center space-y-1">
                    <div className="text-5xl font-bold text-white tracking-tight">$99<span className="text-2xl text-zinc-500">/year</span></div>
                    <p className="text-xs text-zinc-500 font-medium italic opacity-60">Zero duplication. Zero padding.</p>
                  </div>

                  <div className="space-y-4">
                    <ProCTA />
                  </div>

                  <div className="pt-10 border-t border-white/5 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-zinc-600 ml-1">Verification Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={purchaseEmail}
                          onChange={(e) => setPurchaseEmail(e.target.value)}
                          placeholder="Your purchase email"
                          className="bg-white/5 border-white/10 h-14 rounded-xl text-base focus:ring-primary/40 text-white font-bold"
                        />
                      </div>
                      <Button 
                        onClick={handleActivate}
                        disabled={activating}
                        variant="outline"
                        className="w-full h-14 rounded-xl border-white/10 hover:bg-white/5 text-white font-bold uppercase tracking-widest text-xs"
                      >
                        {activating ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify Identity"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium leading-relaxed italic">
      <div className="mt-1 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <Check className="w-2.5 h-2.5 text-primary" strokeWidth={4} />
      </div>
      {text}
    </li>
  );
}
