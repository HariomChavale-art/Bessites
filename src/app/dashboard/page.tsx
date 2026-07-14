
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, doc, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  Check, 
  X, 
  Globe, 
  Loader2, 
  User as UserIcon,
  LayoutDashboard,
  BarChart3,
  Settings as SettingsIcon,
  DollarSign,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  Search,
  Zap,
  Menu,
  Star,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  History,
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
  Award
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
  | 'api' 
  | 'settings' 
  | 'support';

export default function UserDashboard() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  
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
    if (!rawSubmissions || !globalStats) return { views: "0", clicks: "0", saves: "0", likes: "0", rating: "0.0", ctr: "0.0%" };
    
    const myApproved = rawSubmissions.filter(s => s.status === 'approved');
    const myApprovedIds = myApproved.map(s => s.id);
    const myStats = globalStats.filter(gs => myApprovedIds.includes(gs.id));
    
    const totalClicks = myStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0);
    const totalLikes = myStats.reduce((acc, curr) => acc + (curr.likeCount || 0), 0);
    const ratingSum = myStats.reduce((acc, curr) => acc + (curr.ratingSum || 0), 0);
    const ratingCount = myStats.reduce((acc, curr) => acc + (curr.ratingCount || 0), 0);
    
    const totalViews = totalClicks * 4; // Mocked views for dashboard
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";
    const avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : "0.0";

    return {
      views: totalViews.toLocaleString(),
      clicks: totalClicks.toLocaleString(),
      saves: Math.floor(totalLikes * 0.7).toLocaleString(), // Mocked saves relative to likes
      likes: totalLikes.toLocaleString(),
      rating: avgRating,
      ctr: `${ctr}%`,
      websites: myApproved.length
    };
  }, [rawSubmissions, globalStats]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white p-2 sm:p-4 md:p-8 font-body selection:bg-primary/30 antialiased overflow-x-hidden">
      
      {/* Main Glass Layout */}
      <div className="max-w-[1600px] mx-auto bg-[#121117] border border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col lg:flex-row overflow-hidden shadow-2xl min-h-[90vh]">
        
        {/* Unified Sidebar Navigation */}
        <aside className="w-full lg:w-72 p-6 md:p-8 flex flex-col border-r border-white/5 bg-[#0D0C12]/50">
          <div className="flex items-center gap-3 mb-10">
             <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-all">
                  <Zap className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <div className="min-w-0">
                  <span className="text-lg font-black italic uppercase tracking-tighter block leading-none">Bessites</span>
                  <span className="text-[9px] text-primary font-black uppercase tracking-widest opacity-60">Creator Suite</span>
                </div>
             </Link>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pb-10">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'overview'} onClick={() => setActiveView('overview')} />
            <SidebarItem icon={Globe} label="My Websites" active={activeView === 'my-websites'} onClick={() => setActiveView('my-websites')} />
            <SidebarItem icon={BarChart3} label="Analytics" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
            <SidebarItem icon={Users} label="Audience" active={activeView === 'audience'} onClick={() => setActiveView('audience')} />
            <SidebarItem icon={Flame} label="Promotions" active={activeView === 'promotions'} onClick={() => setActiveView('promotions')} />
            <SidebarItem icon={Star} label="Reviews" active={activeView === 'reviews'} onClick={() => setActiveView('reviews')} />
            <SidebarItem icon={DollarSign} label="Earnings" active={activeView === 'earnings'} onClick={() => setActiveView('earnings')} />
            <SidebarItem icon={Bell} label="Notifications" active={activeView === 'notifications'} onClick={() => setActiveView('notifications')} />
            <SidebarItem icon={Mic} label="AI Assistant" active={activeView === 'ai-assistant'} onClick={() => setActiveView('ai-assistant')} />
            <SidebarItem icon={ZapIcon} label="API (future)" active={activeView === 'api'} onClick={() => setActiveView('api')} />
            <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
              <SidebarItem icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
              <SidebarItem icon={HelpCircle} label="Support" active={activeView === 'support'} onClick={() => setActiveView('support')} />
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col gap-8 md:gap-12 bg-background/30">
          
          {/* Header & AI Assistant Bar */}
          <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            <div className="space-y-1">
               <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">Welcome, {profile?.displayName?.split(' ')[0] || 'Curator'} 👋</h1>
               <p className="text-muted-foreground text-sm font-medium opacity-60 italic">Your performance summary for the last 30 days</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
               <div className="relative group w-full sm:w-96 order-2 sm:order-1">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    placeholder="Ask Bessites.ai for insights..." 
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-xs font-medium focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:italic" 
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary/20 rounded-xl hover:bg-primary/30 transition-colors"><Mic className="w-3.5 h-3.5 text-primary" /></button>
               </div>
               
               <div className="flex items-center gap-3 pl-4 border-l border-white/10 order-1 sm:order-2 ml-auto">
                  <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-white transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-4 ring-[#121117]" />
                  </button>
                  <Avatar className="w-11 h-11 ring-2 ring-primary/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/profile')}>
                    <AvatarImage src={profile?.photoURL} />
                    <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
               </div>
            </div>
          </header>

          {activeView === 'overview' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Performance Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
                 <PerformanceCard label="Total Views" value={stats.views} icon={Eye} color="text-blue-400" />
                 <PerformanceCard label="Total Clicks" value={stats.clicks} icon={MousePointer2} color="text-primary" />
                 <PerformanceCard label="Total Saves" value={stats.saves} icon={Bookmark} color="text-amber-400" />
                 <PerformanceCard label="Total Likes" value={stats.likes} icon={Heart} color="text-pink-500" />
                 <PerformanceCard label="Avg Rating" value={stats.rating} icon={Star} color="text-yellow-400" />
                 <PerformanceCard label="Avg CTR" value={stats.ctr} icon={TrendingUp} color="text-emerald-400" />
                 <PerformanceCard label="Followers" value="--" icon={Users} color="text-indigo-400" isFuture />
              </div>

              {/* Main Analytics Hub */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                 
                 {/* Traffic Momentum Graph */}
                 <Card className="xl:col-span-2 bg-[#18161E] border-white/5 p-6 sm:p-10 rounded-[2.5rem] relative shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                       <div className="space-y-1">
                          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Performance Momentum</h3>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40">Website Traffic Over Time</p>
                       </div>
                       <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-end sm:self-auto overflow-x-auto no-scrollbar max-w-full">
                         {['Today', '7D', '30D', '90D', '1Y', 'Life'].map((p, i) => (
                           <button key={p} className={cn(
                             "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap",
                             i === 2 ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                           )}>{p}</button>
                         ))}
                       </div>
                    </div>
                    
                    <div className="flex-1 relative mt-4">
                       {/* High Fidelity Performance SVG Chart */}
                       <svg className="w-full h-full min-h-[250px]" viewBox="0 0 1000 200" preserveAspectRatio="none">
                         <defs>
                           <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#7B33FF" stopOpacity="0.3" />
                             <stop offset="100%" stopColor="#7B33FF" stopOpacity="0" />
                           </linearGradient>
                           <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#85A3FF" stopOpacity="0.2" />
                             <stop offset="100%" stopColor="#85A3FF" stopOpacity="0" />
                           </linearGradient>
                         </defs>
                         {/* Views Line */}
                         <path d="M0,120 C 100,100 200,160 300,110 C 400,60 500,120 600,100 C 700,80 800,140 900,110 C 1000,80 1000,100 1000,100 L 1000,200 L 0,200 Z" fill="url(#viewsGradient)" />
                         <path d="M0,120 C 100,100 200,160 300,110 C 400,60 500,120 600,100 C 700,80 800,140 900,110 C 1000,80 1000,100" fill="none" stroke="#7B33FF" strokeWidth="4" className="drop-shadow-[0_0_10px_rgba(123,51,255,0.5)]" />
                         {/* Clicks Line */}
                         <path d="M0,150 C 150,140 250,170 400,150 C 550,130 700,160 1000,140" fill="none" stroke="#85A3FF" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
                         {/* Interactive Dot */}
                         <circle cx="600" cy="100" r="6" fill="#7B33FF" stroke="white" strokeWidth="2" />
                         <line x1="600" y1="100" x2="600" y2="200" stroke="#7B33FF" strokeDasharray="5,5" opacity="0.3" />
                       </svg>

                       <div className="flex justify-between mt-8 px-2">
                          {['Jun 1', 'Jun 8', 'Jun 15', 'Jun 22', 'Jun 30'].map(m => (
                            <span key={m} className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-tighter">{m}</span>
                          ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 pt-10 mt-6 border-t border-white/5">
                       <MetricLegend label="Daily Views" value="4.2k" color="bg-primary" />
                       <MetricLegend label="Daily Clicks" value="1.1k" color="bg-secondary" />
                       <MetricLegend label="New Saves" value="+24" color="bg-amber-400" />
                    </div>
                 </Card>

                 <div className="space-y-8 flex flex-col">
                    {/* Website Performance Rank */}
                    <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl flex flex-col justify-center items-center text-center">
                       <div className="relative mb-6">
                          <svg className="w-32 h-32 transform -rotate-90">
                             <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                             <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="364.4" strokeDashoffset="21.8" className="text-primary drop-shadow-[0_0_15px_rgba(123,51,255,0.6)]" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-3xl font-black italic tracking-tighter text-white leading-none">94</span>
                             <span className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.2em] mt-1">RANK</span>
                          </div>
                       </div>
                       <h3 className="text-lg font-black italic uppercase tracking-tighter text-white mb-2">Elite Creator Status</h3>
                       <p className="text-[11px] text-muted-foreground font-medium max-w-[180px] leading-relaxed mb-6">Your websites are in the <span className="text-primary font-bold">top 6%</span> of the Bessites discovery cluster.</p>
                       <div className="grid grid-cols-2 gap-3 w-full">
                          <RankMetric label="Speed" value="98" />
                          <RankMetric label="Mobile" value="95" />
                       </div>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-primary/40 blur-2xl" />
                    </Card>

                    {/* Promote Website Card */}
                    <Card className="flex-1 bg-[#18161E] border-white/5 p-8 rounded-[2.5rem] relative shadow-xl overflow-hidden flex flex-col justify-between group">
                       <div className="space-y-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             <TrendingUp className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Boost Your Flow</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40 mt-1">Promoted Discovery</p>
                          </div>
                          <p className="text-[11px] text-muted-foreground/60 font-medium leading-relaxed">Reach up to <span className="text-white font-bold">50k+ daily visitors</span> with featured placement in the discovery feed.</p>
                       </div>
                       
                       <Button className="w-full mt-8 bg-white text-black hover:bg-white/90 rounded-2xl h-14 font-black uppercase tracking-widest text-xs italic shadow-xl">
                         Promote Website <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                    </Card>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                 
                 {/* Top Performing Websites Table */}
                 <Card className="xl:col-span-2 bg-[#18161E] border-white/5 p-8 rounded-[2.5rem] relative shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                       <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Project Portfolio</h3>
                       <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 italic">Export CSV</Button>
                    </div>
                    <div className="overflow-x-auto no-scrollbar -mx-4 sm:mx-0">
                       <table className="w-full text-left min-w-[600px]">
                          <thead>
                             <tr className="border-b border-white/5">
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Identity</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 text-center">Views</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 text-center">Clicks</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 text-center">CTR</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 text-right">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                             {rawSubmissions?.map((site: any) => {
                               const siteStats = globalStats?.find(s => s.id === site.id);
                               const clicks = siteStats?.visitCount || 0;
                               const views = clicks * 4;
                               const ctr = views > 0 ? ((clicks/views)*100).toFixed(1) : "0.0";
                               return (
                                <tr key={site.id} className="group hover:bg-white/[0.01] transition-colors">
                                  <td className="py-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                        {site.logoUrl ? <img src={site.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-5 h-5 opacity-20" />}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{site.url.replace('https://', '')}</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-30 mt-1">ID: {site.id.slice(0, 8)}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-6 text-center text-xs font-bold text-white/80 tabular-nums">{views.toLocaleString()}</td>
                                  <td className="py-6 text-center text-xs font-bold text-white/80 tabular-nums">{clicks.toLocaleString()}</td>
                                  <td className="py-6 text-center text-xs font-bold text-primary tabular-nums">{ctr}%</td>
                                  <td className="py-6 text-right">
                                    <Badge className={cn(
                                      "uppercase text-[9px] font-black px-2.5 py-0.5 rounded-full border-none",
                                      site.status === 'approved' ? "bg-green-500/10 text-green-500" :
                                      site.status === 'rejected' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                                    )}>
                                      {site.status || 'pending'}
                                    </Badge>
                                  </td>
                                </tr>
                               );
                             })}
                             {!rawSubmissions?.length && (
                               <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-20">No projects synchronized.</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </Card>

                 {/* Traffic Sources Breakdown */}
                 <Card className="bg-[#18161E] border-white/5 p-8 rounded-[2.5rem] relative shadow-xl flex flex-col">
                    <div className="mb-10">
                       <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Traffic Sources</h3>
                       <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40 mt-1">Discovery Origin Cluster</p>
                    </div>
                    <div className="space-y-6 flex-1">
                       <SourceRow label="Direct Link" percent={38} color="bg-primary" />
                       <SourceRow label="AI Recommendation" percent={24} color="bg-blue-400" />
                       <SourceRow label="Category Page" percent={18} color="bg-emerald-400" />
                       <SourceRow label="Search Engine" percent={12} color="bg-amber-400" />
                       <SourceRow label="Social Media" percent={8} color="bg-pink-500" />
                    </div>
                    <div className="mt-10 pt-8 border-t border-white/5">
                       <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><TrendingUp className="w-4 h-4" /></div>
                             <span className="text-[10px] font-black uppercase text-white tracking-widest">Viral Velocity</span>
                          </div>
                          <span className="text-xs font-black text-emerald-500">+12.4%</span>
                       </div>
                    </div>
                 </Card>

              </div>

              {/* Bottom Row: Audience & Notifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 
                 {/* Audience Card */}
                 <Card className="bg-[#18161E] border-white/5 p-8 rounded-[2.5rem] relative shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Global Audience</h3>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground opacity-40"><Map className="w-3.5 h-3.5" /> 108 Countries</div>
                    </div>
                    <div className="space-y-6">
                       <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-none">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-primary"><Smartphone className="w-5 h-5" /></div>
                             <div>
                                <p className="text-sm font-bold text-white">Mobile Discovery</p>
                                <p className="text-[10px] text-muted-foreground opacity-40">Android, iOS</p>
                             </div>
                          </div>
                          <span className="text-sm font-black italic text-white">68%</span>
                       </div>
                       <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-none">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400"><Globe className="w-5 h-5" /></div>
                             <div>
                                <p className="text-sm font-bold text-white">New Visitors</p>
                                <p className="text-[10px] text-muted-foreground opacity-40">First-time session</p>
                             </div>
                          </div>
                          <span className="text-sm font-black italic text-white">82%</span>
                       </div>
                    </div>
                 </Card>

                 {/* Notifications Feed */}
                 <Card className="bg-[#18161E] border-white/5 p-8 rounded-[2.5rem] relative shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">System Feed</h3>
                       <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    </div>
                    <div className="space-y-4">
                       <NotificationItem icon={Check} label="Website Approved" time="2h ago" desc="Your project 'Tools AI' is now live." />
                       <NotificationItem icon={Award} label="New Milestone" time="5h ago" desc="Reached 1,000 total website clicks!" />
                       <NotificationItem icon={MessageSquare} label="New Review" time="1d ago" desc="A creator left a 5-star rating on your site." />
                    </div>
                 </Card>

              </div>

            </div>
          )}

          {activeView !== 'overview' && (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500 px-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary/5 rounded-[2.5rem] sm:rounded-[3rem] flex items-center justify-center text-primary mb-4 shadow-2xl">
                 <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 opacity-40" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter leading-tight">Module <span className="text-primary">Syncing</span></h3>
                <p className="text-muted-foreground font-medium max-w-lg mx-auto opacity-60 text-sm sm:text-base">The <span className="text-white font-bold">{activeView.replace('-', ' ').toUpperCase()}</span> engine is currently synchronizing your creator data with the primary Bessites discovery cluster.</p>
              </div>
              <Button variant="outline" onClick={() => setActiveView('overview')} className="rounded-full h-14 sm:h-16 px-10 sm:px-16 border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] sm:text-xs italic hover:bg-primary hover:text-white transition-all">Restore Overview</Button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all relative overflow-hidden group",
        active ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
      )}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(123,51,255,1)]" />}
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "group-hover:scale-110 transition-transform")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function PerformanceCard({ label, value, icon: Icon, color, isFuture = false }: { label: string, value: string, icon: any, color: string, isFuture?: boolean }) {
  return (
    <div className="bg-[#18161E] border border-white/5 p-4 rounded-3xl flex flex-col justify-between group hover:border-white/10 transition-all cursor-default relative overflow-hidden min-w-[120px]">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-xl bg-white/5", color)}>
          <Icon className="w-4 h-4" />
        </div>
        {isFuture && <span className="text-[7px] font-black uppercase text-muted-foreground opacity-40 bg-white/5 px-1.5 py-0.5 rounded-full">Pro</span>}
      </div>
      <div className="space-y-0.5">
        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">{label}</p>
        <p className="text-xl font-black tracking-tighter tabular-nums leading-none text-white">{value}</p>
      </div>
    </div>
  );
}

function MetricLegend({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex flex-col gap-1">
       <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", color)} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80 tabular-nums">{value}</span>
       </div>
       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 pl-4">{label}</span>
    </div>
  );
}

function RankMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center">
       <span className="text-xs font-black italic text-white">{value}%</span>
       <span className="text-[8px] font-black uppercase text-muted-foreground/40 tracking-widest">{label}</span>
    </div>
  );
}

function SourceRow({ label, percent, color }: { label: string, percent: number, color: string }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black uppercase text-white/80 tracking-widest">{label}</span>
          <span className="text-[10px] font-black italic text-muted-foreground opacity-40">{percent}%</span>
       </div>
       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percent}%` }} />
       </div>
    </div>
  );
}

function NotificationItem({ icon: Icon, label, time, desc }: { icon: any, label: string, time: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors">
       <div className="bg-primary/10 p-2.5 rounded-xl text-primary mt-0.5 group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
       </div>
       <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1">
             <span className="text-xs font-black italic text-white uppercase tracking-tighter">{label}</span>
             <span className="text-[8px] font-black uppercase text-muted-foreground opacity-30">{time}</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-medium line-clamp-2">{desc}</p>
       </div>
    </div>
  );
}
