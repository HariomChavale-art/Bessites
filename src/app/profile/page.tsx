
"use client"

import { useUser, useAuth, useDoc, useFirestore } from "@/firebase";
import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { WebsiteCard } from "@/components/website-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, Bookmark, Settings, Grid, UploadCloud, LogOut, LogIn, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useMemo } from "react";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

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
    if (!auth) return;
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
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Use real data if available, otherwise fallback to mock data
  const displayName = profileData?.displayName || user?.displayName || "Guest Curator";
  const email = user?.email || "Connect your account to save progress";
  const photoURL = user?.photoURL || `https://picsum.photos/seed/curator/200`;
  const interests = profileData?.interests || ["Design", "AI", "Tech", "Discovery"];

  const savedWebsites = MOCK_WEBSITES.slice(0, 4);
  const likedWebsites = MOCK_WEBSITES.slice(4, 8);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative mb-4 group">
            <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary/20 shadow-2xl">
              <AvatarImage src={photoURL} />
              <AvatarFallback className="bg-muted text-2xl font-bold">
                {displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button size="icon" variant="ghost" className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg border-2 border-background w-10 h-10">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
          
          <h1 className="text-3xl font-headline font-bold text-white mb-1">
            {displayName}
          </h1>
          <p className="text-muted-foreground text-sm mb-4">{email}</p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-md">
            {interests.map((interest: string) => (
              <Badge key={interest} variant="secondary" className="bg-white/5 text-white border-white/10 px-4 py-1.5 rounded-full font-medium">
                <Sparkles className="w-3 h-3 mr-2 text-primary" />
                {interest}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-4">
            {user ? (
              <Button variant="outline" className="rounded-full px-8 border-white/10 hover:bg-white/5 h-11 font-bold" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button onClick={handleLogin} className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white glow-primary h-11 font-bold">
                <LogIn className="w-4 h-4 mr-2" />
                Connect Google
              </Button>
            )}
            <Link href="/submit">
              <Button className="rounded-full px-8 bg-white text-background hover:bg-white/90 h-11 font-bold shadow-xl">
                <Plus className="w-4 h-4 mr-2" />
                Submit Website
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-white/5 border border-white/5 rounded-full p-1 h-auto">
              <TabsTrigger 
                value="saved" 
                className="rounded-full px-10 py-3 data-[state=active]:bg-white data-[state=active]:text-background transition-all font-bold"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </TabsTrigger>
              <TabsTrigger 
                value="liked" 
                className="rounded-full px-10 py-3 data-[state=active]:bg-white data-[state=active]:text-background transition-all font-bold"
              >
                <Heart className="w-4 h-4 mr-2" />
                Liked
              </TabsTrigger>
              <TabsTrigger 
                value="uploads" 
                className="rounded-full px-10 py-3 data-[state=active]:bg-white data-[state=active]:text-background transition-all font-bold"
              >
                <Grid className="w-4 h-4 mr-2" />
                Uploads
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="saved" className="mt-0">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
              {savedWebsites.map((app) => (
                <WebsiteCard key={app.id} website={app} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-0">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
              {likedWebsites.map((app) => (
                <WebsiteCard key={app.id} website={app} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="uploads" className="mt-0">
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] text-center px-4">
              <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Plus className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Share your creation</h3>
              <p className="text-muted-foreground max-w-sm mb-8 text-lg">Got a cool web tool? Submit it to our community for review and discovery.</p>
              <Link href="/submit">
                <Button className="rounded-full px-12 py-6 bg-white text-background hover:bg-white/90 font-bold text-lg h-auto">
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
