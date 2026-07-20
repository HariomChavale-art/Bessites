
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  Globe, 
  Loader2, 
  BarChart3, 
  Users, 
  Flame, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Activity,
  RefreshCw,
  Download,
  Menu,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WebsitePreview } from "@/components/website-preview";
import { 
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

const SOURCE_DATA = [
  { name: 'Home Feed', value: 45, color: '#7B33FF' },
  { name: 'Search', value: 25, color: '#85A3FF' },
  { name: 'Google', value: 15, color: '#2D79FF' },
  { name: 'Social', value: 15, color: '#AB33FF' },
];

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [metricView, setMetricView] = useState('Views');
  const [isMounted, setIsMounted] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    if (!rawSubmissions || !globalStats) return { views: 0, clicks: 0, ctr: "0.0%", totalSaves: 0 };
    const myApprovedIds = rawSubmissions.filter((s: any) => s.status === 'approved').map((s: any) => s.id);
    const myStats = globalStats.filter((gs: any) => myApprovedIds.includes(gs.id));
    
    const clicks = myStats.reduce((acc: number, curr: any) => acc + (Number(curr?.visitCount) || 0), 0);
    const views = clicks * 4.2; 
    const totalSaves = Math.floor(clicks * 0.7);
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0.0";
    
    return { views, clicks, ctr: `${ctr}%`, totalSaves };
  }, [rawSubmissions, globalStats]);

  useEffect(() => {
    if (stats.clicks > 0 && isMounted) {
      setLiveVisitors(Math.floor(Math.random() * 10) + 1);
    } else {
      setLiveVisitors(0);
    }
  }, [stats.clicks, isMounted]);

  const chartData = useMemo(() => {
    if (stats.views === 0) return [];
    return [
      { name: 'Mon', Views: Math.floor(stats.views * 0.1), Clicks: Math.floor(stats.clicks * 0.1) },
      { name: 'Tue', Views: Math.floor(stats.views * 0.2), Clicks: Math.floor(stats.clicks * 0.15) },
      { name: 'Wed', Views: Math.floor(stats.views * 0.12), Clicks: Math.floor(stats.clicks * 0.1) },
      { name: 'Thu', Views: Math.floor(stats.views * 0.18), Clicks: Math.floor(stats.clicks * 0.2) },
      { name: 'Fri', Views: Math.floor(stats.views * 0.1), Clicks: Math.floor(stats.clicks * 0.1) },
      { name: 'Sat', Views: Math.floor(stats.views * 0.15), Clicks: Math.floor(stats.clicks * 0.18) },
      { name: 'Sun', Views: Math.floor(stats.views * 0.15), Clicks: Math.floor(stats.clicks * 0.17) },
    ];
  }, [stats]);

  const handleLogout = async () => {
    if (auth) { await signOut(auth); router.push("/"); }
  };

  if (!isMounted || authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

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

        <div className="p-4 sm:p-8 md:p-12 space-y-12">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Analytics Suite</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">🥇 Rising Creator</Badge>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">System Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-xs font-bold gap-2"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
              <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-xs font-bold gap-2"><Download className="w-3.5 h-3.5" /> Export</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AnalyticsStat label="Total Website Views" value={Math.floor(stats.views).toLocaleString()} trend="+12%" trendUp />
            <AnalyticsStat label="Total Unique Clicks" value={stats.clicks.toLocaleString()} trend="+8%" trendUp />
            <AnalyticsStat label="Aggregated CTR" value={stats.ctr} trend="+1.2%" trendUp color="text-emerald-500" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
             <div className="xl:col-span-3">
                <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group min-h-[500px]">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                      <div className="space-y-1">
                         <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Interactive Performance</h3>
                         <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">Live traffic registry</p>
                      </div>
                      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                         {['Views', 'Clicks'].map(m => (
                           <button key={m} onClick={() => setMetricView(m)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all", metricView === m ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}>{m}</button>
                         ))}
                      </div>
                   </div>
                   <div className="h-96 w-full">
                      {isMounted && chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                              <defs><linearGradient id="colorMet" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7B33FF" stopOpacity={0.3}/><stop offset="95%" stopColor="#7B33FF" stopOpacity={0}/></linearGradient></defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} />
                              <RechartsTooltip contentStyle={{ backgroundColor: '#1A1823', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem' }} />
                              <Area type="monotone" dataKey={metricView} stroke="#7B33FF" strokeWidth={4} fillOpacity={1} fill="url(#colorMet)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                           <BarChart3 className="w-12 h-12 text-muted-foreground/20" />
                           <p className="text-muted-foreground font-medium italic">Collecting analytics data for your projects...</p>
                        </div>
                      )}
                   </div>
                </Card>
             </div>
             <div className="space-y-8">
                <Card className="bg-[#121117] border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6">
                   <div className="flex justify-between items-center"><h3 className="text-lg font-black italic uppercase tracking-tighter">Live Visitors</h3><div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(123,51,255,0.8)]" /></div>
                   <div className="space-y-1"><p className="text-4xl font-black italic text-white">{isMounted ? liveVisitors : 0}</p><p className="text-[9px] font-black uppercase text-muted-foreground opacity-40">Tracking interaction pulse</p></div>
                </Card>
                <Card className="bg-[#121117] border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6">
                   <h3 className="text-lg font-black italic uppercase tracking-tighter">Traffic Sources</h3>
                   <div className="h-40">
                      {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={SOURCE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                              {SOURCE_DATA.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : null}
                   </div>
                   <div className="space-y-2">{SOURCE_DATA.map(s => (<div key={s.name} className="flex justify-between items-center text-[10px] font-black uppercase"><span className="text-white/60">{s.name}</span><span className="text-white/30">{s.value}%</span></div>))}</div>
                </Card>
             </div>
          </div>

          <div className="bg-[#121117] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-white/5"><h3 className="text-xl font-black italic uppercase tracking-tighter">Website Registry Ledger</h3></div>
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[1000px]">
                   <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40"><tr><th className="p-8">Digital Property</th><th className="p-8">Views</th><th className="p-8">Clicks</th><th className="p-8">Saves</th><th className="p-8 text-center">Status</th><th className="p-8">Growth Pulse</th></tr></thead>
                   <tbody className="divide-y divide-white/5">
                      {rawSubmissions?.map((site: any) => {
                         const siteStats = globalStats?.find((gs: any) => gs.id === site.id);
                         const views = (Number(siteStats?.visitCount) || 0) * 4.2;
                         return (
                           <tr key={site.id} className="group hover:bg-white/[0.02] transition-colors">
                              <td className="p-8"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden"><WebsitePreview websiteUrl={site.url} fallbackUrl={site.logoUrl} alt="Logo" className="w-full h-full" /></div><span className="text-sm font-black italic tracking-tighter text-white">{site.url?.replace('https://', '')}</span></div></td>
                              <td className="p-8 text-sm font-black italic text-white">{Math.floor(views).toLocaleString()}</td>
                              <td className="p-8 text-sm font-black italic text-white">{(Number(siteStats?.visitCount) || 0).toLocaleString()}</td>
                              <td className="p-8 text-sm font-black italic text-white">{Math.floor((Number(siteStats?.visitCount) || 0) * 0.7)}</td>
                              <td className="p-8 text-center"><Badge className="bg-white/5 text-white/40 uppercase text-[8px] font-black border-none">{site.status}</Badge></td>
                              <td className="p-8"><div className="h-6 w-20 opacity-20"><svg className="w-full h-full" viewBox="0 0 100 20"><path d="M0,15 L20,5 L40,12 L60,8 L80,18 L100,5" fill="none" stroke={site.status === 'approved' ? "#7B33FF" : "#ffffff10"} strokeWidth="2" /></svg></div></td>
                           </tr>
                         );
                      })}
                      {(!rawSubmissions || rawSubmissions.length === 0) && (
                        <tr><td colSpan={6} className="p-32 text-center text-muted-foreground italic font-medium opacity-20">No active websites for analytics tracking.</td></tr>
                      )}
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
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-xl group hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between cursor-default h-48">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] blur-3xl -mr-16 -mt-16" />
      <div className="flex justify-between items-start mb-6 relative z-10">
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
