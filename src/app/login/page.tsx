"use client"

import { useState, useRef, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, User, Eye, EyeOff, KeyRound, Zap } from "lucide-react";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, loading: authLoading } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
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
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      console.error("Firebase Storage Error:", err);
      return null;
    }
  };

  const formatAuthError = (error: any) => {
    const code = error.code || "";
    switch (code) {
      case 'auth/user-not-found':
        return "Account not found. Check your email or join the community!";
      case 'auth/wrong-password':
        return "Access denied: Incorrect password for this account.";
      case 'auth/invalid-email':
        return "Please enter a valid email address.";
      case 'auth/email-already-in-use':
        return "This email is already registered. Try signing in instead!";
      case 'auth/weak-password':
        return "Security alert: Password is too weak. Please use at least 6 characters.";
      case 'auth/too-many-requests':
        return "System lockout: Too many attempts. Please try again later.";
      case 'auth/invalid-credential':
        return "Incorrect email or password. Please verify and try again.";
      default:
        return "Bessites Access: An authentication glitch occurred.";
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
        getDoc(userRef).then(docSnap => {
          router.push(docSnap.exists() && docSnap.data()?.onboardingComplete ? "/" : "/onboarding");
        }).catch(() => router.push("/onboarding"));
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const finalPhotoURL = selectedFile ? await uploadToFirebase(selectedFile, user.uid) : null;
        
        if (finalPhotoURL) {
          await updateProfile(user, { photoURL: finalPhotoURL });
        }
        
        const userData = {
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: finalPhotoURL,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: []
        };

        const userRef = doc(db, "users", user.uid);
        setDoc(userRef, userData)
          .then(() => router.push("/onboarding"))
          .catch(async (e) => {
             errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userRef.path,
                operation: 'create',
                requestResourceData: userData
              }));
          });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Bessites Access",
        description: formatAuthError(error),
      });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!auth || !email) {
      toast({
        variant: "destructive",
        title: "Bessites Support",
        description: "Please enter your email address to receive a recovery link.",
      });
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Recovery Sent",
        description: "A secure reset link has been sent to your inbox.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Recovery Error",
        description: formatAuthError(error),
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <div className="flex-1 p-8 sm:p-16 flex flex-col justify-center bg-background order-2 md:order-1">
        <div className="w-full max-md mx-auto">
          <div className="mb-12 flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
              <Zap className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <span className="text-3xl font-black italic uppercase tracking-tighter block leading-none text-white">Bessites</span>
          </div>
          
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
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors mt-2 flex items-center gap-1.5"
                >
                  {resetLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <KeyRound className="w-3 h-3" />}
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-16 text-xl font-black shadow-xl glow-primary transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : mode === 'login' ? 'SIGN IN' : 'JOIN THE FLOW'}
            </Button>
            
            <p className="text-center text-muted-foreground font-medium pt-4">
              {mode === 'login' ? "New here? " : "Already part of the flow? "}
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

      <div className="flex-1 bg-gradient-to-br from-primary/15 to-transparent p-8 sm:p-16 flex flex-col items-center justify-center space-y-12 border-b md:border-b-0 md:border-l border-white/5 order-1 md:order-2">
        <div className="space-y-4 text-center">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Welcome to <br />
            <span className="text-primary">Bessites!</span>
          </h1>
          <p className="text-muted-foreground font-medium text-xl max-w-md mx-auto">
            The world's most curated directory for web tools, games, and modern webs.
          </p>
        </div>

        <div className="relative">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-muted border-4 border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-24 h-24 sm:w-32 sm:h-32 text-white/10" />
            )}
          </div>
          {mode === 'signup' && (
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-primary p-4 rounded-full text-white shadow-xl glow-primary hover:scale-110 transition-transform active:scale-95 z-10"
            >
              <Plus className="w-6 h-6" strokeWidth={5} />
            </button>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
}
