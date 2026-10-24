'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Flame, Sparkles, LogIn, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Logo } from '@/components/logo';

export function HalloweenGlassLoginCard() {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVortexing, setIsVortexing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsVortexing(true);
      // Let the vortex animation play before redirecting
      setTimeout(() => {
        // Parent component or router will handle the redirect based on auth state
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      alert('Handshake Failed: ' + error.message);
    }
  };

  return (
    <div className={cn(
      "relative z-10 transition-all duration-1000 ease-in-out",
      isVortexing && "scale-0 rotate-[720deg] blur-3xl opacity-0"
    )}>
      <Card className="w-full max-w-md bg-[#0E0D14]/65 backdrop-blur-2xl border border-orange-500/25 rounded-[3rem] shadow-[0_0_60px_-15px_rgba(255,107,0,0.35)] overflow-hidden relative group">
        {/* Burning Border Beam */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3rem]">
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0%,#FF6B00_25%,#9D4EDD_50%,transparent_75%)] animate-border-beam opacity-40" />
        </div>

        {/* Minimal Cobwebs */}
        <div className="absolute top-0 left-0 p-6 opacity-20 pointer-events-none text-white">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0,0 L100,0 M0,0 L0,100 M0,0 L70,70 M0,0 L30,90 M0,0 L90,30" />
            <path d="M20,0 C20,10 10,20 0,20 M40,0 C40,25 25,40 0,40 M60,0 C60,40 40,60 0,60" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none text-white rotate-90">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0,0 L100,0 M0,0 L0,100 M0,0 L70,70 M0,0 L30,90 M0,0 L90,30" />
            <path d="M20,0 C20,10 10,20 0,20 M40,0 C40,25 25,40 0,40 M60,0 C60,40 40,60 0,60" />
          </svg>
        </div>

        <div className="p-8 sm:p-12 space-y-10 relative z-10">
          <header className="text-center space-y-3">
            <Logo className="text-4xl glow-pumpkin" />
            <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em] italic">
              Initialize Curator Access
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2 group">
                <Label className="text-[10px] font-black uppercase text-white/30 ml-2 group-focus-within:text-orange-500 transition-colors">Credential Email</Label>
                <div className="relative">
                   <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-orange-500/40" />
                   <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-white/[0.03] border-white/10 rounded-2xl pl-12 focus:ring-2 focus:ring-orange-500/40 transition-all text-white font-bold"
                    placeholder="alex@bessites.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label className="text-[10px] font-black uppercase text-white/30 ml-2 group-focus-within:text-orange-500 transition-colors">Security Key</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-orange-500/40" />
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 bg-white/[0.03] border-white/10 rounded-2xl pl-12 focus:ring-2 focus:ring-orange-500/40 transition-all text-white font-bold font-mono"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-black text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-all group"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  ENTER REGISTRY 
                  <Flame className="w-5 h-5 ml-2 fill-current group-hover:scale-125 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <footer className="pt-6 border-t border-white/5 text-center space-y-4">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" /> Secure Node Handshake <Sparkles className="w-3 h-3" />
            </p>
            <button type="button" className="text-[9px] font-black text-orange-500/40 hover:text-orange-500 uppercase tracking-[0.2em] transition-colors">
              Request Recovery
            </button>
          </footer>
        </div>
      </Card>
      
      {/* Spark Particles during login success (Vortex) */}
      {isVortexing && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-orange-500 rounded-full animate-ping"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}