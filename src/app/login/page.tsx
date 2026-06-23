
"use client"

import { useState, useRef } from "react";
import { useAuth, useFirestore } from "@/firebase";
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
import { Navigation } from "@/components/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const isConfigured = !!auth && !!db;

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
    if (!isConfigured) return;
    
    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth!, email, password);
        const user = result.user;
        const docRef = doc(db!, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data()?.onboardingComplete) {
          router.push("/");
        } else {
          router.push("/onboarding");
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
        const user = userCredential.user;
        if (photoPreview) await updateProfile(user, { photoURL: photoPreview });
        await setDoc(doc(db!, "users", user.uid), {
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-card/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          <div className="flex-1 p-8 sm:p-16 flex flex-col justify-center order-2 md:order-1">
            <div className="space-y-4 mb-10">
              <Logo className="scale-125 origin-left mb-6" />
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase italic">
                Welcome to Webdock!
              </h1>
              <p className="text-muted-foreground font-medium text-lg">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary font-bold hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white font-bold text-base ml-1 uppercase tracking-widest">Email</Label>
                <Input 
                  type="email" 
                  placeholder="example@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 rounded-2xl h-14 text-lg focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-bold text-base ml-1 uppercase tracking-widest">Password</Label>
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
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-16 text-xl font-black shadow-xl mt-4 glow-primary"
              >
                {loading ? <Loader2 className="animate-spin" /> : mode === 'login' ? 'SIGN IN' : 'JOIN NOW'}
              </Button>
            </form>
          </div>

          <div className="flex-1 bg-white/[0.02] border-l border-white/5 p-12 flex flex-col items-center justify-center relative order-1 md:order-2">
            <div className="relative group">
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#1A1A1A] border-4 border-white/10 overflow-hidden relative shadow-2xl transition-all group-hover:border-primary/50">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                    <User className="w-24 h-24 sm:w-32 sm:h-32" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-primary p-4 rounded-full text-white shadow-xl glow-primary hover:scale-110 transition-transform active:scale-95 z-10"
              >
                <Plus className="w-8 h-8" strokeWidth={3} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-xl font-black text-white mb-2 uppercase tracking-[0.2em] opacity-60 italic">Your Identity</h2>
              <p className="text-sm text-muted-foreground max-w-[240px]">Personalize your Webdock presence with a custom avatar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
