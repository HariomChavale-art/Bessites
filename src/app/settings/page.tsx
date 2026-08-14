'use client';

import { useMemo, useState, useEffect, useRef } from "react";
import { useFirestore, useUser, useDoc, useAuth, useStorage } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile, signOut } from "firebase/auth";
import { 
  User as UserIcon, 
  Palette, 
  Shield, 
  Eye, 
  ChevronRight, 
  Globe, 
  BarChart3, 
  Users, 
  HelpCircle, 
  LogOut, 
  Menu,
  ChevronLeft,
  Camera,
  Save,
  Loader2,
  Settings as SettingsIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSubView, setActiveSubView] = useState<'menu' | 'account'>('menu');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);
  const { data: profile } = useDoc(userDocRef);

  useEffect(() => {
    if (profile) {
      setEditName(profile.displayName || user?.displayName || "");
      setEditBio(profile.bio || "");
    }
  }, [profile, user]);

  const handleLogout = async () => {
    if (auth) { await signOut(auth); router.push("/"); }
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
    if (!user || !db || !storage) return;
    setIsUpdating(true);
    try {
      let finalPhotoURL = profile?.photoURL || user.photoURL;
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `profiles/${user.uid}-${Date.now()}.${fileExt}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, selectedFile);
        finalPhotoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName: editName, photoURL: finalPhotoURL });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: editName,
        bio: editBio,
        photoURL: finalPhotoURL
      });

      toast({ title: "Profile Updated", description: "Your changes have been saved." });
      setActiveSubView('menu');
      setSelectedFile(null);
      setPhotoPreview(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-10 px-2">
        <Link href="/" className="group block">
          <div className="flex flex-col items-start gap-1">
            <Logo className="w-10 h-10 mb-1" />
            <span className="text-2xl font-black italic uppercase tracking-tighter text-white">Bessites</span>
            <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">Creator Studio</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
        <SidebarItem icon={Globe} label="My Websites" active={pathname === '/my-websites'} onClick={() => router.push('/my-websites')} />
        <SidebarItem icon={BarChart3} label="Analytics" active={pathname === '/analytics'} onClick={() => router.push('/analytics')} />
        <SidebarItem icon={Users} label="Audience" active={pathname === '/audience'} onClick={() => router.push('/audience')} />
        <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
          <SidebarItem icon={SettingsIcon} label="Settings" active={pathname === '/settings'} onClick={() => router.push('/settings')} />
          <SidebarItem icon={HelpCircle} label="Support" active={pathname === '/support'} onClick={() => router.push('/support')} />
        </div>
      </nav>
      <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all group">
         <LogOut className="w-5 h-5" /> <span className="text-sm font-bold">Logout</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white font-body antialiased flex flex-col lg:flex-row">
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 p-8 flex-col border-r border-white/5 bg-[#0D0C12] z-50"><SidebarContent /></aside>
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B0A0F]">
        <header className="lg:hidden flex items-center justify-between p-4 sticky top-0 bg-[#0B0A0F]/80 backdrop-blur-xl z-50 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">Bessites</span>
          </Link>
          <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5"><Menu className="w-5 h-5" /></Button></SheetTrigger><SheetContent side="left" className="bg-[#0D0C12] p-6 w-80"><SidebarContent /></SheetContent></Sheet>
        </header>

        <div className="p-4 sm:p-8 md:p-12 space-y-12">
          {activeSubView === 'menu' ? (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Settings</h1>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">Preferences & Management</p>
              </div>

              <div className="max-w-2xl space-y-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-50 ml-1">Account Management</p>
                  <SettingsOption icon={UserIcon} label="Account Info" description="Display name and profile picture." onClick={() => setActiveSubView('account')} />
                  <SettingsOption icon={Palette} label="Discovery Preferences" description="Update your discovery feed tags." onClick={() => router.push('/onboarding')} />
                  <SettingsOption icon={Shield} label="Privacy & Security" description="Password and data controls." onClick={() => {}} />
                  <SettingsOption icon={Eye} label="Display Mode" description="Customize your visual experience." onClick={() => {}} />
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-2xl animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center gap-4 mb-12">
                  <Button variant="ghost" size="icon" onClick={() => setActiveSubView('menu')} className="rounded-full hover:bg-white/5">
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Account Info</h2>
               </div>

               <Card className="bg-[#121117] border-white/5 p-10 rounded-[3rem] space-y-10">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                      <Avatar className="w-32 h-32 border-4 border-white/10 ring-8 ring-primary/5">
                        <AvatarImage src={photoPreview || profile?.photoURL || user?.photoURL} className="object-cover" />
                        <AvatarFallback className="text-3xl">{(profile?.displayName || user?.displayName || "C").charAt(0)}</AvatarFallback>
                      </Avatar>
                      <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-primary p-3 rounded-full text-white shadow-xl hover:scale-110 transition-all border-4 border-[#121117]">
                        <Camera className="w-5 h-5" />
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">Display Name</Label>
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-white/5 border-white/10 rounded-2xl h-14 text-lg font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">Bio</Label>
                      <Textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Tell the world about yourself..." className="bg-white/5 border-white/10 rounded-2xl min-h-[120px] p-4 text-sm font-medium" />
                    </div>
                  </div>

                  <Button onClick={handleUpdateAccount} disabled={isUpdating} className="w-full h-16 bg-primary hover:bg-primary/90 rounded-2xl font-black text-lg shadow-xl shadow-primary/10">
                    {isUpdating ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                    SAVE CHANGES
                  </Button>
               </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all group text-left", active ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" : "text-muted-foreground/60 hover:text-white hover:bg-white/5")}>
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "group-hover:text-white")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function SettingsOption({ icon: Icon, label, description, onClick }: { icon: any, label: string, description: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-5 p-5 rounded-[2rem] bg-[#121117] border border-white/5 hover:bg-white/5 transition-all text-left group">
      <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-primary/20 group-hover:text-primary transition-all group-hover:scale-105">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white text-base leading-none mb-1 group-hover:text-primary transition-colors">{label}</h4>
        <p className="text-[10px] text-muted-foreground font-medium truncate opacity-70 italic">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
    </button>
  );
}
