
"use client"

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth, useFirestore, useUser, useStorage } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { WebsitePreview } from "@/components/website-preview";
import { Logo } from "@/components/logo";

// Modern Avatar Options
const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Astra",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nala",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nova"
];

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
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, loading: authLoading } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(PRESET_AVATARS[0]);

  // --- HIGH DENSITY FALLING BACKGROUND PHYSICS ---
  const [particles, setParticles] = useState<Particle[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const lastMousePos = useRef({ x: -1000, y: -1000 });
  const mouseVelocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const particleCount = 32;
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
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(userRef);
        router.push(docSnap.exists() && docSnap.data()?.onboardingComplete ? "/" : "/onboarding");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (selectedAvatar) await updateProfile(user, { photoURL: selectedAvatar });
        
        const userData = {
          email: user.email,
          displayName: email.split('@')[0],
          photoURL: selectedAvatar,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: [],
          walletBalance: 0
        };
        await setDoc(doc(db, "users", user.uid), userData);
        router.push("/onboarding");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Auth Error", description: error.message });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!auth || !email) {
      toast({ variant: "destructive", title: "Reset Failed", description: "Please enter your email address first." });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Reset Sent", description: "Check your email for the password reset link." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const isFirebaseMissing = !auth || !db;

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="min-h-screen relative bg-[#0B0A0E] text-white flex flex-col items-center justify-center overflow-hidden selection:bg-primary/40 font-body"
    >
      {/* 1. DENSE DYNAMIC BACKGROUND */}
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
              opacity: 0.8,
            }}
          >
            <div className="w-full h-full rounded-2xl border border-white/10 bg-card/80 overflow-hidden shadow-[0_0_20px_rgba(123,51,255,0.15)] backdrop-blur-sm ring-1 ring-white/5 transition-opacity">
              <WebsitePreview 
                websiteUrl={p.website.url} 
                className="w-full h-full object-cover scale-110" 
              />
            </div>
          </div>
        ))}
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <main className="w-full max-w-7xl mx-auto px-6 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-screen py-12">
        
        {/* DESKTOP LEFT PANEL: VALUE PROP */}
        <div className="hidden lg:flex lg:col-span-6 flex-col space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="space-y-6">
             <Logo showText className="scale-125 origin-left" />
             <h1 className="text-8xl xl:text-9xl font-black text-white tracking-tighter uppercase italic leading-[0.85] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                Unlock a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400">World of</span> <br />
                Modern Webs.
             </h1>
             <p className="text-2xl text-muted-foreground font-medium max-w-lg italic opacity-70 leading-relaxed pt-4 border-l-4 border-primary pl-6">
                Discover curated tools, apps, and games before the masses. Join the Bessites community and start your discovery pipeline today.
             </p>
          </div>
        </div>

        {/* AUTH PANEL: THE DARK BLUISH-PURPLE GLASS CARD */}
        <div className="lg:col-span-6 flex justify-center items-center w-full animate-in fade-in zoom-in-95 duration-1000">
          <Card className="w-full max-w-md bg-[#121026]/75 backdrop-blur-[24px] border border-primary/30 rounded-[3rem] shadow-[0_0_50px_rgba(123,51,255,0.15)] overflow-hidden relative group transition-all duration-700 hover:border-primary/50">
            {/* Soft Internal Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] -ml-32 -mb-32 pointer-events-none" />
            
            <div className="p-8 sm:p-12 relative z-10 flex flex-col">
              
              <header className="text-center mb-10 space-y-3">
                <div className="lg:hidden flex justify-center mb-6">
                  <Logo showText />
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                  {mode === 'login' ? 'Welcome Back!' : 'Start Building.'}
                </h2>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 italic">
                  {mode === 'login' ? 'Enter your details to explore the modern web.' : 'Join the global discovery registry.'}
                </p>
              </header>

              <form onSubmit={handleAuth} className="space-y-6">
                
                {mode === 'signup' && (
                  <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2">Identify Your Curator Avatar</Label>
                    <div className="flex justify-between gap-2 bg-white/5 p-2 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                       {PRESET_AVATARS.map((avatar, idx) => (
                         <button
                           key={idx}
                           type="button"
                           onClick={() => setSelectedAvatar(avatar)}
                           className={cn(
                             "w-12 h-12 rounded-xl transition-all shrink-0 p-1 relative",
                             selectedAvatar === avatar 
                               ? "bg-primary/20 ring-2 ring-primary shadow-[0_0_15px_rgba(123,51,255,0.5)]" 
                               : "bg-white/5 opacity-50 hover:opacity-100 hover:bg-white/10"
                           )}
                         >
                           <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-2 group">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-2 group-focus-within:text-primary transition-colors">Email Address</Label>
                    <Input 
                      type="email" 
                      placeholder="alex.kyr@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/[0.05] border-white/10 rounded-2xl h-14 text-sm font-bold focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner placeholder:text-white/10"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <div className="flex justify-between items-center px-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 group-focus-within:text-primary transition-colors">Password</Label>
                      {mode === 'login' && (
                        <button 
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="bg-white/[0.05] border-white/10 rounded-2xl h-14 text-sm pr-12 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner font-mono"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/20 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex items-center space-x-2 px-2">
                    <Checkbox id="remember" className="rounded-md border-white/20 data-[state=checked]:bg-primary" />
                    <label htmlFor="remember" className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest cursor-pointer select-none">Remember this device</label>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || isFirebaseMissing}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white rounded-2xl h-16 text-sm font-black shadow-[0_15px_35px_rgba(123,51,255,0.3)] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 border-none"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Join Registry')}
                  {!loading && <Sparkles className="w-4 h-4" />}
                </Button>
              </form>

              <div className="mt-10 text-center space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                  {mode === 'login' ? "Don't have an account?" : "Already part of the registry?"}
                  <button 
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-primary font-black ml-2 hover:underline decoration-2 underline-offset-4"
                  >
                    {mode === 'login' ? 'SIGN UP' : 'SIGN IN'}
                  </button>
                </p>
                
                <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/40 italic">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure & Private. No spam, ever.
                  </div>
                  <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">Your data stays yours. Built for discovery.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
