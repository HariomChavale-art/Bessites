
"use client"

import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Zap, Chrome, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async (mode: 'login' | 'signup') => {
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Firebase is not properly configured. Please check your API keys.",
      });
      return;
    }
    
    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();

        if (userData?.onboardingComplete) {
          router.push("/profile");
        } else {
          router.push("/onboarding");
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: []
        }, { merge: true });

        router.push("/onboarding");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Please check your email and password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Firebase is not properly configured. Please check your API keys.",
      });
      return;
    }

    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: []
        });
        router.push("/onboarding");
      } else {
        const userData = docSnap.data();
        if (userData?.onboardingComplete) {
          router.push("/profile");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.code === 'auth/configuration-not-found' 
          ? "Google Sign-in is not enabled in Firebase Console." 
          : error.message || "An error occurred with Google Sign-in.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative pt-24">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-primary p-4 rounded-[1.5rem] mb-6 glow-primary shadow-[0_0_30px_rgba(123,51,255,0.4)] transition-transform hover:scale-110">
            <Zap className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-5xl font-headline font-extrabold text-white tracking-tighter">NetFlow</h1>
          <p className="text-muted-foreground mt-3 text-center text-lg">The web's front page, curated by you.</p>
        </div>

        <Card className="bg-card/40 backdrop-blur-3xl border-white/5 shadow-2xl rounded-[3rem] overflow-hidden p-2">
          <CardHeader className="pb-2">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1.5 rounded-[1.8rem]">
                <TabsTrigger value="login" className="rounded-[1.4rem] data-[state=active]:bg-primary data-[state=active]:text-white font-bold h-12 transition-all">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-[1.4rem] data-[state=active]:bg-primary data-[state=active]:text-white font-bold h-12 transition-all">Join</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-10 space-y-6 px-4">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white ml-1">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary text-lg" 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" title="Password" className="text-white ml-1">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary text-lg" 
                  />
                </div>
                <Button 
                  onClick={() => handleEmailAuth('login')} 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-[1.8rem] h-16 text-xl font-bold glow-primary transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Sign In"}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="mt-10 space-y-6 px-4">
                <div className="space-y-3">
                  <Label htmlFor="signup-email" className="text-white ml-1">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary text-lg" 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-password" title="Password" className="text-white ml-1">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary text-lg" 
                  />
                </div>
                <Button 
                  onClick={() => handleEmailAuth('signup')} 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-[1.8rem] h-16 text-xl font-bold glow-primary transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Start Discovery"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                <span className="bg-[#1c1926] px-4 text-muted-foreground font-bold">Or continue with</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin} 
              disabled={loading}
              className="w-full border-white/10 bg-white/5 hover:bg-white/10 rounded-[1.8rem] h-16 gap-4 text-lg font-bold transition-all active:scale-95"
            >
              <Chrome className="w-6 h-6" />
              Google
            </Button>
          </CardContent>
          <CardFooter className="pb-8">
            <p className="text-[11px] text-center w-full text-muted-foreground px-8 leading-relaxed opacity-60">
              By joining NetFlow, you agree to our <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
