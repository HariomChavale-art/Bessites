
"use client"

import { useUser, useAuth, useDoc, useFirestore, useCollection } from "@/firebase";
import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { WebsiteCard } from "@/components/website-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Heart, 
  Bookmark, 
  Grid, 
  LogOut, 
  Loader2, 
  ExternalLink, 
  Clock, 
  Settings, 
  Shield, 
  User as UserIcon, 
  Palette, 
  Eye,
  Info,
  Mail,
  FileText,
  ShieldCheck,
  ChevronRight,
  Camera,
  ChevronLeft,
  Save
} from "lucide-react";
import Link from "next/link";
import { signOut, updateProfile } from "firebase/auth";
import { doc, collection, query, where, updateDoc } from "firebase/firestore";
import { useMemo, useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profileData } = useDoc(userDocRef);

  const [settingsView, setSettingsView] = useState<'menu' | 'account' | 'privacy' | 'display'>('menu');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (profileData) {
      setEditName(profileData.displayName || "");
      setEditBio(profileData.bio || "");
    }
  }, [profileData]);

  const savedCollectionRef = useMemo(() => {
    if (!user || !db) return null;
    return collection(db, "users", user.uid, "likedWebsites");
  }, [user, db]);
  const { data: savedDocs, loading: savedLoading } = useCollection(savedCollectionRef);

  const likedCollectionRef = useMemo(() => {
    if (!user || !db) return null;
    return collection(db, "users", user.uid, "userLikes");
  }, [user, db]);
  const { data: likedDocs, loading: likedLoading } = useCollection(likedCollectionRef);

  const submissionsQuery = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "submissions"), where("userId", "==", user.uid));
  }, [user, db]);
  const { data: rawSubmissions, loading: submissionsLoading } = useCollection(submissionsQuery);

  const userSubmissions = useMemo(() => {
    if (!rawSubmissions) return [];
    return [...rawSubmissions].sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
  }, [rawSubmissions]);

  const savedWebsitesList = useMemo(() => {
    if (!savedDocs) return [];
    const savedIds = savedDocs.map(doc => doc.id);
    return MOCK_WEBSITES.filter(w => savedIds.includes(w.id));
  }, [savedDocs]);

  const likedWebsitesList = useMemo(() => {
    if (!likedDocs) return [];
    const likedIds = likedDocs.map(doc => doc.id);
    return MOCK_WEBSITES.filter(w => likedIds.includes(w.id));
  }, [likedDocs]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      toast({ title: "Bessites Access", description: "Signed out successfully." });
      router.push("/");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAccount = async () => {
    if (!user || !db) return;
    setIsUpdating(true);
    try {
      let finalPhotoURL = profileData?.photoURL || user.photoURL;
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `profiles/${user.uid}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('Website-images')
          .upload(fileName, selectedFile);
        
        if (uploadError) {
          console.warn("Supabase Storage Error:", uploadError.message);
          toast({
            variant: "destructive",
            title: "Storage Error",
            description: "Profile picture upload failed (Check Supabase RLS). Update will proceed without new image.",
          });
        } else {
          const { data } = supabase.storage.from('Website-images').getPublicUrl(fileName);
          finalPhotoURL = data.publicUrl;
        }
      }

      await updateProfile(user, { displayName: editName, photoURL: finalPhotoURL });
      
      const userRef = doc(db, "users", user.uid);
      updateDoc(userRef, {
        displayName: editName,
        bio: editBio,
        photoURL: finalPhotoURL
      }).catch(async (e) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { displayName: editName }
          }));
      });

      toast({ title: "Profile Updated", description: "Your account information has been saved." });
      setSettingsView('menu');
      setSelectedFile(null);
      setPhotoPreview(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setIsUpdating(false);
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
              <p className="text-muted-foreground font-medium mb-8">Sign in to view your profile and collections.</p>
              <Link href="/login">
                <Button className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-bold text-lg">Go to Login</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const displayName = profileData?.displayName || user?.displayName || "Curator";
  const email = user?.email || "";
  const photoURL = profileData?.photoURL || user?.photoURL || `https://picsum.photos/seed/${user.uid}/200`;
  const interests = profileData?.interests || [];

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
            
            <Dialog onOpenChange={(open) => !open && setSettingsView('menu')}>
              <DialogTrigger asChild>
                <button className="absolute bottom-1 right-1 bg-white text-black p-2.5 rounded-full shadow-xl hover:scale-110 transition-transform active:scale-95 z-10 border border-black/5">
                  <Settings className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-background border-white/10 text-white rounded-[2.5rem] sm:max-w-md p-0 overflow-hidden">
                {settingsView === 'menu' ? (
                  <>
                    <div className="p-8 pb-4">
                      <DialogHeader>
                        <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Settings</DialogTitle>
                      </DialogHeader>
                    </div>
                    <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto no-scrollbar">
                      <div className="px-4 py-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-50">Account Management</p>
                        <SettingsOption icon={UserIcon} label="Account Info" description="Display name and profile picture." onClick={() => setSettingsView('account')} />
                        <SettingsOption icon={Palette} label="Discovery Preferences" description="Update your discovery feed tags." onClick={() => router.push('/onboarding')} />
                        <SettingsOption icon={Shield} label="Privacy & Security" description="Password and data controls." onClick={() => setSettingsView('privacy')} />
                        <SettingsOption icon={Eye} label="Display Mode" description="Customize your visual experience." onClick={() => setSettingsView('display')} />
                      </div>

                      <div className="px-4 py-4 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-50">Legal & Support</p>
                        <SettingsOption icon={Info} label="About Us" description="Our mission and story." onClick={() => router.push('/about')} />
                        <SettingsOption icon={Mail} label="Contact Support" description="Help and feedback." onClick={() => router.push('/contact')} />
                        <SettingsOption icon={FileText} label="Privacy Policy" description="Data and AdSense policies." onClick={() => router.push('/privacy')} />
                        <SettingsOption icon={ShieldCheck} label="Terms of Service" description="Usage terms." onClick={() => router.push('/terms')} />
                      </div>
                      
                      <div className="pt-6 px-4 pb-8 border-t border-white/5">
                        <Button variant="ghost" onClick={handleLogout} className="w-full h-16 rounded-[1.5rem] border border-white/5 hover:bg-destructive/10 hover:text-destructive font-black uppercase tracking-widest text-xs transition-all italic">
                          <LogOut className="w-4 h-4 mr-3" /> Sign Out
                        </Button>
                      </div>
                    </div>
                  </>
                ) : settingsView === 'account' ? (
                  <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                      <Button variant="ghost" size="icon" onClick={() => setSettingsView('menu')} className="rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Account Info</DialogTitle>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                        <Avatar className="w-24 h-24 border-2 border-white/10 ring-4 ring-primary/10">
                          <AvatarImage src={photoPreview || photoURL} className="object-cover" />
                          <AvatarFallback className="text-xl">{displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-xl hover:scale-110 transition-all">
                          <Camera className="w-4 h-4" />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest opacity-50">Display Name</Label>
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-white/5 border-white/10 rounded-2xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest opacity-50">Bio</Label>
                        <Textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Curator of fine webs..." className="bg-white/5 border-white/10 rounded-2xl min-h-[100px]" />
                      </div>
                    </div>

                    <Button onClick={handleUpdateAccount} disabled={isUpdating} className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-black text-lg">
                      {isUpdating ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                      SAVE CHANGES
                    </Button>
                  </div>
                ) : (
                  <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                      <Button variant="ghost" size="icon" onClick={() => setSettingsView('menu')} className="rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">{settingsView.toUpperCase()}</DialogTitle>
                    </div>
                    <div className="p-12 text-center bg-white/5 rounded-[2rem] border border-white/5">
                      <Shield className="w-12 h-12 text-primary mx-auto mb-4 opacity-20" />
                      <p className="text-muted-foreground font-medium">This section is being synchronized with your profile details at {email}.</p>
                    </div>
                  </div>
                )}
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

        <Tabs defaultValue="saved" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/5 border border-white/5 rounded-2xl p-1.5 h-auto overflow-x-auto no-scrollbar max-w-full">
              <TabsTrigger value="saved" className="rounded-xl px-6 sm:px-8 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background font-bold transition-all shrink-0">
                <Bookmark className="w-4 h-4 mr-2" /> Saved
              </TabsTrigger>
              <TabsTrigger value="liked" className="rounded-xl px-6 sm:px-8 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background font-bold transition-all shrink-0">
                <Heart className="w-4 h-4 mr-2" /> Liked
              </TabsTrigger>
              <TabsTrigger value="uploads" className="rounded-xl px-6 sm:px-8 py-3.5 data-[state=active]:bg-white data-[state=active]:text-background font-bold transition-all shrink-0">
                <Grid className="w-4 h-4 mr-2" /> Submissions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="saved">
            {savedLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
            ) : savedWebsitesList.length > 0 ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-6 px-2">
                {savedWebsitesList.map((app) => <WebsiteCard key={app.id} website={app} />)}
              </div>
            ) : (
              <div className="text-center py-20 opacity-40">
                <Bookmark className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg">No saved tools in your collection yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked">
            {likedLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
            ) : likedWebsitesList.length > 0 ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-6 px-2">
                {likedWebsitesList.map((app) => <WebsiteCard key={app.id} website={app} />)}
              </div>
            ) : (
              <div className="text-center py-20 opacity-40">
                <Heart className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg">You haven't liked any websites yet.</p>
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
                        <div className="bg-primary/10 p-3 rounded-2xl text-primary"><ExternalLink className="w-6 h-6" /></div>
                        <Badge className={cn("uppercase font-black tracking-widest text-[10px] px-3 py-1 rounded-full", sub.status === 'pending' ? "bg-amber-500/20 text-amber-500" : "bg-green-500/20 text-green-500")}>
                          {sub.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1 truncate">{sub.url.replace('https://', '')}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        {sub.timestamp ? new Date(sub.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3.5rem] bg-white/[0.02] text-center px-4">
                  <Plus className="w-14 h-14 text-primary mb-8" />
                  <h3 className="text-3xl font-extrabold text-white mb-3">Submit your project</h3>
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
      <div className="bg-white/5 p-3.5 rounded-2xl group-hover:bg-primary/20 group-hover:text-primary transition-all group-hover:scale-105">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white text-sm leading-none mb-1 group-hover:text-primary transition-colors">{label}</h4>
        <p className="text-[10px] text-muted-foreground font-medium truncate opacity-70">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
    </button>
  );
}
