
"use client"

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  ArrowRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const WEBSITE_LOGOS = [
  { name: 'Figma', color: '#c084fc', svg: '<path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4zM4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4zm0-8c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4zm8-4h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0zm8 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z"/>' },
  { name: 'Linear', color: '#a855f7', svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5l-5.5-5.5 1.41-1.41L11 13.67l6.09-6.08L18.5 9 11 16.5z"/>' },
  { name: 'Vercel', color: '#f3e8ff', svg: '<path d="M12 3L2 21h20L12 3z"/>' },
  { name: 'Notion', color: '#d8b4fe', svg: '<path d="M4 4h16v16H4V4zm3 3v10h2v-6l5 6h2V7h-2v6L9 7H7z"/>' },
  { name: 'Raycast', color: '#c084fc', svg: '<path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 3.2L17 8.4v6.4l-5 3.1-5-3.1V8.4l5-3.2z"/>' },
  { name: 'Framer', color: '#a855f7', svg: '<path d="M4 2h16v7h-8l8 7h-8v6l-8-7h8V9H4V2z"/>' },
  { name: 'Stripe', color: '#c084fc', svg: '<path d="M13.5 9.5c0-.8.7-1.2 1.8-1.2 1.5 0 3.3.5 4.7 1.3V5.2c-1.5-.6-3-.9-4.7-.9-3.9 0-6.5 2-6.5 5.4 0 5.3 7.3 4.4 7.3 6.7 0 .9-.8 1.3-2 1.3-1.8 0-3.9-.7-5.5-1.7v4.5c1.8.8 3.7 1.2 5.5 1.2 4 0 6.8-2 6.8-5.5-.1-5.7-7.4-4.7-7.4-6.7z"/>' },
  { name: 'AI Hub', color: '#e879f9', svg: '<path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/>' },
  { name: 'Supabase', color: '#a855f7', svg: '<path d="M13 2L4 14h7v8l9-12h-7V2z"/>' },
  { name: 'Discord', color: '#c084fc', svg: '<path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 00-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 00-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02z"/>' },
  { name: 'Arc', color: '#d8b4fe', svg: '<path d="M12 3a9 9 0 00-9 9v6a3 3 0 003 3h2v-8a4 4 0 018 0v8h2a3 3 0 003-3v-6a9 9 0 00-9-9z"/>' }
];

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
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);

  // --- Falling Logos Logic ---
  const fallingLogos = useMemo(() => {
    const count = 16;
    return Array.from({ length: count }).map((_, i) => {
      const item = WEBSITE_LOGOS[i % WEBSITE_LOGOS.length];
      const leftPercent = ((i / count) * 92) + (Math.random() * 4);
      const duration = 16 + (i % 5) * 3.2;
      const delay = -1 * (Math.random() * duration);
      const size = i % 3 === 0 ? 92 : (i % 2 === 0 ? 80 : 68);
      const driftX = (i % 2 === 0 ? 1 : -1) * (16 + (i % 4) * 7);
      const rotEnd = (i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 9);
      const maxOpacity = i % 3 === 0 ? 0.56 : 0.42;

      return {
        id: i,
        left: `${leftPercent.toFixed(1)}%`,
        duration: `${duration.toFixed(1)}s`,
        delay: `${delay.toFixed(1)}s`,
        driftX: `${driftX}px`,
        rotEnd: `${rotEnd}deg`,
        maxOpacity,
        size,
        svg: item.svg,
        color: item.color
      };
    });
  }, []);

  useEffect(() => {
    if (currentUser && !authLoading && db) {
      const userRef = doc(db, "users", currentUser.uid);
      getDoc(userRef).then(docSnap => {
        if (docSnap.exists() && docSnap.data().onboardingComplete) {
          router.push("/");
        } else {
          router.push("/onboarding");
        }
      });
    }
  }, [currentUser, db, router, authLoading]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name || email.split('@')[0] });
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          displayName: name || email.split('@')[0],
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

  const handleOAuth = async (providerName: 'google' | 'apple') => {
    if (!auth || !db) return;
    setLoading(true);
    try {
      let provider;
      if (providerName === 'google') {
        provider = new GoogleAuthProvider();
      } else {
        provider = new OAuthProvider('apple.com');
      }
      
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName || result.user.email?.split('@')[0],
          photoURL: result.user.photoURL,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: [],
          walletBalance: 0
        });
        router.push("/onboarding");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "OAuth Error", description: error.message });
      setLoading(false);
    }
  };

  const updatePwStrength = (val: string) => {
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setPwStrength(score);
  };

  const getPwLabel = () => {
    const labels = [
      'Use 8+ characters with letters & numbers',
      'Weak — add numbers or symbols',
      'Good — almost there!',
      'Strong password',
      'Very Strong & Encrypted ✓'
    ];
    return labels[pwStrength];
  };

  const handleForgotPassword = async () => {
    if (!auth || !email) {
      toast({ variant: "destructive", title: "Email Required", description: "Enter your email address first." });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Reset Sent", description: "Check your inbox for the reset link." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="min-h-screen relative bg-black text-[#f8f5ff] flex flex-col justify-between overflow-hidden font-body selection:bg-purple-600 selection:text-white">
      <style jsx global>{`
        .ambient-bg {
          background-color: #000000;
          background-image:
            radial-gradient(circle at 50% 38%, rgba(124, 58, 237, 0.22) 0%, rgba(59, 7, 100, 0.12) 32%, rgba(0, 0, 0, 0) 65%),
            radial-gradient(circle at 15% 10%, rgba(147, 51, 234, 0.12) 0%, transparent 38%),
            radial-gradient(circle at 85% 15%, rgba(88, 28, 135, 0.14) 0%, transparent 40%),
            linear-gradient(180deg, #000000 0%, #030108 50%, #000000 100%);
        }
        .purple-grid {
          background-size: 52px 52px;
          background-image: 
            linear-gradient(to right, rgba(168, 85, 247, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168, 85, 247, 0.04) 1px, transparent 1px);
          mask-image: radial-gradient(ellipse at 50% 40%, black 25%, transparent 78%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 40%, black 25%, transparent 78%);
        }
        .glass-panel {
          background: linear-gradient(155deg, rgba(14, 5, 28, 0.82) 0%, rgba(4, 1, 10, 0.94) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(168, 85, 247, 0.34);
          box-shadow: 0 32px 80px -12px rgba(0, 0, 0, 0.98), 0 0 55px -12px rgba(147, 51, 234, 0.42);
        }
        .btn-electric {
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 48%, #4c1d95 100%);
          box-shadow: 0 12px 32px -6px rgba(147, 51, 234, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.4);
          transition: all 0.18s ease;
        }
        .btn-electric:hover {
          transform: translateY(-1.5px);
          filter: brightness(1.1);
          box-shadow: 0 18px 40px -4px rgba(168, 85, 247, 0.9);
        }
        .falling-logo-item {
          position: absolute;
          top: -130px;
          will-change: transform;
          animation: fallDown linear infinite;
        }
        @keyframes fallDown {
          0% { transform: translate3d(0, -14vh, 0) rotate(0deg); opacity: 0; }
          10% { opacity: var(--logo-max-opacity); }
          88% { opacity: var(--logo-max-opacity); }
          100% { transform: translate3d(var(--drift-x), 115vh, 0) rotate(var(--rot-end)); opacity: 0; }
        }
        .brand-gradient-text {
          background: linear-gradient(90deg, #ffffff 0%, #d8b4fe 32%, #a855f7 68%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* GPU-Friendly Background */}
      <div className="absolute inset-0 ambient-bg pointer-events-none" />
      <div className="absolute inset-0 purple-grid pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {fallingLogos.map((p) => (
          <div 
            key={p.id}
            className="falling-logo-item"
            style={{
              left: p.left,
              animationDuration: p.duration,
              animationDelay: p.delay,
              '--drift-x': p.driftX,
              '--rot-end': p.rotEnd,
              '--logo-max-opacity': p.maxOpacity
            } as any}
          >
            <div style={{ width: p.size, height: p.size }} className="rounded-3xl bg-[#090214]/90 border border-purple-500/35 flex items-center justify-center shadow-2xl">
              <svg 
                width={Math.round(p.size * 0.55)} 
                height={Math.round(p.size * 0.55)} 
                viewBox="0 0 24 24" 
                fill={p.color}
                dangerouslySetInnerHTML={{ __html: p.svg }}
              />
            </div>
          </div>
        ))}
      </div>

      <main className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-5xl mx-auto px-4 py-12">
        <section className="w-full max-w-3xl mx-auto text-center mb-10">
          <h1 className="font-headline font-extrabold text-3xl sm:text-6xl tracking-tight text-white leading-tight">
            Your all-in-one platform to find the <span className="brand-gradient-text">perfect tools/webs</span>
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-purple-100/80 max-w-2xl mx-auto italic leading-relaxed">
            Bessites brings together the internet’s best websites and digital tools, neatly organized into <strong className="text-purple-300 font-semibold">your chosen interests</strong> so you can discover everything in one place.
          </p>
        </section>

        <section className="w-full max-w-md mx-auto">
          <div className="glass-panel rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-4/5 h-28 bg-purple-600/20 blur-3xl pointer-events-none" />

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-black/90 border border-purple-500/30 mb-8">
              <button
                onClick={() => setMode('login')}
                className={cn(
                  "py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                  mode === 'login' ? "bg-gradient-to-r from-purple-600 to-purple-900 text-white shadow-xl" : "text-purple-300/75 hover:text-white"
                )}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={cn(
                  "py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                  mode === 'signup' ? "bg-gradient-to-r from-purple-600 to-purple-900 text-white shadow-xl" : "text-purple-300/75 hover:text-white"
                )}
              >
                Create Account
              </button>
            </div>

            <div className="text-center mb-8">
              <Logo className="text-3xl sm:text-4xl brand-gradient-text mb-2" />
              <h2 className="text-lg font-bold text-white">
                {mode === 'login' ? 'Welcome back to your dashboard' : 'Create your Bessites account'}
              </h2>
              <p className="text-xs text-purple-200/70 mt-1 italic">
                {mode === 'login' ? 'Sign in to access your curated collections.' : 'Set up your account to unlock full access.'}
              </p>
            </div>

            {/* OAuth Nodes */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <OAuthButton icon="Apple" label="Apple" onClick={() => handleOAuth('apple')} />
              <OAuthButton icon="Google" label="Google" onClick={() => handleOAuth('google')} />
              <OAuthButton icon="Passkey" label="Passkey" onClick={() => {}} />
            </div>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-purple-500/20" />
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-purple-300/50 font-black">or email</span>
              <div className="flex-grow border-t border-purple-500/20" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-200/60 ml-2">Name or Handle</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="bg-black/80 border-purple-500/30 h-12 rounded-2xl text-sm focus:ring-purple-500"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-purple-200/60 ml-2">Email Address</Label>
                <Input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-black/80 border-purple-500/30 h-12 rounded-2xl text-sm focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-200/60">Access Key</Label>
                  {mode === 'login' && (
                    <button type="button" onClick={handleForgotPassword} className="text-[10px] text-purple-400 hover:text-purple-300 italic">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      updatePwStrength(e.target.value);
                    }}
                    placeholder="••••••••••••"
                    className="bg-black/80 border-purple-500/30 h-12 rounded-2xl text-sm pr-12 focus:ring-purple-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {mode === 'signup' && (
                  <div className="pt-2 px-1">
                    <div className="flex gap-1 h-1 bg-purple-900/50 rounded-full overflow-hidden">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={cn("flex-1 transition-colors", i <= pwStrength ? "bg-purple-500" : "bg-transparent")} />
                      ))}
                    </div>
                    <p className="text-[9px] text-purple-400/60 mt-1 italic uppercase tracking-widest">{getPwLabel()}</p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="btn-electric w-full h-14 rounded-2xl font-headline font-black text-sm text-white tracking-widest uppercase italic gap-3 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to Bessites' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* Pure Black Bottom Section */}
      <footer className="relative z-10 w-full bg-black border-t border-neutral-900 py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="rounded-3xl bg-[#050505] border border-neutral-800 p-8 shadow-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400 mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Why People Use Bessites
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ReasonBox 
                num="1" 
                title="Interest Mapping" 
                desc="Find tools tailored to categories you actually care about." 
              />
              <ReasonBox 
                num="2" 
                title="Verified Only" 
                desc="Every site is manually reviewed to ensure absolute discovery fidelity." 
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/50 border border-neutral-800 text-neutral-400 italic lowercase tracking-tight normal-case">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              Secured with 256-bit SSL/TLS encryption — your account is safe.
            </div>
            <div className="flex items-center gap-3">
              <span className="text-neutral-300 font-black">BESSITES</span>
              <span className="opacity-20">•</span>
              <span>Secure Discovery System</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OAuthButton({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      className="bg-[#0f0520]/80 backdrop-blur-md border border-purple-500/30 hover:bg-purple-900/40 hover:border-purple-400/60 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group"
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {icon === 'Apple' && (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
        )}
        {icon === 'Google' && (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"/>
            <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"/>
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"/>
          </svg>
        )}
        {icon === 'Passkey' && (
          <svg className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        )}
      </div>
      <span className="text-[10px] font-black uppercase text-white/60 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}

function ReasonBox({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-5 p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-700 transition-colors group">
      <span className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white font-black text-xs shrink-0 group-hover:bg-purple-900/20 group-hover:border-purple-500/40 transition-colors">
        {num}
      </span>
      <div className="space-y-1">
        <h4 className="text-sm font-black uppercase tracking-tight text-neutral-200">{title}</h4>
        <p className="text-xs text-neutral-500 font-medium leading-relaxed italic">{desc}</p>
      </div>
    </div>
  );
}
