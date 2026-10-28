"use client"

import { useState, useRef, useEffect } from "react";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
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
  tilt: number;
}

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, loading: authLoading } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- ORIGINAL INTERACTIVE FALLING WEBSITES BACKGROUND ---
  const [particles, setParticles] = useState<Particle[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const lastMousePos = useRef({ x: -1000, y: -1000 });
  const mouseVelocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const particleCount = 28;
    const initialParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
      id: `p-${i}`,
      x: Math.random() * 100,
      y: (Math.random() * 140) - 20,
      vx: 0,
      vy: 0.04 + Math.random() * 0.08,
      website: MOCK_WEBSITES[i % MOCK_WEBSITES.length],
      size: 100 + Math.random() * 80,
      rotation: Math.random() * 360,
      tilt: 0
    }));
    setParticles(initialParticles);

    let animationFrame: number;
    const animate = () => {
      mouseVelocity.current = {
        x: (mousePos.current.x - lastMousePos.current.x) * 0.1,
        y: (mousePos.current.y - lastMousePos.current.y) * 0.1
      };
      lastMousePos.current = { ...mousePos.current };

      setParticles(prev => prev.map(p => {
        let { x, y, vx, vy, rotation, tilt } = p;
        
        y += vy;
        
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const mx = (mousePos.current.x / rect.width) * 100;
          const my = (mousePos.current.y / rect.height) * 100;
          
          const dx = mx - x;
          const dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 25) {
            const power = (25 - dist) / 25;
            vx += dx * power * 0.015;
            vy += dy * power * 0.015;
            vx += mouseVelocity.current.x * power * 0.5;
            vy += mouseVelocity.current.y * power * 0.5;
            tilt = (vx * 20);
          }
        }

        vx *= 0.94;
        vy = vy * 0.95 + (p.vy) * 0.05;
        tilt *= 0.9;
        
        x += vx;

        if (y > 115) {
          y = -20;
          x = Math.random() * 100;
          vx = 0;
        }
        if (x < -10) x = 110;
        if (x > 110) x = -10;

        return { ...p, x, y, vx, vy, rotation: rotation + 0.05, tilt };
      }));
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    if (currentUser && !authLoading && db) {
      const userRef = doc(db, "users", currentUser.uid);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists() && docSnap.data().onboardingComplete) {
          router.push("/");
        } else {
          router.push("/onboarding");
        }
      }).catch(() => {
        router.push("/onboarding");
      });
    }
  }, [currentUser, db, router, authLoading]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
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
      toast({ variant: "destructive", title: "Auth Error", description: error.message });
      setLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="min-h-screen relative bg-[#0B0A0E] text-white flex flex-col items-center justify-center overflow-hidden font-body"
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute will-change-transform"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg) skewX(${p.tilt}deg)`,
              opacity: 0.6,
            }}
          >
            <div className="w-full h-full rounded-2xl border border-white/10 bg-card/80 overflow-hidden shadow-2xl backdrop-blur-sm">
              <WebsitePreview 
                websiteUrl={p.website.url} 
                className="w-full h-full object-cover grayscale opacity-50" 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0A0E]/80 to-[#0B0A0E] z-10" />

      <main className="w-full max-w-lg px-6 z-20 animate-in fade-in zoom-in duration-1000">
        <Card className="bg-[#121117]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 sm:p-12 shadow-2xl relative overflow-hidden">
          <header className="text-center mb-12 space-y-4">
            <Logo className="text-5xl" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 italic">
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
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> SECURE DISCOVERY SYSTEM
             </div>
          </div>
        </Card>
      </main>
    </div>
  );
}