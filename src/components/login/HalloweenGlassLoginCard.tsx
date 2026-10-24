'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Flame, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
      // Success triggers vortex
      setIsVortexing(true);
    } catch (error) {
      setLoading(false);
      alert('Authentication error. Please check your credentials.');
    }
  };

  return (
    <div className={cn(
      "relative z-10 transition-all duration-1000",
      isVortexing && "scale-0 rotate-[720deg] blur-3xl opacity-0"
    )}>
      <Card className="w-full max-w-md bg-[#0E0D14]/65 backdrop-blur-2xl border border-orange-500/25 rounded-[3rem] shadow-[0_0_60px_-15px_rgba(255,107,0,0.35)] overflow-hidden relative">
        {/* Conic Border Beam */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-[-2px] rounded-[3rem] border-2 border-transparent bg-gradient-to-r from-transparent via-orange-500/50 to-transparent animate-border-beam" />
        </div>

        {/* Cobwebs */}
        <div className="absolute top-0 left-0 p-4 opacity-20 pointer-events-none">
          <svg width="60" height="60" viewBox="0 0 100 100"><path d="M0,0 L100,0 M0,0 L0,100 M0,0 L70,70 M0,0 L30,90 M0,0 L90,30" stroke="white" strokeWidth="1" fill="none" /></svg>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none rotate-90">
          <svg width="60" height="60" viewBox="0 0 100 100"><path d="M0,0 L100,0 M0,0 L0,100 M0,0 L70,70 M0,0 L30,90 M0,0 L90,30" stroke="white" strokeWidth="1" fill="none" /></svg>
        </div>

        <div className="p-8 sm:p-12 space-y-8 relative z-10">
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              BESSITES <span className="text-orange-500">VOiD</span>
            </h1>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest italic">
              Initialize Curator Credentials
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <Label className="text-[10px] font-black uppercase text-white/30 ml-2 group-focus-within:text-orange-500 transition-colors">Credential Email</Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-2 focus:ring-orange-500/40 transition-all text-white font-bold"
                  placeholder="curator@bessites.com"
                  required
                />
              </div>

              <div className="space-y-2 group">
                <Label className="text-[10px] font-black uppercase text-white/30 ml-2 group-focus-within:text-orange-500 transition-colors">Access Key</Label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-2 focus:ring-orange-500/40 transition-all text-white font-bold font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-black text-lg shadow-xl shadow-orange-500/20 group"
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

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" /> Secure Node Transmission <Sparkles className="w-3 h-3" />
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
