
"use client"

import { useUser, useAuth, useDoc, useFirestore, useCollection } from "@/firebase";
import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { WebsiteCard } from "@/components/website-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, Bookmark, Settings, Grid, LogOut, Chrome, Apple, Sparkles, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { signOut, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, collection } from "firebase/firestore";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [authLoading, setAuthLoading] = useState(false);

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profileData } = useDoc(userDocRef);

  // Fetch real liked websites from Firestore
  const likedCollectionRef = useMemo(() => {
    if (!user || !db) return null;
    return collection(db, "users", user.uid, "likedWebsites");
  }, [user, db]);

  const { data: likedDocs, loading: likedLoading } = useCollection(likedCollectionRef);

  // Map Firestore IDs back to our MOCK_WEBSITES data for display
  const likedWebsites = useMemo(() => {
    if (!likedDocs) return [];
    const likedIds = likedDocs.map(doc => doc.id);
    return MOCK_WEBSITES.filter(w => likedIds.includes(w.id));
  }, [likedDocs]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const handleSocialLogin = async (providerType: 'google' | 'apple') => {
    if (!auth || !db) return;
    setAuthLoading(true);
    try {
      const provider = providerType === 'google' ? new GoogleAuthProvider() : new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;
      const docRef = doc(db, "users", signedInUser.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          displayName: signedInUser.displayName,
          photoURL: signedInUser.photoURL,
          email: signedInUser.email,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          interests: []
        });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    } finally {
      setAuthLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  const isGuest = !user;
  const displayName = profileData?.displayName || user?.displayName || "Guest Curator";
  const email = user?.email || "Account not connected";
  const photoURL = profileData?.photoURL || user?.photoURL || `https://picsum.photos/seed/curator/200`;
  const interests = profileData?.interests?.length > 0 ? profileData.interests : ["Design", "AI", "Tech"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        {isGuest ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-12">
            <div className="space-y-4">
              <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl font-headline font-extrabold text-white tracking-tighter">
                Your <span className="text-primary italic">Collection</span> Awaits
              </h1>
              <p className="text-muted-foreground text-xl max-w-lg mx-auto font-medium">
                Connect your account to save favorite websites and track your flow.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <Button onClick={() => handleSocialLogin('google')} disabled={authLoading} className="bg-white text-background hover:bg-white/90 rounded-2xl h-16 font-bold text-lg">
                {authLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <Chrome className="w-6 h-6 mr-3" />}
                Connect Google
              </Button>
              <Button onClick={() => handleSocialLogin('apple')} disabled={authLoading} className="bg-black text-white hover:bg-black/90 border border-white/10 rounded-2xl h-16 font-bold text-lg">
                {authLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <Apple className="w-6 h-6 mr-3" />}
                Connect Apple
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center mb-12">
            <div className="relative mb-6 group">
              <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary/20 shadow-2xl">
                <AvatarImage src={photoURL} />
                <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="ghost" className="absolute bottom-0 right-0 rounded-full bg-primary text-white w-10 h-10">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
            <h1 className="text-4xl font-headline font-extrabold text-white mb-2 tracking-tight">{displayName}</h1>
            <p className="text-muted-foreground text-sm mb-6 font-medium bg-white/5 px-4 py-1 rounded-full border border-white/5 inline-block">{email}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-md">
              {interests.map((interest: string) => (
                <Badge key={interest} variant="secondary" className="bg-white/5 text-white border-white/10 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase">
                  {interest}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
              <Button variant="outline" className="rounded-2xl border-white/10 h-14 font-bold flex-1" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" /> Sign Out
              </Button>
              <Link href="/submit" className="flex-1">
                <Button className="w-full rounded-2xl bg-white text-background h-14 font-bold shadow-xl">
                  <Plus className="w-5 h-5 mr-2" /> Submit Site
                </Button>
              </Link>
            </div>
          </div>
        )}

        <Tabs defaultValue="liked" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/5 border border-white/5 rounded-2xl p-1.5 h-auto">
              <TabsTrigger value="liked" className="rounded-xl px-12 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background font-bold">
                <Heart className="w-4 h-4 mr-2" /> Liked
              </TabsTrigger>
              <TabsTrigger value="uploads" className="rounded-xl px-12 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background font-bold">
                <Grid className="w-4 h-4 mr-2" /> Submissions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="liked">
            {likedLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
            ) : likedWebsites.length > 0 ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-6 px-2">
                {likedWebsites.map((app) => <WebsiteCard key={app.id} website={app} />)}
              </div>
            ) : (
              <div className="text-center py-20 opacity-40">
                <Heart className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg">No liked websites yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="uploads">
            <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-white/5 rounded-[3.5rem] bg-white/[0.02] text-center px-4 max-w-3xl mx-auto">
              <Plus className="w-14 h-14 text-primary mb-8" />
              <h3 className="text-3xl font-extrabold text-white mb-3">Share your creation</h3>
              <p className="text-muted-foreground mb-10 text-lg">Got a cool web tool? Submit it to the community.</p>
              <Link href="/submit"><Button className="rounded-2xl px-16 py-8 bg-white text-background font-extrabold text-xl h-auto">Submit Now</Button></Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
