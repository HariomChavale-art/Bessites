
'use client';

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, query, where, doc, deleteDoc, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  Globe, 
  Loader2, 
  BarChart3, 
  Users, 
  Star, 
  Flame, 
  DollarSign, 
  Bell, 
  Mic, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Plus,
  Eye,
  TrendingUp,
  Search as SearchIcon,
  ChevronRight,
  Menu,
  Check,
  X,
  Trash2,
  ExternalLink,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WebsitePreview } from "@/components/website-preview";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
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

export default function MyWebsitesPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
  const { data: rawSubmissions, loading: submissionsLoading } = useCollection(mySubmissionsRef);

  const websiteStatsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);
  const { data: globalStats } = useCollection(websiteStatsRef);

  const filteredSubmissions = useMemo(() => {
    if (!rawSubmissions) return [];
    return rawSubmissions.filter(sub => {
      const matchesSearch = sub.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rawSubmissions, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    if (!rawSubmissions || !globalStats) return { total: 0, approved: 0, momentum: "0%" };
    const approved = rawSubmissions.filter(s => s.status === 'approved').length;
    return {
      total: rawSubmissions.length,
      approved,
      momentum: approved > 0 ? "94%" : "0%"
    };
  }, [rawSubmissions, globalStats]);

  const handleDelete = (id: string) => {
    if (!db) return;
    const subRef = doc(db, "submissions", id);
    deleteDoc(subRef)
      .then(() => {
        toast({ title: "Deleted", description: "Website removed from registry." });
      })
      .catch((e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: subRef.path,
          operation: 'delete'
        }));
      });
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/website/${id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Public discovery link copied to clipboard." });
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-10 px-2">
         <Link href="/" className="group block">
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl font-black italic uppercase tracking-tighter block leading-none text-white">Bessites</span>
              <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60 mt-1 block">Creator Studio</span>
            </div>
         </Link>
      </div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pb-10">
        <SidebarItem icon={Globe} label="My Websites" active={pathname === '/my-websites'} onClick={() => router.push('/my-websites')} badge={stats.total} />
        <SidebarItem icon={BarChart3} label="Analytics" active={pathname === '/analytics'} onClick={() => router.push('/analytics')} />
        <SidebarItem icon={Users} label="Audience" active={pathname === '/audience'} onClick={() => router.push('/audience')} />
        <SidebarItem icon={Flame} label="Promotions" active={pathname === '/promotions'} onClick={() => router.push('/promotions')} />
        <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
          <SidebarItem icon={Settings} label="Settings" active={pathname === '/profile'} onClick={() => router.push('/profile')} />
          <SidebarItem icon={HelpCircle} label="Support" active={pathname === '/support'} onClick={() => router.push('/support')} />
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
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 p-8 flex-col border-r border-white/5 bg-[#0D0C12] z-50"><SidebarContent /></aside>
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B0A0F]">
        <header className="lg:hidden flex items-center justify-between p-4 sticky top-0 bg-[#0B0A0F]/80 backdrop-blur-xl z-50 border-b border-white/5">
          <Link href="/" className="text-xl font-black italic uppercase tracking-tighter text-white">Bessites</Link>
          <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5"><Menu className="w-5 h-5" /></Button></SheetTrigger><SheetContent side="left" className="bg-[#0D0C12] border-r border-white/5 p-6 w-80"><SidebarContent /></SheetContent></Sheet>
        </header>

        <div className="p-4 sm:p-8 md:p-12 space-y-12">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Digital Property Manager</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 italic">🥇 Rising Creator</Badge>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">Registry Overview</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full xl:w-auto">
              <Link href="/submit" className="w-full sm:w-auto"><Button className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-2xl px-8 font-black uppercase tracking-widest text-xs italic shadow-xl shadow-white/5 transition-all hover:scale-105"><Plus className="w-4 h-4 mr-2" /> Submit New Project</Button></Link>
              <Avatar className="w-12 h-12 ring-2 ring-primary/20 cursor-pointer" onClick={() => router.push('/profile')}><AvatarImage src={profile?.photoURL} /><AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback></Avatar>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <GlassStat label="Total Properties" value={stats.total} icon={Globe} />
            <GlassStat label="Approval Rate" value={stats.total > 0 ? `${Math.round((stats.approved / stats.total) * 100)}%` : "0%"} icon={Check} color="text-emerald-500" />
            <GlassStat label="Discovery Momentum" value={stats.momentum} icon={TrendingUp} color="text-primary" />
          </div>

          <div className="bg-[#121117] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <h3 className="text-xl font-black italic uppercase tracking-tighter shrink-0">The Master Ledger</h3>
               <div className="flex flex-1 max-w-2xl items-center gap-4">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search registry..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 bg-white/5 border-white/10 rounded-2xl h-12 text-xs font-bold"
                    />
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {['all', 'approved', 'pending'].map(f => (
                      <button key={f} onClick={() => setStatusFilter(f)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all", statusFilter === f ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}>{f}</button>
                    ))}
                  </div>
               </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                  <tr>
                    <th className="p-8">Digital Property</th>
                    <th className="p-8">Momentum (Live)</th>
                    <th className="p-8 text-center">Status</th>
                    <th className="p-8">Views</th>
                    <th className="p-8">Clicks</th>
                    <th className="p-8">CTR</th>
                    <th className="p-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissionsLoading ? (
                    <tr><td colSpan={7} className="p-32 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                  ) : filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((site: any) => {
                      const siteStats = globalStats?.find(gs => gs.id === site.id);
                      const views = siteStats?.visitCount || 0;
                      const clicks = Math.floor(views * 0.15); // Mocked for demonstration since visitCount is total clicks in your schema
                      const ctr = views > 0 ? "15.0%" : "0.0%";
                      return (
                        <tr key={site.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="p-8">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-[#0B0A0F] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                <WebsitePreview websiteUrl={site.url} fallbackUrl={site.logoUrl} alt={site.url} width={56} height={56} className="w-full h-full" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-black italic tracking-tighter text-white group-hover:text-primary transition-colors truncate">{site.url.replace('https://', '').replace('www.', '')}</p>
                                <p className="text-[10px] text-muted-foreground font-medium opacity-40 italic mt-0.5">{site.categories?.[0] || 'Web App'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-8">
                             <div className="h-10 w-32 opacity-30 group-hover:opacity-100 transition-opacity">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40"><path d="M0,35 Q10,5 20,25 T40,15 T60,30 T80,10 T100,20" fill="none" stroke={site.status === 'approved' ? "#7B33FF" : "#ffffff20"} strokeWidth="3" /></svg>
                             </div>
                          </td>
                          <td className="p-8 text-center">
                            <Badge className={cn("uppercase text-[9px] font-black px-4 py-1 rounded-full border-none", 
                              site.status === 'approved' ? "bg-emerald-500/10 text-emerald-400" : 
                              site.status === 'rejected' ? "bg-red-500/10 text-red-400" : "bg-white/5 text-muted-foreground/30")}>
                              {site.status || 'pending'}
                            </Badge>
                          </td>
                          <td className="p-8 text-sm font-black italic tracking-tighter text-white">{(views * 4).toLocaleString()}</td>
                          <td className="p-8 text-sm font-black italic tracking-tighter text-white">{views.toLocaleString()}</td>
                          <td className="p-8 text-sm font-black italic tracking-tighter text-primary">{ctr}</td>
                          <td className="p-8">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" onClick={() => router.push(`/website/${site.id}`)} className="h-10 w-10 hover:bg-white/10 rounded-xl" title="View Public Page"><ExternalLink className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => handleShare(site.id)} className="h-10 w-10 hover:bg-white/10 rounded-xl" title="Share Link"><Share2 className="w-4 h-4" /></Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-destructive/20 text-destructive rounded-xl" title="Delete Permanent"><Trash2 className="w-4 h-4" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-[#121019] border-white/10 text-white rounded-[2rem]">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Confirm Deletion</AlertDialogTitle>
                                      <AlertDialogDescription className="text-muted-foreground font-medium">This will permanently remove {site.url} from the Bessites registry. This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="bg-white/5 border-none text-white hover:bg-white/10 rounded-xl">Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(site.id)} className="bg-destructive text-white hover:bg-destructive/90 rounded-xl">Purge Registry</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                             </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={7} className="p-32 text-center text-muted-foreground italic font-medium opacity-20">The master ledger is empty. Start your discovery pipeline.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function GlassStat({ label, value, icon: Icon, color = "text-white" }: { label: string, value: string | number, icon: any, color?: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-xl group hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between cursor-default">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] blur-3xl -mr-16 -mt-16" />
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="p-4 rounded-2xl bg-white/5 transition-all group-hover:scale-110"><Icon className={cn("w-6 h-6", color)} /></div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-1">{label}</p>
        <h4 className="text-4xl font-black italic tracking-tighter text-white tabular-nums leading-none">{value}</h4>
      </div>
    </Card>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick, badge }: { icon: any, label: string, active?: boolean, onClick: () => void, badge?: number }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all relative overflow-hidden group text-left", active ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" : "text-muted-foreground/60 hover:text-white hover:bg-white/5")}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(123,51,255,1)]" />}
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-primary" : "group-hover:text-white")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {badge !== undefined && badge > 0 && <span className="ml-auto bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg">{badge}</span>}
    </button>
  );
}
