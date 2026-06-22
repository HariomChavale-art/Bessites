"use client"

import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider 
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Zap, Chrome, Loader2, Apple } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isConfigured = !!auth && !!db;

  const handleEmailAuth = async (mode: 'login' | 'signup') => {
    if (!isConfigured) return;
    
    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth!, email, password);
        const user = result.user;
        
        const docRef = doc(db!, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();

        if (userData?.onboardingComplete) {
          router.push("/");
        } else {
          router.push("/onboarding");
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db!, "users", user.uid), {
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

  const handleSocialLogin = async (providerType: 'google' | 'apple') => {
    if (!isConfigured) return;

    setLoading(true);
    try {
      const provider = providerType === 'google' 
        ? new GoogleAuthProvider() 
        : new OAuthProvider('apple.com');
        
      const result = await signInWithPopup(auth!, provider);
      const user = result.user;

      const docRef = doc(db!, "users", user.uid);
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
          router.push("/");
        } else {
          router.push("/onboarding");
        }
      }
      
      toast({
        title: "Welcome to Webdock!",
        description: `Successfully signed in.`,
      });
    } catch (error: any) {
      console.error("Social Auth Error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An error occurred during sign-in.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-primary p-4 rounded-[1.5rem] mb-6 glow-primary shadow-[0_0_30px_rgba(123,51,255,0.4)] transition-transform hover:scale-110">
              <Zap className="w-10 h-10 text-white" fill="white" />
            </div>
            <h1 className="text-5xl font-headline font-extrabold text-white tracking-tighter">Webdock</h1>
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
                    <Label htmlFor="email" className="text-white ml-1 font-bold">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isConfigured}
                      className="bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary text-lg" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="password" title="Password" className="text-white ml-1 font-bold">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!isConfigured}
                      className="bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary text-lg" 
                    />
                  </div>
                  <Button 
                    onClick={() => handleEmailAuth('login')} 
                    disabled={loading || !isConfigured}
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-[1.8rem] h-16 text-xl font-bold glow-primary transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Sign In"}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="mt-10 space-y-6 px-4">
                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-white ml-1 font-bold">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isConfigured}
                      className="bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary text-lg" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-password" title="Password" className="text-white ml-1 font-bold">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!isConfigured}
                      className="bg-white/5 border-white/10 rounded-2xl h-14 focus:ring-primary text-lg" 
                    />
                  </div>
                  <Button 
                    onClick={() => handleEmailAuth('signup')} 
                    disabled={loading || !isConfigured}
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-[1.8rem] h-16 text-xl font-bold glow-primary transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Start Discovery"}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                  <span className="bg-[#1c1926] px-4 text-muted-foreground font-bold">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialLogin('google')} 
                  disabled={loading || !isConfigured}
                  className="border-white/10 bg-white/5 hover:bg-white/10 rounded-[1.8rem] h-14 gap-2 text-sm font-bold transition-all active:scale-95"
                >
                  <Chrome className="w-5 h-5" />
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialLogin('apple')} 
                  disabled={loading || !isConfigured}
                  className="border-white/10 bg-white/5 hover:bg-white/10 rounded-[1.8rem] h-14 gap-2 text-sm font-bold transition-all active:scale-95"
                >
                  <Apple className="w-5 h-5" />
                  Apple
                </Button>
              </div>
            </CardContent>
            <CardFooter className="pb-8">
              <p className="text-[11px] text-center w-full text-muted-foreground px-8 leading-relaxed opacity-60">
                By joining Webdock, you agree to our Terms and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
