'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, doc, query, where, deleteDoc, updateDoc, orderBy, increment, serverTimestamp } from "firebase/firestore";
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
  Gamepad2,
  Palette,
  Megaphone,
  CreditCard,
  Download
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
import { Logo } from "@/components/logo";

type DashboardView = 
  | 'overview'
  | 'my-websites' 
  | 'analytics' 
  | 'audience' 
  | 'reviews' 
  | 'promotions' 
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
      views: "0", clicks: "0", saves: "0", likes: "0", followers: "124", rating: "4.8", ctr: "12.4%", earnings: "$0.00",
      total: 0, approved: 0, pending: 0, rejected: 0
    };
    
    const myApproved = rawSubmissions.filter(s => s.status === 'approved');
    const myApprovedIds = myApproved.map(s => s.id);
    const myStats = globalStats.filter(gs => myApprovedIds.includes(gs.id));
    
    const totalClicks = myStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0);
    const totalLikes = myStats.reduce((acc, curr) => acc + (curr.likeCount || 0), 0);
    
    const totalViews = totalClicks * 4; 
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

    return {
      views: totalViews.toLocaleString(),
      clicks: totalClicks.toLocaleString(),
      saves: Math.floor(totalLikes * 0.7).toLocaleString(),
      likes: totalLikes.toLocaleString(),
      followers: "124",
      rating: "4.8",
      ctr: `${ctr}%`,
      earnings: "$0.00",
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-10">
         <Link href="/" className="group block">
            <Logo showText />
            <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60 mt-1 block">Creator Studio</span>
         </Link>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pb-10">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'overview'} onClick={() => handleViewChange('overview')} />
        <SidebarItem icon={Globe} label="My Websites" active={activeView === 'my-websites'} onClick={() => handleViewChange('my-websites')} badge={stats.total} />
        <SidebarItem icon={BarChart3} label="Analytics" active={activeView === 'analytics'} onClick={() => handleViewChange('analytics')} />
        <SidebarItem icon={Users} label="Audience" active={activeView === 'audience'} onClick={() => handleViewChange('audience')} />
        <SidebarItem icon={Star} label="Reviews" active={activeView === 'reviews'} onClick={() => handleViewChange('reviews')} />
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
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 sticky top-0 bg-[#0B0A0F]/80 backdrop-blur-xl z-50 border-b border-white/5">
          <Logo showText className="scale-75 origin-left" />
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0D0C12] border-r border-white/5 p-6 w-80">
              <SheetHeader>
                <SheetTitle className="text-left text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Creator Menu</SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Command Bar */}
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
                    placeholder="Search your collection..." 
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:italic" 
                  />
               </div>
               
               <div className="flex items-center gap-3 pl-0 sm:pl-4 border-l-0 sm:border-l border-white/10 ml-auto sm:ml-0">
                  <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-white transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                  </button>
                  <Avatar className="w-11 h-11 ring-2 ring-primary/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/profile')}>
                    <AvatarImage src={profile?.photoURL} className="object-cover" />
                    <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
               </div>
            </div>
          </header>
        </div>

        <div className="p-4 sm:p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col gap-8 md:gap-12 pb-32">
          {activeView === 'overview' && (
            <div className="space-y-12 animate-in fade-in duration-700">
               <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  <StatCard label="Website Views" value={stats.views} icon={Eye} trend="+12.5%" trendUp />
                  <StatCard label="Website Clicks" value={stats.clicks} icon={MousePointer2} trend="+8.4%" trendUp />
                  <StatCard label="Total Likes" value={stats.likes} icon={Heart} trend="+24%" trendUp color="text-rose-500" />
                  <StatCard label="Total Saves" value={stats.saves} icon={Bookmark} trend="+15%" trendUp color="text-amber-500" />
                  <StatCard label="Followers" value={stats.followers} icon={Users} trend="+3" trendUp color="text-sky-500" />
                  <StatCard label="Avg. Rating" value={stats.rating} icon={Star} trend="Stable" trendUp color="text-yellow-500" />
                  <StatCard label="Industry CTR" value={stats.ctr} icon={TrendingUp} trend="+1.2%" trendUp color="text-emerald-500" />
                  <StatCard label="Earnings" value={stats.earnings} icon={DollarSign} trend="--" trendUp={false} color="text-purple-500" />
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12">
                  <div className="xl:col-span-2 space-y-8 md:space-y-12">
                    <Card className="bg-[#121117] border-white/5 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 relative z-10">
                          <div className="space-y-1">
                             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Performance Engine</h3>
                             <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">Real-time Website Traffic Analysis</p>
                          </div>
                          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                             {['Today', '7D', '30D', '90D', '1Y', 'Life'].map(t => (
                               <button key={t} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all shrink-0", t === '30D' ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-muted-foreground hover:text-white")}>{t}</button>
                             ))}
                          </div>
                       </div>
                       <div className="h-80 w-full flex items-end justify-between gap-1.5 pb-6 border-b border-white/5 group/bars overflow-x-auto no-scrollbar">
                          {[40, 65, 45, 90, 75, 55, 80, 100, 85, 60, 45, 70, 85, 90, 60].map((h, i) => (
                             <div key={i} className="flex-1 min-w-[20px] bg-primary/20 hover:bg-primary transition-all rounded-t-xl relative group/bar cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                                <div className="h-full w-full" style={{ height: `${h}%` }} />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-white/10 text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-2xl z-20 whitespace-nowrap">{h}% Growth</div>
                             </div>
                          ))}
                       </div>
                    </Card>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black italic uppercase tracking-tighter">Your Top Digital Properties</h3>
                          <button onClick={() => setActiveView('my-websites')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-2">Manage All <ArrowRight className="w-3 h-3" /></button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {rawSubmissions?.slice(0, 4).map((site: any) => (
                             <SmallWebsiteCard key={site.id} site={site} globalStats={globalStats} />
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-8 md:space-y-12">
                     <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/10 p-8 rounded-[3rem] shadow-xl space-y-8 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="flex items-center gap-3 relative z-10">
                           <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><Sparkles className="w-4 h-4" /></div>
                           <h3 className="text-lg font-black italic uppercase tracking-tighter">Bessites Assistant</h3>
                        </div>
                        <div className="space-y-4 relative z-10">
                           {["Increase my website clicks", "Suggest better categories", "Generate SEO tags"].map(q => (
                              <button key={q} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.08] transition-all group/btn text-left">
                                 <span className="text-[11px] font-bold text-white/60 group-hover/btn:text-white transition-colors">"{q}"</span>
                                 <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover/btn:text-primary group-hover/btn:translate-x-1 transition-all" />
                              </button>
                           ))}
                        </div>
                     </Card>

                     <AudienceWidget />
                     <RecentActivityPanel />
                  </div>
               </div>
            </div>
          )}

          {activeView === 'my-websites' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
                  <div className="space-y-1">
                     <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">The Website Registry</h2>
                     <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">Managing {stats.total} Active digital properties</p>
                  </div>
                  <Button onClick={() => router.push('/submit')} className="w-full sm:w-auto h-14 px-10 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest text-xs italic shadow-2xl shadow-white/5 hover:bg-primary hover:text-white transition-all">
                     <Plus className="w-4 h-4 mr-2" strokeWidth={3} /> Submit New Project
                  </Button>
               </header>

               <div className="bg-[#121117] border border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto no-scrollbar">
                     <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-white/5">
                           <tr>
                              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Digital Property</th>
                              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 text-center">Status</th>
                              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Performance</th>
                              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">CTR Momentum</th>
                              <th className="p-8 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Studio Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {rawSubmissions?.map((site: any) => {
                             const siteStats = globalStats?.find(gs => gs.id === site.id);
                             const ctr = siteStats?.visitCount ? ((siteStats.visitCount / (siteStats.visitCount * 4)) * 100).toFixed(1) : "0.0";
                             return (
                                <tr key={site.id} className="group hover:bg-white/[0.02] transition-colors">
                                   <td className="p-8">
                                      <div className="flex items-center gap-6">
                                         <div className="w-16 h-16 rounded-[1.25rem] bg-[#0B0A0F] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                            <WebsitePreview 
                                              websiteUrl={site.url}
                                              fallbackUrl={site.logoUrl}
                                              alt={site.name || "Tool"}
                                              width={64}
                                              height={64}
                                              className="w-full h-full object-cover"
                                            />
                                         </div>
                                         <div className="min-w-0">
                                            <p className="text-sm font-black italic tracking-tighter text-white group-hover:text-primary transition-colors truncate">{site.url.replace('https://', '')}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium opacity-40 italic mt-0.5">Updated {site.timestamp ? formatDistanceToNow(site.timestamp.toDate()) : 'Recently'} ago</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="p-8">
                                      <div className="flex justify-center">
                                         <Badge className={cn(
                                            "uppercase text-[9px] font-black px-3 py-1 rounded-full border-none",
                                            site.status === 'approved' ? "bg-emerald-500/10 text-emerald-400" :
                                            site.status === 'rejected' ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
                                         )}>
                                            {site.status || 'pending'}
                                         </Badge>
                                      </div>
                                   </td>
                                   <td className="p-8">
                                      <div className="flex items-center gap-6">
                                         <div className="text-center">
                                            <p className="text-sm font-black italic tracking-tighter text-white">{(siteStats?.visitCount || 0) * 4}</p>
                                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Views</p>
                                         </div>
                                         <div className="text-center">
                                            <p className="text-sm font-black italic tracking-tighter text-white">{siteStats?.visitCount || 0}</p>
                                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Clicks</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="p-8">
                                      <div className="flex items-center gap-3">
                                         <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(123,51,255,0.6)]" style={{ width: `${Math.min(parseFloat(ctr) * 4, 100)}%` }} />
                                         </div>
                                         <span className="text-[10px] font-black text-primary italic">{ctr}%</span>
                                      </div>
                                   </td>
                                   <td className="p-8">
                                      <div className="flex items-center justify-end gap-2">
                                         <button className="p-3 hover:bg-white/5 rounded-xl transition-all text-muted-foreground hover:text-white" title="Promotion Studio"><Flame className="w-4 h-4" /></button>
                                         <button className="p-3 hover:bg-white/5 rounded-xl transition-all text-muted-foreground hover:text-white" title="Performance Suite"><BarChart3 className="w-4 h-4" /></button>
                                         <button className="p-3 hover:bg-white/5 rounded-xl transition-all text-muted-foreground hover:text-white"><Edit className="w-4 h-4" /></button>
                                         <button className="p-3 hover:bg-destructive/10 rounded-xl transition-all text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                                      </div>
                                   </td>
                                </tr>
                             );
                           })}
                           {(!rawSubmissions || rawSubmissions.length === 0) && (
                             <tr>
                                <td colSpan={5} className="p-40 text-center text-muted-foreground italic font-medium opacity-20">The registry is currently empty. Submit your first project to unlock performance metrics.</td>
                             </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'promotions' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-gradient-to-r from-primary/20 to-purple-500/10 p-10 sm:p-16 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -mr-48 -mt-48 transition-transform group-hover:scale-110 duration-1000" />
                  <div className="relative z-10 max-w-2xl space-y-6">
                    <Badge className="bg-primary text-white border-none px-4 py-1 rounded-full font-black uppercase tracking-widest italic text-[10px]">Boost Discovery</Badge>
                    <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter leading-none">Reach More <span className="text-primary">Curators.</span></h2>
                    <p className="text-lg text-muted-foreground font-medium">Promote your high-quality websites to the front page and category highlights to increase traffic by up to 400%.</p>
                    <Button className="h-16 px-12 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm italic shadow-2xl hover:scale-105 transition-all">
                      Create New Promotion <ArrowUpRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Active Campaigns" value="3" icon={Megaphone} trend="Live" trendUp color="text-emerald-500" />
                  <StatCard label="Total Ad Clicks" value="14.2k" icon={MousePointer2} trend="+18%" trendUp />
                  <StatCard label="Total Spend" value="$240.00" icon={CreditCard} trend="Budget OK" trendUp color="text-blue-500" />
                  <StatCard label="Estimated Reach" value="85k+" icon={Zap} trend="+12k" trendUp color="text-amber-500" />
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                  <Card className="xl:col-span-2 bg-[#121117] border-white/5 p-10 rounded-[3.5rem] space-y-10 shadow-2xl">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">Campaign Distribution</h3>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary"><div className="w-2 h-2 rounded-full bg-primary" /> Performance</div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground/30"><div className="w-2 h-2 rounded-full bg-white/10" /> Goal</div>
                      </div>
                    </div>
                    <div className="h-96 flex items-center justify-center border border-white/5 rounded-3xl bg-white/[0.01]">
                       <PieChart className="w-24 h-24 text-white/10" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 absolute">Ad Data Synchronizing</span>
                    </div>
                  </Card>

                  <div className="space-y-8">
                     <Card className="bg-primary/5 border-primary/20 p-8 rounded-[3rem] space-y-6">
                        <div className="flex items-center gap-3">
                           <Sparkles className="w-5 h-5 text-primary" />
                           <h4 className="text-lg font-black italic uppercase tracking-tighter">AI Ad Assistant</h4>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">"Your campaign in the <span className="text-white font-bold">Programming</span> category is outperforming generic placements by 24%. We recommend shifting 15% of your budget there."</p>
                        <Button variant="outline" className="w-full border-primary/20 bg-primary/10 hover:bg-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary italic">Apply Optimization</Button>
                     </Card>

                     <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 italic ml-4">Recent Ad Events</h4>
                        <div className="space-y-3">
                           {[
                             { label: 'Campaign Started', time: '2h ago', color: 'bg-emerald-500' },
                             { label: 'Payment Received', time: '5h ago', color: 'bg-blue-500' },
                             { label: 'Ad Approved', time: '1d ago', color: 'bg-primary' }
                           ].map((e, i) => (
                             <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-4">
                                   <div className={cn("w-2 h-2 rounded-full", e.color)} />
                                   <span className="text-[11px] font-bold">{e.label}</span>
                                </div>
                                <span className="text-[9px] font-black uppercase text-muted-foreground/40">{e.time}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter ml-4">Active Campaigns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[1, 2].map(i => (
                       <Card key={i} className="bg-[#121117] border-white/5 p-8 rounded-[3rem] flex items-center justify-between group hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-6">
                             <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                                <ImageIcon className="w-8 h-8 text-white/5" />
                             </div>
                             <div className="min-w-0">
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] font-black mb-2">ACTIVE</Badge>
                                <h4 className="text-lg font-black italic tracking-tighter text-white truncate">Campaign_{i}.app</h4>
                                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">Homepage Featured • 7 Days Left</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black italic text-white leading-none">4.2k</p>
                             <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest mt-1">Clicks</p>
                          </div>
                       </Card>
                     ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter ml-4">Billing & Payouts</h3>
                  <Card className="bg-[#121117] border-white/5 rounded-[3rem] overflow-hidden">
                     <table className="w-full text-left">
                        <thead className="bg-white/5">
                           <tr>
                              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Invoice ID</th>
                              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Date</th>
                              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Amount</th>
                              <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Status</th>
                              <th className="p-8 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {[1, 2, 3].map(i => (
                             <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-8 text-xs font-bold font-code opacity-40">#BESS_0923{i}</td>
                                <td className="p-8 text-[11px] font-bold text-white/60">Oct {10+i}, 2024</td>
                                <td className="p-8 text-sm font-black italic text-white">$80.00</td>
                                <td className="p-8"><Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] font-black">PAID</Badge></td>
                                <td className="p-8 text-right"><button className="text-[10px] font-black uppercase text-primary italic hover:underline">Download PDF</button></td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </Card>
               </div>
            </div>
          )}

          {activeView !== 'overview' && activeView !== 'my-websites' && activeView !== 'promotions' && (
             <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-32 h-32 bg-primary/5 rounded-[3.5rem] flex items-center justify-center text-primary mb-4 shadow-inner">
                   <Logo className="w-16 h-16 opacity-20 grayscale" />
                </div>
                <div className="space-y-3">
                   <h3 className="text-5xl font-black italic uppercase tracking-tighter">Module Sync <span className="text-primary">Required</span></h3>
                   <p className="text-muted-foreground font-medium max-w-lg mx-auto opacity-60">The <span className="text-white font-bold">{activeView.toUpperCase()}</span> infrastructure is currently being synchronized with the primary Bessites discovery cluster.</p>
                </div>
                <Button variant="outline" onClick={() => setActiveView('overview')} className="rounded-full h-16 px-16 border-white/10 bg-white/5 font-black uppercase tracking-widest text-xs italic hover:bg-primary hover:text-white transition-all shadow-xl">Back to Dashboard</Button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, trendUp, color = "text-primary" }: { label: string, value: string, icon: any, trend: string, trendUp: boolean, color?: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] group hover:scale-[1.02] hover:bg-[#1A1823] transition-all duration-500 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-default">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-[40px] -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors" />
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={cn("p-3 rounded-2xl bg-white/5 transition-all group-hover:scale-110", color)}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className={cn("flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full", trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground/40")}>
           {trendUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : null}
           {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-1">{label}</p>
        <h4 className="text-2xl sm:text-4xl font-black italic tracking-tighter text-white tabular-nums leading-none">{value}</h4>
      </div>
    </Card>
  );
}

function SmallWebsiteCard({ site, globalStats }: { site: any, globalStats: any[] | null }) {
  const siteStats = globalStats?.find(gs => gs.id === site.id);
  return (
    <div className="bg-[#121117] border border-white/5 p-5 rounded-[2rem] flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer shadow-lg overflow-hidden relative">
       <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-[#0B0A0F] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
             <WebsitePreview 
                websiteUrl={site.url}
                fallbackUrl={site.logoUrl}
                alt={site.name || "Tool"}
                width={48}
                height={48}
                className="w-full h-full"
             />
          </div>
          <div className="min-w-0">
             <h4 className="text-sm font-black italic tracking-tighter text-white truncate">{site.url.replace('https://', '')}</h4>
             <p className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-widest mt-0.5">{site.categories?.[0] || 'Web App'}</p>
          </div>
       </div>
       <div className="text-right ml-4">
          <p className="text-sm font-black italic text-white leading-none">{(siteStats?.visitCount || 0) * 4}</p>
          <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-widest">Views</p>
       </div>
    </div>
  );
}

function AudienceWidget() {
  const regions = [
    { name: 'India', val: '42%', color: 'bg-primary', icon: Globe },
    { name: 'USA', val: '28%', color: 'bg-indigo-400', icon: Target },
    { name: 'UK', val: '15%', color: 'bg-sky-400', icon: Activity },
    { name: 'Germany', val: '10%', color: 'bg-cyan-500', icon: Layers }
  ];
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-xl space-y-8 relative overflow-hidden group">
       <div className="flex justify-between items-center relative z-10">
          <h3 className="text-lg font-black italic uppercase tracking-tighter">Audience Pulse</h3>
          <Map className="w-4 h-4 text-primary" />
       </div>
       <div className="space-y-5 relative z-10">
          {regions.map(r => (
            <div key={r.name} className="space-y-1.5">
               <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <r.icon className="w-2.5 h-2.5 opacity-40" />
                    <span className="text-white/60">{r.name}</span>
                  </div>
                  <span className="text-white/30">{r.val}</span>
               </div>
               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", r.color)} style={{ width: r.val }} />
               </div>
            </div>
          ))}
       </div>
    </Card>
  );
}

function RecentActivityPanel() {
  const activity = [
    { icon: Heart, label: 'Someone liked your website.', time: '2m ago', color: 'text-rose-500' },
    { icon: Bookmark, label: 'Someone saved your website.', time: '15m ago', color: 'text-amber-500' },
    { icon: Check, label: 'Website approved by admin.', time: '1h ago', color: 'text-emerald-500' }
  ];
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-xl space-y-8">
       <div className="flex justify-between items-center">
          <h3 className="text-lg font-black italic uppercase tracking-tighter">Live Pulse</h3>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
       </div>
       <div className="space-y-6">
          {activity.map((act, i) => (
             <div key={i} className="flex items-start gap-4 group">
                <div className={cn("p-2 rounded-xl bg-white/5 shrink-0 group-hover:scale-110 transition-transform", act.color)}><act.icon className="w-3.5 h-3.5" /></div>
                <div className="min-w-0">
                   <p className="text-[11px] font-bold text-white/60 leading-tight tracking-tight group-hover:text-white transition-colors">{act.label}</p>
                   <p className="text-[9px] font-black uppercase text-muted-foreground/20 tracking-widest mt-1 italic">{act.time}</p>
                </div>
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
        "w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all relative overflow-hidden group text-left", 
        active ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
      )}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(123,51,255,1)]" />}
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-primary" : "group-hover:text-white")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg">{badge}</span>
      )}
    </button>
  );
}
