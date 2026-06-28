"use client"

import { useUser, useAuth, useDoc, useFirestore, useCollection } from "@/firebase";
import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { WebsiteCard } from "@/components/website-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, Grid, LogOut, Loader2, ExternalLink, Clock, Settings, Shield, Bell, User as UserIcon, Palette, Eye } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { doc, collection, query, where, orderBy } from "firebase/firestore";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profileData } = useDoc(userDocRef);

  const likedCollectionRef = useMemo(() => {
    if (!user || !db) return null;
    return collection(db, "users", user.uid, "likedWebsites");
  }, [user, db]);

  const { data: likedDocs, loading: likedLoading } = useCollection(likedCollectionRef);

  const submissionsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "submissions"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
  }, [user, db]);

  const { data: userSubmissions, loading: submissionsLoading } = useCollection(submissionsQuery);

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
        description: "You have been successfully signed out of Webdock.",
      });
      router.push("/");
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-sm">
            <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5">
              <LogOut className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
              <h2 className="text-2xl font-black text-white mb-2">Login Required</h2>
              <p className="text-muted-foreground font-medium mb-8">Sign in to view your profile, likes, and submissions.</p>
              <Link href="/login">
                <Button className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-bold text-lg">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const displayName = profileData?.displayName || user?.displayName || "Curator";
  const email = user?.email || "Guest User";
  const photoURL = profileData?.photoURL || user?.photoURL || `https://picsum.photos/seed/${user.uid}/200`;
  const interests = profileData?.interests?.length > 0 ? profileData.interests : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 pb-32">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative mb-6 group">
            <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary/20 shadow-2xl">
              <AvatarImage src={photoURL} className="object-cover" />
              <AvatarFallback className="text-2xl bg-primary/20 text-primary">{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            {/* Settings Dialog Button */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="absolute bottom-1 right-1 bg-white text-black p-2.5 rounded-full shadow-xl hover:scale-110 transition-transform active:scale-95 z-10 border border-black/5">
                  <Settings className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-background border-white/10 text-white rounded-[2.5rem] sm:max-w-md p-0 overflow-hidden">
                <div className="p-8 pb-4">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Settings</DialogTitle>
                  </DialogHeader>
                </div>
                <div className="p-4 space-y-2">
                  <SettingsOption icon={UserIcon} label="Account Info" description="Manage your display name and email." />
                  <SettingsOption icon={Shield} label="Privacy & Security" description="Password and authentication methods." />
                  <SettingsOption 
                    icon={Palette} 
                    label="Discovery Preferences" 
                    description="Update your 3+ interest tags." 
                    onClick={() => router.push('/onboarding')} 
                  />
                  <SettingsOption icon={Bell} label="Notifications" description="Manage app-wide staff pick alerts." />
                  <SettingsOption icon={Eye} label="Display Mode" description="Theme and appearance settings." />
                  <div className="pt-4 px-4 pb-6">
                    <Button variant="ghost" onClick={handleLogout} className="w-full h-14 rounded-2xl border border-white/5 hover:bg-destructive/10 hover:text-destructive font-bold transition-all">
                      <LogOut className="w-5 h-5 mr-3" /> Sign Out
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <h1 className="text-4xl font-headline font-extrabold text-white mb-2 tracking-tight">{displayName}</h1>
          <p className="text-muted-foreground text-sm mb-6 font-medium bg-white/5 px-4 py-1 rounded-full border border-white/5 inline-block">{email}</p>
          
          {interests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-md">
              {interests.map((interest: string) => (
                <Badge key={interest} variant="secondary" className="bg-white/5 text-white border-white/10 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase">
                  {interest}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
            <Link href="/submit" className="flex-1">
              <Button className="w-full rounded-2xl bg-white text-background h-14 font-black text-lg shadow-xl hover:bg-white/90">
                <Plus className="w-5 h-5 mr-2" strokeWidth={3} /> SUBMIT SITE
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="liked" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/5 border border-white/5 rounded-2xl p-1.5 h-auto">
              <TabsTrigger value="liked" className="rounded-xl px-8 sm:px-12 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background font-bold transition-all">
                <Heart className="w-4 h-4 mr-2" /> Liked
              </TabsTrigger>
              <TabsTrigger value="uploads" className="rounded-xl px-8 sm:px-12 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background font-bold transition-all">
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
                <p className="text-lg">No saved tools in your collection yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="uploads">
            <div className="space-y-6 max-w-4xl mx-auto">
              {submissionsLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
              ) : userSubmissions && userSubmissions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userSubmissions.map((sub: any) => (
                    <Card key={sub.id} className="bg-white/[0.03] border-white/5 p-6 rounded-3xl group hover:border-primary/20 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                          <ExternalLink className="w-6 h-6" />
                        </div>
                        <Badge className={cn(
                          "uppercase font-black tracking-widest text-[10px] px-3 py-1 rounded-full",
                          sub.status === 'pending' ? "bg-amber-500/20 text-amber-500" : "bg-green-500/20 text-green-500"
                        )}>
                          {sub.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1 truncate">{sub.url.replace('https://', '')}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        {sub.timestamp ? new Date(sub.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sub.categories?.slice(0, 2).map((cat: string) => (
                          <Badge key={cat} variant="secondary" className="bg-white/5 text-[9px] uppercase font-bold px-2 py-0.5 border-none">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                  <Link href="/submit" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/20 transition-all text-center">
                    <Plus className="w-8 h-8 text-primary mb-3" />
                    <span className="text-white font-bold">Submit Another</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3.5rem] bg-white/[0.02] text-center px-4">
                  <Plus className="w-14 h-14 text-primary mb-8" />
                  <h3 className="text-3xl font-extrabold text-white mb-3">Submit your project</h3>
                  <p className="text-muted-foreground mb-10 text-lg">Got a cool web tool? Share it with the Webdock community.</p>
                  <Link href="/submit"><Button className="rounded-2xl px-16 py-8 bg-white text-background font-extrabold text-xl h-auto">Submit Now</Button></Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function SettingsOption({ icon: Icon, label, description, onClick }: { icon: any, label: string, description: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] hover:bg-white/5 transition-all text-left group">
      <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-primary/20 group-hover:text-primary transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-bold text-white leading-none mb-1">{label}</h4>
        <p className="text-xs text-muted-foreground font-medium">{description}</p>
      </div>
    </button>
  );
}
