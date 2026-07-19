
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, doc, updateDoc, deleteDoc, query, orderBy, where, serverTimestamp } from "firebase/firestore";
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
  Clock,
  Briefcase,
  AlertCircle,
  Download,
  LogOut,
  Mail,
  UserCheck,
  UserX,
  FileText,
  CreditCard,
  Calendar,
  MousePointer2,
  Target
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WebsitePreview } from "@/components/website-preview";
import { Skeleton } from "@/components/ui/skeleton";

type AdminSection = 
  | 'overview' 
  | 'submissions' 
  | 'promotions' 
  | 'users' 
  | 'revenue' 
  | 'reports' 
  | 'settings' 
  | 'activity' 
  | 'database';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Gated Access Check
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), orderBy("timestamp", "desc"));
  }, [db]);
  const { data: submissions, loading: subLoading } = useCollection(submissionsRef);

  const promosRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "promotions"), orderBy("createdAt", "desc"));
  }, [db]);
  const { data: promotions, loading: promoLoading } = useCollection(promosRef);

  const usersRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "users"), orderBy("createdAt", "desc"));
  }, [db]);
  const { data: appUsers, loading: userLoading } = useCollection(usersRef);

  const websiteStatsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);
  const { data: globalStats, loading: statsLoading } = useCollection(websiteStatsRef);

  const stats = useMemo(() => {
    const isDataLoading = subLoading || promoLoading || userLoading || statsLoading;
    if (isDataLoading) return null;

    const approvedSites = submissions?.filter(s => s.status === 'approved').length || 0;
    const pendingSites = submissions?.filter(s => s.status === 'pending').length || 0;
    const activePromos = promotions?.filter(p => p.status === 'active').length || 0;
    const totalUsersCount = appUsers?.length || 0;
    
    const totalRev = promotions?.filter(p => p.status === 'active' || p.status === 'completed' || p.status === 'scheduled')
      .reduce((acc, curr) => acc + (curr.cost || 0), 0) || 0;

    const totalPlatformViews = globalStats?.reduce((acc, curr) => acc + (curr.visitCount || 0), 0) || 0;

    return {
      totalWebsites: approvedSites,
      pendingWebsites: pendingSites,
      activePromos: activePromos,
      totalUsers: totalUsersCount,
      totalRevenue: `$${totalRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      totalViews: totalPlatformViews.toLocaleString()
    };
  }, [submissions, appUsers, globalStats, promotions, subLoading, promoLoading, userLoading, statsLoading]);

  const handleStatusUpdate = (subId: string, status: 'approved' | 'rejected') => {
    if (!db) return;
    const subRef = doc(db, "submissions", subId);
    updateDoc(subRef, { status }).then(() => {
        toast({ title: `Website ${status.toUpperCase()}`, description: `Registry updated successfully.` });
    });
  };

  const handlePromoReview = (promoId: string, status: 'scheduled' | 'rejected') => {
    if (!db) return;
    const promoRef = doc(db, "promotions", promoId);
    updateDoc(promoRef, { status }).then(() => {
      toast({ title: "Promotion Reviewed", description: `Campaign is now ${status}.` });
    });
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0F111A]"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 antialiased">
      
      <aside className={cn("bg-[#1E293B] text-white flex flex-col transition-all duration-300 border-r border-slate-800 shrink-0", sidebarCollapsed ? "w-20" : "w-72")}>
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50 bg-[#0F172A]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg"><Shield className="w-5 h-5 text-white" /></div>
             {!sidebarCollapsed && <span className="text-sm font-bold tracking-tight">Bessites Admin</span>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar py-6">
          <SidebarNavGroup label="Infrastructure" collapsed={sidebarCollapsed}>
             <SidebarNavLink icon={LayoutDashboard} label="System Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} collapsed={sidebarCollapsed} />
             <SidebarNavLink icon={Inbox} label="Website Moderation" active={activeSection === 'submissions'} onClick={() => setActiveSection('submissions')} badge={stats?.pendingWebsites} collapsed={sidebarCollapsed} />
             <SidebarNavLink icon={Flame} label="Ad Campaigns" active={activeSection === 'promotions'} onClick={() => setActiveSection('promotions')} collapsed={sidebarCollapsed} />
             <SidebarNavLink icon={Users} label="User Registry" active={activeSection === 'users'} onClick={() => setActiveSection('users')} collapsed={sidebarCollapsed} />
          </SidebarNavGroup>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500"><span>Admin</span><ChevronRight className="w-3.5 h-3.5 opacity-40" /><span className="text-slate-900 font-bold capitalize">{activeSection}</span></div>
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden"><UserIcon className="w-5 h-5 text-slate-500" /></div></div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-[1600px] mx-auto space-y-10">

            {activeSection === 'overview' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                   <AdminStatCard label="Total Users" value={stats?.totalUsers ?? '-'} icon={Users} color="text-blue-600" />
                   <AdminStatCard label="Approved Sites" value={stats?.totalWebsites ?? '-'} icon={Globe} color="text-indigo-600" />
                   <AdminStatCard label="Review Queue" value={stats?.pendingWebsites ?? '-'} icon={Inbox} color="text-amber-600" />
                   <AdminStatCard label="Total Revenue" value={stats?.totalRevenue ?? '-'} icon={DollarSign} color="text-emerald-600" />
                </div>
              </div>
            )}

            {activeSection === 'submissions' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <h1 className="text-2xl font-extrabold tracking-tight">Website Moderation</h1>
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                         <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-500"><th className="p-5">Digital Property</th><th className="p-5">Creator</th><th className="p-5">Status</th><th className="p-5 text-right">Operations</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {submissions?.map((sub: any) => (
                           <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-5">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden"><WebsitePreview websiteUrl={sub.url} alt={sub.url} className="w-full h-full" /></div>
                                    <span className="text-sm font-bold truncate">{sub.url.replace('https://', '')}</span>
                                 </div>
                              </td>
                              <td className="p-5 text-[11px] font-medium text-slate-500">{sub.userEmail}</td>
                              <td className="p-5"><Badge className={cn("rounded-lg px-3 py-1 text-[9px] font-bold uppercase", sub.status === 'approved' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{sub.status}</Badge></td>
                              <td className="p-5 text-right">
                                 {sub.status === 'pending' && (
                                   <div className="flex items-center justify-end gap-2">
                                      <Button onClick={() => handleStatusUpdate(sub.id, 'approved')} className="h-8 px-4 rounded-lg bg-emerald-600 text-white font-bold text-[10px] uppercase">Accept</Button>
                                      <Button onClick={() => handleStatusUpdate(sub.id, 'rejected')} variant="outline" className="h-8 px-4 rounded-lg border-rose-200 text-rose-600 font-bold text-[10px] uppercase">Decline</Button>
                                   </div>
                                 )}
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </Card>
              </div>
            )}

            {activeSection === 'promotions' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <h1 className="text-2xl font-extrabold tracking-tight">Ad Campaign Review</h1>
                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                         <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-500"><th className="p-5">Campaign ID</th><th className="p-5">Goal & Target</th><th className="p-5">Placement</th><th className="p-5">Budget</th><th className="p-5 text-center">Status</th><th className="p-5 text-right">Review</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {promotions?.map((promo: any) => (
                           <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-5"><span className="text-[11px] font-bold">{promo.promoId}</span></td>
                              <td className="p-5">
                                 <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-indigo-600 uppercase">{promo.objective}</p>
                                    <p className="text-[9px] text-slate-400 font-medium">Reach Est: ~{(promo.duration * 12000).toLocaleString()}</p>
                                 </div>
                              </td>
                              <td className="p-5 text-[11px] font-bold text-slate-700">{promo.placement}</td>
                              <td className="p-5 text-[11px] font-bold text-emerald-600">${promo.cost.toFixed(2)}</td>
                              <td className="p-5 text-center"><Badge className={cn("text-[9px] font-bold uppercase", promo.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{promo.status}</Badge></td>
                              <td className="p-5 text-right">
                                 {promo.status === 'pending' && (
                                   <div className="flex items-center justify-end gap-2">
                                      <Button onClick={() => handlePromoReview(promo.id, 'scheduled')} className="h-8 px-4 rounded-lg bg-indigo-600 text-white font-bold text-[10px] uppercase">Approve</Button>
                                      <Button onClick={() => handlePromoReview(promo.id, 'rejected')} variant="outline" className="h-8 px-4 rounded-lg border-rose-200 text-rose-600 font-bold text-[10px] uppercase">Reject</Button>
                                   </div>
                                 )}
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </Card>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarNavGroup({ label, children, collapsed }: { label: string, children: React.ReactNode, collapsed: boolean }) {
  return (
    <div className="mb-8 px-4">
      {!collapsed && <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 px-4 mb-4">{label}</p>}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarNavLink({ icon: Icon, label, active = false, onClick, badge, collapsed }: { icon: any, label: string, active?: boolean, onClick?: () => void, badge?: number, collapsed: boolean }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative group", active ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5")}>
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="flex-1 text-left text-xs font-bold truncate">{label}</span>}
      {!collapsed && badge !== undefined && badge > 0 && <span className="bg-indigo-400 text-white text-[9px] px-2 py-0.5 rounded-md font-bold">{badge}</span>}
    </button>
  );
}

function AdminStatCard({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) {
  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl p-5 group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform", color)}><Icon className="w-5 h-5" /></div>
      </div>
      <div>
         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 leading-none">{label}</p>
         <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
      </div>
    </Card>
  );
}
