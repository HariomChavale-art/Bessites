
'use client';

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser, useDoc } from "@/firebase";
import { collection, doc, query, where, orderBy, limit } from "firebase/firestore";
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
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type DashboardSection = 'overview' | 'submissions' | 'users' | 'websites' | 'monetization' | 'analytics' | 'settings';

export default function UserDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userDocRef);

  const mySubmissionsRef = useMemo(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "submissions"), 
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
  }, [user, db]);

  const { data: mySubmissions, loading: subLoading } = useCollection(mySubmissionsRef);

  const websiteStatsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);

  const { data: globalStats } = useCollection(websiteStatsRef);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const approvedSites = mySubmissions?.filter(s => s.status === 'approved') || [];
  const pendingSites = mySubmissions?.filter(s => s.status === 'pending') || [];
  
  // Calculate total clicks for user's own approved sites
  const totalMyClicks = approvedSites.reduce((acc, site) => {
    const stats = globalStats?.find(gs => gs.id === site.id);
    return acc + (stats?.visitCount || 0);
  }, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary/30">
      <div className="flex flex-1 overflow-hidden">
        
        {/* Shopify-style Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-white/[0.01] flex flex-col hidden lg:flex shrink-0">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-black italic uppercase tracking-tighter">Bessites <span className="text-primary text-xs ml-1 font-bold lowercase tracking-normal opacity-60">curator</span></span>
            </Link>
            
            <nav className="space-y-1">
              <SidebarLink icon={LayoutDashboard} label="Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
              <SidebarLink icon={Inbox} label="Submissions" active={activeSection === 'submissions'} onClick={() => setActiveSection('submissions')} badge={pendingSites.length} />
              <SidebarLink icon={Users} label="Users" active={activeSection === 'users'} onClick={() => setActiveSection('users')} />
              <SidebarLink icon={Globe} label="My Websites" active={activeSection === 'websites'} onClick={() => setActiveSection('websites')} />
              <SidebarLink icon={DollarSign} label="Monetization" active={activeSection === 'monetization'} onClick={() => setActiveSection('monetization')} />
              <SidebarLink icon={BarChart3} label="Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />
              <SidebarLink icon={SettingsIcon} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-black">
                {profile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{profile?.displayName || 'Curator'}</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase font-black tracking-widest opacity-40">Digital Pioneer</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar">
          
          {/* Top Bar with 3 Vertical Lines Menu */}
          <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-20">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
              Curator <ChevronRight className="w-3 h-3" /> <span className="text-white">{activeSection}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input placeholder="Search your data..." className="bg-white/5 border border-white/10 rounded-lg h-9 pl-8 pr-4 text-xs font-medium w-48 focus:w-64 transition-all focus:border-primary outline-none" />
              </div>
              
              <div className="flex items-center gap-1 border-l border-white/10 ml-2 pl-4">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white" title="Dashboard Menu">
                  <MoreVertical className="w-5 h-5" />
                </button>
                <button className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white">
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
            
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="My Submissions" value={mySubmissions?.length || 0} icon={Inbox} color="text-amber-500" />
                  <StatCard label="Approved Sites" value={approvedSites.length} icon={Check} color="text-green-500" />
                  <StatCard label="Total Impact" value={totalMyClicks.toLocaleString()} icon={TrendingUp} color="text-primary" />
                  <StatCard label="Rank" value="#124" icon={Zap} color="text-blue-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <DashboardList title="Recent Activity" items={mySubmissions?.slice(0, 5) || []} />
                  <DashboardList title="Interest Match" items={[
                    { name: 'AI', value: 'High' },
                    { name: 'Productivity', value: 'Medium' },
                    { name: 'Tools', value: 'High' },
                  ]} />
                </div>
              </div>
            )}

            {activeSection === 'submissions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Status Tracker</h2>
                  <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{pendingSites.length} Pending</div>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project URL</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {mySubmissions && mySubmissions.length > 0 ? (
                        mySubmissions.map((sub: any) => (
                          <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-card border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                                  {sub.logoUrl ? <img src={sub.logoUrl} className="w-full h-full object-cover" /> : <Globe className="w-5 h-5 text-white/10" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{sub.url.replace('https://', '')}</p>
                                  <div className="flex gap-1.5 mt-1">
                                    {sub.categories?.slice(0, 2).map((cat: string) => (
                                      <span key={cat} className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground/60">{cat}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-6 text-center">
                              <div className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                sub.status === 'approved' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                sub.status === 'rejected' ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              )}>
                                <div className={cn("w-1 h-1 rounded-full", 
                                  sub.status === 'approved' ? "bg-green-500" :
                                  sub.status === 'rejected' ? "bg-red-500" : "bg-amber-500"
                                )} />
                                {sub.status || 'pending'}
                              </div>
                            </td>
                            <td className="p-6 text-right">
                               <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                                 {sub.timestamp ? new Date(sub.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                               </p>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={3} className="p-20 text-center text-muted-foreground italic font-medium">You haven't submitted any projects yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection !== 'overview' && activeSection !== 'submissions' && (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-primary relative shadow-2xl border border-white/5 group">
                   <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   <SettingsIcon className="w-12 h-12 relative group-hover:rotate-90 transition-transform duration-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Syncing {activeSection}...</h3>
                  <p className="text-muted-foreground font-medium max-w-sm mx-auto">This control panel is being synchronized with the Bessites master database.</p>
                </div>
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
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-bold group",
        active ? "bg-white/5 text-primary shadow-sm" : "text-muted-foreground hover:bg-white/[0.02] hover:text-white"
      )}
    >
      <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", active ? "text-primary" : "")} />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-lg shadow-primary/20">{badge}</span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between group hover:border-white/10 transition-all cursor-default relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
      <div className="flex items-center justify-between mb-6 relative">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{label}</p>
        <div className={cn("p-3 rounded-2xl bg-white/5 shadow-inner transition-transform group-hover:scale-110", color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-5xl font-black tracking-tighter relative">{value}</p>
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
          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary/40 glow-primary group-hover:scale-125 transition-transform" />
              <span className="text-xs font-bold text-white/80 truncate max-w-[200px]">{item.url ? item.url.replace('https://', '') : item.name}</span>
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/5 bg-white/5",
              item.status === 'approved' ? "text-green-500" : item.status === 'rejected' ? "text-red-500" : "text-muted-foreground"
            )}>{item.value || item.status || 'Pending'}</span>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-10 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30">No Data Points</div>
        )}
      </div>
    </div>
  );
}
