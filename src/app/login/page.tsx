
"use client"

import { useState, useRef, useEffect } from "react";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, User, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && !loading) {
      // Check if onboarding is complete
      const checkOnboarding = async () => {
        if (!db) return;
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().onboardingComplete) {
          router.push("/");
        } else {
          router.push("/onboarding");
        }
      };
      checkOnboarding();
    }
  }, [currentUser, db, router, loading]);

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    
    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const docRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data()?.onboardingComplete) {
          router.push("/");
        } else {
          router.push("/onboarding");
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (photoPreview) await updateProfile(user, { photoURL: photoPreview });
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          photoURL: photoPreview || null,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: []
        }, { merge: true });
        router.push("/onboarding");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Auth Error",
        description: error.message || "Invalid credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side: Welcome Branding */}
      <div className="flex-1 p-8 sm:p-16 flex flex-col justify-center items-center md:items-start space-y-8 bg-gradient-to-br from-primary/10 to-transparent">
        <Logo className="scale-150 origin-center md:origin-left mb-12" />
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Welcome to <br />
            <span className="text-primary">Webdock!</span>
          </h1>
          <p className="text-muted-foreground font-medium text-xl max-w-md">
            The world's most curated directory for web tools, games, and modern apps.
          </p>
        </div>
        
        <div className="w-full max-w-md mt-12">
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
            
            <p className="text-center text-muted-foreground font-medium">
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

      {/* Right side: Profile Uploader */}
      <div className="flex-1 bg-card/20 flex flex-col items-center justify-center p-12 border-l border-white/5">
        <div className="relative group">
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#222222] border-4 border-white/10 overflow-hidden relative shadow-2xl transition-all group-hover:border-primary/50">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/5">
                <User className="w-32 h-32 sm:w-40 sm:h-40" />
              </div>
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-4 right-4 bg-primary p-5 rounded-full text-white shadow-xl glow-primary hover:scale-110 transition-transform active:scale-95 z-10"
          >
            <Plus className="w-10 h-10" strokeWidth={4} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="mt-12 text-center max-w-sm">
          <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-[0.2em] italic">Personalize</h2>
          <p className="text-muted-foreground font-medium">Add a profile picture to customize your Webdock presence. This will be visible to the community.</p>
        </div>
      </div>
    </div>
  );
}
