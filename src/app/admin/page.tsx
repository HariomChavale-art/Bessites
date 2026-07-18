
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
  Plus,
  Flame,
  Clock
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
  | 'database'
  | 'promotions';

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

  const promosRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "promotions"), orderBy("createdAt", "desc"));
  }, [db]);
  const { data: globalPromos } = useCollection(promosRef);

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
      pendingPromos: 0,
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
      revenue: `$${globalPromos?.reduce((acc, curr) => acc + (curr.cost || 0), 0).toFixed(2) || "0.00"}`,
      viewsToday: (globalStats.reduce((acc, curr) => acc + (curr.visitCount || 0), 0) * 4).toLocaleString(),
      sponsored: globalPromos?.filter(p => p.status === 'active').length || 0,
      pendingPromos: globalPromos?.filter(p => p.status === 'pending').length || 0,
      totalCategories: 108
    };
  }, [submissions, appUsers, globalStats, globalPromos]);

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

  const handlePromoApproval = (promoId: string, status: 'scheduled' | 'rejected') => {
    if (!db) return;
    const promoRef = doc(db, "promotions", promoId);
    updateDoc(promoRef, { status }).then(() => {
      toast({ title: "Promotion Updated", description: `Campaign is now ${status}.` });
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
              <div className="min-w-0">
                <span className="text-xl font-black italic uppercase tracking-tighter block leading-none">Bessites</span>
                <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">Admin Command</span>
              </div>
            </Link>
            
            <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)] no-scrollbar pr-2 pb-10">
              <SidebarSection label="Platform">
                <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
                <SidebarLink icon={Inbox} label="Submission Queue" active={activeSection === 'submissions'} onClick={() => setActiveSection('submissions')} badge={stats.pending} />
                <SidebarLink icon={Flame} label="Promotion Review" active={activeSection === 'promotions'} onClick={() => setActiveSection('promotions')} badge={stats.pendingPromos} />
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
        </aside>

        {/* Main Command Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar bg-background">
          
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
            </div>
          </header>

          <div className="p-8 sm:p-12 space-y-12 max-w-[1800px] mx-auto w-full">
            
            {activeSection === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col gap-2">
                   <h1 className="text-4xl font-black italic uppercase tracking-tighter">System <span className="text-primary">Overview</span></h1>
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">Real-time Bessites Infrastructure Metrics</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <StatCard label="Total Websites" value={stats.totalWebsites} icon={Globe} color="text-blue-500" />
                  <StatCard label="Pending Submissions" value={stats.pending} icon={Inbox} color="text-amber-500" pulse={stats.pending > 0} />
                  <StatCard label="Pending Promotions" value={stats.pendingPromos} icon={Flame} color="text-orange-500" pulse={stats.pendingPromos > 0} />
                  <StatCard label="Revenue (Total)" value={stats.revenue} icon={DollarSign} color="text-emerald-500" />
                  <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="text-purple-500" />
                  <StatCard label="Website Clicks Today" value={stats.totalClicks} icon={Zap} color="text-primary" />
                  <StatCard label="Total Views Today" value={stats.viewsToday} icon={Eye} color="text-indigo-400" />
                  <StatCard label="Active Sponsored" value={stats.sponsored} icon={Megaphone} color="text-yellow-500" />
                </div>
              </div>
            )}

            {activeSection === 'promotions' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Promotion Review Queue</h2>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40">Reviewing Advertising Campaigns</p>
                  </div>
                </div>
                
                <div className="bg-[#121019] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1200px]">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Promotion ID</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Digital Property</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Placement</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Status</th>
                          <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Review</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {globalPromos && globalPromos.length > 0 ? (
                          globalPromos.filter(p => p.status === 'pending').map((promo: any) => (
                            <tr key={promo.id} className="hover:bg-white/[0.01] transition-colors group">
                              <td className="p-6">
                                <span className="text-xs font-black italic tracking-tighter text-white">{promo.promoId}</span>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-black border border-white/10 overflow-hidden"><WebsitePreview websiteUrl={promo.websiteUrl} alt="Logo" className="w-full h-full" /></div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{promo.websiteName}</p>
                                    <p className="text-[9px] text-muted-foreground uppercase font-black opacity-30">{promo.userEmail}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase">{promo.placement}</Badge>
                              </td>
                              <td className="p-6">
                                <span className="text-[10px] font-bold text-white/80">{promo.duration} Days (Starts: {new Date(promo.startDate).toLocaleDateString()})</span>
                              </td>
                              <td className="p-6">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-black italic text-emerald-400">PAID ${promo.cost}</span>
                                  <span className="text-[8px] font-black uppercase text-muted-foreground/30">{promo.paymentMethod.toUpperCase()} GATEWAY</span>
                                </div>
                              </td>
                              <td className="p-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button onClick={() => handlePromoApproval(promo.id, 'scheduled')} className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[9px]">Approve</Button>
                                  <Button onClick={() => handlePromoApproval(promo.id, 'rejected')} variant="ghost" className="h-9 px-4 rounded-xl text-red-500 hover:bg-red-500/10 font-black uppercase text-[9px]">Reject</Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={6} className="p-40 text-center text-muted-foreground italic font-medium opacity-20">The promotion review queue is currently empty.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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
                </div>
                
                <div className="bg-[#121019] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1400px]">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Website Identity</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
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
                              <td className="p-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'approved')} className="h-10 w-10 hover:bg-green-500/20 text-green-500 rounded-xl"><Check className="w-4 h-4" /></Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'rejected')} className="h-10 w-10 hover:bg-red-500/20 text-red-500 rounded-xl"><X className="w-4 h-4" /></Button>
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

            {activeSection !== 'overview' && activeSection !== 'submissions' && activeSection !== 'promotions' && (
              <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-32 h-32 bg-primary/5 rounded-[3rem] flex items-center justify-center text-primary mb-4 shadow-2xl shadow-primary/10">
                   <ShieldAlert className="w-16 h-16 opacity-40" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter">Module Sync <span className="text-primary">Required</span></h3>
                  <p className="text-muted-foreground font-medium max-w-lg mx-auto opacity-60">The <span className="text-white font-bold">{activeSection.toUpperCase()}</span> infrastructure is currently synchronizing.</p>
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
