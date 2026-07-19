
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, query, where, doc, addDoc, serverTimestamp, deleteDoc, orderBy, updateDoc } from "firebase/firestore";
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
  HelpCircle,
  ChevronLeft,
  Calendar,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  Download,
  Clock,
  ArrowRight,
  ExternalLink,
  Star,
  Search
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const PROMO_TYPES = [
  { id: 'homepage', name: 'Homepage Featured', price: 15, reach: '50k+', desc: 'Prime placement on the main discovery feed.', icon: Star, color: 'text-amber-400' },
  { id: 'trending', name: 'Trending Section', price: 12, reach: '30k+', desc: 'Boost your rank in the community charts.', icon: TrendingUp, color: 'text-primary' },
  { id: 'staff', name: 'Staff Picks', price: 20, reach: '100k+', desc: 'The highest tier of professional curation.', icon: Zap, color: 'text-purple-400' },
  { id: 'category', name: 'Category Featured', price: 10, reach: '20k+', desc: 'Target niche audiences in your category.', icon: Globe, color: 'text-blue-400' },
  { id: 'search', name: 'Search Boost', price: 8, reach: '15k+', desc: 'Rank #1 for relevant discovery queries.', icon: Search, color: 'text-emerald-400' },
];

export default function PromotionsPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Creation State
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedType, setSelectedType] = useState(PROMO_TYPES[0]);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("7");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);
  const { data: profile } = useDoc(userDocRef);

  const mySubmissionsRef = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "submissions"), where("userId", "==", user.uid), where("status", "==", "approved"));
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

  const stats = useMemo(() => {
    if (!promotions) return { active: 0, totalSpend: 0, scheduled: 0 };
    return {
      active: promotions.filter(p => p.status === 'active').length,
      scheduled: promotions.filter(p => p.status === 'scheduled').length,
      totalSpend: promotions.reduce((acc, curr) => acc + (curr.cost || 0), 0)
    };
  }, [promotions]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const totalCost = useMemo(() => {
    const base = selectedType.price * parseInt(duration);
    const tax = base * 0.18; // 18% GST/Tax
    return (base + tax).toFixed(2);
  }, [selectedType, duration]);

  const handleLaunchCampaign = async () => {
    if (!db || !user || !selectedSiteId) return;
    setIsProcessing(true);
    
    const selectedSite = mySites?.find(s => s.id === selectedSiteId);
    const promoId = `PRM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Automatic status logic: Active if start date is now or past, else Scheduled.
    // Given the user wants "automatic", we'll default to 'active' or 'scheduled'.
    const start = new Date(startDate);
    const now = new Date();
    const initialStatus = start <= now ? "active" : "scheduled";

    const promoData = {
      promoId,
      userId: user.uid,
      userEmail: user.email,
      websiteId: selectedSiteId,
      websiteUrl: selectedSite?.url || "",
      websiteName: selectedSite?.url.replace('https://', '').split('/')[0] || "Unknown Site",
      type: selectedType.id,
      placement: selectedType.name,
      startDate: start.toISOString(),
      duration: parseInt(duration),
      cost: parseFloat(totalCost),
      status: initialStatus,
      paymentMethod,
      createdAt: serverTimestamp()
    };

    addDoc(collection(db, "promotions"), promoData)
      .then(() => {
        toast({ title: "Campaign Launched", description: `Your promotion is now ${initialStatus}.` });
        setIsProcessing(false);
        setMode('list');
        setStep(1);
      })
      .catch((e) => {
        setIsProcessing(false);
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
    updateDoc(promoRef, { status: 'cancelled' }).then(() => {
      toast({ title: "Cancelled", description: "Campaign removal complete." });
    });
  };

  const handleLogout = async () => {
    if (auth) { await signOut(auth); router.push("/"); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-10 px-2">
         <Link href="/" className="group block">
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl font-black italic uppercase tracking-tighter block leading-none text-white">Bessites</span>
              <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60 mt-1 block">Creator Studio</span>
            </div>
         </Link>
      </div>
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

        {mode === 'list' ? (
          <div className="p-4 sm:p-8 md:p-12 space-y-12 animate-in fade-in duration-500">
            <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/5 p-10 sm:p-16 rounded-[4rem] relative overflow-hidden shadow-2xl group">
               <div className="relative z-10 space-y-6">
                  <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1 italic">🚀 Automatic Discovery Boost</Badge>
                  <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Reach More <span className="text-primary">Curators.</span></h2>
                  <p className="text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed">Promotions are now instant. Select a site, pick a schedule, and go live immediately.</p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                     <Button onClick={() => setMode('create')} className="h-14 px-10 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs italic hover:scale-105 transition-all shadow-xl">Create New Promotion</Button>
                     <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/5 px-6 h-14">
                        <Wallet className="w-4 h-4 text-primary" />
                        <div className="text-left"><p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Billing Balance</p><p className="text-sm font-black italic text-white">${stats.totalSpend.toLocaleString()}</p></div>
                     </div>
                  </div>
               </div>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
               <PromoStat label="Active Promos" value={stats.active} icon={Rocket} color="text-sky-500" />
               <PromoStat label="Scheduled" value={stats.scheduled} icon={Clock} color="text-amber-500" />
               <PromoStat label="Avg. Conversion" value="11.4%" icon={TrendingUp} color="text-emerald-400" />
               <PromoStat label="Reach Pulse" value="2.1M" icon={Globe} color="text-indigo-400" />
            </div>

            <Tabs defaultValue="all" className="w-full">
              <div className="bg-[#121117] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
                 <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Campaign Ledger</h3>
                    <TabsList className="bg-white/5 rounded-2xl p-1 h-auto">
                       <TabsTrigger value="all" className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest">All</TabsTrigger>
                       <TabsTrigger value="active" className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest">Active</TabsTrigger>
                       <TabsTrigger value="scheduled" className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest">Scheduled</TabsTrigger>
                    </TabsList>
                 </div>
                 
                 <TabsContent value="all" className="m-0">
                    <div className="overflow-x-auto no-scrollbar">
                       <table className="w-full text-left min-w-[1000px]">
                          <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40"><tr><th className="p-8">Promoted Property</th><th className="p-8">Placement</th><th className="p-8">Duration</th><th className="p-8">Cost</th><th className="p-8 text-center">Status</th><th className="p-8 text-right">Operations</th></tr></thead>
                          <tbody className="divide-y divide-white/5">
                             {promosLoading ? (
                               <tr><td colSpan={6} className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                             ) : promotions && promotions.length > 0 ? (
                               promotions.map(promo => (
                                 <tr key={promo.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-8">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0 shadow-lg">
                                             <WebsitePreview websiteUrl={promo.websiteUrl} alt="Logo" className="w-full h-full" />
                                          </div>
                                          <div className="min-w-0">
                                             <p className="text-sm font-black italic tracking-tighter text-white truncate">{promo.websiteName}</p>
                                             <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40">ID: {promo.promoId}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="p-8">
                                       <div className="flex items-center gap-2">
                                          <div className={cn("p-2 rounded-lg bg-white/5", PROMO_TYPES.find(t => t.id === promo.type)?.color)}><Flame className="w-3.5 h-3.5" /></div>
                                          <span className="text-[10px] font-black uppercase text-white/60">{promo.placement}</span>
                                       </div>
                                    </td>
                                    <td className="p-8 text-sm font-bold text-white">{promo.duration} Days</td>
                                    <td className="p-8 text-sm font-black italic text-primary">${promo.cost.toFixed(2)}</td>
                                    <td className="p-8 text-center">
                                       <Badge className={cn("uppercase text-[8px] font-black border-none px-4 py-1.5 rounded-full shadow-lg", 
                                          promo.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : 
                                          promo.status === 'scheduled' ? "bg-blue-500/10 text-blue-400" : 
                                          promo.status === 'cancelled' ? "bg-red-500/10 text-red-400" : "bg-white/5 text-muted-foreground/40")}>
                                          {promo.status}
                                       </Badge>
                                    </td>
                                    <td className="p-8 text-right">
                                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button size="icon" variant="ghost" className="w-10 h-10 rounded-xl hover:bg-white/10"><Download className="w-4 h-4" /></Button>
                                          <Button onClick={() => handleCancelPromo(promo.id)} variant="ghost" className="text-[9px] font-black uppercase text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-xl px-4 py-2">Cancel</Button>
                                       </div>
                                    </td>
                                 </tr>
                               ))
                             ) : (
                               <tr><td colSpan={6} className="p-32 text-center text-muted-foreground italic font-medium opacity-20">The promotion ledger is empty. Launch your first campaign.</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </TabsContent>
              </div>
            </Tabs>
          </div>
        ) : (
          <div className="p-4 sm:p-8 md:p-12 max-w-4xl mx-auto w-full animate-in slide-in-from-right-4 duration-500">
             <div className="mb-12 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setMode('list')} className="text-muted-foreground hover:text-white gap-2 font-bold"><ChevronLeft className="w-5 h-5" /> Exit Designer</Button>
                <div className="flex items-center gap-3">
                   {[1, 2, 3, 4, 5].map(s => (
                     <div key={s} className={cn("w-10 h-1.5 rounded-full transition-all duration-500", s <= step ? "bg-primary" : "bg-white/5")} />
                   ))}
                </div>
             </div>

             {step === 1 && (
               <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black italic uppercase tracking-tighter">Step 1: Choose <span className="text-primary">Target</span></h2>
                     <p className="text-muted-foreground font-medium">Select the website you want to promote across the Bessites ecosystem.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {mySites?.map(site => (
                       <Card 
                        key={site.id} 
                        onClick={() => setSelectedSiteId(site.id)}
                        className={cn("p-6 rounded-[2.5rem] bg-[#121117] border-2 cursor-pointer transition-all duration-300 group hover:scale-[1.02]", 
                        selectedSiteId === site.id ? "border-primary shadow-2xl shadow-primary/20" : "border-white/5 hover:border-white/20")}
                       >
                          <div className="flex items-center gap-5">
                             <div className="w-16 h-16 rounded-2xl bg-black overflow-hidden border border-white/10 group-hover:scale-110 transition-transform shadow-xl"><WebsitePreview websiteUrl={site.url} alt={site.url} className="w-full h-full" /></div>
                             <div className="min-w-0">
                                <p className="text-lg font-black italic tracking-tighter text-white truncate">{site.url.replace('https://', '').split('/')[0]}</p>
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">{site.categories?.[0]}</p>
                             </div>
                          </div>
                       </Card>
                     ))}
                     {(!mySites || mySites.length === 0) && (
                        <div className="col-span-2 p-12 text-center bg-white/5 rounded-[2.5rem] border border-white/5">
                           <Globe className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                           <p className="text-muted-foreground italic font-medium">You need an approved website to create a promotion.</p>
                        </div>
                     )}
                  </div>
                  <Button onClick={handleNext} disabled={!selectedSiteId} className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl glow-primary">CONTINUE TO PLACEMENT <ArrowRight className="w-5 h-5 ml-2" /></Button>
               </div>
             )}

             {step === 2 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black italic uppercase tracking-tighter">Step 2: Promotion <span className="text-primary">Strategy</span></h2>
                     <p className="text-muted-foreground font-medium">Choose where your website will be featured for maximum discovery.</p>
                  </div>
                  <div className="space-y-4">
                     {PROMO_TYPES.map(type => (
                       <Card 
                        key={type.id} 
                        onClick={() => setSelectedType(type)}
                        className={cn("p-8 rounded-[3rem] bg-[#121117] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group", 
                        selectedType.id === type.id ? "border-primary shadow-2xl shadow-primary/20" : "border-white/5 hover:border-white/10")}
                       >
                          <div className="absolute top-0 right-0 p-8">
                             <div className={cn("text-3xl font-black italic tracking-tighter", type.color)}>${type.price}<span className="text-xs font-bold text-muted-foreground/40 uppercase">/Day</span></div>
                          </div>
                          <div className="flex items-start gap-8 relative z-10">
                             <div className={cn("p-5 rounded-[2rem] bg-white/5 shadow-inner group-hover:scale-110 transition-transform", type.color)}><type.icon className="w-8 h-8" /></div>
                             <div className="space-y-1 pr-24">
                                <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">{type.name}</h4>
                                <p className="text-muted-foreground text-sm font-medium leading-relaxed">{type.desc}</p>
                                <div className="flex items-center gap-4 mt-4">
                                   <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1 font-black uppercase text-[8px]">{type.reach} Est. Reach</Badge>
                                   <Badge className="bg-primary/10 text-primary border-none px-3 py-1 font-black uppercase text-[8px]">High conversion</Badge>
                                </div>
                             </div>
                          </div>
                       </Card>
                     ))}
                  </div>
                  <div className="flex gap-4">
                     <Button variant="outline" onClick={handleBack} className="h-16 flex-1 rounded-3xl border-white/5 bg-white/5 font-black uppercase tracking-widest text-xs italic">Go Back</Button>
                     <Button onClick={handleNext} className="h-16 flex-[2] rounded-3xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl glow-primary">DESIGN SCHEDULE <ArrowRight className="w-5 h-5 ml-2" /></Button>
                  </div>
               </div>
             )}

             {step === 3 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black italic uppercase tracking-tighter">Step 3: Campaign <span className="text-primary">Schedule</span></h2>
                     <p className="text-muted-foreground font-medium">Define exactly when your promotion starts and how long it lasts.</p>
                  </div>
                  <Card className="bg-[#121117] border-white/5 p-10 rounded-[3rem] space-y-10 shadow-2xl">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-40">Start Date & Time</label>
                           <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                              <Input 
                                type="datetime-local" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-xs font-black uppercase" 
                              />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-40">Campaign Duration</label>
                           <div className="grid grid-cols-3 gap-2">
                              {['1', '3', '7', '30'].map(d => (
                                <button 
                                 key={d} 
                                 onClick={() => setDuration(d)}
                                 className={cn("h-14 rounded-2xl font-black text-xs transition-all", 
                                 duration === d ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" : "bg-white/5 text-muted-foreground hover:bg-white/10")}
                                >{d} DAYS</button>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="p-4 rounded-2xl bg-primary/10 text-primary shadow-inner"><ShieldCheck className="w-6 h-6" /></div>
                           <div>
                              <p className="text-sm font-black italic tracking-tighter text-white">Instant Automatic Launch</p>
                              <p className="text-[10px] font-black uppercase text-muted-foreground/40">No admin review required.</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-black uppercase text-muted-foreground/30 mb-1">Estimated Impressions</p>
                           <p className="text-2xl font-black italic text-primary">~{(parseInt(duration) * 8500).toLocaleString()}</p>
                        </div>
                     </div>
                  </Card>
                  <div className="flex gap-4">
                     <Button variant="outline" onClick={handleBack} className="h-16 flex-1 rounded-3xl border-white/5 bg-white/5 font-black uppercase tracking-widest text-xs italic">Back</Button>
                     <Button onClick={handleNext} disabled={!startDate} className="h-16 flex-[2] rounded-3xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl glow-primary">REVIEW ORDER SUMMARY <ArrowRight className="w-5 h-5 ml-2" /></Button>
                  </div>
               </div>
             )}

             {step === 4 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black italic uppercase tracking-tighter">Step 4: Order <span className="text-primary">Summary</span></h2>
                     <p className="text-muted-foreground font-medium">Verify all campaign details before proceeding to instant activation.</p>
                  </div>
                  <Card className="bg-[#121117] border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
                     <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                        <div className="flex items-center justify-between mb-10">
                           <h3 className="text-xl font-black italic uppercase tracking-tighter">Campaign Configuration</h3>
                           <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] italic shadow-xl">Automated Pipeline</Badge>
                        </div>
                        <div className="space-y-6">
                           <SummaryRow label="Promoted Asset" value={mySites?.find(s => s.id === selectedSiteId)?.url.replace('https://', '')} />
                           <SummaryRow label="Placement Tier" value={selectedType.name} />
                           <SummaryRow label="Campaign Duration" value={`${duration} Days`} />
                           <SummaryRow label="Start Window" value={new Date(startDate).toLocaleString()} />
                        </div>
                     </div>
                     <div className="p-10 bg-white/[0.03] space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground"><span>Base Price</span><span className="text-white font-black">${(selectedType.price * parseInt(duration)).toFixed(2)}</span></div>
                        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground"><span>Platform Taxes (18%)</span><span className="text-white font-black">${(selectedType.price * parseInt(duration) * 0.18).toFixed(2)}</span></div>
                        <div className="h-px bg-white/10 my-4" />
                        <div className="flex justify-between items-center"><span className="text-xl font-black italic uppercase tracking-tighter text-white">Grand Total</span><span className="text-4xl font-black italic text-primary">${totalCost}</span></div>
                     </div>
                  </Card>
                  <div className="flex gap-4">
                     <Button variant="outline" onClick={handleBack} className="h-16 flex-1 rounded-3xl border-white/5 bg-white/5 font-black uppercase tracking-widest text-xs italic">Modify Order</Button>
                     <Button onClick={handleNext} className="h-16 flex-[2] rounded-3xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl glow-primary">PROCEED TO ACTIVATION <ArrowRight className="w-5 h-5 ml-2" /></Button>
                  </div>
               </div>
             )}

             {step === 5 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black italic uppercase tracking-tighter">Step 5: Finalize <span className="text-primary">Activation</span></h2>
                     <p className="text-muted-foreground font-medium">Bessites uses end-to-end encryption for all discovery transactions. Your campaign will go live instantly.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="md:col-span-2 space-y-6">
                        <Card className="bg-[#121117] border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-8">
                           <div className="space-y-6">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Choose Payment Method</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <PaymentOption id="card" label="Credit / Debit Card" icon={CreditCard} active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} />
                                 <PaymentOption id="upi" label="UPI (Google Pay / PhonePe)" icon={Smartphone} active={paymentMethod === 'upi'} onClick={() => setPaymentMethod('upi')} />
                                 <PaymentOption id="bank" label="Net Banking" icon={Building2} active={paymentMethod === 'bank'} onClick={() => setPaymentMethod('bank')} />
                                 <PaymentOption id="wallet" label="Digital Wallets" icon={Wallet} active={paymentMethod === 'wallet'} onClick={() => setPaymentMethod('wallet')} />
                              </div>
                           </div>
                           
                           {paymentMethod === 'card' && (
                             <div className="space-y-6 pt-6 border-t border-white/5 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase text-muted-foreground/40">Cardholder Name</label>
                                   <Input placeholder="HARIOM CHAVALE" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black uppercase text-xs" />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase text-muted-foreground/40">Card Number</label>
                                   <Input placeholder="**** **** **** 4242" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-xs" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-muted-foreground/40">Expiry Date</label><Input placeholder="MM/YY" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-xs" /></div>
                                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-muted-foreground/40">CVC</label><Input placeholder="***" type="password" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-xs" /></div>
                                </div>
                             </div>
                           )}
                        </Card>
                     </div>
                     <div className="space-y-6">
                        <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-xl space-y-6">
                           <h4 className="text-lg font-black italic uppercase tracking-tighter text-white">Billing Total</h4>
                           <div className="flex justify-between items-center text-sm font-bold text-muted-foreground"><span>Campaign Cost</span><span className="text-white font-black">${totalCost}</span></div>
                           <div className="flex justify-between items-center text-sm font-bold text-muted-foreground"><span>Platform Fee</span><span className="text-emerald-400 font-black">WAIVED</span></div>
                           <div className="h-px bg-white/10 my-2" />
                           <div className="space-y-1"><p className="text-[9px] font-black uppercase text-muted-foreground/40">Payable amount</p><p className="text-4xl font-black italic text-primary">${totalCost}</p></div>
                        </Card>
                        <Button 
                          onClick={handleLaunchCampaign} 
                          disabled={isProcessing}
                          className="w-full h-20 rounded-[2.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-2xl transition-all hover:scale-[1.02]"
                        >
                           {isProcessing ? <Loader2 className="animate-spin w-8 h-8" /> : "LAUNCH INSTANTLY"}
                        </Button>
                        <p className="text-[10px] text-center font-bold text-muted-foreground/40 uppercase tracking-widest px-4 leading-relaxed">Activation is automatic. No further review required.</p>
                     </div>
                  </div>
               </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string, value: string | undefined }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">{label}</span>
      <span className="text-sm font-black italic text-white text-right truncate max-w-[240px]">{value || '---'}</span>
    </div>
  );
}

function PaymentOption({ id, label, icon: Icon, active, onClick }: { id: string, label: string, icon: any, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn("flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-3 group", 
      active ? "border-primary bg-primary/5 shadow-xl" : "border-white/5 hover:border-white/10")}
    >
      <Icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground/40")} />
      <span className={cn("text-[9px] font-black uppercase tracking-widest", active ? "text-white" : "text-muted-foreground/30")}>{label}</span>
    </button>
  );
}

function PromoStat({ label, value, icon: Icon, trend, color = "text-white" }: { label: string, value: string | number, icon: any, trend?: string, color?: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-5 rounded-[2.5rem] shadow-xl group hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between cursor-default">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] blur-3xl -mr-12 -mt-12" />
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="p-3 rounded-2xl bg-white/5"><Icon className={cn("w-5 h-5", color)} /></div>
        {trend && <div className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{trend}</div>}
      </div>
      <div className="relative z-10"><p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1 leading-tight">{label}</p><h4 className="text-2xl font-black italic tracking-tighter text-white leading-none tabular-nums">{value}</h4></div>
    </Card>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all relative overflow-hidden group text-left", active ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" : "text-muted-foreground/60 hover:text-white hover:bg-white/5")}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(123,51,255,1)]" />}
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-primary" : "group-hover:text-white")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}
