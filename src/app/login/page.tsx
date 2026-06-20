
"use client"

import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
    if (!auth || !db) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Check onboarding
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
        
        // Initialize profile
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
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth || !db) return;
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
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message || "Please check if Google sign-in is enabled in Firebase Console.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-primary p-4 rounded-2xl mb-6 glow-primary shadow-[0_0_30px_rgba(123,51,255,0.4)]">
            <Zap className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-headline font-extrabold text-white tracking-tight">NetFlow</h1>
          <p className="text-muted-foreground mt-2 text-center">Curate the future of the web.</p>
        </div>

        <Card className="bg-card/30 backdrop-blur-2xl border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pb-2">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-2xl">
                <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-primary font-bold">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-primary font-bold">Join</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-12 focus:ring-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-12 focus:ring-primary" 
                  />
                </div>
                <Button 
                  onClick={() => handleEmailAuth('login')} 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 text-lg font-bold glow-primary"
                >
                  {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Sign In"}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-12 focus:ring-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-12 focus:ring-primary" 
                  />
                </div>
                <Button 
                  onClick={() => handleEmailAuth('signup')} 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 text-lg font-bold glow-primary"
                >
                  {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Start Curating"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-[#18151F] px-4 text-muted-foreground font-bold">Or</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin} 
              disabled={loading}
              className="w-full border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl h-14 gap-3 text-base font-bold transition-all hover:scale-[1.02]"
            >
              <Chrome className="w-6 h-6" />
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-[11px] text-center w-full text-muted-foreground px-6 leading-relaxed">
              By joining NetFlow, you agree to our <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
