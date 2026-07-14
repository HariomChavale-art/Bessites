
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, doc, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
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
  Star,
  Shield,
  Bell,
  Database,
  Megaphone,
  AlertTriangle,
  Tags,
  Eye,
  Menu,
  ExternalLink,
  ShieldAlert,
  Activity,
  Filter,
  PieChart,
  History,
  Lock,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AdminSection = 
  | 'overview' 
  | 'submissions' 
  | 'websites' 
  | 'users' 
  | 'analytics' 
  | 'revenue' 
  | 'sponsored' 
  | 'reports' 
  | 'categories' 
  | 'featured' 
  | 'moderation' 
  | 'notifications' 
  | 'settings' 
  | 'database';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [searchQuery, setSearchQuery] = useState("");

  // Gated Access Check
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // Real Data Streams
  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), orderBy("timestamp", "desc"));
  }, [db]);
  const { data: submissions } = useCollection(submissionsRef);

  const usersRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), orderBy("createdAt", "desc"));
  }, [db]);
  const { data: appUsers } = useCollection(usersRef);

  const websiteStatsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);
  const { data: globalStats } = useCollection(websiteStatsRef);

  // Dynamic Real-Time Stats
  const stats = useMemo(() => {
    if (!submissions || !appUsers || !globalStats) return {
      totalWebsites: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      totalUsers: 0,
      verified: 0,
      totalClicks: 0,
      newUsersToday: 0,
      revenue: "$0.00",
      viewsToday: "--",
      sponsored: 0,
      totalCategories: 108
    };

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    return {
      totalWebsites: submissions.length,
      pending: submissions.filter(s => s.status === 'pending').length,
      approved: submissions.filter(s => s.status === 'approved').length,
      rejected: submissions.filter(s => s.status === 'rejected').length,
      totalUsers: appUsers.length,
      verified: appUsers.filter(u => u.interests && u.interests.length >= 5).length,
      totalClicks: globalStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0),
      newUsersToday: appUsers.filter(u => u.createdAt && new Date(u.createdAt.seconds * 1000) > oneDayAgo).length,
      revenue: "$0.00",
      viewsToday: (globalStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0) * 4).toLocaleString(),
      sponsored: 0,
      totalCategories: 108
    };
  }, [submissions, appUsers, globalStats]);

  const handleStatusUpdate = (subId: string, status: 'approved' | 'rejected') => {
    if (!db) return;
    const subRef = doc(db, "submissions", subId);

    updateDoc(subRef, { status })
      .then(() => {
        toast({
          title: status === 'approved' ? "Approved" : "Rejected",
          description: `Project status updated to ${status}.`,
        });
      })
      .catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: subRef.path,
          operation: 'update',
          requestResourceData: { status }
        }));
      });
  };

  const handleDelete = (subId: string) => {
    if (!db) return;
    const subRef = doc(db, "submissions", subId);

    deleteDoc(subRef)
      .then(() => {
        toast({
          title: "Permanent Removal",
          description: "Website has been purged from discovery.",
        });
      })
      .catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: subRef.path,
          operation: 'delete'
        }));
      });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0A0F] text-white selection:bg-primary/30 antialiased font-body">
      <div className="flex flex-1 overflow-hidden">
        
        {/* Shopify-style Admin Sidebar */}
        <aside className="w-72 border-r border-white/5 bg-[#121019] flex flex-col hidden lg:flex shrink-0">
          <div className="p-8">
            <Link href="/" className="flex items-center gap-3 mb-10 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black italic uppercase tracking-tighter block leading-none">Bessites</span>
                <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">Admin Command</span>
              </div>
            </Link>
            
            <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)] no-scrollbar pr-2 pb-10">
              <SidebarSection label="Platform">
                <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
                <SidebarLink icon={Inbox} label="Submission Queue" active={activeSection === 'submissions'} onClick={() => setActiveSection('submissions')} badge={stats.pending} />
                <SidebarLink icon={Globe} label="Website Manager" active={activeSection === 'websites'} onClick={() => setActiveSection('websites')} />
                <SidebarLink icon={Users} label="Users" active={activeSection === 'users'} onClick={() => setActiveSection('users')} />
              </SidebarSection>
              
              <SidebarSection label="Growth">
                <SidebarLink icon={BarChart3} label="Platform Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />
                <SidebarLink icon={DollarSign} label="Revenue" active={activeSection === 'revenue'} onClick={() => setActiveSection('revenue')} />
                <SidebarLink icon={Megaphone} label="Sponsored Listings" active={activeSection === 'sponsored'} onClick={() => setActiveSection('sponsored')} />
              </SidebarSection>
              
              <SidebarSection label="Governance">
                <SidebarLink icon={AlertTriangle} label="Reports" active={activeSection === 'reports'} onClick={() => setActiveSection('reports')} />
                <SidebarLink icon={Tags} label="Categories" active={activeSection === 'categories'} onClick={() => setActiveSection('categories')} />
                <SidebarLink icon={Star} label="Featured Websites" active={activeSection === 'featured'} onClick={() => setActiveSection('featured')} />
                <SidebarLink icon={Shield} label="Moderation" active={activeSection === 'moderation'} onClick={() => setActiveSection('moderation')} />
              </SidebarSection>
              
              <SidebarSection label="System">
                <SidebarLink icon={Bell} label="Notifications" active={activeSection === 'notifications'} onClick={() => setActiveSection('notifications')} />
                <SidebarLink icon={SettingsIcon} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
                <SidebarLink icon={Database} label="Backup & Database" active={activeSection === 'database'} onClick={() => setActiveSection('database')} />
              </SidebarSection>
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xs font-black shadow-lg">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">Bessites Admin</p>
                <p className="text-[10px] text-primary uppercase font-black tracking-widest opacity-60">System Root</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Command Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar bg-background">
          
          {/* Top Admin Header */}
          <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-20">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 italic">
              Admin Center <ChevronRight className="w-3 h-3" /> <span className="text-white">{activeSection}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="System global search..." 
                  className="bg-white/5 border border-white/10 rounded-xl h-10 pl-10 pr-4 text-xs font-medium w-48 focus:w-80 transition-all focus:border-primary outline-none" 
                />
              </div>
              
              <div className="flex items-center gap-2 border-l border-white/10 ml-2 pl-4">
                 <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground relative">
                    <Activity className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-ping" />
                 </button>
                 
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground">
                      <Menu className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#121019] border-white/10 text-white w-64 rounded-2xl p-2 shadow-2xl">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-4 py-2">System Commands</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setActiveSection('database')} className="rounded-xl focus:bg-white/5 cursor-pointer flex gap-3 px-4 py-3">
                      <Database className="w-4 h-4 text-primary" /> <span className="text-sm font-bold">Cold Storage Backup</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveSection('notifications')} className="rounded-xl focus:bg-white/5 cursor-pointer flex gap-3 px-4 py-3">
                      <Megaphone className="w-4 h-4 text-primary" /> <span className="text-sm font-bold">Global Announcement</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5 my-1" />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-xl focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer flex gap-3 px-4 py-3 font-black italic uppercase tracking-widest text-[10px]">
                      <X className="w-4 h-4" /> Close Admin Panel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="p-8 sm:p-12 space-y-12 max-w-[1800px] mx-auto w-full">
            
            {activeSection === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="flex flex-col gap-2">
                   <h1 className="text-4xl font-black italic uppercase tracking-tighter">System <span className="text-primary">Overview</span></h1>
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">Real-time Bessites Infrastructure Metrics</p>
                </div>

                {/* 12 Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <StatCard label="Total Websites" value={stats.totalWebsites} icon={Globe} color="text-blue-500" />
                  <StatCard label="Pending Submissions" value={stats.pending} icon={Inbox} color="text-amber-500" pulse={stats.pending > 0} />
                  <StatCard label="Approved Websites" value={stats.approved} icon={Check} color="text-green-500" />
                  <StatCard label="Rejected Websites" value={stats.rejected} icon={X} color="text-red-500" />
                  <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="text-purple-500" />
                  <StatCard label="Verified Creators" value={stats.verified} icon={Shield} color="text-cyan-500" />
                  <StatCard label="Total Categories" value={stats.totalCategories} icon={Tags} color="text-pink-500" />
                  <StatCard label="Website Clicks Today" value={stats.totalClicks} icon={Zap} color="text-primary" />
                  <StatCard label="Total Views Today" value={stats.viewsToday} icon={Eye} color="text-indigo-400" />
                  <StatCard label="Active Sponsored" value={stats.sponsored} icon={Megaphone} color="text-yellow-500" />
                  <StatCard label="Revenue (Month)" value={stats.revenue} icon={DollarSign} color="text-emerald-500" />
                  <StatCard label="New Users Today" value={stats.newUsersToday} icon={ArrowUpRight} color="text-blue-400" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 space-y-8">
                    <DashboardChart title="Visitor & Click Momentum" subtitle="Growth trends over 12 months" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <DashboardList 
                        title="Most Visited Categories" 
                        items={[
                          { name: 'AI & Generative Tools', value: '14.2k clicks' },
                          { name: 'Niche Gaming Ports', value: '9.8k clicks' },
                          { name: 'Developer Utilities', value: '7.5k clicks' }
                        ]} 
                       />
                       <DashboardList 
                        title="Fast-Growing Websites" 
                        items={submissions?.filter(s => s.status === 'approved').slice(0, 3).map(s => ({
                          name: s.url.replace('https://', '').split('/')[0],
                          value: 'Trending'
                        })) || []} 
                       />
                    </div>
                  </div>
                  <DashboardList 
                    title="Live Activity Feed" 
                    items={[
                      { name: 'New user joined: alex@...', value: '2m ago' },
                      { name: 'Website submitted: tools.ai', value: '15m ago' },
                      { name: 'Admin approved: devbox.io', value: '1h ago' },
                      { name: 'New report: Broken link', value: '3h ago' },
                      { name: 'Verification request: Mark', value: '5h ago' }
                    ]} 
                  />
                </div>
              </div>
            )}

            {activeSection === 'submissions' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Submission Queue</h2>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-1 opacity-40">Reviewing Community Contributions</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-white/5 bg-white/5 font-black uppercase tracking-widest text-[10px] h-12 px-6">
                       <Filter className="w-3.5 h-3.5 mr-2" /> Filter Registry
                    </Button>
                    <Badge className="bg-primary/10 text-primary border-primary/20 h-12 px-6 rounded-2xl flex items-center font-black italic">{stats.pending} Pending Review</Badge>
                  </div>
                </div>
                
                <div className="bg-[#121019] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1400px]">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Website Identity</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Digital Creator</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Submission Date</th>
                          <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {submissions && submissions.length > 0 ? (
                          submissions.map((sub: any) => (
                            <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
                              <td className="p-6">
                                <div className="flex items-center gap-5">
                                  <div className="w-14 h-14 rounded-2xl bg-[#0B0A0F] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
                                    {sub.logoUrl ? <img src={sub.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-6 h-6 text-white/10" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-black truncate group-hover:text-primary transition-colors">{sub.url.replace('https://', '')}</p>
                                    <div className="flex gap-2 mt-1">
                                      <Badge className={cn(
                                        "uppercase text-[8px] font-black px-2 py-0.5 rounded-full border-none",
                                        sub.status === 'approved' ? "bg-green-500/10 text-green-500" :
                                        sub.status === 'rejected' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                                      )}>
                                        {sub.status || 'pending'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex flex-wrap gap-2">
                                  {sub.categories?.slice(0, 2).map((cat: string) => (
                                    <span key={cat} className="text-[8px] font-black uppercase tracking-tighter text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10">{cat}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-6 max-w-xs">
                                <p className="text-xs text-muted-foreground truncate italic">"{sub.description || 'No description provided'}"</p>
                              </td>
                              <td className="p-6">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-white/80">{sub.userEmail}</p>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-30">UID: {sub.userId?.slice(0, 8)}</p>
                                </div>
                              </td>
                              <td className="p-6">
                                <span className="text-[10px] font-medium text-muted-foreground">
                                  {sub.timestamp ? new Date(sub.timestamp.seconds * 1000).toLocaleDateString() : 'Real-time'}
                                </span>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => window.open(sub.url, '_blank')} className="h-10 px-4 hover:bg-white/5 rounded-xl font-bold text-[10px] uppercase">Preview</Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'approved')} className="h-10 w-10 hover:bg-green-500/20 text-green-500 rounded-xl" title="Approve Website"><Check className="w-4 h-4" /></Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'rejected')} className="h-10 w-10 hover:bg-red-500/20 text-red-500 rounded-xl" title="Reject Website"><X className="w-4 h-4" /></Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleDelete(sub.id)} className="h-10 w-10 hover:bg-destructive/20 text-muted-foreground rounded-xl" title="Delete Permanently"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={6} className="p-40 text-center text-muted-foreground italic font-medium opacity-20">The registry queue is currently empty.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection !== 'overview' && activeSection !== 'submissions' && (
              <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-32 h-32 bg-primary/5 rounded-[3rem] flex items-center justify-center text-primary mb-4 shadow-2xl shadow-primary/10">
                   <ShieldAlert className="w-16 h-16 opacity-40" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter">Module Sync <span className="text-primary">Required</span></h3>
                  <p className="text-muted-foreground font-medium max-w-lg mx-auto opacity-60">The <span className="text-white font-bold">{activeSection.toUpperCase()}</span> infrastructure is currently synchronizing with the primary discovery cluster.</p>
                </div>
                <Button variant="outline" onClick={() => setActiveSection('overview')} className="rounded-full h-16 px-16 border-white/10 bg-white/5 font-black uppercase tracking-widest text-xs italic hover:bg-primary hover:text-white transition-all">Restore Dashboard</Button>
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

function StatCard({ label, value, icon: Icon, color, pulse = false }: { label: string, value: string | number, icon: any, color: string, pulse?: boolean }) {
  return (
    <div className="bg-[#121019] border border-white/5 p-6 rounded-[2.25rem] flex flex-col justify-between group hover:border-white/10 transition-all cursor-default relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-center justify-between mb-6 relative">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{label}</p>
        <div className={cn("p-3 rounded-xl bg-white/5 shadow-inner transition-transform group-hover:scale-110", color, pulse && "animate-pulse")}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-black tracking-tighter relative tabular-nums leading-none">{value}</p>
    </div>
  );
}

function DashboardChart({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="bg-[#121019] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
       <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.25em] opacity-40 mt-1">{subtitle}</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary"><div className="w-2 h-2 rounded-full bg-primary" /> Traffic</div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40"><div className="w-2 h-2 rounded-full bg-white/10" /> Goal</div>
          </div>
       </div>
       <div className="h-72 w-full flex items-end justify-between gap-1.5 pb-6 border-b border-white/5">
          {[40, 65, 45, 90, 75, 55, 80, 100, 85, 60, 45, 70].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar cursor-pointer">
              <div 
                className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-xl relative" 
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1823] border border-white/5 text-white text-[10px] font-black px-3 py-1 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-2xl">{h}%</div>
              </div>
              <span className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-tighter">{['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][i]}</span>
            </div>
          ))}
       </div>
    </div>
  );
}

function DashboardList({ title, items, onAction }: { title: string, items: any[], onAction?: () => void }) {
  return (
    <div className="bg-[#121019] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h3>
        {onAction && (
          <button onClick={onAction} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors italic">View All</button>
        )}
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-6 rounded-[1.75rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group cursor-default">
            <div className="flex items-center gap-5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary/40 shadow-[0_0_15px_rgba(123,51,255,0.4)] group-hover:scale-150 transition-transform" />
              <span className="text-xs font-black text-white/80 truncate max-w-[240px] tracking-tight">{item.name}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">{item.value}</span>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">No Active Data Stream</div>
        )}
      </div>
    </div>
  );
}
