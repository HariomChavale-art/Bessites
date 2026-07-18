
'use client';

import { useMemo, useState, useEffect, useRef } from "react";
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
  PieChart as PieChartIcon,
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
  Download,
  Send,
  User as UserIcon,
  Layers,
  ArrowDown,
  ActivityIcon,
  History,
  Timer,
  Navigation2,
  Laptop,
  Chrome,
  Code,
  SmartphoneIcon,
  Monitor,
  Tablet,
  Search as SearchLucide,
  Briefcase,
  Music,
  ShoppingBag,
  Clapperboard,
  BookOpen,
  Smartphone as PhoneIcon,
  Building2,
  Globe2,
  Rocket,
  Wallet,
  Receipt,
  ShieldAlert,
  MoreHorizontal
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
import { chatWithAstra } from "@/ai/flows/assistant-chat-flow";
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
  Area,
  BarChart,
  Bar
} from 'recharts';

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

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Mock data for graphs
const CHART_DATA = [
  { name: 'Mon', views: 2400, clicks: 400, ctr: 12.5, likes: 45, saves: 32, followers: 2, shares: 12, impressions: 5000 },
  { name: 'Tue', views: 3000, clicks: 650, ctr: 14.2, likes: 58, saves: 41, followers: 5, shares: 28, impressions: 7200 },
  { name: 'Wed', views: 2000, clicks: 320, ctr: 11.0, likes: 33, saves: 28, followers: 1, shares: 15, impressions: 4100 },
  { name: 'Thu', views: 2780, clicks: 510, ctr: 13.5, likes: 49, saves: 35, followers: 4, shares: 22, impressions: 6400 },
  { name: 'Fri', views: 1890, clicks: 280, ctr: 10.2, likes: 21, saves: 19, followers: 0, shares: 8, impressions: 3800 },
  { name: 'Sat', views: 2390, clicks: 440, ctr: 12.8, likes: 42, saves: 30, followers: 3, shares: 31, impressions: 5900 },
  { name: 'Sun', views: 3490, clicks: 820, ctr: 15.6, likes: 74, saves: 55, followers: 8, shares: 45, impressions: 8800 },
];

const SOURCE_DATA = [
  { name: 'Home Feed', value: 45, color: '#7B33FF' },
  { name: 'Search', value: 25, color: '#85A3FF' },
  { name: 'Categories', value: 15, color: '#2D79FF' },
  { name: 'Recommendations', value: 10, color: '#AB33FF' },
  { name: 'Google', value: 3, color: '#FF5F56' },
  { name: 'Social', value: 2, color: '#FFBD2E' },
];

const CAMPAIGN_DISTRIBUTION = [
  { name: 'Homepage Featured', value: 40, color: '#7B33FF' },
  { name: 'Trending Section', value: 25, color: '#85A3FF' },
  { name: 'Category Featured', value: 15, color: '#2D79FF' },
  { name: 'Search Results', value: 10, color: '#AB33FF' },
  { name: 'Editor\'s Choice', value: 10, color: '#00D1FF' },
];

export default function UserDashboard() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // AI Assistant State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Greetings, Creator. I am Astra. Ready to optimize your digital discovery path? What shall we focus on today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    if (!rawSubmissions || !globalStats) return { 
      views: "0", clicks: "0", saves: "0", likes: "0", followers: "124", rating: "4.8", ctr: "12.4%", earnings: "$0.00", shares: "842",
      total: 0, approved: 0, pending: 0, rejected: 0
    };
    
    const myApproved = rawSubmissions.filter(s => s.status === 'approved');
    const myApprovedIds = myApproved.map(s => s.id);
    const myStats = globalStats.filter(gs => myApprovedIds.includes(gs.id));
    
    const totalClicks = myStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0);
    const totalLikes = myStats.reduce((acc, curr) => acc + (curr.likeCount || 0), 0);
    const totalShares = myStats.reduce((acc, curr) => acc + (curr.shareCount || 0), 0);
    
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
      shares: totalShares.toLocaleString(),
      total: rawSubmissions.length,
      approved: rawSubmissions.filter(s => s.status === 'approved').length,
      pending: rawSubmissions.filter(s => s.status === 'pending').length,
      rejected: rawSubmissions.filter(s => s.status === 'rejected').length
    };
  }, [rawSubmissions, globalStats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent, customMsg?: string) => {
    e?.preventDefault();
    const messageToSend = customMsg || input;
    if (!messageToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await chatWithAstra({ 
        message: messageToSend, 
        history: messages 
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Communication Interrupted",
        description: "Astra is currently recalibrating. Please try again."
      });
    } finally {
      setIsTyping(false);
    }
  };

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
      <div className="mb-10 px-2">
         <Link href="/" className="group block">
            <div className="flex flex-col items-start gap-1 group">
              <span className="text-2xl font-black italic uppercase tracking-tighter block leading-none text-white">Bessites</span>
              <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60 mt-1 block">Creator Studio</span>
            </div>
         </Link>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pb-10">
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
          <Link href="/" className="flex flex-col items-start scale-75 origin-left">
            <span className="text-2xl font-black italic uppercase tracking-tighter text-white">Bessites</span>
            <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">Creator Studio</span>
          </Link>
          
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
               <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white">
                 {activeView === 'my-websites' ? 'Digital Property Manager' : 
                  activeView === 'analytics' ? 'Analytics Command Center' : 
                  activeView === 'audience' ? 'Audience Insights' : 
                  activeView === 'promotions' ? 'Promotion Studio' :
                  activeView === 'ai-assistant' ? 'Astra Strategy Hub' : `Welcome, ${profile?.displayName?.split(' ')[0] || 'Curator'} 👋`}
               </h1>
               <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">🥇 Rising Creator</Badge>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">Creator Level 01</p>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
               <div className="relative group w-full sm:w-96">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    placeholder="Search studio global data..." 
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

        <div className="p-4 sm:p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col gap-8 md:gap-12 pb-32 flex-1">
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
                              <button key={q} onClick={() => { setActiveView('ai-assistant'); handleSendMessage(undefined, q); }} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.08] transition-all group/btn text-left">
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

          {activeView === 'promotions' && (
            <div className="space-y-12 animate-in fade-in duration-700">
               {/* Welcome Banner */}
               <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/5 p-10 sm:p-16 rounded-[4rem] relative overflow-hidden shadow-2xl group">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -mr-[200px] -mt-[200px] transition-all group-hover:bg-primary/20" />
                  <div className="relative z-10 space-y-6">
                     <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1 italic">🚀 Boost Discovery Pipeline</Badge>
                     <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Reach More <span className="text-primary">Curators.</span></h2>
                     <p className="text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed">
                        Promotions help your website gain massive visibility across the Bessites ecosystem. Boost high-quality properties to the Homepage, Trending, and Category frontlines.
                     </p>
                     <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                        <div className="relative group/search w-full sm:w-96">
                           <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
                           <input 
                              placeholder="Search your registry to promote..." 
                              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:italic" 
                           />
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 shadow-xl">
                           <div className="flex items-center gap-3 px-4 py-2 border-r border-white/10">
                              <Wallet className="w-4 h-4 text-primary" />
                              <div>
                                 <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Promotion Balance</p>
                                 <p className="text-sm font-black italic text-white">$420.00</p>
                              </div>
                           </div>
                           <button className="p-3 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground relative">
                              <Bell className="w-5 h-5" />
                              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                           </button>
                        </div>
                     </div>
                  </div>
               </Card>

               {/* Promotion Stats Row */}
               <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
                  <PromotionStatCard label="Active Promotions" value="3" icon={Rocket} color="text-sky-500" />
                  <PromotionStatCard label="Total Promo Clicks" value="14.2k" icon={MousePointer2} color="text-primary" trend="+18%" trendUp />
                  <PromotionStatCard label="Total Promo Views" value="124k" icon={Eye} color="text-blue-400" trend="+12%" trendUp />
                  <PromotionStatCard label="Average CTR" value="11.4%" icon={TrendingUp} color="text-emerald-400" trend="+1.2%" trendUp />
                  <PromotionStatCard label="Total Spend" value="$1,240" icon={DollarSign} color="text-purple-500" />
                  <PromotionStatCard label="Remaining Budget" value="$420.00" icon={Wallet} color="text-amber-500" />
                  <PromotionStatCard label="Conversion Rate" value="8.4%" icon={Zap} color="text-rose-400" />
                  <PromotionStatCard label="Estimated Reach" value="2.1M" icon={Globe} color="text-indigo-400" />
                  <PromotionStatCard label="Websites Promoted" value="8" icon={Grid} color="text-cyan-400" />
                  <PromotionStatCard label="Performance Score" value="94" icon={Award} color="text-yellow-500" trend="High" trendUp />
               </div>

               {/* Main Graph & Distribution Row */}
               <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 md:gap-12">
                  <div className="xl:col-span-3">
                     <Card className="bg-[#121117] border-white/5 p-8 sm:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group h-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
                           <div className="space-y-1">
                              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Promotion Performance</h3>
                              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40">Interactive campaign stream</p>
                           </div>
                           <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                              {['Today', '7 Days', '30 Days', '90 Days', '1 Year', 'Lifetime'].map(f => (
                                <button key={f} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all shrink-0", f === '30 Days' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white")}>{f}</button>
                              ))}
                           </div>
                        </div>
                        
                        <div className="h-[450px] w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={CHART_DATA}>
                                 <defs>
                                    <linearGradient id="promoImpressions" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#7B33FF" stopOpacity={0.3}/>
                                       <stop offset="95%" stopColor="#7B33FF" stopOpacity={0}/>
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} />
                                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} />
                                 <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#1A1823', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', color: '#fff' }}
                                    itemStyle={{ color: '#7B33FF', fontWeight: 900 }}
                                 />
                                 <Area type="monotone" dataKey="impressions" stroke="#7B33FF" strokeWidth={4} fillOpacity={1} fill="url(#promoImpressions)" />
                                 <Area type="monotone" dataKey="clicks" stroke="#85A3FF" strokeWidth={2} fillOpacity={0} />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </Card>
                  </div>

                  <div className="space-y-8 md:space-y-12">
                     <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-xl space-y-8">
                        <div className="flex justify-between items-center">
                           <h3 className="text-lg font-black italic uppercase tracking-tighter">Campaign Distribution</h3>
                           <PieChartIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="h-48 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie
                                    data={CAMPAIGN_DISTRIBUTION}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                 >
                                    {CAMPAIGN_DISTRIBUTION.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                 </Pie>
                                 <RechartsTooltip />
                              </PieChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                           {CAMPAIGN_DISTRIBUTION.map((s, i) => (
                              <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest group cursor-default">
                                 <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                                    <span className="text-white/60 group-hover:text-white transition-colors">{s.name}</span>
                                 </div>
                                 <span className="text-white/30">{s.value}%</span>
                              </div>
                           ))}
                        </div>
                        <div className="pt-6 border-t border-white/5 space-y-4">
                           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                              <span className="text-muted-foreground/40">Best Placement</span>
                              <span className="text-primary italic">Homepage Featured</span>
                           </div>
                           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                              <span className="text-muted-foreground/40">Highest CTR</span>
                              <span className="text-emerald-400">14.2%</span>
                           </div>
                        </div>
                     </Card>

                     {/* AI Promotion Assistant Card */}
                     <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-primary/10 p-8 rounded-[3rem] shadow-xl space-y-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[60px]" />
                        <div className="flex items-center gap-3 relative z-10">
                           <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><Sparkles className="w-4 h-4" /></div>
                           <h3 className="text-lg font-black italic uppercase tracking-tighter">AI Promotion Assistant</h3>
                        </div>
                        <div className="space-y-4 relative z-10">
                           {[
                              "Boost in Programming category.",
                              "Update thumbnail for +12% CTR.",
                              "Peak hours: 6 PM - 10 PM.",
                              "Try a 7-day campaign strategy."
                           ].map((insight, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/insight cursor-default">
                                 <div className="w-1 h-1 rounded-full bg-primary mt-1.5 group-hover/insight:scale-150 transition-transform" />
                                 <p className="text-[10px] font-bold text-white/60 group-hover/insight:text-white transition-colors leading-relaxed">"{insight}"</p>
                              </div>
                           ))}
                        </div>
                     </Card>
                  </div>
               </div>

               {/* Active Campaigns Table */}
               <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                     <div className="space-y-1">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">The Campaign Ledger</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40 italic">Active & Historical Registry</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                           {['Active', 'Pending', 'Scheduled', 'Completed'].map(f => (
                              <button key={f} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all shrink-0", f === 'Active' ? "bg-white text-black shadow-lg" : "text-muted-foreground hover:text-white")}>{f}</button>
                           ))}
                        </div>
                        <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 font-black uppercase tracking-widest text-[9px] h-11 italic"><Filter className="w-3.5 h-3.5 mr-2" /> Sort By</Button>
                     </div>
                  </div>

                  <div className="bg-[#121117] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
                     <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left min-w-[1400px]">
                           <thead className="bg-white/5">
                              <tr>
                                 <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Digital Property</th>
                                 <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Campaign Type</th>
                                 <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Duration</th>
                                 <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Budget</th>
                                 <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 text-center">Status</th>
                                 <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Impressions</th>
                                 <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Clicks</th>
                                 <th className="p-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">CTR</th>
                                 <th className="p-8 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Operations</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {[
                                 { name: 'Krea AI', url: 'https://krea.ai', type: 'Homepage Banner', start: '2024-06-01', end: '2024-06-08', budget: '$450.00', status: 'Active', views: '42.1k', clicks: '4,280', ctr: '10.2%', days: 4 },
                                 { name: 'Jan.ai', url: 'https://jan.ai', type: 'Category Featured', start: '2024-06-02', end: '2024-06-05', budget: '$120.00', status: 'Active', views: '12.8k', clicks: '1,540', ctr: '12.0%', days: 1 },
                                 { name: 'FlowGPT', url: 'https://flowgpt.com', type: 'Trending Boost', start: '2024-06-03', end: '2024-06-10', budget: '$300.00', status: 'Scheduled', views: '0', clicks: '0', ctr: '0%', days: 7 },
                                 { name: 'Wolfram Alpha', url: 'https://wolframalpha.com', type: 'Editor\'s Choice', start: '2024-05-15', end: '2024-05-22', budget: '$0.00', status: 'Completed', views: '102k', clicks: '14.2k', ctr: '13.9%', days: 0 }
                              ].map((promo, idx) => (
                                 <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-8">
                                       <div className="flex items-center gap-6">
                                          <div className="w-14 h-14 rounded-2xl bg-[#0B0A0F] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                             <WebsitePreview 
                                                websiteUrl={promo.url}
                                                alt={promo.name}
                                                width={56}
                                                height={56}
                                                className="w-full h-full object-cover"
                                             />
                                          </div>
                                          <div className="min-w-0">
                                             <p className="text-sm font-black italic tracking-tighter text-white group-hover:text-primary transition-colors truncate">{promo.name}</p>
                                             <p className="text-[10px] text-muted-foreground font-medium opacity-40 italic mt-0.5">{promo.url.replace('https://', '')}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="p-8">
                                       <Badge className="bg-white/5 text-white/60 border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 italic">{promo.type}</Badge>
                                    </td>
                                    <td className="p-8">
                                       <div className="space-y-1">
                                          <p className="text-[10px] font-black text-white/80">{promo.start} — {promo.end}</p>
                                          <p className="text-[9px] font-black uppercase text-muted-foreground/30 italic">{promo.days > 0 ? `${promo.days} days remaining` : 'Campaign Over'}</p>
                                       </div>
                                    </td>
                                    <td className="p-8">
                                       <span className="text-sm font-black italic tracking-tighter text-white">{promo.budget}</span>
                                    </td>
                                    <td className="p-8">
                                       <div className="flex justify-center">
                                          <Badge className={cn(
                                             "uppercase text-[9px] font-black px-4 py-1 rounded-full border-none",
                                             promo.status === 'Active' ? "bg-emerald-500/10 text-emerald-400" : 
                                             promo.status === 'Scheduled' ? "bg-sky-500/10 text-sky-400" :
                                             promo.status === 'Completed' ? "bg-white/10 text-white/40" : "bg-white/5 text-muted-foreground/30"
                                          )}>
                                             {promo.status}
                                          </Badge>
                                       </div>
                                    </td>
                                    <td className="p-8">
                                       <span className="text-sm font-black italic tracking-tighter text-white">{promo.views}</span>
                                    </td>
                                    <td className="p-8">
                                       <span className="text-sm font-black italic tracking-tighter text-white">{promo.clicks}</span>
                                    </td>
                                    <td className="p-8">
                                       <span className="text-sm font-black italic tracking-tighter text-primary">{promo.ctr}</span>
                                    </td>
                                    <td className="p-8">
                                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          {promo.status === 'Active' && <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-white/10 rounded-xl text-white/40" title="Pause"><History className="w-4 h-4" /></Button>}
                                          <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-white/10 rounded-xl text-white/40" title="Settings"><MoreHorizontal className="w-4 h-4" /></Button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               {/* Bottom CTA & Quick Actions Grid */}
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12">
                  {/* Create New Promotion Card */}
                  <Card className="xl:col-span-2 bg-gradient-to-br from-primary to-purple-800 border-none p-10 sm:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] -mr-[150px] -mt-[150px] transition-all group-hover:bg-white/20" />
                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0">
                           <Rocket className="w-20 h-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-6">
                           <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">Ready to Go <span className="underline decoration-white/40 underline-offset-8">Global?</span></h2>
                           <p className="text-lg text-white/80 font-medium leading-relaxed"> Launch your next digital property to the top of our discovery pipelines in 5 easy steps.</p>
                           <Button className="h-16 px-16 rounded-full bg-white text-black font-black uppercase tracking-widest text-lg italic hover:scale-105 transition-all shadow-2xl">
                              Create New Promotion
                           </Button>
                        </div>
                     </div>
                  </Card>

                  {/* Payment & Billing Summary */}
                  <Card className="bg-[#121117] border-white/5 p-8 rounded-[3.5rem] shadow-xl space-y-8">
                     <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Billing Registry</h3>
                        <Receipt className="w-5 h-5 text-primary" />
                     </div>
                     <div className="space-y-4">
                        {[
                           { date: 'Jun 02', name: 'Homepage Featured', val: '$450', status: 'Paid' },
                           { date: 'May 28', name: 'Category Boost', val: '$120', status: 'Paid' },
                           { date: 'May 15', name: 'Trending Pipeline', val: '$300', status: 'Paid' }
                        ].map((bill, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                              <div className="flex items-center gap-4">
                                 <div className="text-[10px] font-black text-muted-foreground/30 uppercase">{bill.date}</div>
                                 <div>
                                    <p className="text-[11px] font-bold text-white/80 group-hover:text-primary transition-colors">{bill.name}</p>
                                    <p className="text-[9px] font-black uppercase text-muted-foreground/20 tracking-widest mt-0.5">{bill.status}</p>
                                 </div>
                              </div>
                              <span className="text-[11px] font-black italic text-white">{bill.val}</span>
                           </div>
                        ))}
                     </div>
                     <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] italic hover:bg-white/10">Download All Invoices</Button>
                  </Card>
               </div>

               {/* Recent Activity Feed */}
               <Card className="bg-[#121117] border-white/5 p-8 sm:p-12 rounded-[3.5rem] shadow-xl space-y-10">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Promotion Activity Feed</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] opacity-40">Live campaign pulse</p>
                     </div>
                     <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(123,51,255,1)]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[
                        { icon: Check, label: 'Campaign approved: Krea AI', time: '2m ago', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { icon: Rocket, label: 'Campaign started: jan.ai', time: '15m ago', color: 'text-sky-500', bg: 'bg-sky-500/10' },
                        { icon: Award, label: 'Editor\'s Choice: Wolfram Alpha', time: '1h ago', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                        { icon: DollarSign, label: 'Payment received: $450.00', time: '3h ago', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        { icon: ShieldAlert, label: 'Budget almost exhausted', time: '5h ago', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { icon: History, label: 'Promotion paused manually', time: '1d ago', color: 'text-white/40', bg: 'bg-white/5' }
                     ].map((act, i) => (
                        <div key={i} className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/[0.01] border border-white/[0.03] hover:border-white/10 transition-all group">
                           <div className={cn("p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform", act.bg, act.color)}>
                              <act.icon className="w-5 h-5" />
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-white/80 group-hover:text-white transition-colors truncate">{act.label}</p>
                              <p className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-widest mt-1 italic">{act.time}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>
          )}

          {activeView !== 'overview' && activeView !== 'my-websites' && activeView !== 'ai-assistant' && activeView !== 'analytics' && activeView !== 'audience' && activeView !== 'promotions' && (
             <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-32 h-32 bg-primary/5 rounded-[3.5rem] flex items-center justify-center text-primary mb-4 shadow-inner">
                   <Zap className="w-16 h-16 opacity-20 grayscale" />
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

function StatCard({ label, value, icon: Icon, trend, trendUp, color = "text-primary" }: { label: string, value: string, icon: any, trend?: string, trendUp?: boolean, color?: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] group hover:scale-[1.02] hover:bg-[#1A1823] transition-all duration-500 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-default">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-[40px] -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors" />
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={cn("p-3 rounded-2xl bg-white/5 transition-all group-hover:scale-110", color)}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        {trend && (
           <div className={cn("flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full", trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground/40")}>
              {trendUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : null}
              {trend}
           </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-1">{label}</p>
        <h4 className="text-2xl sm:text-4xl font-black italic tracking-tighter text-white tabular-nums leading-none">{value}</h4>
      </div>
    </Card>
  );
}

function PromotionStatCard({ label, value, icon: Icon, trend, trendUp, color = "text-primary" }: { label: string, value: string, icon: any, trend?: string, trendUp?: boolean, color?: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-5 sm:p-6 rounded-[1.75rem] sm:rounded-[2.25rem] group hover:scale-[1.02] hover:bg-[#1A1823] transition-all duration-500 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-default">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] blur-3xl -mr-12 -mt-12" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={cn("p-2.5 rounded-xl bg-white/5 transition-all group-hover:scale-110", color)}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        {trend && (
           <div className={cn("flex items-center gap-1 text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full", trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground/40")}>
              {trend}
           </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1 leading-tight">{label}</p>
        <h4 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white tabular-nums leading-none">{value}</h4>
      </div>
    </Card>
  );
}

function AudienceStatCard({ label, value, growth, icon: Icon, color }: { label: string, value: string, growth: string, icon: any, color: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all">
       <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] blur-3xl -mr-16 -mt-16" />
       <div className="flex justify-between items-start mb-6">
          <div className={cn("p-4 rounded-2xl bg-white/5", color)}>
             <Icon className="w-6 h-6" />
          </div>
          <div className="text-right">
             <div className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter", growth.startsWith('+') ? "text-emerald-400" : "text-rose-400")}>
                {growth.startsWith('+') ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {growth}
             </div>
             <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">vs last month</p>
          </div>
       </div>
       <div className="space-y-1">
          <p className="text-4xl font-black italic tracking-tighter text-white">{value}</p>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40">{label}</p>
       </div>
    </Card>
  );
}

function AnalyticsSummaryCard({ label, value, trend, trendUp, color, icon: Icon }: { label: string, value: string, trend: string, trendUp: boolean, color: string, icon: any }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all">
       <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] blur-3xl -mr-16 -mt-16" />
       <div className="flex justify-between items-start mb-6">
          <div className={cn("p-4 rounded-2xl bg-white/5", color)}>
             <Icon className="w-6 h-6" />
          </div>
          <div className="text-right">
             <div className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter", trendUp ? "text-emerald-400" : "text-rose-400")}>
                {trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {trend}
             </div>
             <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">vs last month</p>
          </div>
       </div>
       <div className="space-y-1">
          <p className="text-4xl font-black italic tracking-tighter text-white">{value}</p>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40">{label}</p>
       </div>
       <div className="h-12 w-full mt-6 opacity-30">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
             <path d="M0,80 Q25,20 50,70 T100,30" fill="none" stroke="currentColor" strokeWidth="4" className={color} />
          </svg>
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
             <h4 className="text-sm font-black italic tracking-tighter text-white truncate">{site.name || site.url.replace('https://', '')}</h4>
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
