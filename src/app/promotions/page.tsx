
'use client';

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, query, where, doc, addDoc, serverTimestamp, deleteDoc, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  Globe, 
  Loader2, 
  BarChart3, 
  Users, 
  Flame, 
  Bell, 
  LogOut, 
  Plus,
  TrendingUp,
  ChevronRight,
  Menu,
  Rocket,
  Zap,
  Wallet,
  Receipt,
  Check,
  X,
  Settings,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WebsitePreview } from "@/components/website-preview";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function PromotionsPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);
  const { data: profile } = useDoc(userDocRef);

  const mySubmissionsRef = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "submissions"), where("userId", "==", user.uid));
  }, [user, db]);
  const { data: mySites } = useCollection(mySubmissionsRef);

  const promosRef = useMemo(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "promotions"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [user, db]);
  const { data: promotions, loading: promosLoading } = useCollection(promosRef);

  const promoStats = useMemo(() => {
    if (!promotions) return { active: 0, totalSpend: 0 };
    return {
      active: promotions.filter(p => p.status === 'active').length,
      totalSpend: promotions.reduce((acc, curr) => acc + (curr.cost || 0), 0)
    };
  }, [promotions]);

  const handleCreatePromo = async () => {
    if (!db || !user || !selectedSiteId || !selectedPlacement || !selectedDuration) return;
    setIsCreating(true);
    
    const selectedSite = mySites?.find(s => s.id === selectedSiteId);
    const cost = parseInt(selectedDuration) * 15; // $15 per day

    const promoData = {
      userId: user.uid,
      websiteId: selectedSiteId,
      websiteUrl: selectedSite?.url || "",
      placement: selectedPlacement,
      duration: parseInt(selectedDuration),
      cost,
      status: "pending",
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, "promotions"), promoData)
      .then(() => {
        toast({ title: "Campaign Scheduled", description: "Your promotion is entering the review queue." });
        setIsCreating(false);
        setSelectedSiteId("");
        setSelectedPlacement("");
        setSelectedDuration("");
      })
      .catch((e) => {
        setIsCreating(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'promotions',
          operation: 'create',
          requestResourceData: promoData
        }));
      });
  };

  const handleCancelPromo = (id: string) => {
    if (!db) return;
    const promoRef = doc(db, "promotions", id);
    deleteDoc(promoRef).then(() => {
      toast({ title: "Cancelled", description: "Campaign removal complete." });
    });
  };

  const handleLogout = async () => {
    if (auth) { await signOut(auth); router.push("/"); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-10 px-2"><Link href="/" className="group block"><div className="flex flex-col items-start gap-1"><span className="text-2xl font-black italic uppercase tracking-tighter text-white">Bessites</span><span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">Creator Studio</span></div></Link></div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
        <SidebarItem icon={Globe} label="My Websites" active={pathname === '/my-websites'} onClick={() => router.push('/my-websites')} />
        <SidebarItem icon={BarChart3} label="Analytics" active={pathname === '/analytics'} onClick={() => router.push('/analytics')} />
        <SidebarItem icon={Users} label="Audience" active={pathname === '/audience'} onClick={() => router.push('/audience')} />
        <SidebarItem icon={Flame} label="Promotions" active={pathname === '/promotions'} onClick={() => router.push('/promotions')} />
        <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
          <SidebarItem icon={Settings} label="Settings" active={pathname === '/profile'} onClick={() => router.push('/profile')} />
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
          <Link href="/" className="text-xl font-black italic uppercase tracking-tighter text-white">Bessites</Link>
          <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5"><Menu className="w-5 h-5" /></Button></SheetTrigger><SheetContent side="left" className="bg-[#0D0C12] p-6 w-80"><SidebarContent /></SheetContent></Sheet>
        </header>

        <div className="p-4 sm:p-8 md:p-12 space-y-12">
          <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/5 p-10 sm:p-16 rounded-[4rem] relative overflow-hidden shadow-2xl group">
             <div className="relative z-10 space-y-6">
                <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1 italic">🚀 Boost Discovery Pipeline</Badge>
                <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Reach More <span className="text-primary">Curators.</span></h2>
                <p className="text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed">Promotions help your website gain massive visibility across the Bessites ecosystem.</p>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 w-fit shadow-xl">
                   <div className="flex items-center gap-3 px-4 py-2 border-r border-white/10"><Wallet className="w-4 h-4 text-primary" /><div><p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Billing Balance</p><p className="text-sm font-black italic text-white">${promoStats.totalSpend}.00</p></div></div>
                   <button className="p-3 text-muted-foreground hover:text-white transition-all"><Bell className="w-5 h-5" /></button>
                </div>
             </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
             <PromoStat label="Active Promos" value={promoStats.active} icon={Rocket} color="text-sky-500" />
             <PromoStat label="Total Pipeline Spend" value={`$${promoStats.totalSpend}`} icon={Zap} color="text-primary" />
             <PromoStat label="Avg. Conversion" value="11.4%" icon={TrendingUp} color="text-emerald-400" />
             <PromoStat label="Discovery Reach" value="2.1M" icon={Globe} color="text-indigo-400" />
          </div>

          <div className="bg-[#121117] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Active Campaigns</h3>
                <Dialog>
                   <DialogTrigger asChild>
                      <Button className="h-10 px-6 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] italic hover:scale-105 transition-all">Create New Promotion</Button>
                   </DialogTrigger>
                   <DialogContent className="bg-[#121019] border-white/10 text-white rounded-[2rem] sm:max-w-lg">
                      <DialogHeader><DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Boost Website Visibility</DialogTitle></DialogHeader>
                      <div className="space-y-6 py-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">1. Select Website</label>
                            <Select onValueChange={setSelectedSiteId}>
                               <SelectTrigger className="bg-white/5 border-white/10 rounded-xl"><SelectValue placeholder="Choose property..." /></SelectTrigger>
                               <SelectContent className="bg-[#1A1823] border-white/10 text-white">
                                  {mySites?.filter(s => s.status === 'approved').map(site => (
                                    <SelectItem key={site.id} value={site.id}>{site.url.replace('https://', '')}</SelectItem>
                                  ))}
                               </SelectContent>
                            </Select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">2. Choose Placement</label>
                            <Select onValueChange={setSelectedPlacement}>
                               <SelectTrigger className="bg-white/5 border-white/10 rounded-xl"><SelectValue placeholder="Target zone..." /></SelectTrigger>
                               <SelectContent className="bg-[#1A1823] border-white/10 text-white">
                                  <SelectItem value="homepage">Homepage Banner</SelectItem>
                                  <SelectItem value="trending">Trending Section</SelectItem>
                                  <SelectItem value="category">Category Boost</SelectItem>
                               </SelectContent>
                            </Select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">3. Select Duration</label>
                            <Select onValueChange={setSelectedDuration}>
                               <SelectTrigger className="bg-white/5 border-white/10 rounded-xl"><SelectValue placeholder="Campaign length..." /></SelectTrigger>
                               <SelectContent className="bg-[#1A1823] border-white/10 text-white">
                                  <SelectItem value="1">1 Day ($15)</SelectItem>
                                  <SelectItem value="7">7 Days ($100)</SelectItem>
                                  <SelectItem value="30">30 Days ($400)</SelectItem>
                               </SelectContent>
                            </Select>
                         </div>
                      </div>
                      <DialogFooter>
                         <Button onClick={handleCreatePromo} disabled={isCreating || !selectedSiteId || !selectedPlacement || !selectedDuration} className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl font-black text-lg shadow-xl">
                            {isCreating ? <Loader2 className="animate-spin" /> : "LAUNCH CAMPAIGN"}
                         </Button>
                      </DialogFooter>
                   </DialogContent>
                </Dialog>
             </div>
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[1000px]">
                   <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40"><tr><th className="p-8">Promoted Property</th><th className="p-8">Placement</th><th className="p-8">Duration</th><th className="p-8">Cost</th><th className="p-8 text-center">Status</th><th className="p-8 text-right">Operations</th></tr></thead>
                   <tbody className="divide-y divide-white/5">
                      {promosLoading ? (
                        <tr><td colSpan={6} className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                      ) : promotions && promotions.length > 0 ? (
                        promotions.map(promo => (
                          <tr key={promo.id} className="group hover:bg-white/[0.02] transition-colors">
                             <td className="p-8"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-black border border-white/10 overflow-hidden"><WebsitePreview websiteUrl={promo.websiteUrl} alt="Logo" className="w-full h-full" /></div><span className="text-sm font-black italic tracking-tighter text-white">{promo.websiteUrl.replace('https://', '')}</span></div></td>
                             <td className="p-8 text-[10px] font-black uppercase text-white/60">{promo.placement}</td>
                             <td className="p-8 text-sm font-bold text-white">{promo.duration} Days</td>
                             <td className="p-8 text-sm font-black italic text-primary">${promo.cost}</td>
                             <td className="p-8 text-center"><Badge className={cn("uppercase text-[8px] font-black border-none px-3 py-1", promo.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground/40")}>{promo.status}</Badge></td>
                             <td className="p-8 text-right"><Button variant="ghost" onClick={() => handleCancelPromo(promo.id)} className="text-[9px] font-black uppercase text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-xl px-4 py-2">Cancel Campaign</Button></td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} className="p-32 text-center text-muted-foreground italic font-medium opacity-20">No active promotions in the discovery pipeline.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>

          <Card className="bg-[#121117] border-white/5 p-8 rounded-[3.5rem] shadow-xl space-y-8">
             <div className="flex justify-between items-center"><h3 className="text-xl font-black italic uppercase tracking-tighter">Billing & Receipt Registry</h3><Receipt className="w-5 h-5 text-primary" /></div>
             <div className="space-y-4">
                {promotions?.map(promo => (
                  <div key={promo.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                     <div className="flex items-center gap-4">
                        <div className="text-[10px] font-black text-muted-foreground/30 uppercase">{promo.createdAt ? new Date(promo.createdAt.seconds * 1000).toLocaleDateString() : 'Pending'}</div>
                        <div className="text-[11px] font-bold text-white/80">{promo.placement.toUpperCase()} - {promo.websiteUrl}</div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black italic text-white">${promo.cost}</span>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-white/10"><Download className="w-3.5 h-3.5" /></Button>
                     </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function PromoStat({ label, value, icon: Icon, trend, color = "text-white" }: { label: string, value: string | number, icon: any, trend?: string, color?: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-5 rounded-[2rem] shadow-xl group hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between cursor-default">
      <div className="flex justify-between items-start mb-4 relative z-10"><div className="p-2.5 rounded-xl bg-white/5"><Icon className={cn("w-4 h-4", color)} /></div>{trend && <div className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{trend}</div>}</div>
      <div className="relative z-10"><p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1 leading-tight">{label}</p><h4 className="text-xl font-black italic tracking-tighter text-white leading-none">{value}</h4></div>
    </Card>
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
