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
  Eye,
  MousePointer2,
  TrendingUp,
  Search as SearchIcon,
  ChevronRight,
  Menu,
  Check,
  X,
  History,
  Activity,
  Sparkles,
  PieChart as PieChartIcon
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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const CHART_DATA = [
  { name: 'Mon', views: 2400, clicks: 400, ctr: 12.5 },
  { name: 'Tue', views: 3000, clicks: 650, ctr: 14.2 },
  { name: 'Wed', views: 2000, clicks: 320, ctr: 11.0 },
  { name: 'Thu', views: 2780, clicks: 510, ctr: 13.5 },
  { name: 'Fri', views: 1890, clicks: 280, ctr: 10.2 },
  { name: 'Sat', views: 2390, clicks: 440, ctr: 12.8 },
  { name: 'Sun', views: 3490, clicks: 820, ctr: 15.6 },
];

const SOURCE_DATA = [
  { name: 'Home Feed', value: 45, color: '#7B33FF' },
  { name: 'Search', value: 25, color: '#85A3FF' },
  { name: 'Categories', value: 15, color: '#2D79FF' },
  { name: 'Recommendations', value: 10, color: '#AB33FF' },
  { name: 'Google', value: 3, color: '#FF5F56' },
  { name: 'Social', value: 2, color: '#FFBD2E' },
];

export default function AnalyticsPage() {
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

  const mySubmissionsRef = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "submissions"), where("userId", "==", user.uid));
  }, [user, db]);
  const { data: rawSubmissions } = useCollection(mySubmissionsRef);

  const websiteStatsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);
  const { data: globalStats } = useCollection(websiteStatsRef);

  const stats = useMemo(() => {
    if (!rawSubmissions || !globalStats) return { views: "0", clicks: "0", ctr: "0.0%" };
    const myApprovedIds = rawSubmissions.filter(s => s.status === 'approved').map(s => s.id);
    const myStats = globalStats.filter(gs => myApprovedIds.includes(gs.id));
    const totalClicks = myStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0);
    const totalViews = totalClicks * 4; 
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
    return { views: totalViews.toLocaleString(), clicks: totalClicks.toLocaleString(), ctr: `${ctr}%` };
  }, [rawSubmissions, globalStats]);

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
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Analytics Command Center</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">🥇 Rising Creator</Badge>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">Performance Overview</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-primary/20 cursor-pointer" onClick={() => router.push('/profile')}><AvatarImage src={profile?.photoURL} /><AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback></Avatar>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AnalyticsStat label="Total Website Views" value={stats.views} trend="+12.5%" trendUp />
            <AnalyticsStat label="Total Clicks" value={stats.clicks} trend="+8.4%" trendUp />
            <AnalyticsStat label="Current CTR" value={stats.ctr} trend="+1.2%" trendUp color="text-emerald-500" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
             <div className="xl:col-span-3">
                <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                      <div className="space-y-1">
                         <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Website Performance</h3>
                         <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">Interactive traffic stream</p>
                      </div>
                      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                         {['Today', '7D', '30D', '1Y', 'Life'].map(t => (
                           <button key={t} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all shrink-0", t === '30D' ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}>{t}</button>
                         ))}
                      </div>
                   </div>
                   <div className="h-96 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={CHART_DATA}>
                            <defs><linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7B33FF" stopOpacity={0.3}/><stop offset="95%" stopColor="#7B33FF" stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#1A1823', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem' }} />
                            <Area type="monotone" dataKey="views" stroke="#7B33FF" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </Card>
             </div>
             <div className="space-y-8">
                <Card className="bg-[#121117] border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6">
                   <div className="flex justify-between items-center"><h3 className="text-lg font-black italic uppercase tracking-tighter">Live Visitors</h3><div className="w-2 h-2 rounded-full bg-primary animate-pulse" /></div>
                   <div className="space-y-1"><p className="text-4xl font-black italic text-white">42</p><p className="text-[9px] font-black uppercase text-muted-foreground opacity-40">Peak: 124 (Today)</p></div>
                </Card>
                <Card className="bg-[#121117] border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6">
                   <h3 className="text-lg font-black italic uppercase tracking-tighter">Traffic Sources</h3>
                   <div className="h-40"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={SOURCE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">{SOURCE_DATA.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><RechartsTooltip /></PieChart></ResponsiveContainer></div>
                   <div className="space-y-2">{SOURCE_DATA.slice(0, 3).map(s => (<div key={s.name} className="flex justify-between items-center text-[10px] font-black uppercase"><span className="text-white/60">{s.name}</span><span className="text-white/30">{s.value}%</span></div>))}</div>
                </Card>
             </div>
          </div>

          <div className="bg-[#121117] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-white/5 flex justify-between items-center"><h3 className="text-xl font-black italic uppercase tracking-tighter">Website Registry Ledger</h3></div>
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[1000px]">
                   <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40"><tr><th className="p-8">Digital Property</th><th className="p-8">Views</th><th className="p-8">Clicks</th><th className="p-8">CTR</th><th className="p-8 text-center">Status</th><th className="p-8">Sparkline</th><th className="p-8 text-right">Actions</th></tr></thead>
                   <tbody className="divide-y divide-white/5">
                      {rawSubmissions?.map(site => {
                         const siteStats = globalStats?.find(gs => gs.id === site.id);
                         const views = (siteStats?.visitCount || 0) * 4;
                         return (
                           <tr key={site.id} className="group hover:bg-white/[0.02] transition-colors">
                              <td className="p-8"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden"><WebsitePreview websiteUrl={site.url} fallbackUrl={site.logoUrl} alt="Logo" className="w-full h-full" /></div><span className="text-sm font-black italic tracking-tighter text-white">{site.url.replace('https://', '')}</span></div></td>
                              <td className="p-8 text-sm font-black italic text-white">{views}</td>
                              <td className="p-8 text-sm font-black italic text-white">{siteStats?.visitCount || 0}</td>
                              <td className="p-8 text-sm font-black italic text-primary">{views > 0 ? (siteStats?.visitCount / views * 100).toFixed(1) : "0.0"}%</td>
                              <td className="p-8 text-center"><Badge className="bg-white/5 text-white/40 uppercase text-[8px] font-black border-none">{site.status}</Badge></td>
                              <td className="p-8"><div className="h-6 w-20 opacity-20"><svg className="w-full h-full" viewBox="0 0 100 20"><path d="M0,15 L20,5 L40,12 L60,8 L80,18 L100,5" fill="none" stroke="#7B33FF" strokeWidth="2" /></svg></div></td>
                              <td className="p-8 text-right"><button className="p-2 hover:bg-white/5 rounded-lg"><ChevronRight className="w-4 h-4 text-muted-foreground/40" /></button></td>
                           </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AnalyticsStat({ label, value, trend, trendUp, color = "text-white" }: { label: string, value: string, trend: string, trendUp: boolean, color?: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-xl group hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between cursor-default">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] blur-3xl -mr-16 -mt-16" />
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="p-4 rounded-2xl bg-white/5"><Activity className={cn("w-6 h-6", color)} /></div>
        <div className={cn("flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full", trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>{trend}</div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-1">{label}</p>
        <h4 className="text-4xl font-black italic tracking-tighter text-white tabular-nums leading-none">{value}</h4>
      </div>
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
