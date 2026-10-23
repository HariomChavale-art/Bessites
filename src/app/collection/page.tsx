
"use client"

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Activity, 
  Globe, 
  Zap, 
  AlertCircle, 
  ChevronRight, 
  LayoutGrid, 
  Table as TableIcon,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CollectionSite } from '@/types/collection';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { ConnectWebsiteModal } from '@/components/collection/ConnectWebsiteModal';

export default function CollectionDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'arena'>('grid');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const sitesRef = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "collections_sites"), where("ownerId", "==", user.uid), orderBy("lastSyncedAt", "desc"));
  }, [user, db]);

  const { data: sites, loading } = useCollection<CollectionSite>(sitesRef);

  const aggregateStats = useMemo(() => {
    if (!sites || sites.length === 0) return { live: 0, visitors: 0, uptime: 0, healthy: 0 };
    return {
      live: sites.reduce((acc, s) => acc + (s.currentSummaryStats?.liveVisitors || 0), 0),
      visitors: sites.reduce((acc, s) => acc + (s.currentSummaryStats?.visitors24h || 0), 0),
      uptime: 99.98, // Mock aggregate
      healthy: sites.filter(s => s.status === 'healthy').length
    };
  }, [sites]);

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white font-body selection:bg-primary/30 antialiased">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 space-y-12 pb-32">
        {/* Header Command Bar */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Collection</h1>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 italic">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  All Systems Operational
               </div>
               <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{sites?.length || 0} Assets Connected</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="bg-white/5 p-1 rounded-2xl border border-white/5 flex gap-1">
                <button onClick={() => setViewMode('grid')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-primary text-white" : "text-white/40 hover:text-white")}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('table')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'table' ? "bg-primary text-white" : "text-white/40 hover:text-white")}><TableIcon className="w-4 h-4" /></button>
             </div>
             <Button onClick={() => setIsConnectModalOpen(true)} className="h-14 px-8 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest text-xs italic shadow-xl transition-all hover:scale-105 active:scale-95 group">
                CONNECT WEBSITE <Plus className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform" />
             </Button>
          </div>
        </header>

        {/* Global Rollup Strip */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <RollupCard label="Live Visitors Now" value={aggregateStats.live} icon={Activity} sub="Across Portfolio" color="text-primary" />
           <RollupCard label="Total 24h Traffic" value={aggregateStats.visitors.toLocaleString()} icon={Zap} sub="+12.4% vs Yesterday" color="text-amber-400" />
           <RollupCard label="Global Health" value={`${aggregateStats.uptime}%`} icon={ShieldCheck} sub={`${aggregateStats.healthy}/${sites?.length || 0} Sites Healthy`} color="text-emerald-400" />
           <RollupCard label="Bessites Synergy" value="842" icon={ArrowUpRight} sub="Outbound Referrals Today" color="text-blue-400" />
        </section>

        {/* Search & Filter Nodes */}
        <section className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-[2rem]">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input placeholder="Search assets, tags, or providers..." className="w-full bg-transparent border-none pl-12 h-10 text-sm font-bold placeholder:text-white/10 focus:ring-0" />
           </div>
           <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest gap-2 text-white/40"><Filter className="w-3.5 h-3.5" /> Filter</Button>
           <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest gap-2 text-white/40"><RefreshCw className="w-3.5 h-3.5" /> Sync All</Button>
        </section>

        {/* Website Matrix (Grid View) */}
        {viewMode === 'grid' && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {sites?.map(site => (
               <WebsiteCard key={site.id} site={site} />
             ))}
             {!loading && (!sites || sites.length === 0) && (
               <div className="col-span-full py-32 text-center space-y-6 bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5">
                  <Globe className="w-16 h-16 text-white/5 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-xl font-black italic uppercase text-white/40">The Collection is Empty</p>
                    <p className="text-sm text-white/20 font-medium italic">Connect your first website to start monitoring telemetry.</p>
                  </div>
                  <Button onClick={() => setIsConnectModalOpen(true)} variant="outline" className="rounded-full px-10 h-12 border-white/10 font-bold uppercase text-[10px]">Add Project Now</Button>
               </div>
             )}
          </section>
        )}

        {/* Connect Modal */}
        <ConnectWebsiteModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} />
      </main>
    </div>
  );
}

function RollupCard({ label, value, sub, icon: Icon, color }: { label: string, value: string | number, sub: string, icon: any, color: string }) {
  return (
    <Card className="bg-[#121117] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
       <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-110 transition-transform"><Icon className="w-12 h-12" /></div>
       <div className="space-y-6 relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">{label}</p>
          <div className="space-y-1">
             <h3 className={cn("text-4xl font-black italic tracking-tighter tabular-nums", color)}>{value}</h3>
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{sub}</p>
          </div>
       </div>
    </Card>
  );
}

function WebsiteCard({ site }: { site: CollectionSite }) {
  const chartData = [
    { v: 10 }, { v: 45 }, { v: 30 }, { v: 55 }, { v: 70 }, { v: 40 }, { v: 65 }
  ];

  return (
    <Card className="bg-[#121117] border border-white/5 p-8 rounded-[3rem] shadow-2xl hover:border-primary/40 transition-all group cursor-pointer flex flex-col gap-8">
       <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-2 group-hover:scale-110 transition-transform">
                <Globe className="w-full h-full text-white/20" />
             </div>
             <div className="min-w-0">
                <h4 className="text-lg font-black italic uppercase tracking-tighter truncate">{site.domain}</h4>
                <div className="flex items-center gap-2">
                   <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", site.status === 'healthy' ? "bg-emerald-500" : "bg-amber-500")} />
                   <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">{site.status}</span>
                </div>
             </div>
          </div>
          <Badge className="bg-white/5 text-white/40 border-none text-[8px] font-black uppercase px-3 py-1 rounded-full italic">{site.providerType}</Badge>
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.02] p-4 rounded-[1.5rem] border border-white/5">
             <p className="text-[8px] font-black uppercase text-white/20 mb-1 tracking-widest">Active Now</p>
             <h5 className="text-2xl font-black italic text-primary tabular-nums">{site.currentSummaryStats?.liveVisitors || 0}</h5>
          </div>
          <div className="bg-white/[0.02] p-4 rounded-[1.5rem] border border-white/5">
             <p className="text-[8px] font-black uppercase text-white/20 mb-1 tracking-widest">Growth</p>
             <h5 className="text-2xl font-black italic text-emerald-400 tabular-nums">+{site.currentSummaryStats?.trafficGrowthDelta || 0}%</h5>
          </div>
       </div>

       <div className="h-20 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
               <defs>
                  <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B33FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7B33FF" stopOpacity={0}/>
                  </linearGradient>
               </defs>
               <Area type="monotone" dataKey="v" stroke="#7B33FF" strokeWidth={3} fillOpacity={1} fill="url(#colorPulse)" />
            </AreaChart>
          </ResponsiveContainer>
       </div>

       <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="space-y-0.5">
                <p className="text-[7px] font-black uppercase text-white/20 tracking-widest italic">Health Score</p>
                <p className="text-[10px] font-bold text-white/60">99.9% Uptime</p>
             </div>
             <div className="space-y-0.5">
                <p className="text-[7px] font-black uppercase text-white/20 tracking-widest italic">Response</p>
                <p className="text-[10px] font-bold text-white/60">142ms</p>
             </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-white/5 hover:bg-primary hover:text-white transition-all"><ChevronRight className="w-5 h-5" /></Button>
       </div>
    </Card>
  );
}
