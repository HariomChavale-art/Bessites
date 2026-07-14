
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc } from "@/firebase";
import { collection, doc, updateDoc, deleteDoc, query, orderBy, limit, increment, serverTimestamp, where } from "firebase/firestore";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  MoreHorizontal,
  ExternalLink,
  ShieldAlert,
  ArrowDownRight,
  Filter
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

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userDocRef);

  // Gated Access Check
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // Submissions for real stats
  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), orderBy("timestamp", "desc"));
  }, [db]);
  const { data: submissions } = useCollection(submissionsRef);

  // Users for real stats
  const usersRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), orderBy("createdAt", "desc"));
  }, [db]);
  const { data: appUsers } = useCollection(usersRef);

  // Stats for click aggregations
  const websiteStatsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);
  const { data: globalStats } = useCollection(websiteStatsRef);

  // Calculate Real-Time Aggregates
  const stats = useMemo(() => {
    if (!submissions || !appUsers || !globalStats) return {
      totalWebsites: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      totalUsers: 0,
      verified: 0,
      totalClicks: 0,
      newUsersToday: 0
    };

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    return {
      totalWebsites: submissions.length,
      pending: submissions.filter(s => s.status === 'pending').length,
      approved: submissions.filter(s => s.status === 'approved').length,
      rejected: submissions.filter(s => s.status === 'rejected').length,
      totalUsers: appUsers.length,
      verified: appUsers.filter(u => u.interests && u.interests.length >= 3).length,
      totalClicks: globalStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0),
      newUsersToday: appUsers.filter(u => u.createdAt && new Date(u.createdAt.seconds * 1000) > oneDayAgo).length
    };
  }, [submissions, appUsers, globalStats]);

  const handleStatusUpdate = (subId: string, status: 'approved' | 'rejected') => {
    if (!db) return;
    const subRef = doc(db, "submissions", subId);

    updateDoc(subRef, { status })
      .then(() => {
        toast({
          title: status === 'approved' ? "Approved" : "Rejected",
          description: `Submission is now ${status}.`,
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
          title: "Deleted",
          description: "Submission removed permanently.",
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
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary/30 antialiased">
      <div className="flex flex-1 overflow-hidden">
        
        {/* Shopify-style Admin Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-white/[0.01] flex flex-col hidden lg:flex shrink-0">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-3 mb-10 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-black italic uppercase tracking-tighter">Admin <span className="text-primary">Center</span></span>
            </Link>
            
            <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] no-scrollbar pr-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-3 mb-2">Platform</p>
              <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
              <SidebarLink icon={Inbox} label="Submission Queue" active={activeSection === 'submissions'} onClick={() => setActiveSection('submissions')} badge={stats.pending} />
              <SidebarLink icon={Globe} label="Website Manager" active={activeSection === 'websites'} onClick={() => setActiveSection('websites')} />
              <SidebarLink icon={Users} label="Users" active={activeSection === 'users'} onClick={() => setActiveSection('users')} />
              
              <div className="h-px bg-white/5 my-4 mx-3" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-3 mb-2">Growth</p>
              <SidebarLink icon={BarChart3} label="Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />
              <SidebarLink icon={DollarSign} label="Revenue" active={activeSection === 'revenue'} onClick={() => setActiveSection('revenue')} />
              <SidebarLink icon={Megaphone} label="Sponsored" active={activeSection === 'sponsored'} onClick={() => setActiveSection('sponsored')} />
              
              <div className="h-px bg-white/5 my-4 mx-3" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-3 mb-2">Governance</p>
              <SidebarLink icon={AlertTriangle} label="Reports" active={activeSection === 'reports'} onClick={() => setActiveSection('reports')} />
              <SidebarLink icon={Tags} label="Categories" active={activeSection === 'categories'} onClick={() => setActiveSection('categories')} />
              <SidebarLink icon={Star} label="Featured" active={activeSection === 'featured'} onClick={() => setActiveSection('featured')} />
              <SidebarLink icon={Shield} label="Moderation" active={activeSection === 'moderation'} onClick={() => setActiveSection('moderation')} />
              
              <div className="h-px bg-white/5 my-4 mx-3" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-3 mb-2">System</p>
              <SidebarLink icon={Bell} label="Notifications" active={activeSection === 'notifications'} onClick={() => setActiveSection('notifications')} />
              <SidebarLink icon={SettingsIcon} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
              <SidebarLink icon={Database} label="Database" active={activeSection === 'database'} onClick={() => setActiveSection('database')} />
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-black">
                {profile?.displayName?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{profile?.displayName || 'Master Admin'}</p>
                <p className="text-[10px] text-primary truncate uppercase font-black tracking-widest opacity-60">System Root</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar">
          
          {/* Top Command Bar */}
          <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-20">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
              Bessites <ChevronRight className="w-3 h-3" /> <span className="text-white">{activeSection}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  placeholder="Global system search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg h-9 pl-8 pr-4 text-xs font-medium w-48 focus:w-80 transition-all focus:border-primary outline-none" 
                />
              </div>
              
              <div className="flex items-center gap-1 border-l border-white/10 ml-2 pl-4">
                 <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                 </button>
                 
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-white/10 text-white w-56 rounded-2xl p-2 shadow-2xl">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 py-2">System Commands</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setActiveSection('database')} className="rounded-xl focus:bg-white/5 cursor-pointer flex gap-3 px-4 py-3">
                      <Database className="w-4 h-4 text-primary" /> <span className="text-sm font-bold">Backup Database</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveSection('notifications')} className="rounded-xl focus:bg-white/5 cursor-pointer flex gap-3 px-4 py-3">
                      <Bell className="w-4 h-4 text-primary" /> <span className="text-sm font-bold">Send Announcement</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5 my-1" />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-xl focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer flex gap-3 px-4 py-3 font-black italic uppercase tracking-widest text-[10px]">
                      <X className="w-4 h-4" /> Close Admin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
            
            {activeSection === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Metric Grid - 12 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
                  <StatCard label="Total Websites" value={stats.totalWebsites} icon={Globe} color="text-blue-500" />
                  <StatCard label="Pending Queue" value={stats.pending} icon={Inbox} color="text-amber-500" pulse={stats.pending > 0} />
                  <StatCard label="Approved" value={stats.approved} icon={Check} color="text-green-500" />
                  <StatCard label="Rejected" value={stats.rejected} icon={X} color="text-red-500" />
                  <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="text-purple-500" />
                  <StatCard label="Verified" value={stats.verified} icon={Shield} color="text-cyan-500" />
                  
                  <StatCard label="Categories" value={108} icon={Tags} color="text-pink-500" />
                  <StatCard label="Total Clicks" value={stats.totalClicks} icon={Zap} color="text-primary" />
                  <StatCard label="Views Today" value="--" icon={Eye} color="text-indigo-400" />
                  <StatCard label="Sponsored" value="0" icon={Megaphone} color="text-yellow-500" />
                  <StatCard label="Revenue" value="$0" icon={DollarSign} color="text-emerald-500" />
                  <StatCard label="New Users" value={stats.newUsersToday} icon={ArrowUpRight} color="text-blue-400" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <DashboardChart title="Discovery Traffic" subtitle="Visitors vs Clicks" className="xl:col-span-2" />
                  <DashboardList 
                    title="Live Activity Feed" 
                    items={submissions?.slice(0, 5).map(s => ({
                      name: `Submission: ${s.url.replace('https://', '')}`,
                      value: s.timestamp ? `${Math.floor((Date.now() - s.timestamp.seconds * 1000) / 60000)}m ago` : 'Just now'
                    })) || []} 
                  />
                </div>
              </div>
            )}

            {activeSection === 'submissions' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Submission Queue</h2>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-50">Reviewing Community Projects</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] h-10 px-4">
                       <Filter className="w-3 h-3 mr-2" /> Filter
                    </Button>
                    <Badge className="bg-primary/10 text-primary border-primary/20 h-10 px-4 rounded-xl flex items-center">{stats.pending} Pending</Badge>
                  </div>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Website Branding</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Metadata</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Submitter</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                          <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Command</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {submissions && submissions.length > 0 ? (
                          submissions.map((sub: any) => (
                            <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-card border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
                                    {sub.logoUrl ? <img src={sub.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-5 h-5 text-white/10" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-black truncate group-hover:text-primary transition-colors">{sub.url.replace('https://', '')}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-40">{sub.timestamp ? new Date(sub.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex flex-wrap gap-1.5">
                                  {sub.categories?.slice(0, 3).map((cat: string) => (
                                    <span key={cat} className="text-[8px] font-black uppercase tracking-tighter text-primary bg-primary/10 px-2 py-0.5 rounded-full">{cat}</span>
                                  ))}
                                  {sub.categories?.length > 3 && <span className="text-[8px] font-black text-muted-foreground">+{sub.categories.length - 3}</span>}
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-white/80">{sub.userEmail}</p>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">User ID: {sub.userId?.slice(0, 8)}</p>
                                </div>
                              </td>
                              <td className="p-6">
                                <Badge className={cn(
                                  "uppercase text-[8px] font-black px-3 py-1 rounded-full border-none shadow-lg",
                                  sub.status === 'approved' ? "bg-green-500/10 text-green-500" :
                                  sub.status === 'rejected' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                                )}>
                                  {sub.status || 'pending'}
                                </Badge>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'approved')} className="h-10 w-10 hover:bg-green-500/20 text-green-500 rounded-xl" title="Approve Website"><Check className="w-4 h-4" /></Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'rejected')} className="h-10 w-10 hover:bg-red-500/20 text-red-500 rounded-xl" title="Reject Website"><X className="w-4 h-4" /></Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleDelete(sub.id)} className="h-10 w-10 hover:bg-destructive/20 text-muted-foreground rounded-xl" title="Delete Permanent"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={5} className="p-32 text-center text-muted-foreground italic font-medium">The submission queue is empty.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection !== 'overview' && activeSection !== 'submissions' && (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-4 glow-primary">
                   <ShieldAlert className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter">Syncing {activeSection}...</h3>
                  <p className="text-muted-foreground font-medium max-w-sm mx-auto">This module is currently establishing a secure handshake with the primary discovery infrastructure.</p>
                </div>
                <Button variant="outline" onClick={() => setActiveSection('overview')} className="rounded-full h-14 px-12 border-white/10 font-black uppercase tracking-widest text-xs italic">Back to Dashboard</Button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active, onClick, badge }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold group",
        active ? "bg-white/5 text-primary shadow-sm ring-1 ring-white/5" : "text-muted-foreground hover:bg-white/[0.02] hover:text-white"
      )}
    >
      <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", active ? "text-primary shadow-primary/50" : "")} />
      <span className="flex-1 text-left truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded-full font-black shadow-lg shadow-primary/20 animate-pulse">{badge}</span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color, pulse = false }: { label: string, value: string | number, icon: any, color: string, pulse?: boolean }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between group hover:border-white/10 transition-all cursor-default relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl -mr-12 -mt-12 group-hover:bg-primary/5 transition-colors" />
      <div className="flex items-center justify-between mb-4 relative">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</p>
        <div className={cn("p-2.5 rounded-xl bg-white/5 shadow-inner transition-transform group-hover:scale-110", color, pulse && "animate-pulse")}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-black tracking-tighter relative tabular-nums">{value}</p>
    </div>
  );
}

function DashboardChart({ title, subtitle, className }: { title: string, subtitle: string, className?: string }) {
  return (
    <div className={cn("bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl relative overflow-hidden", className)}>
       <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40">{subtitle}</p>
          </div>
          <div className="flex gap-2">
             <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-primary"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Traffic</div>
             <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Benchmark</div>
          </div>
       </div>
       <div className="h-64 w-full flex items-end justify-between gap-1 pb-4 border-b border-white/5">
          {[40, 65, 45, 90, 75, 55, 80, 100, 85, 60, 45, 70].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar cursor-pointer">
              <div 
                className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-lg relative" 
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">{h}%</div>
              </div>
              <span className="text-[8px] font-black text-muted-foreground/30 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
            </div>
          ))}
       </div>
       <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase italic">
             <TrendingUp className="w-3 h-3" /> +24% growth
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors italic underline underline-offset-4">Full Analytics</button>
       </div>
    </div>
  );
}

function DashboardList({ title, items, onAction }: { title: string, items: any[], onAction?: () => void }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
        {onAction && (
          <button onClick={onAction} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors italic">View All</button>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary/40 glow-primary group-hover:scale-125 transition-transform" />
              <span className="text-xs font-bold text-white/80 truncate max-w-[200px]">{item.name}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">{item.value}</span>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-10 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">No Recent Activity</div>
        )}
      </div>
    </div>
  );
}
