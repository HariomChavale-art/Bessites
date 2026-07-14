
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
  Trash2,
  LayoutDashboard,
  Inbox,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  DollarSign,
  TrendingUp,
  MoreVertical,
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
  ArrowRight
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

export default function UserDashboard() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  
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
    if (!rawSubmissions || !globalStats) return { clicks: "0", views: "0", total: 0 };
    const myApprovedIds = rawSubmissions.filter(s => s.status === 'approved').map(s => s.id);
    const myStats = globalStats.filter(gs => myApprovedIds.includes(gs.id));
    const clicks = myStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0);
    return {
      clicks: clicks.toLocaleString(),
      views: (clicks * 4).toLocaleString(),
      total: clicks
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
    <div className="min-h-screen bg-[#0B0A0F] text-white p-4 sm:p-8 font-body selection:bg-primary/30">
      
      {/* Helios Main Container */}
      <div className="max-w-[1600px] mx-auto bg-[#121117] border border-white/5 rounded-[2.5rem] flex flex-col lg:flex-row overflow-hidden shadow-2xl min-h-[90vh]">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 p-8 flex flex-col border-r border-white/5">
          <div className="flex items-center gap-3 mb-12">
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" fill="currentColor" />
             </div>
             <span className="text-xl font-headline font-extrabold tracking-tight">Bessites.ai</span>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={Globe} label="Portfolio" />
            <SidebarItem icon={BarChart3} label="Analysis" />
            <SidebarItem icon={Star} label="Market" />
            <SidebarItem icon={Users} label="Community" />
          </nav>

          <div className="mt-auto pt-8 space-y-2">
             <SidebarItem icon={Settings} label="Settings" />
             <SidebarItem icon={HelpCircle} label="Support" />
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 sm:p-12 overflow-y-auto no-scrollbar flex flex-col gap-10">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
               <h1 className="text-3xl sm:text-4xl font-headline font-extrabold text-white tracking-tight mb-2">Welcome, {profile?.displayName?.split(' ')[0] || 'Curator'}</h1>
               <p className="text-muted-foreground text-sm font-medium">Here's your discovery performance overview</p>
            </div>
            
            <div className="flex items-center gap-4">
               <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-white transition-all"><Bell className="w-5 h-5" /></button>
               <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-white transition-all"><SettingsIcon className="w-5 h-5" /></button>
               <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                    <AvatarImage src={profile?.photoURL} />
                    <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                     <p className="text-sm font-black tracking-tight">{profile?.displayName}</p>
                     <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{user?.email?.split('@')[0]}</p>
                  </div>
               </div>
            </div>
          </header>

          {/* Top Row: Quick Filters & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
             <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                {['Impact', 'Discovery', 'Tools'].map((tab, i) => (
                  <button key={tab} className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    i === 1 ? "bg-[#1E1C26] text-white shadow-xl" : "text-muted-foreground hover:text-white"
                  )}>{tab}</button>
                ))}
             </div>

             <div className="relative group w-full sm:w-96">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="Ask Bessites.ai anything" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-sm font-medium focus:ring-1 focus:ring-primary/50 outline-none transition-all" 
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 rounded-lg"><Mic className="w-3.5 h-3.5 text-primary" /></button>
             </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
             
             {/* Total Discovery Impact */}
             <Card className="bg-[#18161E] border-white/5 p-8 rounded-[2rem] relative overflow-hidden group shadow-xl">
                <div className="flex justify-between items-center mb-10">
                   <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">Total Discovery Impact</span>
                   <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold flex items-center gap-1.5">6M <ChevronRight className="w-3 h-3 rotate-90" /></div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                   <span className="text-4xl font-headline font-black text-white">$</span>
                   <span className="text-4xl font-headline font-black text-white">{stats.clicks}</span>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
             </Card>

             {/* Decisions Powered by AI */}
             <Card className="bg-gradient-to-br from-[#1E1C26] to-[#121117] border-white/10 p-8 rounded-[2rem] relative overflow-hidden group shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-lg font-headline font-extrabold text-white leading-tight">Decisions Powered by Data</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[180px]">Move beyond guesswork with AI-driven investment insights.</p>
                </div>
                <Button className="w-full mt-6 bg-[#2A2732] hover:bg-[#34303D] text-white rounded-full h-12 text-xs font-black uppercase tracking-widest relative z-10 border border-white/5">
                  Explore AI Insights
                </Button>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/40 blur-xl shadow-[0_0_30px_rgba(123,51,255,1)]" />
             </Card>

             {/* Trending Categories */}
             <Card className="bg-[#18161E] border-white/5 p-8 rounded-[2rem] relative shadow-xl xl:col-span-1">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-sm font-black uppercase tracking-widest text-white">Trending Interests</h3>
                </div>
                <div className="flex gap-2 mb-6">
                   {['Most Viewed', 'Gain', 'Loss'].map((t, i) => (
                     <button key={t} className={cn(
                       "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all",
                       i === 0 ? "bg-white/10 border-white/10 text-white" : "text-muted-foreground border-white/5 hover:border-white/20"
                     )}>{t}</button>
                   ))}
                </div>
                <div className="space-y-5">
                   <TrendingRow name="AI & Generative" value="$11,770.3" change="+16.31%" />
                   <TrendingRow name="Gaming Ports" value="$10,280.8" change="+8.11%" />
                   <TrendingRow name="Web Utilities" value="$8,510.2" change="+4.89%" />
                   <TrendingRow name="Creative Arts" value="$2,110.2" change="+2.12%" />
                </div>
             </Card>

             {/* Top Projects */}
             <Card className="bg-[#18161E] border-white/5 p-8 rounded-[2rem] relative shadow-xl">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-sm font-black uppercase tracking-widest text-white">My Projects</h3>
                   <Button variant="ghost" size="sm" className="h-8 px-4 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">See all <ArrowUpRight className="w-3 h-3" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <PortfolioSmallCard name="AAPL" value="$ 1,721.3" units="104" color="bg-white/5" />
                   <PortfolioSmallCard name="AMZN" value="$ 1,721.3" units="12" color="bg-white/5" />
                   <PortfolioSmallCard name="MSFT" value="$ 1,721.3" units="41" color="bg-white/5" />
                   <PortfolioSmallCard name="NVDA" value="$ 1,721.3" units="16" color="bg-white/5" />
                </div>
             </Card>

          </div>

          {/* Performance Chart Section */}
          <Card className="bg-[#18161E] border-white/5 p-8 rounded-[3rem] relative shadow-xl overflow-hidden">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-headline font-extrabold text-white">Portfolio Performance</h3>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  {['1D', '1W', '1M', '6M', '1Y'].map((p, i) => (
                    <button key={p} className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                      i === 4 ? "bg-[#25222E] text-white shadow-xl" : "text-muted-foreground hover:text-white"
                    )}>{p}</button>
                  ))}
                </div>
             </div>
             
             <div className="h-64 relative">
                {/* Simplified SVG Path Replicating Chart from image */}
                <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7B33FF" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#7B33FF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0,100 C 50,80 100,120 150,90 C 200,60 250,140 300,110 C 350,80 400,120 450,95 C 500,70 550,130 600,100 C 650,70 700,150 750,120 C 800,90 850,140 900,110 C 950,80 1000,100 L 1000,200 L 0,200 Z" 
                    fill="url(#chartGradient)" 
                  />
                  <path 
                    d="M0,100 C 50,80 100,120 150,90 C 200,60 250,140 300,110 C 350,80 400,120 450,95 C 500,70 550,130 600,100 C 650,70 700,150 750,120 C 800,90 850,140 900,110 C 950,80 1000,100" 
                    fill="none" stroke="#7B33FF" strokeWidth="3" 
                  />
                  {/* Tooltip dot */}
                  <circle cx="600" cy="100" r="6" fill="#7B33FF" stroke="white" strokeWidth="2" />
                  <line x1="600" y1="100" x2="600" y2="200" stroke="#7B33FF" strokeDasharray="5,5" opacity="0.4" />
                </svg>

                {/* Legend Overlay */}
                <div className="absolute top-0 left-[60%] -translate-x-1/2 -mt-10">
                   <div className="bg-[#2A2732] border border-white/10 p-3 rounded-2xl shadow-2xl flex flex-col items-center">
                      <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">1st Jun 2025</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black">$ 16,500</span>
                        <Badge className="bg-green-500/20 text-green-500 border-none text-[8px] font-black">+2.5%</Badge>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex justify-between mt-6 px-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <span key={m} className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">{m}</span>
                ))}
             </div>
          </Card>

        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative overflow-hidden group",
      active ? "text-white bg-gradient-to-r from-primary/30 to-transparent" : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
    )}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(123,51,255,1)]" />}
      <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:scale-110 transition-transform")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function TrendingRow({ name, value, change }: { name: string, value: string, change: string }) {
  return (
    <div className="flex items-center justify-between group cursor-default">
       <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:scale-150 transition-transform" />
          <span className="text-xs font-bold text-white/80">{name}</span>
       </div>
       <div className="text-right">
          <p className="text-[10px] font-black text-white">{value}</p>
          <p className="text-[9px] font-bold text-green-500 tracking-tighter">{change}</p>
       </div>
    </div>
  );
}

function PortfolioSmallCard({ name, value, units, color }: { name: string, value: string, units: string, color: string }) {
  return (
    <div className={cn("p-5 rounded-2xl border border-white/5 flex flex-col gap-1 transition-transform hover:scale-[1.02]", color)}>
       <p className="text-[10px] font-black text-white mb-2">{value}</p>
       <div className="flex items-center gap-2 text-[8px] font-black text-green-500 uppercase tracking-tighter mb-4"><ArrowUpRight className="w-3 h-3" /> 12.3% (0.7%)</div>
       <div className="flex items-center justify-between mt-auto">
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{name}</span>
          <span className="text-[8px] font-black text-white/60">Units <span className="text-white font-black">{units}</span></span>
       </div>
    </div>
  );
}
