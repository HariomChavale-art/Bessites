
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, doc, query, where, deleteDoc, updateDoc, orderBy } from "firebase/firestore";
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
  ArrowDownRight,
  Sparkles,
  Monitor,
  Tablet,
  MapPin,
  Compass,
  Languages,
  Download,
  FileText,
  Gamepad2,
  Palette,
  Smile,
  Frown,
  Meh
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { WebsitePreview } from "@/components/website-preview";
import { formatDistanceToNow } from "date-fns";

type DashboardView = 
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
  const [activeView, setActiveView] = useState<DashboardView>('my-websites');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
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
      views: "0", clicks: "0", saves: "0", likes: "0", shares: "0", rating: "0.0", ctr: "0.0%", earnings: "$0.00", followers: "0",
      total: 0, approved: 0, pending: 0, rejected: 0, ratingCount: 0
    };
    
    const myApproved = rawSubmissions.filter(s => s.status === 'approved');
    const myApprovedIds = myApproved.map(s => s.id);
    const myStats = globalStats.filter(gs => myApprovedIds.includes(gs.id));
    
    const totalClicks = myStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0);
    const totalLikes = myStats.reduce((acc, curr) => acc + (curr.likeCount || 0), 0);
    const totalShares = myStats.reduce((acc, curr) => acc + (curr.shareCount || 0), 0);
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
      shares: totalShares.toLocaleString(),
      rating: avgRating,
      ratingCount,
      ctr: `${ctr}%`,
      earnings: "$0.00",
      followers: "0",
      total: rawSubmissions.length,
      approved: rawSubmissions.filter(s => s.status === 'approved').length,
      pending: rawSubmissions.filter(s => s.status === 'pending').length,
      rejected: rawSubmissions.filter(s => s.status === 'rejected').length
    };
  }, [rawSubmissions, globalStats]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  const handleViewChange = (view: DashboardView) => {
    setActiveView(view);
    setIsMenuOpen(false);
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
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
        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'my-websites'} onClick={() => handleViewChange('my-websites')} />
        <SidebarItem icon={BarChart3} label="Analytics" active={activeView === 'analytics'} onClick={() => handleViewChange('analytics')} />
        <SidebarItem icon={Users} label="Audience" active={activeView === 'audience'} onClick={() => handleViewChange('audience')} />
        <SidebarItem icon={Star} label="Reviews" active={activeView === 'reviews'} onClick={() => handleViewChange('reviews')} badge={stats.ratingCount > 0 ? stats.ratingCount : undefined} />
        <SidebarItem icon={Flame} label="Promotions" active={activeView === 'promotions'} onClick={() => handleViewChange('promotions')} />
        <SidebarItem icon={DollarSign} label="Earnings" active={activeView === 'earnings'} onClick={() => handleViewChange('earnings')} />
        <SidebarItem icon={Bell} label="Notifications" active={activeView === 'notifications'} onClick={() => handleViewChange('notifications')} />
        <SidebarItem icon={Mic} label="AI Assistant" active={activeView === 'ai-assistant'} onClick={() => handleViewChange('ai-assistant')} />
        <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
          <SidebarItem icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => handleViewChange('settings')} />
          <SidebarItem icon={HelpCircle} label="Support" active={activeView === 'support'} onClick={() => handleViewChange('support')} />
        </div>
      </nav>

      <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all group">
         <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
         <span className="text-sm font-bold">Logout</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white font-body selection:bg-primary/30 antialiased flex flex-col lg:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 p-8 flex-col border-r border-white/5 bg-[#0D0C12] z-50">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B0A0F]">
        
        {/* Mobile Header & Nav Trigger */}
        <header className="lg:hidden flex items-center justify-between p-4 sticky top-0 bg-[#0B0A0F]/80 backdrop-blur-xl z-50 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-black italic uppercase tracking-tighter text-sm">Bessites</span>
          </Link>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0D0C12] border-r border-white/5 p-6 w-80">
              <SheetHeader className="sr-only">
                <SheetTitle>Creator Menu</SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Global Dashboard Command Bar */}
        <div className="px-4 sm:px-8 md:px-12 pt-8 md:pt-12 pb-2">
          <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 bg-[#0B0A0F]/80 backdrop-blur-xl z-40 py-2">
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
               
               <div className="flex items-center gap-3 pl-0 sm:pl-4 border-l-0 sm:border-l border-white/10 ml-auto sm:ml-0">
                  <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-white transition-all relative">
                    <Bell className="w-5 h-5" />
                  </button>
                  <Avatar className="w-11 h-11 ring-2 ring-primary/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/profile')}>
                    <AvatarImage src={profile?.photoURL} className="object-cover" />
                    <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
               </div>
            </div>
          </header>
        </div>

        <div className="p-4 sm:p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col gap-8 md:gap-12">
          {activeView === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-500 pb-24">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsSummaryCard label="Total Website Views" value={stats.views} trend="+12.5%" trendUp={true} color="bg-primary/20" />
                <AnalyticsSummaryCard label="Total Clicks" value={stats.clicks} trend="+8.4%" trendUp={true} color="bg-white/5" />
                <AnalyticsSummaryCard label="Industry CTR" value={stats.ctr} trend="+1.2%" trendUp={true} color="bg-white/5" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8 min-w-0">
                  <PerformanceEngineChart />
                  <WebsitePerformanceTable websites={rawSubmissions} globalStats={globalStats} />
                </div>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SmallMetricCard label="Live Visitors" value="59" sub="Peak Today: 142" icon={Activity} pulse />
                    <SmallMetricCard label="Avg. Session" value="2m 47s" sub="Bounce: 42%" icon={Clock} />
                  </div>
                  <TrafficSourcesChart />
                  <PerformanceScoreGauge score={91} />
                  <AIInsightsCard />
                  <ActivityFeed />
                </div>
              </div>
            </div>
          )}

          {activeView === 'audience' && (
            <div className="space-y-12 animate-in fade-in duration-500 pb-24">
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  <AudienceStatCard label="Likes" value={stats.likes} growth="+18%" trendUp color="bg-rose-500" icon={Heart} />
                  <AudienceStatCard label="Saves" value={stats.saves} growth="+12%" trendUp color="bg-amber-500" icon={Bookmark} />
                  <AudienceStatCard label="Shares" value={stats.shares} growth="+24%" trendUp color="bg-emerald-500" icon={Share2} />
                  <AudienceStatCard label="Visitors" value={stats.views} growth="+8.5%" trendUp color="bg-sky-500" icon={Users} />
               </div>

               <Card className="bg-[#121117] border-white/5 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Audience Activity</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">User engagement across all platforms</p>
                     </div>
                     <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                        {['Visitors', 'Likes', 'Saves', 'Shares', 'Clicks', 'Followers'].map(m => (
                          <button key={m} className="px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all hover:bg-white/5 text-muted-foreground hover:text-white shrink-0">{m}</button>
                        ))}
                     </div>
                  </div>
                  <div className="h-80 w-full flex items-end justify-between gap-1.5 pb-6 border-b border-white/5 overflow-x-auto no-scrollbar">
                     {[30, 45, 60, 40, 80, 70, 90, 65, 85, 100, 75, 55].map((h, i) => (
                        <div key={i} className="flex-1 min-w-[20px] bg-primary/20 hover:bg-primary transition-all rounded-t-xl shadow-lg" style={{ height: `${h}%` }} />
                     ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 overflow-x-auto no-scrollbar gap-4">
                     {['Today', '7D', '30D', '90D', '1Y', 'Life'].map(t => <button key={t} className="hover:text-primary transition-colors shrink-0">{t}</button>)}
                  </div>
               </Card>

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <Card className="xl:col-span-1 bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl flex flex-col h-fit">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Top Audience Interests</h3>
                        <Activity className="w-4 h-4 text-primary" />
                     </div>
                     <div className="space-y-6">
                        {[
                          { icon: Sparkles, label: 'AI & Machine Learning', val: '42%', grow: '+12%', color: 'text-purple-400' },
                          { icon: Gamepad2, label: 'Gaming & Ports', val: '28%', grow: '+5%', color: 'text-rose-400' },
                          { icon: Monitor, label: 'Programming Tools', val: '15%', grow: '-2%', color: 'text-blue-400' },
                          { icon: Palette, label: 'Digital Design', val: '10%', grow: '+8%', color: 'text-pink-400' },
                          { icon: Star, label: 'Entertainment', val: '5%', grow: '+1%', color: 'text-amber-400' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-2xl bg-white/5", item.color)}><item.icon className="w-5 h-5" /></div>
                                <div>
                                   <p className="text-sm font-bold text-white/80">{item.label}</p>
                                   <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest">{item.val} OF AUDIENCE</p>
                                </div>
                             </div>
                             <span className={cn("text-[10px] font-black", item.grow.startsWith('+') ? 'text-emerald-400' : 'text-rose-500')}>{item.grow}</span>
                          </div>
                        ))}
                     </div>
                  </Card>

                  <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <BreakdownGridCard title="Top Countries" items={[{ label: 'India', value: '14.2k (42%)', icon: Globe }, { label: 'United States', value: '8.4k (25%)', icon: Globe }, { label: 'United Kingdom', value: '3.1k (9%)', icon: Globe }, { label: 'Germany', value: '2.2k (6%)', icon: Globe }]} />
                     <BreakdownGridCard title="Devices & OS" items={[{ label: 'Mobile (Android/iOS)', value: '68%', icon: Smartphone }, { label: 'Desktop (Windows/Mac)', value: '24%', icon: Monitor }, { label: 'Tablet', value: '8%', icon: Tablet }]} />
                     <BreakdownGridCard title="Behavioral Pulse" items={[{ label: 'Peak: 7 PM - 10 PM', value: 'Traffic Surge', icon: Clock }, { label: 'Busiest Day: Tuesday', value: '18.4% share', icon: Calendar }]} />
                     <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/10 p-8 rounded-[3rem] shadow-xl space-y-6">
                        <div className="flex items-center gap-3"><div className="p-2.5 bg-primary/10 rounded-xl text-primary"><Sparkles className="w-4 h-4" /></div><h3 className="text-lg font-black italic uppercase tracking-tighter">AI Audience Insights</h3></div>
                        <div className="space-y-4">
                           {["Your Gaming audience grew by 18% this month.", "Most visitors use Android devices."].map((insight, i) => (
                             <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                                <div className="w-1 bg-primary rounded-full group-hover:scale-y-125 transition-transform" />
                                <p className="text-[11px] font-bold text-white/60 leading-relaxed italic">"{insight}"</p>
                             </div>
                           ))}
                        </div>
                     </Card>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'reviews' && (
            <div className="space-y-12 animate-in fade-in duration-500 pb-24">
               <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
                  <div className="space-y-1">
                     <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">Reviews Intelligence</h2>
                     <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">Manage Community Sentiment & Trust</p>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] h-12 px-6">
                        <Filter className="w-3.5 h-3.5 mr-2" /> Filter Rating
                     </Button>
                  </div>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-8 rounded-[2.5rem] bg-[#121117] border border-white/5 space-y-6 shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] -mr-16 -mt-16" />
                     <div className="flex justify-between items-center relative">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Global Rating</p>
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                     </div>
                     <div className="flex items-end gap-3 relative">
                        <h3 className="text-5xl font-black italic tracking-tighter">{stats.rating}</h3>
                        <span className="text-xs font-black text-amber-500/40 mb-2">/ 5.0</span>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full relative"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${(parseFloat(stats.rating) / 5) * 100}%` }} /></div>
                  </Card>

                  <Card className="p-8 rounded-[2.5rem] bg-[#121117] border border-white/5 space-y-6 shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16" />
                     <div className="flex justify-between items-center relative">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Total Reviews</p>
                        <MessageSquare className="w-5 h-5 text-primary" />
                     </div>
                     <div className="flex items-end gap-3 relative">
                        <h3 className="text-5xl font-black italic tracking-tighter">{stats.ratingCount}</h3>
                        <span className="text-xs font-black text-primary/40 mb-2">ENGAGED USERS</span>
                     </div>
                     <p className="text-[9px] font-black uppercase text-emerald-400 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +14% Momentum</p>
                  </Card>

                  <Card className="p-8 rounded-[2.5rem] bg-[#121117] border border-white/5 space-y-4 shadow-xl">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Sentiment Heatmap</p>
                     <div className="space-y-3">
                        <SentimentBar label="Positive" percentage={78} icon={Smile} color="text-emerald-400" bg="bg-emerald-400" />
                        <SentimentBar label="Neutral" percentage={15} icon={Meh} color="text-amber-400" bg="bg-amber-400" />
                        <SentimentBar label="Negative" percentage={7} icon={Frown} color="text-rose-500" bg="bg-rose-500" />
                     </div>
                  </Card>
               </div>

               <Card className="bg-[#121117] border-white/5 rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden">
                  <div className="p-6 sm:p-10 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01]">
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter">Recent Feedback</h3>
                     <div className="flex gap-4">
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary italic">Export PDF Report</Button>
                     </div>
                  </div>
                  
                  <div className="divide-y divide-white/5">
                     <div className="p-20 text-center space-y-4 opacity-40">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-xl font-bold italic tracking-tight">Review stream is synchronizing...</p>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">We are aggregating feedback from all your digital properties into this central hub.</p>
                     </div>
                  </div>
               </Card>
            </div>
          )}

          {activeView === 'my-websites' && (
            <div className="space-y-12 animate-in fade-in duration-500 pb-20">
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
                 <div className="space-y-1">
                    <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">Your Projects</h2>
                 </div>
                 <Button onClick={() => router.push('/submit')} className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs italic shadow-2xl hover:bg-primary hover:text-white transition-all">
                    <Plus className="w-4 h-4 mr-2" /> Submit New Project
                 </Button>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                 {rawSubmissions?.map((site: any) => (
                    <Card key={site.id} className="bg-[#121117] border-white/5 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden group hover:border-white/10 transition-all shadow-2xl flex flex-col p-8">
                       <div className="flex items-start justify-between mb-8">
                          <div className="w-20 h-20 rounded-[1.75rem] bg-[#0B0A0F] border border-white/5 flex items-center justify-center overflow-hidden">
                             {site.logoUrl ? <img src={site.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-10 h-10 opacity-20" />}
                          </div>
                          <Badge className={cn("uppercase text-[9px] font-black border-none", site.status === 'approved' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500")}>{site.status || 'pending'}</Badge>
                       </div>
                       <h4 className="text-2xl font-black italic tracking-tighter text-white truncate mb-4">{site.url.replace('https://', '')}</h4>
                       <div className="mt-auto pt-6 border-t border-white/5 flex gap-2">
                          <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 text-[10px] font-black uppercase tracking-widest">Edit</Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(site.id)} className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                       </div>
                    </Card>
                 ))}
                 {(!rawSubmissions || rawSubmissions.length === 0) && (
                   <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-4 opacity-40">
                      <Plus className="w-12 h-12 mx-auto" />
                      <p className="text-xl font-bold italic">No projects submitted yet.</p>
                   </div>
                 )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function SentimentBar({ label, percentage, icon: Icon, color, bg }: { label: string, percentage: number, icon: any, color: string, bg: string }) {
  return (
    <div className="space-y-1.5">
       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><Icon className={cn("w-3 h-3", color)} /> {label}</div>
          <span className="text-white/40">{percentage}%</span>
       </div>
       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", bg)} style={{ width: `${percentage}%` }} />
       </div>
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
    </div>
  );
}

function PerformanceEngineChart() {
  const [metric, setMetric] = useState('Views');
  return (
    <Card className="bg-[#121117] border-white/5 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="space-y-1">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Website Performance</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">Interactive Traffic Analysis Engine</p>
         </div>
         <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
            {['Views', 'Clicks', 'CTR', 'Likes', 'Saves'].map(m => (
              <button key={m} onClick={() => setMetric(m)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all shrink-0", metric === m ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-white")}>{m}</button>
            ))}
         </div>
      </div>
      <div className="h-80 w-full flex items-end justify-between gap-1.5 pb-6 border-b border-white/5 group overflow-x-auto no-scrollbar">
         {[40, 65, 45, 90, 75, 55, 80, 100, 85, 60, 45, 70, 85, 90, 60].map((h, i) => (
           <div key={i} className="flex-1 min-w-[15px] flex flex-col items-center gap-3 group/bar cursor-pointer">
              <div className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-xl relative overflow-hidden" style={{ height: `${h}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>
           </div>
         ))}
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
  const sources = [{ name: 'Home Feed', value: 35, color: 'bg-primary' }, { name: 'Search', value: 25, color: 'bg-purple-600' }, { name: 'Categories', value: 15, color: 'bg-blue-500' }, { name: 'Recommendations', value: 12, color: 'bg-indigo-400' }, { name: 'Google', value: 8, color: 'bg-cyan-500' }];
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-8">
      <div className="flex justify-between items-center"><h3 className="text-lg font-black italic uppercase tracking-tighter">Traffic Sources</h3><PieChart className="w-4 h-4 text-primary" /></div>
      <div className="relative flex justify-center py-4">
         <div className="w-40 h-40 rounded-full border-[12px] border-white/5 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[12px] border-primary border-r-transparent border-b-transparent -rotate-45" />
            <div className="text-center"><span className="text-2xl font-black italic tracking-tighter text-white">100%</span></div>
         </div>
      </div>
      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
         {sources.map(s => (
           <div key={s.name} className="flex items-center gap-3">
              <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.color)} />
              <p className="text-[9px] font-black uppercase text-white/60 truncate tracking-tight">{s.name}</p>
           </div>
         ))}
      </div>
    </Card>
  );
}

function WebsitePerformanceTable({ websites, globalStats }: { websites: any[] | null, globalStats: any[] | null }) {
  return (
    <Card className="bg-[#121117] border-white/5 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
         <h3 className="text-xl font-black italic uppercase tracking-tighter">Your Performance Registry</h3>
      </div>
      <div className="overflow-x-auto no-scrollbar">
         <table className="w-full text-left min-w-[800px]">
            <thead className="bg-white/5">
               <tr>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Digital Property</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Views</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Clicks</th>
                  <th className="p-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">CTR Momentum</th>
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
                             <p className="text-sm font-black text-white truncate tracking-tight">{site.url.replace('https://', '')}</p>
                          </div>
                       </td>
                       <td className="p-6 font-black text-xs text-white/80 tabular-nums">{v.toLocaleString()}</td>
                       <td className="p-6 font-black text-xs text-white/80 tabular-nums">{c.toLocaleString()}</td>
                       <td className="p-6 font-black text-xs text-emerald-400">{ctr}%</td>
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
               <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="402" strokeDashoffset={402 - (402 * score) / 100} className="text-primary drop-shadow-[0_0_15px_rgba(123,51,255,0.6)]" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-5xl font-black italic tracking-tighter text-white leading-none">{score}</span>
            </div>
         </div>
      </div>
    </Card>
  );
}

function AIInsightsCard() {
  const insights = ["Your CTR increased 18% this week.", "Gaming websites perform 2.4x better for your profile."];
  return (
    <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/10 p-8 rounded-[2.5rem] shadow-xl space-y-6">
      <div className="flex items-center gap-3"><div className="p-2.5 bg-primary/10 rounded-xl text-primary"><Sparkles className="w-4 h-4" /></div><h3 className="text-lg font-black italic uppercase tracking-tighter">AI Performance Insights</h3></div>
      <div className="space-y-4">
         {insights.map((insight, i) => (
           <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all"><p className="text-[11px] font-bold text-white/60 leading-relaxed italic">"{insight}"</p></div>
         ))}
      </div>
    </Card>
  );
}

function ActivityFeed() {
  const activities = [{ type: 'view', text: 'Someone viewed your website.', time: '2m ago' }, { type: 'click', text: 'Someone clicked your website.', time: '15m ago' }];
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-6">
      <div className="flex justify-between items-center"><h3 className="text-lg font-black italic uppercase tracking-tighter">Real-Time Activity</h3><div className="w-2 h-2 rounded-full bg-primary animate-pulse" /></div>
      <div className="space-y-4">{activities.map((act, i) => (<div key={i} className="flex justify-between items-start gap-4"><p className="text-[11px] font-bold text-white/60 tracking-tight">{act.text}</p><span className="text-[9px] font-black uppercase text-white/10 shrink-0">{act.time}</span></div>))}</div>
    </Card>
  );
}

function AudienceStatCard({ label, value, growth, trendUp, color, icon: Icon }: { label: string, value: string, growth: string, trendUp: boolean, color: string, icon: any }) {
   return (
      <div className={cn("p-8 rounded-[2.5rem] border border-white/5 bg-[#121117] relative overflow-hidden group hover:scale-[1.02] transition-all")}>
         <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-20", color)} />
         <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <div className={cn("p-3 rounded-2xl bg-white/5", color.replace('bg-', 'text-'))}><Icon className="w-5 h-5" /></div>
               <Badge className={cn("border-none text-[9px] font-black uppercase px-2 py-0.5", trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>{growth}</Badge>
            </div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{label}</p>
               <h3 className="text-3xl font-black italic tracking-tighter leading-none">{value}</h3>
            </div>
         </div>
      </div>
   );
}

function BreakdownGridCard({ title, items }: { title: string, items: any[] }) {
   return (
      <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl flex flex-col h-fit">
         <h3 className="text-lg font-black italic uppercase tracking-tighter mb-8">{title}</h3>
         <div className="grid grid-cols-1 gap-5">
            {items.map((item, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className="flex items-center gap-3">
                     <item.icon className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                     <span className="text-xs font-bold text-white/80">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-muted-foreground/20">{item.value}</span>
               </div>
            ))}
         </div>
      </Card>
   );
}

function SidebarItem({ icon: Icon, label, active = false, onClick, badge }: { icon: any, label: string, active?: boolean, onClick: () => void, badge?: number }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative overflow-hidden group", active ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" : "text-muted-foreground/60 hover:text-white hover:bg-white/5")}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(123,51,255,1)]" />}
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "group-hover:scale-110 transition-transform")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {badge !== undefined && (<span className="ml-auto bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-lg">{badge}</span>)}
    </button>
  );
}
