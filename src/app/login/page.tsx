"use client"

import { useState, useRef, useEffect } from "react";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, User, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, loading: authLoading } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && !authLoading) {
      const checkOnboarding = async () => {
        if (!db) return;
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().onboardingComplete) {
            router.push("/");
          } else {
            router.push("/onboarding");
          }
        } catch (error) {
          console.warn("Auth redirect check deferred");
        }
      };
      checkOnboarding();
    }
  }, [currentUser, db, router, authLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !db) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: []
        });
        router.push("/onboarding");
      } else {
        router.push(userSnap.data().onboardingComplete ? "/" : "/onboarding");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sign In Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    
    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const docRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(docRef);
        router.push(docSnap.exists() && docSnap.data()?.onboardingComplete ? "/" : "/onboarding");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (photoPreview) {
          await updateProfile(user, { photoURL: photoPreview });
        }
        
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: photoPreview || null,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: []
        });
        
        router.push("/onboarding");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Auth Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side: Entry Form */}
      <div className="flex-1 p-8 sm:p-16 flex flex-col justify-center bg-background order-2 md:order-1">
        <div className="w-full max-w-md mx-auto">
          <Logo className="mb-12" showText />
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white font-bold text-xs ml-1 uppercase tracking-widest opacity-60">Email Address</Label>
              <Input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 rounded-2xl h-14 text-lg focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white font-bold text-xs ml-1 uppercase tracking-widest opacity-60">Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 rounded-2xl h-14 text-lg pr-12 focus:ring-primary"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-16 text-xl font-black shadow-xl glow-primary transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : mode === 'login' ? 'SIGN IN' : 'JOIN WEBDOCK'}
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-4 text-muted-foreground font-bold tracking-widest">Or continue with</span></div>
            </div>

            <Button 
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full rounded-full h-14 border-white/10 hover:bg-white/5 font-bold"
            >
              Sign in with Google
            </Button>
            
            <p className="text-center text-muted-foreground font-medium pt-4">
              {mode === 'login' ? "New here? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary font-bold hover:underline"
              >
                {mode === 'login' ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side: Welcome & Profile Uploader */}
      <div className="flex-1 bg-gradient-to-br from-primary/15 to-transparent p-8 sm:p-16 flex flex-col items-center justify-center space-y-12 border-b md:border-b-0 md:border-l border-white/5 order-1 md:order-2">
        <div className="space-y-4 text-center">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Welcome to <br />
            <span className="text-primary">Webdock!</span>
          </h1>
          <p className="text-muted-foreground font-medium text-xl max-w-md mx-auto">
            The world's most curated directory for web tools, games, and modern apps.
          </p>
        </div>

        {/* Circular Profile Uploader */}
        <div className="relative">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-muted border-4 border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-24 h-24 sm:w-32 sm:h-32 text-white/10" />
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-primary p-4 rounded-full text-white shadow-xl glow-primary hover:scale-110 transition-transform active:scale-95 z-10"
          >
            <Plus className="w-6 h-6" strokeWidth={5} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
}