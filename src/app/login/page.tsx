
"use client"

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth, useFirestore, useUser, useStorage } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  User, 
  Eye, 
  EyeOff, 
  Camera, 
  ShieldAlert, 
  Sparkles, 
  Github, 
  Chrome,
  ShieldCheck,
} from "lucide-react";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from "@/lib/utils";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { WebsitePreview } from "@/components/website-preview";

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
}

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, loading: authLoading } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // --- INTERACTIVE BACKGROUND LOGIC ---
  const [particles, setParticles] = useState<Particle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const isInteracting = useRef(false);

  useEffect(() => {
    // Initialize particles from registry
    const initialParticles: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: `p-${i}`,
      x: Math.random() * 100,
      y: Math.random() * -100,
      vx: 0,
      vy: 0.05 + Math.random() * 0.1, // 15s avg fall
      website: MOCK_WEBSITES[Math.floor(Math.random() * MOCK_WEBSITES.length)],
      size: 80 + Math.random() * 60,
      rotation: Math.random() * 360
    }));
    setParticles(initialParticles);

    let animationFrame: number;
    const animate = () => {
      setParticles(prev => prev.map(p => {
        let { x, y, vx, vy } = p;
        
        // Vertical Fall
        y += vy;
        
        // Wrap around
        if (y > 110) {
          y = -20;
          x = Math.random() * 100;
        }

        // Interaction physics
        if (isInteracting.current && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const mx = (mousePos.current.x / rect.width) * 100;
          const my = (mousePos.current.y / rect.height) * 100;
          
          const dx = mx - x;
          const dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 30) {
            const force = (30 - dist) / 30;
            vx += dx * force * 0.02;
            vy += dy * force * 0.02;
          }
        }

        // Friction and recovery
        vx *= 0.95;
        vy = vy * 0.95 + (0.1) * 0.05; // Return to base fall speed
        x += vx;

        return { ...p, x, y, vx, vy };
      }));
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    isInteracting.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isInteracting.current = true;
  };

  useEffect(() => {
    const handleStop = () => isInteracting.current = false;
    window.addEventListener('mouseup', handleStop);
    window.addEventListener('touchend', handleStop);
    return () => {
      window.removeEventListener('mouseup', handleStop);
      window.removeEventListener('touchend', handleStop);
    };
  }, []);

  // --- AUTH LOGIC PRESERVED ---
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedAvatar(null);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadToFirebase = async (file: File, userId: string) => {
    if (!storage) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profiles/${userId}-${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error("Firebase Storage Error:", err);
      return null;
    }
  };

  const formatAuthError = (error: any) => {
    const code = error?.code || "";
    switch (code) {
      case 'auth/user-not-found': return "Account not found. Check your email!";
      case 'auth/wrong-password': return "Incorrect password. Please try again.";
      case 'auth/invalid-email': return "Please enter a valid email.";
      case 'auth/email-already-in-use': return "Email already in use. Try signing in!";
      case 'auth/weak-password': return "Password too weak. (Min 6 chars)";
      default: return error?.message || "Authentication failed.";
    }
  };

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
        let finalPhotoURL = selectedAvatar;
        if (selectedFile) finalPhotoURL = await uploadToFirebase(selectedFile, user.uid);
        if (finalPhotoURL) await updateProfile(user, { photoURL: finalPhotoURL });
        
        const userData = {
          email: user.email,
          displayName: email.split('@')[0],
          photoURL: finalPhotoURL,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: [],
          walletBalance: 0
        };
        await setDoc(doc(db, "users", user.uid), userData);
        router.push("/onboarding");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Auth Error", description: formatAuthError(error) });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!auth || !email) {
      toast({ variant: "destructive", title: "Support", description: "Enter email first." });
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Reset Sent", description: "Check your inbox." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: formatAuthError(error) });
    } finally {
      setResetLoading(false);
    }
  };

  const isFirebaseMissing = !auth || !db;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="min-h-screen relative bg-[#0B0A0F] text-white flex flex-col items-center justify-center overflow-hidden selection:bg-primary/30 font-body"
    >
      {/* 1. DYNAMIC FALLING BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
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
            }}
          >
            <div className="w-full h-full rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl backdrop-blur-sm">
              <WebsitePreview websiteUrl={p.website.url} className="w-full h-full opacity-40" />
            </div>
          </div>
        ))}
      </div>

      {/* 2. GLOBAL HEADER PILL */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-2xl ring-1 ring-white/5 group hover:border-primary/40 transition-all">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3 h-3 text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">alexkyr.com</span>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="w-full max-w-7xl mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
        
        {/* DESKTOP LEFT PANEL: VALUE PROP */}
        <div className="hidden lg:flex flex-col space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-4">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(123,51,255,0.4)]">
                 <Sparkles className="w-6 h-6 text-white" />
               </div>
               <span className="text-3xl font-black italic uppercase tracking-tighter text-white">Bessites</span>
             </div>
             <h1 className="text-7xl xl:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                Unlock a <br />
                <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">World of</span> <br />
                Modern Webs.
             </h1>
             <p className="text-xl text-muted-foreground font-medium max-w-md italic opacity-60 leading-relaxed pt-4">
                Discover curated tools, apps, and games before the masses. Join the Bessites community and start your discovery pipeline today.
             </p>
          </div>
        </div>

        {/* AUTH PANEL: THE GLASSMORPHIC CARD */}
        <div className="flex justify-center items-center py-20 lg:py-0 w-full animate-in fade-in zoom-in-95 duration-1000">
          <Card className="w-full max-w-[480px] bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden relative group transition-all duration-500 hover:border-primary/20">
            {/* Inner Gradient Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -ml-32 -mb-32 pointer-events-none" />
            
            <div className="p-8 sm:p-12 relative z-10 flex flex-col">
              
              <header className="text-center mb-10 space-y-2">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                  {mode === 'login' ? 'Welcome Back!' : 'Start Building.'}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                  Enter Your Details Below
                </p>
              </header>

              <form onSubmit={handleAuth} className="space-y-6">
                
                {mode === 'signup' && (
                  <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-top-4">
                    {/* AVATAR SELECTOR */}
                    <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Choose Profile Mark</Label>
                       <div className="grid grid-cols-6 gap-2">
                          {PRESET_AVATARS.map((avatar, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedAvatar(avatar);
                                setPhotoPreview(null);
                              }}
                              className={cn(
                                "aspect-square rounded-xl border-2 transition-all p-1 hover:scale-110 flex items-center justify-center",
                                selectedAvatar === avatar ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 opacity-40 hover:opacity-100"
                              )}
                            >
                              <img src={avatar} alt="Avatar" className="w-full h-full" />
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-1.5 group">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1 group-focus-within:text-primary transition-colors">Email Address</Label>
                    <Input 
                      type="email" 
                      placeholder="hello.alex@gmail.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/5 border-white/5 rounded-2xl h-14 text-sm font-bold focus:ring-primary/40 focus:border-primary transition-all shadow-inner placeholder:text-white/10"
                    />
                  </div>

                  <div className="space-y-1.5 group">
                    <div className="flex justify-between items-center px-1">
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
                        className="bg-white/5 border-white/5 rounded-2xl h-14 text-sm pr-12 focus:ring-primary/40 focus:border-primary transition-all shadow-inner font-mono"
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
                  <div className="flex items-center space-x-2 px-1">
                    <Checkbox id="remember" className="rounded-md border-white/10 data-[state=checked]:bg-primary" />
                    <label htmlFor="remember" className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest cursor-pointer select-none">Remember this device</label>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || isFirebaseMissing}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 text-sm font-black shadow-[0_20px_40px_rgba(123,51,255,0.3)] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Join Discovery')}
                  {!loading && <Sparkles className="w-4 h-4" />}
                </Button>
                
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                  <div className="relative flex justify-center text-[10px]"><span className="bg-[#121117]/80 backdrop-blur-md px-4 text-muted-foreground/20 font-black uppercase tracking-[0.4em]">OR</span></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   <Button type="button" variant="outline" className="h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest gap-3 transition-all">
                     <Chrome className="w-4 h-4 text-primary" /> Log in with Google
                   </Button>
                   <Button type="button" variant="outline" className="h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest gap-3 transition-all">
                     <Github className="w-4 h-4" /> Log in with GitHub
                   </Button>
                </div>
              </form>

              <div className="mt-10 text-center space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                  {mode === 'login' ? "Don't have an account?" : "Already part of the flow?"}
                  <button 
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-primary font-black ml-2 hover:underline decoration-2 underline-offset-4"
                  >
                    {mode === 'login' ? 'SIGN UP' : 'SIGN IN'}
                  </button>
                </p>
                
                <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure & Private. No spam, ever.
                  </div>
                  <p className="text-[8px] font-bold text-muted-foreground/10 uppercase tracking-widest">Your data stays yours. Built for discovery.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* FOOTER ACCENT: MOBILE ONLY BRAND */}
      <div className="lg:hidden absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 pointer-events-none">
        <Sparkles className="w-6 h-6 text-primary" />
        <span className="text-xl font-black italic uppercase tracking-tighter">Bessites</span>
      </div>
    </div>
  );
}
