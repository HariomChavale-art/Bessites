"use client"

import { useState, useRef, useEffect } from "react";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { WebsitePreview } from "@/components/website-preview";
import { Logo } from "@/components/logo";

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  website: any;
  size: number;
  rotation: number;
}

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, loading: authLoading } = useUser();
  
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleCount = 20;
    const initialParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
      id: `p-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.05,
      vy: 0.02 + Math.random() * 0.05,
      website: MOCK_WEBSITES[i % MOCK_WEBSITES.length],
      size: 100 + Math.random() * 50,
      rotation: Math.random() * 360,
    }));
    setParticles(initialParticles);

    let frame: number;
    const animate = () => {
      setParticles(prev => prev.map(p => {
        let { x, y, vy, rotation } = p;
        y += vy;
        if (y > 110) y = -10;
        return { ...p, y, rotation: rotation + 0.1 };
      }));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (currentUser && !authLoading) {
      router.push("/");
    }
  }, [currentUser, authLoading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: email.split('@')[0],
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: [],
          walletBalance: 0
        });
        router.push("/onboarding");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#07060D] text-white flex items-center justify-center overflow-hidden font-body">
      {/* Dynamic Void Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute transition-transform duration-75"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              opacity: 0.5,
            }}
          >
            <div className="w-full h-full rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl">
              <WebsitePreview websiteUrl={p.website.url} className="w-full h-full object-cover grayscale" />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07060D]/80 to-[#07060D] z-10" />

      <main className="w-full max-w-lg px-6 z-20 animate-in fade-in zoom-in duration-1000">
        <Card className="glass rounded-[3rem] p-10 sm:p-12 shadow-[0_0_100px_rgba(123,51,255,0.1)]">
          <header className="text-center mb-12 space-y-4">
            <Logo className="text-5xl" />
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/60 italic">
              {mode === 'login' ? 'Authorized Access Only' : 'Initialize Discovery Access'}
            </p>
          </header>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Curator Email</Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 h-14 rounded-2xl font-bold focus:ring-primary"
                  placeholder="name@studio.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Access Key</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 h-14 rounded-2xl font-bold pr-12 focus:ring-primary"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 rounded-full bg-white text-black hover:bg-white/90 font-black uppercase italic tracking-widest text-lg shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')}
            </Button>
          </form>

          <div className="mt-10 text-center space-y-6">
             <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4"
             >
               {mode === 'login' ? "Need a curator account?" : "Already part of the registry?"}
             </button>
             
             <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase text-white/20 tracking-[0.4em] pt-6 border-t border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> SECURE DISCOVERY NODE
             </div>
          </div>
        </Card>
      </main>
    </div>
  );
}