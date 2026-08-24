
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Camera, 
  ShieldAlert, 
  Sparkles, 
  Globe, 
  Github, 
  Chrome,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { cn } from "@/lib/utils";

// Modern Avatar Options
const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Astra",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nala",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nova"
];

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
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

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
    if (!error) return "Authorization failed.";
    const code = error?.code || error?.name || "";
    const message = error?.message || "";

    if (code.includes('api-key-not-valid') || code.includes('invalid-api-key')) {
      return "System Setup Required: Your Firebase API Key is invalid or missing.";
    }

    switch (code) {
      case 'auth/user-not-found': return "Account not found. Check your email or join the community!";
      case 'auth/wrong-password': return "Access denied: Incorrect password for this account.";
      case 'auth/invalid-email': return "Please enter a valid email address.";
      case 'auth/email-already-in-use': return "This email is already registered. Try signing in!";
      case 'auth/weak-password': return "Security alert: Password is too weak (min 6 characters).";
      case 'auth/invalid-credential': return "Incorrect email or password. Please verify.";
      default: return message || "An unexpected error occurred.";
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
        
        if (selectedFile) {
          finalPhotoURL = await uploadToFirebase(selectedFile, user.uid);
        }
        
        if (finalPhotoURL) {
          await updateProfile(user, { photoURL: finalPhotoURL });
        }
        
        const userData = {
          email: user.email,
          displayName: email.split('@')[0],
          photoURL: finalPhotoURL,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: [],
          walletBalance: 0
        };

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, userData).catch((dbError) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userData
          }));
          throw dbError;
        });
        
        router.push("/onboarding");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Bessites Access", description: formatAuthError(error) });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!auth || !email) {
      toast({ variant: "destructive", title: "Bessites Support", description: "Please enter your email to receive a recovery link." });
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Recovery Sent", description: "A secure reset link has been sent to your inbox." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Recovery Error", description: formatAuthError(error) });
    } finally {
      setResetLoading(false);
    }
  };

  const isFirebaseMissing = !auth || !db;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0B0A0F] selection:bg-primary/30">
      
      {/* LEFT SIDE: Value Panel (Value Proposition) */}
      <div className="flex-1 bg-gradient-to-br from-primary/10 via-background to-transparent p-8 sm:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 order-2 md:order-1 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="mb-12">
            <span className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg"><Sparkles className="w-5 h-5 text-white" /></div>
              Bessites
            </span>
          </div>

          <div className="space-y-6 max-w-xl">
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              Unlock a World of <br />
              <span className="text-primary">Modern Webs.</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed italic opacity-60">
              Discover curated tools, apps, and games before the masses. Join the Bessites community and start your discovery pipeline today.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <div className="flex items-center gap-6 p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm w-fit group hover:bg-white/[0.04] transition-all">
             <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0A0F] bg-muted overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div>
                <p className="text-white font-black italic uppercase tracking-tighter text-xl leading-none">Join 280+ Creators</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 opacity-60">Curating the future web</p>
             </div>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
            <ShieldCheck className="w-3 h-3" /> 280+ Curated Modern Sites and Counting...
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Panel */}
      <div className="flex-1 p-4 sm:p-8 md:p-16 flex flex-col items-center justify-center bg-[#0B0A0F] order-1 md:order-2 relative">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          
          <div className="text-center space-y-2">
             <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                {mode === 'login' ? 'Welcome Back!' : 'Start Building.'}
             </h2>
             <p className="text-sm text-muted-foreground font-medium italic opacity-60">
                {mode === 'login' ? 'Enter your credentials to access the registry.' : 'Create your curator account in seconds.'}
             </p>
          </div>

          <Card className="bg-white/[0.03] border-white/10 p-8 sm:p-10 rounded-[3rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16" />
            
            {isFirebaseMissing && (
              <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed uppercase font-bold">
                  Setup Required: Missing Firebase API keys in your environment.
                </p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {mode === 'signup' && (
                <div className="space-y-6 mb-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 overflow-hidden relative shadow-xl transition-all group-hover:scale-105">
                        {photoPreview || selectedAvatar ? (
                          <img src={photoPreview || selectedAvatar!} alt="Preview" className="w-full h-full object-cover p-2" />
                        ) : (
                          <User className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30" />
                        )}
                        {loading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-primary p-2.5 rounded-full text-white shadow-xl hover:scale-110 transition-all border-2 border-[#121217]"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Or Pick an Avatar</Label>
                    <div className="grid grid-cols-6 gap-2">
                       {PRESET_AVATARS.map((avatar, idx) => (
                         <button
                           key={idx}
                           type="button"
                           onClick={() => {
                             setSelectedAvatar(avatar);
                             setPhotoPreview(null);
                             setSelectedFile(null);
                           }}
                           className={cn(
                             "w-full aspect-square rounded-xl border transition-all p-1 hover:scale-110 bg-white/5",
                             selectedAvatar === avatar ? "border-primary bg-primary/10 shadow-lg" : "border-white/5 opacity-40 hover:opacity-100"
                           )}
                         >
                           <img src={avatar} alt="Avatar" className="w-full h-full object-contain" />
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isFirebaseMissing || loading}
                    className="bg-white/5 border-white/10 rounded-2xl h-12 text-sm font-bold focus:ring-primary placeholder:opacity-20"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Password</Label>
                    {mode === 'login' && (
                      <button 
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={resetLoading || isFirebaseMissing}
                        className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      disabled={isFirebaseMissing || loading}
                      className="bg-white/5 border-white/10 rounded-2xl h-12 text-sm pr-12 focus:ring-primary placeholder:opacity-20 font-mono"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {mode === 'login' && (
                <div className="flex items-center space-x-2 px-1">
                  <Checkbox id="remember" className="rounded-md border-white/10 data-[state=checked]:bg-primary" />
                  <label htmlFor="remember" className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest cursor-pointer select-none">Remember this device</label>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading || isFirebaseMissing}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 text-sm font-black shadow-xl shadow-primary/10 uppercase tracking-widest transition-all active:scale-95 glow-primary"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Enter Discovery' : 'Join the Flow'}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                <div className="relative flex justify-center text-[10px]"><span className="bg-transparent px-4 text-muted-foreground/20 font-black uppercase tracking-[0.3em]">OR</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <Button type="button" variant="outline" className="h-12 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest gap-2">
                   <Chrome className="w-3.5 h-3.5 text-primary" /> Google
                 </Button>
                 <Button type="button" variant="outline" className="h-12 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest gap-2">
                   <Github className="w-3.5 h-3.5" /> GitHub
                 </Button>
              </div>
            </form>
          </Card>

          <div className="text-center space-y-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
              {mode === 'login' ? 'Are You a New Member?' : 'Already part of the flow?'}
              <button 
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary font-black ml-2 hover:underline decoration-2 underline-offset-4"
              >
                {mode === 'login' ? 'SIGN UP' : 'SIGN IN'}
              </button>
            </p>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic">
                <ShieldCheck className="w-3 h-3" /> Secure & Private. No spam, ever.
              </div>
              <p className="text-[8px] font-bold text-muted-foreground/10 uppercase tracking-widest">Your data stays yours. Built for discovery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
