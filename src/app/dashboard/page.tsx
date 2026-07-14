
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
  Filter
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
            
            {/* Hero Analytics Section */}
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

                  <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/10 p-8 rounded-[2.5rem] relative shadow-xl flex items-center justify-between">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Total Impact</p>
                        <h3 className="text-4xl font-black italic tracking-tighter text-white leading-none tabular-nums">${stats.earnings}</h3>
                        <p className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">+12.4% from last week</p>
                     </div>
                     <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                        <DollarSign className="w-8 h-8 text-primary" />
                     </div>
                  </Card>
               </div>
            </div>

            {/* Performance Metric Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
               <PerformanceCard label="Views" value={stats.views} icon={Eye} color="text-blue-400" />
               <PerformanceCard label="Clicks" value={stats.clicks} icon={MousePointer2} color="text-primary" />
               <PerformanceCard label="Likes" value={stats.likes} icon={Heart} color="text-pink-500" />
               <PerformanceCard label="Saves" value={stats.saves} icon={Bookmark} color="text-amber-400" />
               <PerformanceCard label="Rating" value={stats.rating} icon={Star} color="text-yellow-400" />
               <PerformanceCard label="CTR" value={stats.ctr} icon={TrendingUp} color="text-emerald-400" />
               <PerformanceCard label="Earnings" value={stats.earnings} icon={DollarSign} color="text-emerald-500" />
               <PerformanceCard label="Followers" value={stats.followers} icon={Users} color="text-indigo-400" />
            </div>

            {/* Detailed Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               <Card className="xl:col-span-2 bg-[#121117] border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-2xl space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                     <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Discovery Growth</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] opacity-40 mt-1">Traffic & Engagement Volume</p>
                     </div>
                     <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                       {['Today', '7D', '30D', '90D', '1Y', 'Life'].map((p, i) => (
                         <button key={p} className={cn(
                           "px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all",
                           i === 2 ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-white"
                         )}>{p}</button>
                       ))}
                     </div>
                  </div>
                  <div className="h-72 w-full flex items-end justify-between gap-2 pb-6 border-b border-white/5">
                     {[30, 45, 60, 40, 75, 90, 65, 55, 45, 85, 95, 100].map((h, i) => (
                       <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-xl group relative cursor-pointer" style={{ height: `${h}%` }}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1823] border border-white/10 text-white text-[10px] font-black px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">{(h * 123).toLocaleString()}</div>
                       </div>
                     ))}
                  </div>
                  <div className="flex justify-between px-2">
                     {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(m => (
                       <span key={m} className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-tighter">{m}</span>
                     ))}
                  </div>
               </Card>

               <div className="space-y-8">
                  <Card className="bg-[#121117] border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                     <div className="relative mb-6 flex flex-col items-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                           <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                           <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="364.4" strokeDashoffset="21.8" className="text-primary drop-shadow-[0_0_15px_rgba(123,51,255,0.6)]" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-4xl font-black italic tracking-tighter text-white leading-none">94</span>
                           <span className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.2em] mt-1">SCORE</span>
                        </div>
                     </div>
                     <h3 className="text-xl font-black italic uppercase tracking-tighter text-white text-center mb-6">Website Rank</h3>
                     <div className="space-y-3">
                        <RankMetric label="Speed Efficiency" value={98} />
                        <RankMetric label="Mobile Fidelity" value={95} />
                        <RankMetric label="CTR Momentum" value={88} />
                     </div>
                  </Card>
               </div>
            </div>

            {/* Top Performing List */}
            <Card className="bg-[#121117] border-white/5 p-10 rounded-[3rem] shadow-2xl">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Top Performing Projects</h3>
                  <Button variant="ghost" onClick={() => setActiveView('my-websites')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 italic">Manage All Projects</Button>
               </div>
               <div className="space-y-4">
                  {rawSubmissions?.filter(s => s.status === 'approved').slice(0, 3).map((site: any) => {
                    const siteStats = globalStats?.find(gs => gs.id === site.id);
                    return (
                      <div key={site.id} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                         <div className="flex items-center gap-6 w-full sm:w-auto">
                            <div className="w-14 h-14 rounded-2xl bg-[#0B0A0F] border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                               {site.logoUrl ? <img src={site.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-6 h-6 opacity-20" />}
                            </div>
                            <div className="min-w-0">
                               <p className="text-base font-black text-white truncate">{site.url.replace('https://', '')}</p>
                               <div className="flex gap-2 mt-1">
                                  {site.categories?.slice(0, 2).map((cat: string) => (
                                    <span key={cat} className="text-[8px] font-black uppercase text-primary tracking-widest">{cat}</span>
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-12 mt-6 sm:mt-0 w-full sm:w-auto justify-around">
                            <StatGroup label="Views" value={(siteStats?.visitCount || 0) * 4} />
                            <StatGroup label="Clicks" value={siteStats?.visitCount || 0} />
                            <StatGroup label="Rating" value={siteStats?.ratingSum ? (siteStats.ratingSum / siteStats.ratingCount).toFixed(1) : '0.0'} />
                            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5"><Edit className="w-4 h-4" /></Button>
                               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5"><ArrowUpRight className="w-4 h-4" /></Button>
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </Card>
          </div>
        )}

        {activeView === 'my-websites' && (
          <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
               <div className="space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">Your Projects</h2>
                  <div className="flex gap-6">
                     <PortfolioBadge label="Total" count={stats.total} color="bg-white/10 text-white" />
                     <PortfolioBadge label="Approved" count={stats.approved} color="bg-green-500/10 text-green-500" />
                     <PortfolioBadge label="Pending" count={stats.pending} color="bg-amber-500/10 text-amber-500" />
                     <PortfolioBadge label="Rejected" count={stats.rejected} color="bg-red-500/10 text-red-500" />
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                     <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                     <input 
                       placeholder="Search your registry..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-xs font-medium focus:border-primary outline-none transition-all" 
                     />
                  </div>
                  <Button onClick={() => router.push('/submit')} className="h-14 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs italic shadow-2xl hover:bg-primary hover:text-white transition-all">
                     <Plus className="w-4 h-4 mr-2" /> Submit New Project
                  </Button>
               </div>
            </header>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
               {['all', 'approved', 'pending', 'rejected'].map(f => (
                 <button key={f} onClick={() => setStatusFilter(f)} className={cn(
                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                    statusFilter === f ? "bg-primary border-primary text-white shadow-xl" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                 )}>{f}</button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
               {filteredSubmissions.map((site: any) => {
                 const siteStats = globalStats?.find(gs => gs.id === site.id);
                 return (
                    <Card key={site.id} className="bg-[#121117] border-white/5 rounded-[3rem] overflow-hidden group hover:border-white/10 transition-all shadow-2xl flex flex-col">
                       <div className="p-8 space-y-8 flex-1">
                          <div className="flex items-start justify-between">
                             <div className="w-20 h-20 rounded-[1.75rem] bg-[#0B0A0F] border border-white/5 flex items-center justify-center overflow-hidden shadow-xl">
                                {site.logoUrl ? <img src={site.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-10 h-10 opacity-20" />}
                             </div>
                             <div className="flex flex-col items-end gap-3">
                                <Badge className={cn(
                                   "uppercase text-[9px] font-black px-4 py-1.5 rounded-full border-none shadow-lg",
                                   site.status === 'approved' ? "bg-green-500/20 text-green-500" :
                                   site.status === 'rejected' ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500"
                                )}>
                                   {site.status === 'approved' && <Check className="w-3 h-3 mr-1.5" />}
                                   {site.status === 'pending' && <Clock className="w-3 h-3 mr-1.5" />}
                                   {site.status === 'rejected' && <X className="w-3 h-3 mr-1.5" />}
                                   {site.status || 'pending'}
                                </Badge>
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-30 italic">{site.timestamp ? new Date(site.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                             </div>
                          </div>

                          <div className="space-y-2">
                             <h4 className="text-2xl font-black italic tracking-tighter text-white truncate">{site.url.replace('https://', '')}</h4>
                             <div className="flex flex-wrap gap-2">
                                {site.categories?.map((cat: string) => (
                                  <span key={cat} className="text-[9px] font-black uppercase text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10">{cat}</span>
                                ))}
                             </div>
                          </div>

                          {site.status === 'pending' && (
                             <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4 items-center">
                                <Clock className="w-5 h-5 text-amber-500" />
                                <div>
                                   <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Waiting for review</p>
                                   <p className="text-[9px] font-medium text-amber-500/60 italic">Estimated review time: 24–48 hours</p>
                                </div>
                             </div>
                          )}

                          {site.status === 'rejected' && (
                             <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                                <div className="flex gap-4 items-center">
                                   <X className="w-5 h-5 text-red-500" />
                                   <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Reason for rejection</p>
                                </div>
                                <p className="text-[11px] font-bold text-red-500/80 pl-9 italic">"Low-quality content or incomplete website architecture detected."</p>
                             </div>
                          )}

                          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                             <StatGroup label="Views" value={(siteStats?.visitCount || 0) * 4} />
                             <StatGroup label="Clicks" value={siteStats?.visitCount || 0} />
                             <StatGroup label="Rating" value={siteStats?.ratingSum ? (siteStats.ratingSum / siteStats.ratingCount).toFixed(1) : '0.0'} />
                             <StatGroup label="Likes" value={siteStats?.likeCount || 0} />
                             <StatGroup label="Saves" value={Math.floor((siteStats?.likeCount || 0) * 0.7)} />
                             <StatGroup label="CTR" value={siteStats?.visitCount ? ((siteStats.visitCount / ((siteStats.visitCount || 1) * 4)) * 100).toFixed(1) + '%' : '0.0%'} />
                          </div>
                       </div>

                       <div className="p-8 bg-white/[0.01] border-t border-white/5 flex gap-3">
                          <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-black text-xs uppercase tracking-widest">Edit</Button>
                          <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-primary/20 hover:text-primary font-black text-xs uppercase tracking-widest">Promote</Button>
                          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 hover:bg-destructive/20 hover:text-destructive" onClick={() => handleDelete(site.id)}><Trash2 className="w-5 h-5" /></Button>
                       </div>
                    </Card>
                 );
               })}
               {filteredSubmissions.length === 0 && (
                  <div className="col-span-full py-40 text-center flex flex-col items-center justify-center space-y-8">
                     <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center text-muted-foreground/20">
                        <Globe className="w-16 h-16" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white opacity-20">Registry Empty</h3>
                        <p className="text-muted-foreground font-medium italic opacity-40">No matching projects found in your current registry cluster.</p>
                     </div>
                     <Button onClick={() => setStatusFilter('all')} className="rounded-full h-14 px-10 border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest italic hover:bg-primary hover:text-white transition-all">Clear Filters</Button>
                  </div>
               )}
            </div>
          </div>
        )}

        {activeView !== 'overview' && activeView !== 'my-websites' && (
          <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500 px-4">
            <div className="w-32 h-32 bg-primary/5 rounded-[3rem] flex items-center justify-center text-primary mb-4 shadow-2xl">
               <ShieldCheck className="w-16 h-16 opacity-40" />
            </div>
            <div className="space-y-3">
              <h3 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter leading-tight">Module <span className="text-primary">Syncing</span></h3>
              <p className="text-muted-foreground font-medium max-w-lg mx-auto opacity-60 text-sm sm:text-base italic">The <span className="text-white font-bold">{activeView.replace('-', ' ').toUpperCase()}</span> engine is currently synchronizing your creator data with the primary Bessites discovery cluster.</p>
            </div>
            <Button variant="outline" onClick={() => setActiveView('overview')} className="rounded-full h-16 px-16 border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] sm:text-xs italic hover:bg-primary hover:text-white transition-all">Restore Overview</Button>
          </div>
        )}

      </main>
    </div>
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

function PerformanceCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="bg-[#121117] border border-white/5 p-5 rounded-3xl flex flex-col justify-between group hover:border-white/10 transition-all cursor-default relative overflow-hidden min-w-[120px]">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-xl bg-white/5", color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">{label}</p>
        <p className="text-xl font-black tracking-tighter tabular-nums leading-none text-white">{value}</p>
      </div>
    </div>
  );
}

function RankMetric({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1.5">
       <div className="flex justify-between items-center px-1">
          <span className="text-[9px] font-black uppercase text-white/80 tracking-widest">{label}</span>
          <span className="text-[9px] font-black italic text-primary">{value}%</span>
       </div>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${value}%` }} />
       </div>
    </div>
  );
}

function StatGroup({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-center sm:items-start">
       <span className="text-[11px] font-black text-white tabular-nums">{value}</span>
       <span className="text-[8px] font-black uppercase text-muted-foreground/30 tracking-widest">{label}</span>
    </div>
  );
}

function PortfolioBadge({ label, count, color }: { label: string, count: number, color: string }) {
  return (
    <div className={cn("px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/5", color)}>
       <span className="text-base font-black italic leading-none">{count}</span>
       <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{label}</span>
    </div>
  );
}

function SidebarSection({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1 mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/30 px-4 mb-3">{label}</p>
      {children}
    </div>
  );
}
