"use client"

import { useState, useEffect } from "react";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck
} from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Footer } from "@/components/footer";

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

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Wrong email or password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

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
      toast({ variant: "destructive", title: "Error", description: getFriendlyErrorMessage(error.code) });
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!auth || !db) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
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
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({ variant: "destructive", title: "Error", description: getFriendlyErrorMessage(error.code) });
      }
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!auth || !email) {
      toast({ title: "Email required", description: "Please enter your email address first." });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Reset link sent", description: "Check your inbox for instructions to reset your password." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: getFriendlyErrorMessage(error.code) });
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#f8f5ff] flex flex-col items-center p-6 sm:p-12 font-body selection:bg-purple-600 selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#020105]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-gradient-to-b from-purple-900/10 to-transparent blur-[120px]" />
      </div>

      <main className="relative z-10 w-full max-w-md flex flex-col items-center">
        <Link href="/" className="mb-10">
          <Logo className="text-4xl sm:text-5xl" />
        </Link>

        <div className="w-full bg-[#0d0c12] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-black/50">
          <header className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-zinc-400">
              {mode === 'login' ? 'Log in to continue.' : 'Get full access to Bessites.'}
            </p>
          </header>

          <div className="space-y-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl flex items-center justify-center gap-3 transition-all font-semibold"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.3 3.28-8.18 3.28-13.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-zinc-600 font-black">or</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold text-zinc-400 ml-1">Full name</Label>
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="bg-white/5 border-white/10 h-12 rounded-xl text-base focus:ring-primary/40"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-zinc-400 ml-1">Email address</Label>
                <Input 
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-base focus:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" className="text-xs font-bold text-zinc-400">Password</Label>
                  {mode === 'login' && (
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-xs text-primary hover:text-purple-400 transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 h-12 rounded-xl text-base pr-12 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/10 transition-all mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'Log in' : 'Create account')}
              </Button>

              {mode === 'signup' && (
                <p className="text-center text-[10px] text-zinc-500 font-medium">
                  $99/year · Cancel anytime
                </p>
              )}
            </form>

            <div className="text-center pt-4">
              <button 
                type="button" 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <span className="text-primary font-bold">{mode === 'login' ? 'Create an account' : 'Log in here'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-medium text-zinc-400 italic">
            Find the right website, faster.
          </h2>
        </div>

        <div className="mt-10 space-y-3 w-full max-w-xs text-center border-t border-white/5 pt-8">
           <p className="text-xs text-zinc-500 font-medium leading-relaxed">
             Find sites by interest: browse categories you actually care about.
           </p>
           <p className="text-xs text-zinc-500 font-medium leading-relaxed">
             Manually reviewed: every listed site is checked by hand.
           </p>
        </div>

        <div className="mt-12 flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
          Your account is secured with encryption.
        </div>
      </main>

      <Footer />
    </div>
  );
}
