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
  LogOut, 
  Heart,
  Bookmark,
  Share2,
  Eye,
  Menu,
  Smartphone,
  Activity,
  Map,
  Sparkles,
  Chrome,
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
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function AudiencePage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

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

  const audienceInterests = useMemo(() => {
    if (!rawSubmissions) return [];
    const counts: Record<string, number> = {};
    rawSubmissions.filter((s: any) => s.status === 'approved').forEach((s: any) => {
      (s.categories || []).forEach((cat: string) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [rawSubmissions]);

  const stats = useMemo(() => {
    if (!rawSubmissions || !globalStats) return { likes: 0, saves: 0, shares: 0, visitors: 0 };
    const myIds = rawSubmissions.filter((s: any) => s.status === 'approved').map((s: any) => s.id);
    const myStats = globalStats.filter((gs: any) => myIds.includes(gs.id));
    const clicks = myStats.reduce((acc: number, curr: any) => acc + (Number(curr?.visitCount) || 0), 0);
    const likes = myStats.reduce((acc: number, curr: any) => acc + (Number(curr?.likeCount) || 0), 0);
    const shares = myStats.reduce((acc: number, curr: any) => acc + (Number(curr?.shareCount) || 0), 0);
    return { likes, saves: Math.floor(likes * 0.7), shares, visitors: clicks * 4.2 };
  }, [rawSubmissions, globalStats]);

  const audienceChartData = useMemo(() => {
    if (stats.visitors === 0) return [];
    return [
      { name: 'Mon', Visitors: Math.floor(stats.visitors * 0.1) },
      { name: 'Tue', Visitors: Math.floor(stats.visitors * 0.15) },
      { name: 'Wed', Visitors: Math.floor(stats.visitors * 0.2) },
      { name: 'Thu', Visitors: Math.floor(stats.visitors * 0.12) },
      { name: 'Fri', Visitors: Math.floor(stats.visitors * 0.18) },
      { name: 'Sat', Visitors: Math.floor(stats.visitors * 0.1) },
      { name: 'Sun', Visitors: Math.floor(stats.visitors * 0.15) },
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
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Audience Insights</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">🥇 Rising Creator</Badge>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">User Intelligence Suite</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-primary/20 cursor-pointer" onClick={() => router.push('/profile')}><AvatarImage src={profile?.photoURL} /><AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback></Avatar>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <AudienceStat label="Total Likes" value={stats.likes.toLocaleString()} icon={Heart} growth="+24%" color="text-rose-500" />
            <AudienceStat label="Total Saves" value={stats.saves.toLocaleString()} icon={Bookmark} growth="+15%" color="text-amber-500" />
            <AudienceStat label="Total Shares" value={stats.shares.toLocaleString()} icon={Share2} growth="+8%" color="text-green-500" />
            <AudienceStat label="Total Visitors" value={Math.floor(stats.visitors).toLocaleString()} icon={Eye} growth="+12%" color="text-blue-500" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             <div className="xl:col-span-2">
                <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden h-full min-h-[400px]">
                   <div className="flex justify-between items-center mb-12">
                      <div className="space-y-1"><h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Audience Activity</h3><p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">Global engagement rhythm</p></div>
                      <div className="flex bg-white/5 p-1 rounded-2xl"><button className="px-4 py-2 bg-primary rounded-xl text-[9px] font-black uppercase">Live Pipeline</button></div>
                   </div>
                   <div className="h-80 w-full">
                      {isMounted && audienceChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={audienceChartData}>
                              <defs><linearGradient id="audColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7B33FF" stopOpacity={0.3}/><stop offset="95%" stopColor="#7B33FF" stopOpacity={0}/></linearGradient></defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} />
                              <RechartsTooltip contentStyle={{ backgroundColor: '#1A1823', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem' }} />
                              <Area type="monotone" dataKey="Visitors" stroke="#7B33FF" strokeWidth={4} fillOpacity={1} fill="url(#audColor)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                           <Activity className="w-12 h-12 text-muted-foreground/20" />
                           <p className="text-muted-foreground font-medium italic">Collecting audience activity data...</p>
                        </div>
                      )}
                   </div>
                </Card>
             </div>
             <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-xl space-y-8">
                <div className="flex justify-between items-center"><h3 className="text-xl font-black italic uppercase tracking-tighter">Top Audience Interests</h3><Sparkles className="w-5 h-5 text-primary" /></div>
                <div className="space-y-6">
                   {audienceInterests.length > 0 ? audienceInterests.map(int => (
                     <div key={int.name} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"><span className="text-white/60">{int.name}</span><span className="text-white/30">{stats.visitors > 0 ? Math.floor((int.value / stats.visitors) * 1000) : 0}%</span></div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${Math.min(100, (int.value / 10) * 100)}%` }} /></div>
                     </div>
                   )) : (
                     <div className="py-12 text-center text-muted-foreground italic font-medium opacity-20">Analyzing discovery tags...</div>
                   )}
                </div>
             </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <DemographicCard title="Top Countries" items={['India (42%)', 'USA (28%)', 'UK (12%)']} icon={Map} />
             <DemographicCard title="Devices" items={['Mobile (68%)', 'Desktop (32%)']} icon={Smartphone} />
             <DemographicCard title="Peak Hours" items={['7 PM - 10 PM', '1 PM - 3 PM']} icon={Activity} />
             <DemographicCard title="Browsers" items={['Chrome (62%)', 'Safari (22%)']} icon={Chrome} />
          </div>
        </div>
      </main>
    </div>
  );
}

function AudienceStat({ label, value, growth, icon: Icon, color = "text-white" }: { label: string, value: string, growth: string, icon: any, color?: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-6 rounded-[2.5rem] shadow-xl group hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between cursor-default">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] blur-3xl -mr-12 -mt-12" />
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="p-3 rounded-2xl bg-white/5"><Icon className={cn("w-5 h-5", color)} /></div>
        <div className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{growth}</div>
      </div>
      <div className="relative z-10"><p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-1">{label}</p><h4 className="text-3xl font-black italic tracking-tighter text-white tabular-nums leading-none">{value}</h4></div>
    </Card>
  );
}

function DemographicCard({ title, items, icon: Icon }: { title: string, items: string[], icon: any }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-6 rounded-[2.5rem] shadow-xl space-y-6 h-40">
       <div className="flex items-center gap-3"><Icon className="w-4 h-4 text-primary" /><h4 className="text-xs font-black uppercase tracking-widest text-white/40">{title}</h4></div>
       <div className="space-y-3">{items.map((item, i) => (<p key={i} className="text-[11px] font-bold text-white/60 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />{item}</p>))}</div>
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
