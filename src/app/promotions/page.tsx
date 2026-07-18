'use client';

import { useMemo } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  Globe, 
  Loader2, 
  BarChart3, 
  Users, 
  Star, 
  Flame, 
  DollarSign, 
  Bell, 
  Mic, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Plus,
  Eye,
  MousePointer2,
  TrendingUp,
  Search as SearchIcon,
  ChevronRight,
  Menu,
  Rocket,
  Activity,
  Zap,
  Award,
  Wallet,
  Receipt,
  History,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WebsitePreview } from "@/components/website-preview";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const CHART_DATA = [
  { name: 'Mon', impressions: 5000, clicks: 400 },
  { name: 'Tue', impressions: 7200, clicks: 650 },
  { name: 'Wed', impressions: 4100, clicks: 320 },
  { name: 'Thu', impressions: 6400, clicks: 510 },
  { name: 'Fri', impressions: 3800, clicks: 280 },
  { name: 'Sat', impressions: 5900, clicks: 440 },
  { name: 'Sun', impressions: 8800, clicks: 820 },
];

const CAMPAIGN_DIST = [
  { name: 'Homepage Featured', value: 40, color: '#7B33FF' },
  { name: 'Trending Section', value: 25, color: '#85A3FF' },
  { name: 'Category Featured', value: 15, color: '#2D79FF' },
  { name: 'Search Results', value: 10, color: '#AB33FF' },
  { name: 'Editor\'s Choice', value: 10, color: '#00D1FF' },
];

export default function PromotionsPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);
  const { data: profile } = useDoc(userDocRef);

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
        <SidebarItem icon={Star} label="Reviews" active={pathname === '/reviews'} onClick={() => router.push('/reviews')} />
        <SidebarItem icon={Flame} label="Promotions" active={pathname === '/promotions'} onClick={() => router.push('/promotions')} />
        <SidebarItem icon={DollarSign} label="Earnings" active={pathname === '/earnings'} onClick={() => router.push('/earnings')} />
        <SidebarItem icon={Bell} label="Notifications" active={pathname === '/notifications'} onClick={() => router.push('/notifications')} />
        <SidebarItem icon={Mic} label="AI Assistant" active={pathname === '/ai-assistant'} onClick={() => router.push('/ai-assistant')} />
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
                   <div className="flex items-center gap-3 px-4 py-2 border-r border-white/10"><Wallet className="w-4 h-4 text-primary" /><div><p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Balance</p><p className="text-sm font-black italic text-white">$420.00</p></div></div>
                   <button className="p-3 text-muted-foreground hover:text-white transition-all"><Bell className="w-5 h-5" /></button>
                </div>
             </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
             <PromoStat label="Active Promos" value="3" icon={Rocket} color="text-sky-500" />
             <PromoStat label="Promo Clicks" value="14.2k" icon={MousePointer2} color="text-primary" trend="+18%" />
             <PromoStat label="Average CTR" value="11.4%" icon={TrendingUp} color="text-emerald-400" trend="+1.2%" />
             <PromoStat label="Budget Left" value="$420.00" icon={Wallet} color="text-amber-500" />
             <PromoStat label="Reach Est." value="2.1M" icon={Globe} color="text-indigo-400" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
             <div className="xl:col-span-3">
                <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl h-full">
                   <div className="flex justify-between items-center mb-12"><h3 className="text-2xl font-black italic uppercase tracking-tighter">Promotion Performance</h3><div className="flex bg-white/5 p-1 rounded-2xl"><button className="px-4 py-2 bg-primary rounded-xl text-[9px] font-black uppercase">30 Days</button></div></div>
                   <div className="h-96"><ResponsiveContainer width="100%" height="100%"><AreaChart data={CHART_DATA}><defs><linearGradient id="promoGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7B33FF" stopOpacity={0.3}/><stop offset="95%" stopColor="#7B33FF" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} /><RechartsTooltip contentStyle={{ backgroundColor: '#1A1823', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem' }} /><Area type="monotone" dataKey="impressions" stroke="#7B33FF" strokeWidth={4} fillOpacity={1} fill="url(#promoGrad)" /></AreaChart></ResponsiveContainer></div>
                </Card>
             </div>
             <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-xl space-y-8">
                <h3 className="text-lg font-black italic uppercase tracking-tighter">Campaign Distribution</h3>
                <div className="h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={CAMPAIGN_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={5} dataKey="value">{CAMPAIGN_DIST.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}</Pie><RechartsTooltip /></PieChart></ResponsiveContainer></div>
                <div className="space-y-4">{CAMPAIGN_DIST.map((s, i) => (<div key={i} className="flex justify-between items-center text-[10px] font-black uppercase"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-white/60">{s.name}</span></div><span className="text-white/30">{s.value}%</span></div>))}</div>
             </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             <Card className="xl:col-span-2 bg-gradient-to-br from-primary to-purple-800 border-none p-10 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0"><Rocket className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" /></div>
                <div className="flex-1 text-center md:text-left space-y-6"><h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Ready to Go <span className="underline decoration-white/40 underline-offset-8">Global?</span></h2><Button className="h-14 px-12 rounded-full bg-white text-black font-black uppercase tracking-widest text-sm italic hover:scale-105 transition-all">Create New Promotion</Button></div>
             </Card>
             <Card className="bg-[#121117] border-white/5 p-8 rounded-[3.5rem] shadow-xl space-y-8">
                <div className="flex justify-between items-center"><h3 className="text-xl font-black italic uppercase tracking-tighter">Billing Registry</h3><Receipt className="w-5 h-5 text-primary" /></div>
                <div className="space-y-4">{[{ date: 'Jun 02', name: 'Homepage Featured', val: '$450' }].map((bill, i) => (<div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5"><div className="text-[10px] font-black text-muted-foreground/30 uppercase">{bill.date}</div><div className="text-[11px] font-bold text-white/80">{bill.name}</div><span className="text-[11px] font-black italic text-white">{bill.val}</span></div>))}</div>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function PromoStat({ label, value, icon: Icon, trend, color = "text-white" }: { label: string, value: string, icon: any, trend?: string, color?: string }) {
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
