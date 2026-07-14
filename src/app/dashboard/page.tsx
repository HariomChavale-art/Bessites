
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, doc, query, where, orderBy } from "firebase/firestore";
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
  Calendar
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

type DashboardSection = 
  | 'overview' 
  | 'websites' 
  | 'analytics' 
  | 'saved' 
  | 'liked' 
  | 'submit' 
  | 'submissions' 
  | 'sponsored' 
  | 'billing' 
  | 'followers' 
  | 'messages' 
  | 'notifications' 
  | 'settings' 
  | 'help';

type DateRange = 'today' | '7d' | '30d' | '90d' | 'all';

export default function UserDashboard() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [dateRange, setDateRange] = useState<DateRange>('30d');

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

  const savedRef = useMemo(() => {
    if (!user || !db) return null;
    return collection(db, "users", user.uid, "likedWebsites");
  }, [user, db]);
  const { data: savedItems } = useCollection(savedRef);

  const likedRef = useMemo(() => {
    if (!user || !db) return null;
    return collection(db, "users", user.uid, "userLikes");
  }, [user, db]);
  const { data: likedItems } = useCollection(likedRef);

  // Computed Real-Time Stats
  const stats = useMemo(() => {
    if (!rawSubmissions || !globalStats) return {
      totalSubmitted: 0,
      totalViews: 0,
      totalClicks: 0,
      totalSaves: savedItems?.length || 0,
      totalLikes: likedItems?.length || 0,
      avgCtr: "0.00%",
      sponsoredViews: 0,
      earnings: "$0.00"
    };

    const myApprovedIds = rawSubmissions.filter(s => s.status === 'approved').map(s => s.id);
    const myStats = globalStats.filter(gs => myApprovedIds.includes(gs.id));
    
    const clicks = myStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0);
    const views = clicks * 4.2; // Mock views calculation based on clicks for MVP
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(2) : "0.00";

    return {
      totalSubmitted: rawSubmissions.length,
      totalViews: Math.round(views).toLocaleString(),
      totalClicks: clicks.toLocaleString(),
      totalSaves: (savedItems?.length || 0).toLocaleString(),
      totalLikes: (likedItems?.length || 0).toLocaleString(),
      avgCtr: `${ctr}%`,
      sponsoredViews: 0,
      earnings: "$0.00"
    };
  }, [rawSubmissions, globalStats, savedItems, likedItems]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0A0F] text-white selection:bg-primary/30 antialiased">
      <div className="flex flex-1 overflow-hidden">
        
        {/* SaaS Professional Sidebar */}
        <aside className="w-72 border-r border-white/5 bg-[#121019] flex flex-col hidden lg:flex shrink-0">
          <div className="p-8">
            <Link href="/" className="flex items-center gap-3 mb-10 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black italic uppercase tracking-tighter block leading-none">Bessites</span>
                <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">Curator Hub</span>
              </div>
            </Link>
            
            <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] no-scrollbar pr-2">
              <SidebarSection label="Personal Lab">
                <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
                <SidebarLink icon={Globe} label="My Websites" active={activeSection === 'websites'} onClick={() => setActiveSection('websites')} />
                <SidebarLink icon={BarChart3} label="Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />
                <SidebarLink icon={Star} label="Saved Websites" active={activeSection === 'saved'} onClick={() => setActiveSection('saved')} />
                <SidebarLink icon={Heart} label="Liked Websites" active={activeSection === 'liked'} onClick={() => setActiveSection('liked')} />
              </SidebarSection>
              
              <SidebarSection label="Publishing">
                <SidebarLink icon={Plus} label="Submit Website" active={activeSection === 'submit'} onClick={() => router.push('/submit')} />
                <SidebarLink icon={Inbox} label="My Submissions" active={activeSection === 'submissions'} onClick={() => setActiveSection('submissions')} badge={rawSubmissions?.filter(s => s.status === 'pending').length} />
              </SidebarSection>
              
              <SidebarSection label="Business">
                <SidebarLink icon={Zap} label="Sponsored Listings" active={activeSection === 'sponsored'} onClick={() => setActiveSection('sponsored')} />
                <SidebarLink icon={CreditCard} label="Billing & Payments" active={activeSection === 'billing'} onClick={() => setActiveSection('billing')} />
              </SidebarSection>

              <SidebarSection label="Social (Future)">
                <SidebarLink icon={Users} label="Followers" active={activeSection === 'followers'} onClick={() => setActiveSection('followers')} />
                <SidebarLink icon={MessageSquare} label="Messages" active={activeSection === 'messages'} onClick={() => setActiveSection('messages')} />
              </SidebarSection>

              <SidebarSection label="Account">
                <SidebarLink icon={Bell} label="Notifications" active={activeSection === 'notifications'} onClick={() => setActiveSection('notifications')} />
                <SidebarLink icon={Settings} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
                <SidebarLink icon={HelpCircle} label="Help Center" active={activeSection === 'help'} onClick={() => setActiveSection('help')} />
              </SidebarSection>
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01]">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all text-sm font-bold group">
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Command Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar bg-background">
          
          {/* Top SaaS Header */}
          <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-20">
            <div className="flex flex-col">
              <h2 className="text-lg font-black italic uppercase tracking-tighter">Welcome back, {profile?.displayName?.split(' ')[0] || 'Curator'} 👋</h2>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">Here is your discovery summary for today.</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                {(['today', '7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                  <button 
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                      dateRange === range ? "bg-primary text-white shadow-lg" : "text-muted-foreground/60 hover:text-white"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground relative group">
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-4 ring-background" />
                </button>
                
                <Avatar className="w-10 h-10 border-2 border-white/10 shadow-xl cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveSection('settings')}>
                  <AvatarImage src={profile?.photoURL} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-black">{profile?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground">
                      <Menu className="w-6 h-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#121019] border-white/10 text-white w-64 rounded-2xl p-2 shadow-2xl">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-4 py-2">Quick Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push('/submit')} className="rounded-xl focus:bg-white/5 cursor-pointer flex gap-3 px-4 py-3">
                      <Plus className="w-4 h-4 text-primary" /> <span className="text-sm font-bold">New Submission</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveSection('analytics')} className="rounded-xl focus:bg-white/5 cursor-pointer flex gap-3 px-4 py-3">
                      <BarChart3 className="w-4 h-4 text-primary" /> <span className="text-sm font-bold">Deep Analytics</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5 my-1" />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer flex gap-3 px-4 py-3 font-black italic uppercase tracking-widest text-[10px]">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="p-8 sm:p-12 space-y-12 max-w-[1800px] mx-auto w-full">
            
            {activeSection === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 8 Statistic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Total Submitted" value={stats.totalSubmitted} icon={Globe} color="text-blue-500" />
                  <StatCard label="Total Views" value={stats.totalViews} icon={Eye} color="text-indigo-400" />
                  <StatCard label="Total Clicks" value={stats.totalClicks} icon={MousePointer2} color="text-primary" />
                  <StatCard label="Total Saves" value={stats.totalSaves} icon={Bookmark} color="text-amber-500" />
                  <StatCard label="Total Likes" value={stats.totalLikes} icon={Heart} color="text-pink-500" />
                  <StatCard label="Average CTR" value={stats.avgCtr} icon={TrendingUp} color="text-green-500" />
                  <StatCard label="Sponsored Views" value={stats.sponsoredViews} icon={Zap} color="text-yellow-500" />
                  <StatCard label="Earnings (Future)" value={stats.earnings} icon={DollarSign} color="text-emerald-500" />
                </div>

                {/* Growth Graphs Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <DashboardChart title="Website Clicks Over Time" subtitle="Daily interaction flow" data={[40, 65, 45, 90, 75, 55, 80, 100]} color="bg-primary" />
                  <DashboardChart title="Website Views Over Time" subtitle="Traffic and impressions" data={[80, 50, 95, 40, 60, 85, 45, 70]} color="bg-indigo-500" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <DashboardList 
                        title="Top Performing Websites" 
                        items={rawSubmissions?.filter(s => s.status === 'approved').slice(0, 3).map(s => ({
                          name: s.url.replace('https://', '').split('/')[0],
                          value: 'Top Ranked',
                          icon: Globe
                        })) || []} 
                      />
                      <DashboardList 
                        title="Category Performance" 
                        items={[
                          { name: 'AI & Generative Tools', value: '34%' },
                          { name: 'Developer Utilities', value: '28%' },
                          { name: 'Design Inspiration', value: '15%' }
                        ]} 
                        icon={PieChart}
                      />
                    </div>
                    
                    <DashboardTable 
                      title="Recent Submitted Websites" 
                      subtitle="Status tracking for your projects"
                      items={rawSubmissions?.slice(0, 5) || []}
                    />
                  </div>

                  <div className="space-y-8">
                    <ActivityFeed 
                      title="Recent Activity" 
                      items={[
                        { user: 'Someone', action: 'liked your website', time: '2m ago' },
                        { user: 'System', action: 'approved your submission', time: '1h ago' },
                        { user: 'Someone', action: 'saved your project', time: '3h ago' },
                        { user: 'System', action: 'new feature available', time: '1d ago' }
                      ]} 
                    />
                    <AchievementCard 
                      title="Achievements" 
                      items={[
                        { label: 'First Website Submitted', unlocked: true },
                        { label: '100 Views Milestone', unlocked: true },
                        { label: '1000 Views Milestone', unlocked: false },
                        { label: 'Verified Creator', unlocked: false }
                      ]} 
                    />
                    <QuickActions />
                  </div>
                </div>
              </div>
            )}

            {activeSection !== 'overview' && (
              <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-32 h-32 bg-primary/5 rounded-[3rem] flex items-center justify-center text-primary mb-4 shadow-2xl shadow-primary/10">
                   <ShieldCheck className="w-16 h-16 opacity-40" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter">Module <span className="text-primary">Operational</span></h3>
                  <p className="text-muted-foreground font-medium max-w-lg mx-auto opacity-60">The <span className="text-white font-bold">{activeSection.toUpperCase()}</span> infrastructure is live. Detailed views for this module are synchronized with your profile data.</p>
                </div>
                <Button variant="outline" onClick={() => setActiveSection('overview')} className="rounded-full h-16 px-16 border-white/10 bg-white/5 font-black uppercase tracking-widest text-xs italic hover:bg-primary hover:text-white transition-all">Back to Command Center</Button>
              </div>
            )}

          </div>
        </main>
      </div>
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

function SidebarLink({ icon: Icon, label, active, onClick, badge }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all text-sm font-bold group",
        active ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "text-muted-foreground/60 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-white" : "")} />
      <span className="flex-1 text-left truncate tracking-tight">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-primary text-white text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-lg animate-pulse">{badge}</span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-[#121019] border border-white/5 p-6 rounded-[2.25rem] flex flex-col justify-between group hover:border-white/10 transition-all cursor-default relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-center justify-between mb-6 relative">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{label}</p>
        <div className={cn("p-3 rounded-xl bg-white/5 shadow-inner transition-transform group-hover:scale-110", color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-4xl font-black tracking-tighter relative tabular-nums leading-none">{value}</p>
    </div>
  );
}

function DashboardChart({ title, subtitle, data, color }: { title: string, subtitle: string, data: number[], color: string }) {
  return (
    <div className="bg-[#121019] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
       <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.25em] opacity-40 mt-1">{subtitle}</p>
          </div>
          <Calendar className="w-5 h-5 text-muted-foreground/40" />
       </div>
       <div className="h-64 w-full flex items-end justify-between gap-2 pb-6 border-b border-white/5">
          {data.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar cursor-pointer">
              <div 
                className={cn("w-full opacity-20 hover:opacity-100 transition-all rounded-t-xl relative", color)} 
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1823] border border-white/5 text-white text-[10px] font-black px-3 py-1 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-2xl">{h}%</div>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
}

function DashboardList({ title, items, icon: Icon = Zap }: { title: string, items: any[], icon?: any }) {
  return (
    <div className="bg-[#121019] border border-white/5 rounded-[3rem] p-8 space-y-8 shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary/40 glow-primary group-hover:scale-150 transition-transform" />
              <span className="text-xs font-black text-white/80 truncate max-w-[200px]">{item.name}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardTable({ title, subtitle, items }: { title: string, subtitle: string, items: any[] }) {
  return (
    <div className="bg-[#121019] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-8 pb-4">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h3>
        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.25em] opacity-40 mt-1">{subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-y border-white/5">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Website</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clicks</th>
              <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((sub: any) => (
              <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="p-6">
                  <p className="text-sm font-black truncate group-hover:text-primary transition-colors">{sub.url.replace('https://', '').split('/')[0]}</p>
                </td>
                <td className="p-6">
                  <Badge className={cn(
                    "uppercase text-[8px] font-black px-3 py-1 rounded-full border-none",
                    sub.status === 'approved' ? "bg-green-500/10 text-green-500" :
                    sub.status === 'rejected' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {sub.status || 'pending'}
                  </Badge>
                </td>
                <td className="p-6 font-mono text-xs opacity-60">--</td>
                <td className="p-6 text-right text-[10px] text-muted-foreground opacity-40">
                  {sub.timestamp ? new Date(sub.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivityFeed({ title, items }: { title: string, items: any[] }) {
  return (
    <div className="bg-[#121019] border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl">
      <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 relative">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(123,51,255,0.8)]" />
            <div className="space-y-1">
              <p className="text-xs font-bold leading-tight">
                <span className="text-primary">{item.user}</span> {item.action}
              </p>
              <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ title, items }: { title: string, items: any[] }) {
  return (
    <div className="bg-[#121019] border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl">
      <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item, i) => (
          <div key={i} className={cn(
            "p-4 rounded-2xl border flex items-center gap-4 transition-all",
            item.unlocked ? "bg-primary/10 border-primary/20" : "bg-white/[0.02] border-white/5 opacity-40 grayscale"
          )}>
            <Trophy className={cn("w-5 h-5", item.unlocked ? "text-primary" : "text-muted-foreground")} />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-gradient-to-br from-primary/20 to-transparent border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl">
      <h3 className="text-xl font-black italic uppercase tracking-tighter">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        <Button className="w-full bg-white text-black font-black uppercase tracking-widest h-14 rounded-2xl hover:bg-white/90">Submit Website</Button>
        <Button variant="ghost" className="w-full font-black uppercase tracking-widest h-14 rounded-2xl hover:bg-white/5 border border-white/5">Manage Websites</Button>
      </div>
    </div>
  );
}
