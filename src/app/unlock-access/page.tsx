
'use client';

import React, { useState } from 'react';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader2, ShieldCheck, Zap, LogOut, Key } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signOut } from 'firebase/auth';
import { ProCTA } from '@/components/ProCTA';
import { useToast } from '@/hooks/use-toast';

export default function UnlockAccessPage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!licenseKey.trim() || !user) return;
    setIsVerifying(true);

    try {
      const response = await fetch('/api/verify-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey, uid: user.uid })
      });

      const data = await response.json();

      if (data.ok) {
        toast({ title: "Welcome Pro!", description: "Registry unlocked successfully." });
        router.push('/');
      } else {
        toast({ variant: "destructive", title: "Key Rejected", description: data.message });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Verification node unreachable." });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#0B0A0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl w-full space-y-12 relative z-10 animate-in fade-in zoom-in duration-1000">
        <header className="text-center space-y-4">
           <Logo className="text-5xl sm:text-7xl" />
           <div className="space-y-2">
             <h2 className="text-3xl sm:text-5xl font-black italic text-white uppercase tracking-tighter">Registry Spotlight</h2>
             <p className="text-muted-foreground font-medium italic text-lg sm:text-xl">
               Access the top 1% of the modern web with Bessites Pro.
             </p>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Section 1: Buy */}
           <Card className="bg-[#12111A]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 sm:p-10 flex flex-col justify-between gap-10 shadow-2xl">
              <div className="space-y-4">
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">1. Get License</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed italic">
                    Subscribe to our high-fidelity tool suite. You will receive a unique license key in your email.
                 </p>
              </div>
              <ProCTA />
           </Card>

           {/* Section 2: Activate */}
           <Card className="bg-[#12111A]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 sm:p-10 space-y-8 shadow-2xl">
              <div className="space-y-4">
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">2. Activate</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed italic">
                    Paste your license key here to synchronize your Pro status.
                 </p>
              </div>

              <div className="space-y-4">
                 <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input 
                      placeholder="GUM-XXXX-XXXX" 
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-sm font-mono tracking-widest"
                    />
                 </div>
                 <Button 
                   onClick={handleVerify}
                   disabled={!licenseKey.trim() || isVerifying}
                   className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase italic shadow-xl hover:bg-white/90"
                 >
                    {isVerifying ? <Loader2 className="animate-spin w-5 h-5" /> : "ACTIVATE NODE"}
                 </Button>
              </div>
           </Card>
        </div>

        <footer className="flex flex-col items-center gap-6">
           <div className="flex items-center gap-6 opacity-30">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em]">
                 <ShieldCheck className="w-3.5 h-3.5" /> Secure Handshake
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em]">
                 <Zap className="w-3.5 h-3.5" /> Instant Unlock
              </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary transition-colors group"
           >
             <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" /> Sign out
           </button>
        </footer>
      </div>
    </main>
  );
}
