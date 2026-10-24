'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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
    } catch (error: any) {
      setLoading(false);
      alert('Handshake failed: ' + error.message);
    }
  };

  return (
    <div className={cn(
      "relative z-10 transition-all duration-1000 ease-in-out",
      isVortexing && "scale-0 rotate-[720deg] blur-3xl opacity-0"
    )}>
      <Card className="w-full max-w-md bg-[#0D0D12]/75 backdrop-blur-2xl border border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.85)] rounded-[2rem] overflow-hidden relative group">
        <div className="p-8 sm:p-12 space-y-10 relative z-10">
          <header className="text-center space-y-3">
            <Logo className="text-3xl" />
            <p className="text-[11px] font-medium uppercase text-zinc-500 tracking-widest italic">
              Initialize curator access
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase text-zinc-500 tracking-widest ml-1">Email</Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-white/[0.03] border-white/10 rounded-lg focus:ring-1 focus:ring-primary/40 transition-all text-white font-medium"
                  placeholder="alex@studio.co"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase text-zinc-500 tracking-widest ml-1">Security key</Label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-white/[0.03] border-white/10 rounded-lg focus:ring-1 focus:ring-primary/40 transition-all text-white font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-sm tracking-widest uppercase shadow-specular active:scale-[0.98] transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
            </Button>
          </form>

          <footer className="pt-6 border-t border-white/[0.06] text-center">
            <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest italic">
              Authorized access only
            </p>
          </footer>
        </div>
      </Card>
    </div>
  );
}