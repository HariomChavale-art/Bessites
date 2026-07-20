
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, query, where, doc, addDoc, serverTimestamp, orderBy, updateDoc, increment } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  Globe, 
  Loader2, 
  BarChart3, 
  Users, 
  Flame, 
  Plus,
  TrendingUp,
  ChevronRight,
  Menu,
  Rocket,
  Zap,
  Wallet,
  Check,
  X,
  Settings,
  HelpCircle,
  ChevronLeft,
  Calendar,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Download,
  ArrowRight,
  Star,
  Search,
  MousePointer2,
  Bookmark,
  Heart,
  Eye,
  Globe2,
  ReceiptText,
  LogOut,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WebsitePreview } from "@/components/website-preview";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const CAMPAIGN_OBJECTIVES = [
  { id: 'visits', name: 'Website Visits', desc: 'Direct high-intent users to your URL.', icon: MousePointer2, color: 'text-blue-400' },
  { id: 'visibility', name: 'Increase Visibility', desc: 'Maximize impressions across the home feed.', icon: Eye, color: 'text-purple-400' },
  { id: 'saves', name: 'Increase Saves', desc: 'Get more users to bookmark your project.', icon: Bookmark, color: 'text-amber-400' },
  { id: 'likes', name: 'Increase Likes', desc: 'Boost social proof and trending rank.', icon: Heart, color: 'text-rose-400' },
  { id: 'launch', name: 'New Launch', desc: 'Massive blast for a brand new product.', icon: Rocket, color: 'text-emerald-400' },
];

const PLACEMENT_OPTIONS = [
  { id: 'homepage', name: 'Homepage Featured', price: 15, reach: '50k+', desc: 'Prime placement on the main discovery feed.', icon: Star, color: 'text-amber-400' },
  { id: 'trending', name: 'Trending Section', price: 12, reach: '30k+', desc: 'Boost your rank in the community charts.', icon: TrendingUp, color: 'text-primary' },
  { id: 'category', name: 'Category Featured', price: 10, reach: '20k+', desc: 'Target niche audiences in your category.', icon: Globe, color: 'text-blue-400' },
  { id: 'search', name: 'Search Boost', price: 8, reach: '15k+', desc: 'Rank #1 for relevant discovery queries.', icon: Search, color: 'text-emerald-400' },
  { id: 'staff', name: 'Staff Picks', price: 20, reach: '100k+', desc: 'The highest tier of professional curation.', icon: Zap, color: 'text-purple-400' },
];

export default function PromotionsPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [mode, setMode] = useState<'list' | 'create' | 'success'>('list');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Campaign State
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [objective, setObjective] = useState(CAMPAIGN_OBJECTIVES[0]);
  const [placement, setPlacement] = useState(PLACEMENT_OPTIONS[0]);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("7");
  const [dailyBudget, setDailyBudget] = useState("10");
  const [lastOrderId, setLastOrderId] = useState("");

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
    return query(collection(db, "promotions"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
  }, [user, db]);
  const { data: promotions, loading: promosLoading } = useCollection(promosRef);

  const basePrice = useMemo(() => {
    return placement.price * parseInt(duration);
  }, [placement, duration]);

  const taxAmount = useMemo(() => basePrice * 0.18, [basePrice]);
  const finalTotal = useMemo(() => basePrice + taxAmount, [basePrice, taxAmount]);

  const hasInsufficientBalance = useMemo(() => {
    return (profile?.walletBalance || 0) < finalTotal;
  }, [profile, finalTotal]);

  const handleLaunchCampaign = async () => {
    if (!db || !user || !selectedSiteId || hasInsufficientBalance) return;
    setIsProcessing(true);
    
    const selectedSite = mySites?.find(s => s.id === selectedSiteId);
    const promoId = `CAM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;

    const promoData = {
      promoId,
      orderId,
      userId: user.uid,
      userEmail: user.email,
      websiteId: selectedSiteId,
      websiteUrl: selectedSite?.url || "",
      websiteName: selectedSite?.url.replace('https://', '').split('/')[0] || "Target Asset",
      objective: objective.id,
      placement: placement.name,
      startDate: startDate || new Date().toISOString(),
      endDate: new Date(Date.now() + parseInt(duration) * 86400000).toISOString(),
      duration: parseInt(duration),
      dailyBudget: parseFloat(dailyBudget),
      cost: finalTotal,
      currency: 'USD',
      status: 'active',
      createdAt: serverTimestamp()
    };

    const transactionData = {
      userId: user.uid,
      type: 'spend',
      amount: finalTotal,
      currency: 'USD',
      description: `Promotion: ${placement.name} for ${promoData.websiteName}`,
      status: 'completed',
      method: 'wallet',
      orderId,
      timestamp: serverTimestamp()
    };

    try {
      const userRef = doc(db, "users", user.uid);
      const promoRef = collection(db, "promotions");
      const transRef = collection(db, "users", user.uid, "transactions");

      await updateDoc(userRef, {
        walletBalance: increment(-finalTotal)
      });

      await addDoc(promoRef, promoData);
      await addDoc(transRef, transactionData);

      setLastOrderId(orderId);
      setIsProcessing(false);
      setMode('success');
      setStep(1);
      toast({ title: "Campaign Launched!", description: "Funds deducted from your wallet." });
    } catch (e) {
      setIsProcessing(false);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'promotions',
        operation: 'create'
      }));
    }
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
        <SidebarItem icon={Wallet} label="Wallet" active={pathname === '/wallet'} onClick={() => router.push('/wallet')} />
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
                  <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1 italic">🥇 Global Ads Manager</Badge>
                  <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Global <span className="text-primary">Discovery.</span></h2>
                  <p className="text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed">Fund your wallet and boost your website across the Bessites network instantly.</p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                     <Button onClick={() => setMode('create')} className="h-14 px-10 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs italic hover:scale-105 transition-all shadow-xl">Start New Promotion</Button>
                     <Button variant="outline" onClick={() => router.push('/wallet')} className="h-14 px-10 rounded-full border-white/5 bg-white/5 font-black uppercase tracking-widest text-xs italic flex items-center gap-2"><Wallet className="w-4 h-4" /> Wallet Balance: ${(profile?.walletBalance || 0).toFixed(2)}</Button>
                  </div>
               </div>
            </Card>

            <div className="bg-[#121117] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
                 <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Campaign Registry</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground/40"><Globe2 className="w-3.5 h-3.5" /> Worldwide Reach Enabled</div>
                 </div>
                 
                 <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left min-w-[1000px]">
                       <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40"><tr><th className="p-8">Asset</th><th className="p-8">Goal</th><th className="p-8">Placement</th><th className="p-8">Reach</th><th className="p-8">Spend</th><th className="p-8 text-center">Status</th></tr></thead>
                       <tbody className="divide-y divide-white/5">
                          {promosLoading ? (
                             <tr><td colSpan={6} className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                          ) : promotions && promotions.length > 0 ? (
                             promotions.map(promo => (
                               <tr key={promo.id} className="group hover:bg-white/[0.02] transition-colors">
                                  <td className="p-8">
                                     <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden"><WebsitePreview websiteUrl={promo.websiteUrl} alt={promo.websiteName} className="w-full h-full" /></div>
                                        <div className="min-w-0"><p className="text-sm font-black italic text-white truncate">{promo.websiteName}</p><p className="text-[9px] text-muted-foreground font-black uppercase opacity-40">ID: {promo.promoId}</p></div>
                                     </div>
                                  </td>
                                  <td className="p-8"><span className="text-[10px] font-black uppercase text-primary">{promo.objective}</span></td>
                                  <td className="p-8"><span className="text-[10px] font-black uppercase text-white/60">{promo.placement}</span></td>
                                  <td className="p-8"><span className="text-sm font-bold text-white">~{(promo.duration * 12000).toLocaleString()}</span></td>
                                  <td className="p-8"><span className="text-sm font-black italic text-primary">${promo.cost?.toFixed(2)}</span></td>
                                  <td className="p-8 text-center"><Badge className={cn("uppercase text-[8px] font-black border-none px-4 py-1.5 rounded-full", promo.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground/40")}>{promo.status}</Badge></td>
                               </tr>
                             ))
                          ) : (
                             <tr><td colSpan={6} className="p-32 text-center text-muted-foreground italic font-medium opacity-20">No active campaigns. Start your global discovery journey.</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
            </div>
          </div>
        ) : mode === 'create' ? (
          <div className="p-4 sm:p-8 md:p-12 max-w-5xl mx-auto w-full animate-in slide-in-from-right-4 duration-500">
             <div className="mb-12 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setMode('list')} className="text-muted-foreground hover:text-white gap-2 font-bold"><ChevronLeft className="w-5 h-5" /> Exit Manager</Button>
                <div className="flex items-center gap-3">
                   {[1, 2, 3, 4, 5, 6, 7].map(s => (
                     <div key={s} className={cn("w-10 h-1.5 rounded-full transition-all duration-500", s <= step ? "bg-primary" : "bg-white/5")} />
                   ))}
                </div>
             </div>

             {step === 1 && (
               <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Select <span className="text-primary">Website</span></h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {mySites?.map(site => (
                       <Card key={site.id} onClick={() => setSelectedSiteId(site.id)} className={cn("p-6 rounded-[2.5rem] bg-[#121117] border-2 cursor-pointer transition-all", selectedSiteId === site.id ? "border-primary shadow-2xl" : "border-white/5")}>
                          <div className="flex items-center gap-5">
                             <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10"><WebsitePreview websiteUrl={site.url} alt={site.url} className="w-full h-full" /></div>
                             <div className="min-w-0"><p className="text-lg font-black italic text-white truncate">{site.url.replace('https://', '').split('/')[0]}</p><p className="text-xs font-bold text-primary uppercase">{site.categories?.[0]}</p></div>
                          </div>
                       </Card>
                     ))}
                  </div>
                  <Button onClick={() => setStep(2)} disabled={!selectedSiteId} className="w-full h-16 rounded-3xl bg-primary text-white font-black">CHOOSE OBJECTIVE <ArrowRight className="w-5 h-5 ml-2" /></Button>
               </div>
             )}

             {step === 2 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Campaign <span className="text-primary">Objective</span></h2>
                  <div className="grid grid-cols-1 gap-4">
                     {CAMPAIGN_OBJECTIVES.map(obj => (
                       <Card key={obj.id} onClick={() => setObjective(obj)} className={cn("p-8 rounded-[3rem] bg-[#121117] border-2 cursor-pointer transition-all flex items-center gap-8", objective.id === obj.id ? "border-primary" : "border-white/5")}>
                          <div className={cn("p-5 rounded-[2rem] bg-white/5", obj.color)}><obj.icon className="w-8 h-8" /></div>
                          <div className="space-y-1"><h4 className="text-xl font-black italic uppercase text-white">{obj.name}</h4><p className="text-muted-foreground text-sm font-medium">{obj.desc}</p></div>
                       </Card>
                     ))}
                  </div>
                  <div className="flex gap-4"><Button variant="outline" onClick={() => setStep(1)} className="h-16 flex-1 rounded-3xl">Back</Button><Button onClick={() => setStep(3)} className="h-16 flex-[2] rounded-3xl bg-primary text-white font-black">TARGETING <ArrowRight className="w-5 h-5 ml-2" /></Button></div>
               </div>
             )}

             {step === 3 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Global <span className="text-primary">Targeting</span></h2>
                  <Card className="bg-[#121117] border-white/5 p-10 rounded-[3rem] space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-muted-foreground/40">Geographic Coverage</label>
                          <div className="flex flex-wrap gap-2">
                             {['Worldwide', 'India', 'USA', 'Japan', 'Europe'].map(c => (<Badge key={c} className="bg-primary/20 text-primary border-none px-4 py-2 rounded-full">{c}</Badge>))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-muted-foreground/40">Interest Segments</label>
                          <div className="flex flex-wrap gap-2">
                             {['AI Enthusisasts', 'Tech Founders', 'Visual Designers'].map(i => (<Badge key={i} className="bg-white/5 text-white/60 border-none px-4 py-2 rounded-full">{i}</Badge>))}
                          </div>
                        </div>
                     </div>
                  </Card>
                  <div className="flex gap-4"><Button variant="outline" onClick={() => setStep(2)} className="h-16 flex-1 rounded-3xl">Back</Button><Button onClick={() => setStep(4)} className="h-16 flex-[2] rounded-3xl bg-primary text-white font-black">BUDGET & PERIOD <ArrowRight className="w-5 h-5 ml-2" /></Button></div>
               </div>
             )}

             {step === 4 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Period & <span className="text-primary">Budget</span></h2>
                  <Card className="bg-[#121117] border-white/5 p-10 rounded-[3rem] space-y-10">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-muted-foreground/40">Daily Spend (USD)</label>
                           <Input type="number" value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value)} className="h-16 bg-white/5 border-white/10 rounded-2xl text-xl font-black text-white" />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-muted-foreground/40">Campaign Duration</label>
                           <div className="grid grid-cols-3 gap-2">{['3', '7', '30'].map(d => (<button key={d} onClick={() => setDuration(d)} className={cn("h-16 rounded-2xl font-black text-xs transition-all", duration === d ? "bg-primary text-white" : "bg-white/5 text-muted-foreground")}>{d} DAYS</button>))}</div>
                        </div>
                     </div>
                  </Card>
                  <div className="flex gap-4"><Button variant="outline" onClick={() => setStep(3)} className="h-16 flex-1 rounded-3xl">Back</Button><Button onClick={() => setStep(5)} className="h-16 flex-[2] rounded-3xl bg-primary text-white font-black">CHOOSE PLACEMENT <ArrowRight className="w-5 h-5 ml-2" /></Button></div>
               </div>
             )}

             {step === 5 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Premium <span className="text-primary">Placement</span></h2>
                  <div className="space-y-4">
                     {PLACEMENT_OPTIONS.map(p => (
                       <Card key={p.id} onClick={() => setPlacement(p)} className={cn("p-8 rounded-[3rem] bg-[#121117] border-2 cursor-pointer transition-all flex items-center justify-between", placement.id === p.id ? "border-primary" : "border-white/5")}>
                          <div className="flex items-center gap-8"><div className={cn("p-4 rounded-2xl bg-white/5", p.color)}><p.icon className="w-6 h-6" /></div><div className="space-y-1"><h4 className="text-xl font-black italic uppercase text-white">{p.name}</h4><p className="text-muted-foreground text-xs font-medium">{p.desc}</p></div></div>
                          <div className="text-right"><p className="text-lg font-black text-primary">${p.price}<span className="text-[10px] uppercase opacity-40">/Day</span></p></div>
                       </Card>
                     ))}
                  </div>
                  <div className="flex gap-4"><Button variant="outline" onClick={() => setStep(4)} className="h-16 flex-1 rounded-3xl">Back</Button><Button onClick={() => setStep(6)} className="h-16 flex-[2] rounded-3xl bg-primary text-white font-black">FINAL REVIEW <ArrowRight className="w-5 h-5 ml-2" /></Button></div>
               </div>
             )}

             {step === 6 && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Final <span className="text-primary">Review</span></h2>
                  <Card className="bg-[#121117] border-white/5 rounded-[3.5rem] overflow-hidden">
                     <div className="p-10 border-b border-white/5 space-y-6">
                        <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-muted-foreground/30">Target Asset</span><span className="text-sm font-black italic text-white">{mySites?.find(s => s.id === selectedSiteId)?.url}</span></div>
                        <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-primary">{objective.name}</span></div>
                        <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-muted-foreground/30">Duration</span><span className="text-sm font-black italic text-white">{duration} Days</span></div>
                     </div>
                     <div className="p-10 bg-white/[0.03] flex justify-between items-center">
                        <div className="space-y-1"><span className="text-sm font-black italic uppercase text-white/40">Total Order Value</span><p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Incl. 18% Service Tax</p></div>
                        <span className="text-4xl font-black italic text-primary">${finalTotal.toFixed(2)}</span>
                     </div>
                  </Card>
                  
                  <Card className="bg-primary/10 border-primary/20 p-6 rounded-3xl flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/20 text-primary"><Wallet className="w-5 h-5" /></div>
                        <div><p className="text-[10px] font-black uppercase text-primary tracking-widest">Wallet Balance</p><p className="text-lg font-black italic text-white">${(profile?.walletBalance || 0).toFixed(2)}</p></div>
                     </div>
                     {hasInsufficientBalance && (
                        <Link href="/wallet/add-funds"><Button variant="outline" className="rounded-xl border-rose-500/20 text-rose-400 text-[10px] font-black uppercase">Refill Wallet</Button></Link>
                     )}
                  </Card>

                  {hasInsufficientBalance ? (
                    <div className="p-8 bg-rose-500/10 rounded-[2.5rem] border border-rose-500/20 flex items-center gap-6">
                       <AlertCircle className="w-8 h-8 text-rose-500 shrink-0" />
                       <div className="space-y-1"><h4 className="text-lg font-black italic uppercase text-rose-500">Insufficient balance</h4><p className="text-muted-foreground text-sm font-medium">Add funds to your wallet to activate this promotion.</p></div>
                       <Button onClick={() => router.push('/wallet/add-funds')} className="ml-auto bg-rose-500 text-white font-black text-xs uppercase px-8 h-12 rounded-xl shrink-0">ADD FUNDS</Button>
                    </div>
                  ) : (
                    <div className="flex gap-4"><Button variant="outline" onClick={() => setStep(5)} className="h-16 flex-1 rounded-3xl">Modify</Button><Button onClick={handleLaunchCampaign} disabled={isProcessing} className="h-16 flex-[2] rounded-3xl bg-emerald-500 hover:bg-emerald-600 text-white font-black">LAUNCH PROMOTION {isProcessing ? <Loader2 className="w-5 h-5 ml-2 animate-spin" /> : <Zap className="w-5 h-5 ml-2" />}</Button></div>
                  )}
               </div>
             )}
          </div>
        ) : (
          <div className="p-4 sm:p-8 md:p-12 flex items-center justify-center min-h-[calc(100vh-200px)] animate-in zoom-in duration-700">
             <Card className="bg-[#121117] border-white/5 p-12 sm:p-20 rounded-[4rem] max-w-2xl w-full text-center space-y-8 shadow-2xl shadow-primary/5">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                   <Check className="w-12 h-12 text-emerald-400" strokeWidth={4} />
                </div>
                <div className="space-y-2">
                   <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-white">Discovery Activated!</h2>
                   <p className="text-muted-foreground font-medium text-lg italic">Your campaign is now live across the platform.</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-4 text-left">
                   <div className="flex justify-between text-xs font-bold"><span className="text-muted-foreground uppercase opacity-40">Receipt No.</span><span className="text-white font-black">{lastOrderId}</span></div>
                   <div className="flex justify-between text-xs font-bold"><span className="text-muted-foreground uppercase opacity-40">Amount Deducted</span><span className="text-primary font-black">${finalTotal.toFixed(2)}</span></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <Button onClick={() => setMode('list')} className="h-16 flex-1 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-xs italic">Return to Studio</Button>
                   <Button variant="outline" className="h-16 flex-1 rounded-3xl border-white/5 bg-white/5 font-black uppercase tracking-widest text-xs italic gap-2"><Download className="w-4 h-4" /> Download Receipt</Button>
                </div>
             </Card>
          </div>
        )}
      </main>
    </div>
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
