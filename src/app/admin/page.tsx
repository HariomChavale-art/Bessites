
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
  CreditCard
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

  // Real Data Streams
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
  const { data: globalStats } = useCollection(websiteStatsRef);

  // Dynamic Real-Time Stats
  const stats = useMemo(() => {
    if (!submissions || !appUsers || !globalStats) return {
      totalWebsites: 0,
      pendingWebsites: 0,
      activePromos: 0,
      totalUsers: 0,
      revenueToday: "$0.00",
      totalRevenue: "$0.00",
      newUsersToday: 0,
      pendingReports: 0
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const revToday = promotions?.filter(p => p.createdAt && new Date(p.createdAt.seconds * 1000) >= startOfToday)
      .reduce((acc, curr) => acc + (curr.cost || 0), 0) || 0;
    
    const totalRev = promotions?.reduce((acc, curr) => acc + (curr.cost || 0), 0) || 0;

    return {
      totalWebsites: submissions.length,
      pendingWebsites: submissions.filter(s => s.status === 'pending').length,
      activePromos: promotions?.filter(p => p.status === 'active').length || 0,
      totalUsers: appUsers.length,
      revenueToday: `$${revToday.toFixed(2)}`,
      totalRevenue: `$${totalRev.toFixed(2)}`,
      newUsersToday: appUsers.filter(u => u.createdAt && new Date(u.createdAt.seconds * 1000) >= startOfToday).length,
      pendingReports: 0 // Feature for future expansion
    };
  }, [submissions, appUsers, globalStats, promotions]);

  const handleStatusUpdate = (subId: string, status: 'approved' | 'rejected') => {
    if (!db) return;
    const subRef = doc(db, "submissions", subId);
    updateDoc(subRef, { status })
      .then(() => {
        toast({ title: `Website ${status.toUpperCase()}`, description: `Registry updated successfully.` });
      })
      .catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: subRef.path,
          operation: 'update',
          requestResourceData: { status }
        }));
      });
  };

  const handlePromoApproval = (promoId: string, status: 'active' | 'cancelled') => {
    if (!db) return;
    const promoRef = doc(db, "promotions", promoId);
    updateDoc(promoRef, { status }).then(() => {
      toast({ title: "Promotion Updated", description: `Campaign status changed to ${status}.` });
    });
  };

  const handleDeleteSubmission = (subId: string) => {
    if (!db) return;
    deleteDoc(doc(db, "submissions", subId)).then(() => {
      toast({ title: "Property Purged", description: "Website removed from infrastructure." });
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F111A]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 antialiased">
      
      {/* Enterprise Management Sidebar */}
      <aside className={cn(
        "bg-[#1E293B] text-white flex flex-col transition-all duration-300 border-r border-slate-800 shrink-0",
        sidebarCollapsed ? "w-20" : "w-72"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50 bg-[#0F172A]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                <Shield className="w-5 h-5 text-white" />
             </div>
             {!sidebarCollapsed && (
               <div className="min-w-0">
                  <span className="text-sm font-bold tracking-tight block leading-none">Bessites Admin</span>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider opacity-60">Control Center</span>
               </div>
             )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-6">
          <SidebarNavGroup label="Infrastructure" collapsed={sidebarCollapsed}>
             <SidebarNavLink icon={LayoutDashboard} label="System Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} collapsed={sidebarCollapsed} />
             <SidebarNavLink icon={Inbox} label="Website Moderation" active={activeSection === 'submissions'} onClick={() => setActiveSection('submissions')} badge={stats.pendingWebsites} collapsed={sidebarCollapsed} />
             <SidebarNavLink icon={Flame} label="Promotion Studio" active={activeSection === 'promotions'} onClick={() => setActiveSection('promotions')} collapsed={sidebarCollapsed} />
             <SidebarNavLink icon={Users} label="User Registry" active={activeSection === 'users'} onClick={() => setActiveSection('users')} collapsed={sidebarCollapsed} />
          </SidebarNavGroup>

          <SidebarNavGroup label="Finance & Growth" collapsed={sidebarCollapsed}>
             <SidebarNavLink icon={DollarSign} label="Revenue Ledger" active={activeSection === 'revenue'} onClick={() => setActiveSection('revenue')} collapsed={sidebarCollapsed} />
             <SidebarNavLink icon={Megaphone} label="Announcements" collapsed={sidebarCollapsed} />
          </SidebarNavGroup>

          <SidebarNavGroup label="Governance" collapsed={sidebarCollapsed}>
             <SidebarNavLink icon={AlertTriangle} label="Report Queue" active={activeSection === 'reports'} onClick={() => setActiveSection('reports')} collapsed={sidebarCollapsed} />
             <SidebarNavLink icon={History} label="Audit Logs" active={activeSection === 'activity'} onClick={() => setActiveSection('activity')} collapsed={sidebarCollapsed} />
             <SidebarNavLink icon={Database} label="System Data" active={activeSection === 'database'} onClick={() => setActiveSection('database')} collapsed={sidebarCollapsed} />
          </SidebarNavGroup>
        </div>

        <div className="p-4 border-t border-slate-700/50 bg-[#0F172A]">
           <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white"
           >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-180" />}
              {!sidebarCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Collapse Menu</span>}
           </button>
        </div>
      </aside>

      {/* Main Command Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Sticky Command Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
             <span>Admin</span>
             <ChevronRight className="w-3.5 h-3.5 opacity-40" />
             <span className="text-slate-900 font-bold capitalize">{activeSection}</span>
          </div>

          <div className="flex items-center gap-6">
             <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  placeholder="Search global registry..." 
                  className="bg-slate-100 border-none rounded-xl h-10 pl-10 pr-4 text-xs font-medium w-64 focus:w-96 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                />
             </div>
             
             <div className="h-8 w-px bg-slate-200" />
             
             <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                   <p className="text-xs font-bold text-slate-900 leading-none">{user?.email?.split('@')[0]}</p>
                   <p className="text-[10px] text-slate-400 font-medium mt-1">Super Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                   <UserIcon className="w-5 h-5 text-slate-500" />
                </div>
             </div>
          </div>
        </header>

        {/* Workspace Area */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          
          <div className="max-w-[1600px] mx-auto space-y-10">

            {activeSection === 'overview' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col gap-1">
                   <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Platform Infrastructure</h1>
                   <p className="text-sm text-slate-500 font-medium">System status and live operational metrics for Bessites ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                   <AdminStatCard label="Total User Accounts" value={stats.totalUsers} icon={Users} color="text-blue-600" trend={stats.newUsersToday} trendLabel="New today" />
                   <AdminStatCard label="Property Registry" value={stats.totalWebsites} icon={Globe} color="text-indigo-600" trend={stats.pendingWebsites} trendLabel="Awaiting review" trendColor="text-amber-600" />
                   <AdminStatCard label="Today's Revenue" value={stats.revenueToday} icon={DollarSign} color="text-emerald-600" />
                   <AdminStatCard label="Active Campaigns" value={stats.activePromos} icon={Flame} color="text-orange-600" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                   <Card className="xl:col-span-2 border-slate-200 shadow-sm rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">System Traffic Pulse</h3>
                         <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time</span>
                         </div>
                      </div>
                      <div className="h-64 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                         <BarChart3 className="w-8 h-8 text-slate-200" />
                         <span className="ml-3 text-xs font-bold text-slate-300 uppercase tracking-widest">Analytics Infrastructure Syncing</span>
                      </div>
                   </Card>
                   
                   <Card className="border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Recent System Activity</h3>
                      <div className="flex-1 space-y-6">
                         {[1, 2, 3, 4, 5].map(i => (
                           <div key={i} className="flex gap-4 items-start group">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                                 <Clock className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                              </div>
                              <div className="min-w-0">
                                 <p className="text-[11px] font-bold text-slate-800 leading-snug">Website submission received for review</p>
                                 <p className="text-[10px] text-slate-400 font-medium mt-0.5">34 minutes ago • System Agent</p>
                              </div>
                           </div>
                         ))}
                      </div>
                      <Button variant="ghost" className="mt-6 w-full text-[10px] font-bold uppercase tracking-widest text-slate-400">View Audit Logs</Button>
                   </Card>
                </div>
              </div>
            )}

            {activeSection === 'submissions' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Website Moderation</h1>
                      <p className="text-sm text-slate-500 font-medium">Review community contributions and manage the discovery registry.</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <Button variant="outline" className="rounded-xl h-10 text-xs font-bold border-slate-200"><Filter className="w-3.5 h-3.5 mr-2" /> Filters</Button>
                      <Button className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold"><Plus className="w-3.5 h-3.5 mr-2" /> Add Property</Button>
                   </div>
                </div>

                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Digital Property</th>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Classification</th>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Creator Identity</th>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Submission Date</th>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Lifecycle Status</th>
                               <th className="p-5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">Operations</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {subLoading ? (
                              <tr><td colSpan={6} className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-300" /></td></tr>
                            ) : submissions && submissions.length > 0 ? (
                              submissions.map((sub: any) => (
                                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                   <td className="p-5">
                                      <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden shadow-sm shrink-0">
                                            <WebsitePreview websiteUrl={sub.url} fallbackUrl={sub.logoUrl} alt="Logo" className="w-full h-full" />
                                         </div>
                                         <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{sub.url.replace('https://', '')}</p>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase truncate">ID: {sub.id.slice(0, 8)}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="p-5">
                                      <div className="flex gap-1">
                                         {sub.categories?.slice(0, 2).map((cat: string) => (
                                           <span key={cat} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">{cat}</span>
                                         ))}
                                      </div>
                                   </td>
                                   <td className="p-5">
                                      <div className="min-w-0">
                                         <p className="text-[11px] font-bold text-slate-700 truncate">{sub.userEmail}</p>
                                         <p className="text-[9px] text-slate-400 font-medium uppercase truncate">UID: {sub.userId?.slice(0, 8)}</p>
                                      </div>
                                   </td>
                                   <td className="p-5">
                                      <span className="text-[10px] font-bold text-slate-500">
                                         {sub.timestamp ? new Date(sub.timestamp.seconds * 1000).toLocaleDateString() : 'Real-time'}
                                      </span>
                                   </td>
                                   <td className="p-5 text-center">
                                      <Badge className={cn(
                                        "rounded-lg px-3 py-1 text-[9px] font-bold uppercase tracking-wider border-none",
                                        sub.status === 'approved' ? "bg-emerald-100 text-emerald-700" :
                                        sub.status === 'rejected' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                                      )}>
                                         {sub.status || 'pending'}
                                      </Badge>
                                   </td>
                                   <td className="p-5 text-right">
                                      <div className="flex items-center justify-end gap-1">
                                         <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'approved')} className="h-8 w-8 hover:bg-emerald-50 text-emerald-600 rounded-lg"><Check className="w-4 h-4" /></Button>
                                         <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(sub.id, 'rejected')} className="h-8 w-8 hover:bg-rose-50 text-rose-600 rounded-lg"><X className="w-4 h-4" /></Button>
                                         
                                         <AlertDialog>
                                           <AlertDialogTrigger asChild>
                                              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 className="w-4 h-4" /></Button>
                                           </AlertDialogTrigger>
                                           <AlertDialogContent className="rounded-2xl">
                                              <AlertDialogHeader>
                                                 <AlertDialogTitle>Purge Property Registry?</AlertDialogTitle>
                                                 <AlertDialogDescription>This action permanently removes the website from the Bessites infrastructure. This cannot be undone.</AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                 <AlertDialogCancel className="rounded-xl border-slate-200">Cancel</AlertDialogCancel>
                                                 <AlertDialogAction onClick={() => handleDeleteSubmission(sub.id)} className="bg-rose-600 hover:bg-rose-700 rounded-xl">Delete Permanent</AlertDialogAction>
                                              </AlertDialogFooter>
                                           </AlertDialogContent>
                                         </AlertDialog>
                                      </div>
                                   </td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan={6} className="p-40 text-center text-slate-300 font-bold uppercase tracking-widest italic opacity-40">Registry queue empty</td></tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </Card>
              </div>
            )}

            {activeSection === 'promotions' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col gap-1">
                   <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Promotion Review Hub</h1>
                   <p className="text-sm text-slate-500 font-medium">Audit advertising campaigns and verify commercial placements.</p>
                </div>

                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Campaign ID</th>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Promoted Site</th>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Placement</th>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cycle</th>
                               <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Billing</th>
                               <th className="p-5 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                               <th className="p-5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">Audit</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {promoLoading ? (
                              <tr><td colSpan={7} className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-300" /></td></tr>
                            ) : promotions && promotions.length > 0 ? (
                              promotions.map((promo: any) => (
                                <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors group">
                                   <td className="p-5"><span className="text-[11px] font-bold text-slate-900">{promo.promoId}</span></td>
                                   <td className="p-5">
                                      <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded bg-white border border-slate-200 overflow-hidden"><WebsitePreview websiteUrl={promo.websiteUrl} alt="Logo" className="w-full h-full" /></div>
                                         <div className="min-w-0">
                                            <p className="text-[11px] font-bold text-slate-800 truncate">{promo.websiteName}</p>
                                            <p className="text-[9px] text-slate-400 font-medium truncate">{promo.userEmail}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="p-5"><Badge className="bg-indigo-50 text-indigo-700 border-none text-[8px] font-bold uppercase px-2 py-0.5">{promo.placement}</Badge></td>
                                   <td className="p-5">
                                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                         <Calendar className="w-3.5 h-3.5 opacity-30" />
                                         {promo.duration} Days
                                      </div>
                                   </td>
                                   <td className="p-5 text-[11px] font-bold text-emerald-600">${promo.cost.toFixed(2)}</td>
                                   <td className="p-5 text-center">
                                      <Badge className={cn(
                                        "rounded-lg px-3 py-1 text-[9px] font-bold uppercase border-none",
                                        promo.status === 'active' ? "bg-emerald-100 text-emerald-700" :
                                        promo.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                                      )}>{promo.status}</Badge>
                                   </td>
                                   <td className="p-5 text-right">
                                      <div className="flex items-center justify-end gap-1">
                                         <Button onClick={() => handlePromoApproval(promo.id, 'active')} className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] uppercase tracking-widest">Activate</Button>
                                         <Button onClick={() => handlePromoApproval(promo.id, 'cancelled')} variant="ghost" className="h-8 px-3 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-[9px] uppercase tracking-widest">Cancel</Button>
                                      </div>
                                   </td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan={7} className="p-40 text-center text-slate-300 font-bold uppercase tracking-widest italic opacity-40">No promotion requests</td></tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </Card>
              </div>
            )}

            {(activeSection === 'users' || activeSection === 'revenue' || activeSection === 'reports' || activeSection === 'activity' || activeSection === 'database') && (
              <div className="py-40 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                 <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-indigo-100">
                    <ShieldAlert className="w-10 h-10" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-900">Module Synchronizing</h3>
                    <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">The <span className="font-bold text-slate-900 uppercase">{activeSection}</span> management infrastructure is being deployed to this console.</p>
                 </div>
                 <Button variant="outline" onClick={() => setActiveSection('overview')} className="mt-8 rounded-xl h-12 px-10 border-slate-200 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Return to Overview</Button>
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
      <div className="space-y-1">
         {children}
      </div>
    </div>
  );
}

function SidebarNavLink({ icon: Icon, label, active = false, onClick, badge, collapsed }: { icon: any, label: string, active?: boolean, onClick?: () => void, badge?: number, collapsed: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative group",
        active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "")} />
      {!collapsed && (
        <span className="flex-1 text-left text-xs font-bold tracking-tight truncate">{label}</span>
      )}
      {!collapsed && badge !== undefined && badge > 0 && (
        <span className="bg-indigo-400 text-white text-[9px] px-2 py-0.5 rounded-md font-bold shadow-sm">{badge}</span>
      )}
      {collapsed && badge !== undefined && badge > 0 && (
        <span className="absolute top-0 right-0 bg-indigo-500 w-2 h-2 rounded-full border-2 border-[#1E293B]" />
      )}
    </button>
  );
}

function AdminStatCard({ label, value, icon: Icon, color, trend, trendLabel, trendColor = "text-indigo-400" }: { label: string, value: string | number, icon: any, color: string, trend?: number, trendLabel?: string, trendColor?: string }) {
  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl p-5 hover:border-slate-300 transition-all cursor-default flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform", color)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={cn("text-[10px] font-bold uppercase tracking-wider", trendColor)}>
            {trend > 0 ? `+${trend}` : trend} {trendLabel}
          </div>
        )}
      </div>
      <div>
         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 leading-none">{label}</p>
         <h4 className="text-2xl font-black text-slate-900 leading-none tabular-nums">{value}</h4>
      </div>
    </Card>
  );
}
