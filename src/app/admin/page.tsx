
'use client';

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser, useDoc } from "@/firebase";
import { collection, doc, updateDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Check, 
  X, 
  ExternalLink, 
  ShieldAlert, 
  Loader2, 
  Globe, 
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
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import Link from "next/link";

type AdminSection = 'overview' | 'submissions' | 'users' | 'websites' | 'monetization' | 'analytics' | 'settings';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userDocRef);

  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), orderBy("timestamp", "desc"));
  }, [db]);

  const { data: submissions, loading: subLoading } = useCollection(submissionsRef);

  const usersRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), orderBy("createdAt", "desc"), limit(50));
  }, [db]);

  const { data: appUsers } = useCollection(usersRef);

  const websiteStatsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);

  const { data: globalStats } = useCollection(websiteStatsRef);

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

  const pendingSubmissions = submissions?.filter(s => s.status === 'pending') || [];
  const totalClicks = globalStats?.reduce((acc, curr) => acc + (curr.visitCount || 0), 0) || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary/30">
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar - Shopify Style */}
        <aside className="w-64 border-r border-white/5 bg-white/[0.01] flex flex-col hidden lg:flex shrink-0">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <span className="text-xl font-black italic uppercase tracking-tighter">Bessites <span className="text-primary">Admin</span></span>
            </Link>
            
            <nav className="space-y-1">
              <SidebarLink icon={LayoutDashboard} label="Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
              <SidebarLink icon={Inbox} label="Submissions" active={activeSection === 'submissions'} onClick={() => setActiveSection('submissions')} badge={pendingSubmissions.length} />
              <SidebarLink icon={Users} label="Users" active={activeSection === 'users'} onClick={() => setActiveSection('users')} />
              <SidebarLink icon={Globe} label="Websites" active={activeSection === 'websites'} onClick={() => setActiveSection('websites')} />
              <SidebarLink icon={DollarSign} label="Monetization" active={activeSection === 'monetization'} onClick={() => setActiveSection('monetization')} />
              <SidebarLink icon={BarChart3} label="Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />
              <SidebarLink icon={SettingsIcon} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black">{profile?.displayName?.charAt(0) || 'A'}</div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{profile?.displayName || 'Admin User'}</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase font-black tracking-widest opacity-50">Master Curator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar">
          
          {/* Top Bar */}
          <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-20">
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground italic">
              Dashboard <ChevronRight className="w-3 h-3" /> <span className="text-white">{activeSection}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <input placeholder="Search admin..." className="bg-white/5 border border-white/10 rounded-lg h-9 pl-8 pr-4 text-xs font-medium w-48 focus:w-64 transition-all focus:border-primary outline-none" />
              </div>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
            
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Pending" value={pendingSubmissions.length} icon={Inbox} color="text-amber-500" />
                  <StatCard label="Approved" value={submissions?.filter(s => s.status === 'approved').length || 0} icon={Check} color="text-green-500" />
                  <StatCard label="Total Users" value={appUsers?.length || 0} icon={Users} color="text-blue-500" />
                  <StatCard label="Daily Clicks" value={totalClicks} icon={ArrowUpRight} color="text-primary" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <DashboardList title="Recent Submissions" items={submissions?.slice(0, 5) || []} onAction={() => setActiveSection('submissions')} />
                  <DashboardList title="Popular Categories" items={[
                    { name: 'AI', value: '142 clicks' },
                    { name: 'Gaming', value: '98 clicks' },
                    { name: 'Productivity', value: '76 clicks' },
                  ]} />
                </div>
              </div>
            )}

            {activeSection === 'submissions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Queue Management</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20">{pendingSubmissions.length} Pending</Badge>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Website</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Submitter</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {submissions && submissions.length > 0 ? (
                        submissions.map((sub: any) => (
                          <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-card border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                  {sub.logoUrl ? <img src={sub.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-4 h-4 text-white/20" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold truncate">{sub.url.replace('https://', '')}</p>
                                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-40">{new Date(sub.timestamp?.toDate()).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-xs font-medium text-white/60">{sub.userEmail}</td>
                            <td className="p-4">
                              <Badge className={cn(
                                "uppercase text-[8px] font-black px-2 py-0.5 rounded-full border-none",
                                sub.status === 'approved' ? "bg-green-500/10 text-green-500" :
                                sub.status === 'rejected' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                              )}>
                                {sub.status || 'pending'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'approved')} className="h-8 w-8 hover:bg-green-500/20 text-green-500"><Check className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'rejected')} className="h-8 w-8 hover:bg-red-500/20 text-red-500"><X className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(sub.id)} className="h-8 w-8 hover:bg-destructive/20 text-muted-foreground"><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="p-20 text-center text-muted-foreground italic">No submissions found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection !== 'overview' && activeSection !== 'submissions' && (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mb-4">
                   <ShieldAlert className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Syncing {activeSection}...</h3>
                <p className="text-muted-foreground font-medium max-w-sm">This section is being synchronized with the master database infrastructure.</p>
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
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-bold",
        active ? "bg-white/5 text-primary shadow-sm" : "text-muted-foreground hover:bg-white/[0.02] hover:text-white"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">{badge}</span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) {
  return (
    <Card className="bg-white/[0.02] border-white/5 p-6 rounded-[2rem] flex flex-col justify-between group hover:border-white/10 transition-all cursor-default">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{label}</p>
        <div className={cn("p-2 rounded-xl bg-white/5", color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </Card>
  );
}

function DashboardList({ title, items, onAction }: { title: string, items: any[], onAction?: () => void }) {
  return (
    <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
        {onAction && (
          <Button variant="ghost" size="sm" onClick={onAction} className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10 italic">View All</Button>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary/40 glow-primary" />
              <span className="text-xs font-bold text-white/80 truncate max-w-[200px]">{item.url ? item.url.replace('https://', '') : item.name}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{item.value || 'Pending'}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
