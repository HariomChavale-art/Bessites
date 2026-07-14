
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, doc, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  Check, 
  X, 
  Globe, 
  Loader2, 
  LayoutDashboard,
  BarChart3,
  Settings as SettingsIcon,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Search,
  Zap,
  Menu,
  Star,
  ExternalLink,
  ShieldCheck,
  Eye,
  LogOut,
  Settings,
  Bell,
  Heart,
  Bookmark,
  Plus,
  HelpCircle,
  MessageSquare,
  Trophy,
  PieChart,
  MousePointer2,
  Share2,
  Calendar,
  Mic,
  SearchIcon,
  ArrowRight,
  Users,
  Smartphone,
  Map,
  ZapIcon,
  ArrowUp,
  Flame,
  Award,
  Edit,
  Trash2,
  Image as ImageIcon,
  MoreVertical,
  Clock,
  ChevronLeft,
  ChevronDown,
  Layout,
  Filter,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { WebsitePreview } from "@/components/website-preview";

type DashboardView = 
  | 'overview' 
  | 'my-websites' 
  | 'analytics' 
  | 'audience' 
  | 'promotions' 
  | 'reviews' 
  | 'earnings' 
  | 'notifications' 
  | 'ai-assistant' 
  | 'settings' 
  | 'support';

export default function UserDashboard() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userDocRef);

  // Real Data Streams
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
    if (!rawSubmissions || !globalStats) return { 
      views: "0", clicks: "0", saves: "0", likes: "0", rating: "0.0", ctr: "0.0%", earnings: "$0.00", followers: "0",
      total: 0, approved: 0, pending: 0, rejected: 0
    };
    
    const myApproved = rawSubmissions.filter(s => s.status === 'approved');
    const myApprovedIds = myApproved.map(s => s.id);
    const myStats = globalStats.filter(gs => myApprovedIds.includes(gs.id));
    
    const totalClicks = myStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0);
    const totalLikes = myStats.reduce((acc, curr) => acc + (curr.likeCount || 0), 0);
    const ratingSum = myStats.reduce((acc, curr) => acc + (curr.ratingSum || 0), 0);
    const ratingCount = myStats.reduce((acc, curr) => acc + (curr.ratingCount || 0), 0);
    
    const totalViews = totalClicks * 4; 
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
    const avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : "0.0";

    return {
      views: totalViews.toLocaleString(),
      clicks: totalClicks.toLocaleString(),
      saves: Math.floor(totalLikes * 0.7).toLocaleString(),
      likes: totalLikes.toLocaleString(),
      rating: avgRating,
      ctr: `${ctr}%`,
      earnings: "$0.00",
      followers: "0",
      total: rawSubmissions.length,
      approved: rawSubmissions.filter(s => s.status === 'approved').length,
      pending: rawSubmissions.filter(s => s.status === 'pending').length,
      rejected: rawSubmissions.filter(s => s.status === 'rejected').length
    };
  }, [rawSubmissions, globalStats]);

  const filteredSubmissions = useMemo(() => {
    if (!rawSubmissions) return [];
    let list = [...rawSubmissions];
    if (statusFilter !== "all") {
      list = list.filter(s => s.status === statusFilter);
    }
    if (searchQuery) {
      list = list.filter(s => s.url.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [rawSubmissions, statusFilter, searchQuery]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, "submissions", id)).then(() => {
      toast({ title: "Website Deleted", description: "Your project has been removed." });
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white font-body selection:bg-primary/30 antialiased overflow-x-hidden flex flex-col lg:flex-row">
      
      {/* Premium Creator Sidebar */}
      <aside className="w-full lg:w-72 lg:h-screen lg:sticky lg:top-0 p-6 md:p-8 flex flex-col border-r border-white/5 bg-[#0D0C12] z-50">
        <div className="flex items-center gap-3 mb-10">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-all">
                <Zap className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black italic uppercase tracking-tighter block leading-none">Bessites</span>
                <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">Creator Studio</span>
              </div>
           </Link>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pb-10">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'overview'} onClick={() => setActiveView('overview')} />
          <SidebarItem icon={Globe} label="My Websites" active={activeView === 'my-websites'} onClick={() => setActiveView('my-websites')} />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
          <SidebarItem icon={Users} label="Audience" active={activeView === 'audience'} onClick={() => setActiveView('audience')} />
          <SidebarItem icon={Star} label="Reviews" active={activeView === 'reviews'} onClick={() => setActiveView('reviews')} />
          <SidebarItem icon={Flame} label="Promotions" active={activeView === 'promotions'} onClick={() => setActiveView('promotions')} />
          <SidebarItem icon={DollarSign} label="Earnings" active={activeView === 'earnings'} onClick={() => setActiveView('earnings')} />
          <SidebarItem icon={Bell} label="Notifications" active={activeView === 'notifications'} onClick={() => setActiveView('notifications')} badge={stats.pending > 0 ? stats.pending : undefined} />
          <SidebarItem icon={Mic} label="AI Assistant" active={activeView === 'ai-assistant'} onClick={() => setActiveView('ai-assistant')} />
          <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
            <SidebarItem icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
            <SidebarItem icon={HelpCircle} label="Support" active={activeView === 'support'} onClick={() => setActiveView('support')} />
          </div>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all group">
           <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
           <span className="text-sm font-bold">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col gap-8 md:gap-12 bg-[#0B0A0F]">
        
        {/* Top Command Bar */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 sticky top-0 bg-[#0B0A0F]/80 backdrop-blur-xl z-40 py-2 -mx-4 px-4 sm:-mx-8 sm:px-8">
          <div className="space-y-1">
             <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white">Welcome, {profile?.displayName?.split(' ')[0] || 'Curator'} 👋</h1>
             <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">🥇 Rising Creator</Badge>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">Creator Level 01</p>
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
             <div className="relative group w-full sm:w-96">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="Ask Bessites.ai for growth tips..." 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-xs font-medium focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:italic" 
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/20 rounded-xl hover:bg-primary/30 transition-colors"><Mic className="w-3.5 h-3.5 text-primary" /></button>
             </div>
             
             <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-auto sm:ml-0">
                <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-white transition-all relative">
                  <Bell className="w-5 h-5" />
                  {stats.pending > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-4 ring-[#0B0A0F]" />}
                </button>
                <Avatar className="w-11 h-11 ring-2 ring-primary/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/profile')}>
                  <AvatarImage src={profile?.photoURL} className="object-cover" />
                  <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
             </div>
          </div>
        </header>

        {activeView === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* ... keeping original overview ... */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               <div className="xl:col-span-2 relative h-[380px] sm:h-[450px] rounded-[3rem] overflow-hidden bg-gradient-to-br from-primary/20 to-purple-900/10 border border-white/10 group shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/creators/1200/800')] bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A0F] via-transparent to-transparent" />
                  
                  <div className="absolute bottom-10 left-10 right-10 flex flex-col sm:flex-row justify-between items-end gap-6">
                     <div className="space-y-3">
                        <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">Optimize<br /><span className="text-primary">Your Flow</span></h2>
                        <Button className="h-14 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs italic shadow-2xl hover:bg-primary hover:text-white transition-all">Start Promotion Now</Button>
                     </div>
                     <div className="flex bg-white/5 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 gap-8">
                        <HeroStat label="Active Reach" value={stats.views} />
                        <HeroStat label="Engagement" value={stats.clicks} />
                        <HeroStat label="Earnings" value={stats.earnings} />
                        <HeroStat label="Saves" value={stats.saves} />
                     </div>
                  </div>
               </div>
               <div className="space-y-8">
                  <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl min-h-[200px] flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Discovery Momentum</p>
                          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mt-1">Active Visitors</h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary animate-pulse"><TrendingUp className="w-5 h-5" /></div>
                     </div>
                     <div className="flex-1 flex items-end justify-center py-6">
                        <svg className="w-full h-24" viewBox="0 0 100 40">
                          <path d="M0,35 Q10,10 20,30 T40,20 T60,35 T80,10 T100,25" fill="none" stroke="#7B33FF" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="100" cy="25" r="3" fill="#7B33FF" />
                        </svg>
                     </div>
                     <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-2xl font-black text-white italic">59</span>
                        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest opacity-40">Live right now</span>
                     </div>
                  </Card>
               </div>
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            {/* Top Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnalyticsSummaryCard 
                label="Total Website Views" 
                value={stats.views} 
                trend="+12.5%" 
                trendUp={true} 
                color="bg-primary/20" 
              />
              <AnalyticsSummaryCard 
                label="Total Clicks" 
                value={stats.clicks} 
                trend="+8.4%" 
                trendUp={true} 
                color="bg-white/5" 
              />
              <AnalyticsSummaryCard 
                label="Industry CTR" 
                value={stats.ctr} 
                trend="+1.2%" 
                trendUp={true} 
                color="bg-white/5" 
              />
            </div>

            {/* Performance Engine & Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <PerformanceEngineChart />
                <WebsitePerformanceTable websites={rawSubmissions} globalStats={globalStats} />
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <SmallMetricCard 
                    label="Live Visitors" 
                    value="59" 
                    sub="Peak Today: 142" 
                    icon={Activity} 
                    pulse 
                  />
                  <SmallMetricCard 
                    label="Avg. Session" 
                    value="2m 47s" 
                    sub="Bounce: 42%" 
                    icon={Clock} 
                  />
                </div>
                
                <TrafficSourcesChart />
                
                <PerformanceScoreGauge score={91} />
                
                <AIInsightsCard />
                
                <ActivityFeed />
              </div>
            </div>
          </div>
        )}

        {activeView === 'my-websites' && (
          <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            {/* My Websites simplified original */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
               <div className="space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">Your Projects</h2>
               </div>
               <Button onClick={() => router.push('/submit')} className="h-14 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs italic shadow-2xl hover:bg-primary hover:text-white transition-all">
                  <Plus className="w-4 h-4 mr-2" /> Submit New Project
               </Button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
               {rawSubmissions?.map((site: any) => (
                  <Card key={site.id} className="bg-[#121117] border-white/5 rounded-[3rem] overflow-hidden group hover:border-white/10 transition-all shadow-2xl flex flex-col p-8">
                     <div className="flex items-start justify-between mb-8">
                        <div className="w-20 h-20 rounded-[1.75rem] bg-[#0B0A0F] border border-white/5 flex items-center justify-center overflow-hidden">
                           {site.logoUrl ? <img src={site.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-10 h-10 opacity-20" />}
                        </div>
                        <Badge className="bg-primary/10 text-primary border-none uppercase text-[9px] font-black">{site.status || 'pending'}</Badge>
                     </div>
                     <h4 className="text-2xl font-black italic tracking-tighter text-white truncate mb-4">{site.url.replace('https://', '')}</h4>
                     <div className="mt-auto pt-6 border-t border-white/5 flex gap-2">
                        <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 text-[10px] font-black uppercase tracking-widest">Edit</Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(site.id)} className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                     </div>
                  </Card>
               ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function AnalyticsSummaryCard({ label, value, trend, trendUp, color }: { label: string, value: string, trend: string, trendUp: boolean, color: string }) {
  return (
    <div className={cn("relative p-8 rounded-[2.5rem] border border-white/5 overflow-hidden group hover:scale-[1.02] transition-all duration-500", color)}>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-white/5 rounded-2xl"><BarChart3 className="w-5 h-5 text-white" /></div>
          <button className="text-white/20 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</p>
          <div className="flex items-end gap-4">
             <h3 className="text-4xl font-black italic tracking-tighter text-white leading-none tabular-nums">{value}</h3>
             <div className={cn("flex items-center gap-1 text-[10px] font-black mb-1", trendUp ? "text-emerald-400" : "text-rose-500")}>
                {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trend}
             </div>
          </div>
        </div>
      </div>
      {/* Mini Trend Sparkline */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
           <path d="M0,35 Q20,10 40,30 T80,20 T100,25" fill="none" stroke="currentColor" strokeWidth="2" className={trendUp ? "text-emerald-400" : "text-rose-500"} />
        </svg>
      </div>
    </div>
  );
}

function PerformanceEngineChart() {
  const [metric, setMetric] = useState('Views');
  const [time, setTime] = useState('30D');

  return (
    <Card className="bg-[#121117] border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="space-y-1">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Website Performance</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">Interactive Traffic Analysis Engine</p>
         </div>
         <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
            {['Views', 'Clicks', 'CTR', 'Likes', 'Saves'].map(m => (
              <button 
                key={m} 
                onClick={() => setMetric(m)}
                className={cn(
                "px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all",
                metric === m ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-white"
              )}>{m}</button>
            ))}
         </div>
      </div>

      <div className="h-80 w-full flex items-end justify-between gap-1.5 pb-6 border-b border-white/5 group">
         {[40, 65, 45, 90, 75, 55, 80, 100, 85, 60, 45, 70, 85, 90, 60].map((h, i) => (
           <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar cursor-pointer">
              <div 
                className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-xl relative overflow-hidden" 
                style={{ height: `${h}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1823] border border-white/10 text-white text-[10px] font-black px-3 py-1 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-2xl">
                  {h * 123} {metric}
                </div>
              </div>
           </div>
         ))}
      </div>

      <div className="flex justify-between items-center">
         <div className="flex gap-4">
            {['Today', '7D', '30D', '90D', '1Y', 'Life'].map(t => (
               <button key={t} onClick={() => setTime(t)} className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", time === t ? "text-primary" : "text-muted-foreground/30 hover:text-white")}>{t}</button>
            ))}
         </div>
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-primary/40"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Current</div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/10"><div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Industry Avg</div>
         </div>
      </div>
    </Card>
  );
}

function SmallMetricCard({ label, value, sub, icon: Icon, pulse }: { label: string, value: string, sub: string, icon: any, pulse?: boolean }) {
  return (
    <div className="bg-[#121117] border border-white/5 p-6 rounded-[2.25rem] flex flex-col justify-between group hover:border-white/10 transition-all shadow-xl relative overflow-hidden">
      {pulse && <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-ping" />}
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-white/5 text-primary"><Icon className="w-4 h-4" /></div>
      </div>
      <div className="space-y-0.5">
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{label}</p>
        <h4 className="text-2xl font-black italic tracking-tighter text-white">{value}</h4>
        <p className="text-[8px] font-bold text-muted-foreground/20 italic">{sub}</p>
      </div>
    </div>
  );
}

function TrafficSourcesChart() {
  const sources = [
    { name: 'Home Feed', value: 35, color: 'bg-primary' },
    { name: 'Search', value: 25, color: 'bg-purple-600' },
    { name: 'Categories', value: 15, color: 'bg-blue-500' },
    { name: 'Recommendations', value: 12, color: 'bg-indigo-400' },
    { name: 'Google', value: 8, color: 'bg-cyan-500' },
    { name: 'Direct', value: 5, color: 'bg-white/20' }
  ];

  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black italic uppercase tracking-tighter">Traffic Sources</h3>
        <PieChart className="w-4 h-4 text-primary" />
      </div>
      
      <div className="relative flex justify-center py-4">
         <div className="w-40 h-40 rounded-full border-[12px] border-white/5 relative flex items-center justify-center">
            {/* Visual Pie Overlay Simulation */}
            <div className="absolute inset-0 rounded-full border-[12px] border-primary border-r-transparent border-b-transparent -rotate-45" />
            <div className="text-center">
               <span className="text-2xl font-black italic tracking-tighter text-white">100%</span>
               <p className="text-[8px] font-black text-muted-foreground uppercase opacity-40">Volume</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
         {sources.map(s => (
           <div key={s.name} className="flex items-center gap-3">
              <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.color)} />
              <div className="min-w-0">
                 <p className="text-[9px] font-black uppercase text-white/60 truncate tracking-tight">{s.name}</p>
                 <p className="text-[9px] font-black text-white/20">{s.value}%</p>
              </div>
           </div>
         ))}
      </div>
    </Card>
  );
}

function WebsitePerformanceTable({ websites, globalStats }: { websites: any[] | null, globalStats: any[] | null }) {
  return (
    <Card className="bg-[#121117] border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
         <h3 className="text-xl font-black italic uppercase tracking-tighter">Your Websites Performance</h3>
         <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary italic">Deep Audit</Button>
      </div>
      <div className="overflow-x-auto no-scrollbar">
         <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-white/5">
               <tr>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Digital Property</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Views</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Clicks</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">CTR Momentum</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Likes / Saves</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Trend (30D)</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {websites?.map(site => {
                 const siteStats = globalStats?.find(gs => gs.id === site.id);
                 const v = (siteStats?.visitCount || 0) * 4;
                 const c = siteStats?.visitCount || 0;
                 const ctr = v > 0 ? ((c / v) * 100).toFixed(1) : "0.0";

                 return (
                    <tr key={site.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-[#0B0A0F] border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                                {site.logoUrl ? <img src={site.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-5 h-5 opacity-20" />}
                             </div>
                             <div className="min-w-0">
                                <p className="text-sm font-black text-white truncate tracking-tight">{site.url.replace('https://', '')}</p>
                                <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase py-0 px-2 mt-1">{site.status || 'active'}</Badge>
                             </div>
                          </div>
                       </td>
                       <td className="p-6 font-black text-xs text-white/80 tabular-nums">{v.toLocaleString()}</td>
                       <td className="p-6 font-black text-xs text-white/80 tabular-nums">{c.toLocaleString()}</td>
                       <td className="p-6">
                          <div className="space-y-1.5 w-24">
                             <div className="flex justify-between text-[9px] font-bold text-white/40 italic">
                                <span>{ctr}%</span>
                                <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" />
                             </div>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(parseInt(ctr) * 4, 100)}%` }} />
                             </div>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-4 text-[10px] font-bold text-white/40">
                             <div className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-500/40" /> {siteStats?.likeCount || 0}</div>
                             <div className="flex items-center gap-1"><Bookmark className="w-3 h-3 text-amber-500/40" /> {Math.floor((siteStats?.likeCount || 0) * 0.7)}</div>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="h-8 w-24 opacity-30">
                             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                <path d="M0,35 Q10,10 20,30 T40,20 T60,35 T80,10 T100,25" fill="none" stroke="#7B33FF" strokeWidth="3" />
                             </svg>
                          </div>
                       </td>
                    </tr>
                 );
               })}
            </tbody>
         </table>
      </div>
    </Card>
  );
}

function PerformanceScoreGauge({ score }: { score: number }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -mr-16 -mt-16" />
      <div className="flex flex-col items-center space-y-6 relative z-10">
         <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
               <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
               <circle 
                  cx="72" 
                  cy="72" 
                  r="64" 
                  stroke="currentColor" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray="402" 
                  strokeDashoffset={402 - (402 * score) / 100} 
                  className="text-primary drop-shadow-[0_0_15px_rgba(123,51,255,0.6)] transition-all duration-1000" 
                  strokeLinecap="round"
               />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-5xl font-black italic tracking-tighter text-white leading-none">{score}</span>
               <span className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mt-1 opacity-40">SCORE</span>
            </div>
         </div>
         <div className="text-center space-y-1">
            <h4 className="text-xl font-black italic uppercase tracking-tighter">Performance Score</h4>
            <p className="text-[10px] text-muted-foreground font-medium opacity-40 italic">Global discovery rank across 1,200+ webs.</p>
         </div>
         <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-primary text-white border-none italic font-black text-[8px] px-3 py-1">🚀 Trending</Badge>
            <Badge className="bg-amber-500 text-black border-none italic font-black text-[8px] px-3 py-1">⭐ Top Rated</Badge>
         </div>
      </div>
    </Card>
  );
}

function AIInsightsCard() {
  const insights = [
    "Your CTR increased 18% this week.",
    "Gaming websites perform 2.4x better for your profile.",
    "Most high-value visitors come from India & USA.",
    "Tuesday at 4 PM GMT gets your highest traffic volume.",
    "Your 'Bessites AI' project is trending in AI Tools."
  ];

  return (
    <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/10 p-8 rounded-[2.5rem] shadow-xl space-y-6">
      <div className="flex items-center gap-3">
         <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><Sparkles className="w-4 h-4" /></div>
         <h3 className="text-lg font-black italic uppercase tracking-tighter">AI Performance Insights</h3>
      </div>
      <div className="space-y-4">
         {insights.map((insight, i) => (
           <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
              <p className="text-[11px] font-bold text-white/60 leading-relaxed italic">"{insight}"</p>
           </div>
         ))}
      </div>
      <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-[0.2em] italic">Generate More Insights</Button>
    </Card>
  );
}

function ActivityFeed() {
  const activities = [
    { type: 'view', text: 'Someone viewed your website.', time: '2m ago' },
    { type: 'click', text: 'Someone clicked your website.', time: '15m ago' },
    { type: 'save', text: 'Someone saved your website.', time: '1h ago' },
    { type: 'like', text: 'Someone liked your website.', time: '3h ago' },
    { type: 'review', text: 'Someone left a review.', time: '5h ago' }
  ];

  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
      <div className="flex justify-between items-center">
         <h3 className="text-lg font-black italic uppercase tracking-tighter">Real-Time Activity</h3>
         <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>
      <div className="space-y-4">
         {activities.map((act, i) => (
           <div key={i} className="flex justify-between items-start gap-4">
              <div className="flex gap-4">
                 <div className="w-1 bg-white/5 rounded-full self-stretch" />
                 <p className="text-[11px] font-bold text-white/60 tracking-tight">{act.text}</p>
              </div>
              <span className="text-[9px] font-black uppercase text-white/10 shrink-0">{act.time}</span>
           </div>
         ))}
      </div>
    </Card>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick, badge }: { icon: any, label: string, active?: boolean, onClick: () => void, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative overflow-hidden group",
        active ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
      )}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(123,51,255,1)]" />}
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "group-hover:scale-110 transition-transform")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {badge !== undefined && (
        <span className="ml-auto bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-lg">{badge}</span>
      )}
    </button>
  );
}

function HeroStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
       <span className="text-xl sm:text-2xl font-black text-white italic tabular-nums leading-none">{value}</span>
       <span className="text-[8px] font-black uppercase text-muted-foreground/40 tracking-[0.2em] mt-1">{label}</span>
    </div>
  );
}
