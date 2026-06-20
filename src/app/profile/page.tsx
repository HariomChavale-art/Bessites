"use client"

import { useUser, useAuth, useDoc, useFirestore } from "@/firebase";
import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { WebsiteCard } from "@/components/website-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, Bookmark, Settings, Grid, LogOut, LogIn, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useMemo } from "react";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profileData, loading: profileLoading } = useDoc(userDocRef);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const handleLogin = async () => {
    if (!auth) {
      alert("Firebase is not configured yet. Please add your API keys to the .env file.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Curating your workspace...</p>
        </div>
      </div>
    );
  }

  // Use real data if available, otherwise fallback to high-quality mock data
  const isGuest = !user;
  const displayName = profileData?.displayName || user?.displayName || "Guest Curator";
  const email = user?.email || "Account not connected";
  const photoURL = user?.photoURL || `https://picsum.photos/seed/curator/200`;
  const interests = profileData?.interests?.length > 0 ? profileData.interests : ["Design", "AI", "Tech", "Discovery"];

  const savedWebsites = MOCK_WEBSITES.slice(0, 4);
  const likedWebsites = MOCK_WEBSITES.slice(4, 8);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative mb-6 group">
            <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary/20 shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <AvatarImage src={photoURL} />
              <AvatarFallback className="bg-muted text-2xl font-bold">
                {displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {!isGuest && (
              <Button size="icon" variant="ghost" className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg border-2 border-background w-10 h-10">
                <Settings className="w-5 h-5" />
              </Button>
            )}
          </div>
          
          <h1 className="text-4xl font-headline font-extrabold text-white mb-2 tracking-tight">
            {displayName}
          </h1>
          <p className="text-muted-foreground text-sm mb-6 font-medium bg-white/5 px-4 py-1 rounded-full border border-white/5 inline-block">
            {email}
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-md">
            {interests.map((interest: string) => (
              <Badge key={interest} variant="secondary" className="bg-white/5 text-white border-white/10 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 mr-2 text-primary" />
                {interest}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
            {isGuest ? (
              <Button onClick={handleLogin} className="rounded-2xl px-10 bg-primary hover:bg-primary/90 text-white glow-primary h-14 font-bold text-lg flex-1">
                <LogIn className="w-5 h-5 mr-2" />
                Connect Google
              </Button>
            ) : (
              <Button variant="outline" className="rounded-2xl px-10 border-white/10 hover:bg-white/5 h-14 font-bold text-lg flex-1" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            )}
            <Link href="/submit" className="flex-1">
              <Button className="w-full rounded-2xl px-10 bg-white text-background hover:bg-white/90 h-14 font-bold text-lg shadow-xl">
                <Plus className="w-5 h-5 mr-2" />
                Submit Site
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/5 border border-white/5 rounded-2xl p-1.5 h-auto">
              <TabsTrigger 
                value="saved" 
                className="rounded-xl px-12 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background transition-all font-bold"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </TabsTrigger>
              <TabsTrigger 
                value="liked" 
                className="rounded-xl px-12 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background transition-all font-bold"
              >
                <Heart className="w-4 h-4 mr-2" />
                Liked
              </TabsTrigger>
              <TabsTrigger 
                value="uploads" 
                className="rounded-xl px-12 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background transition-all font-bold"
              >
                <Grid className="w-4 h-4 mr-2" />
                Uploads
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="saved" className="mt-0 focus-visible:outline-none">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 px-2">
              {savedWebsites.map((app) => (
                <WebsiteCard key={app.id} website={app} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-0 focus-visible:outline-none">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 px-2">
              {likedWebsites.map((app) => (
                <WebsiteCard key={app.id} website={app} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="uploads" className="mt-0 focus-visible:outline-none">
            <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-white/5 rounded-[3.5rem] bg-white/[0.02] text-center px-4 max-w-3xl mx-auto">
              <div className="bg-primary/10 p-8 rounded-[2rem] mb-8">
                <Plus className="w-14 h-14 text-primary" />
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Share your creation</h3>
              <p className="text-muted-foreground max-w-sm mb-10 text-lg leading-relaxed font-medium">Got a cool web tool or unique experience? Submit it to the community.</p>
              <Link href="/submit">
                <Button className="rounded-2xl px-16 py-8 bg-white text-background hover:bg-white/90 font-extrabold text-xl h-auto shadow-2xl">
                  Submit Now
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
