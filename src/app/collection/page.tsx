
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
  Globe, 
  Zap, 
  LayoutGrid, 
  Table as TableIcon,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CollectionSite } from '@/types/collection';
import { ConnectWebsiteModal } from '@/components/collection/ConnectWebsiteModal';

export default function CollectionDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const sitesRef = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "collections_sites"), where("ownerId", "==", user.uid), orderBy("lastSyncedAt", "desc"));
  }, [user, db]);

  const { data: sites, loading } = useCollection<CollectionSite>(sitesRef);

  const aggregateStats = useMemo(() => {
    if (!sites || sites.length === 0) return { live: 0, total24h: 0 };
    return {
      live: sites.reduce((acc, s) => acc + (s.currentSummaryStats?.liveVisitors || 0), 0),
      total24h: sites.reduce((acc, s) => acc + (s.currentSummaryStats?.visitors24h || 0), 0)
    };
  }, [sites]);

  return (
    <div className="min-h-screen bg-halloween-void text-halloween-bone font-body selection:bg-halloween-pumpkin/30 antialiased">
      <Navigation />
      
      <main className="container mx-auto max-w-6xl px-4 py-12 space-y-12 pb-32">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Collection</h1>
            <p className="text-[10px] font-black uppercase text-halloween-pumpkin tracking-[0.2em] italic">Online & Active</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="bg-white/5 p-1 rounded-2xl border border-white/5 flex gap-1">
                <button onClick={() => setViewMode('grid')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-halloween-pumpkin text-halloween-void" : "text-white/40 hover:text-white")}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('table')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'table' ? "bg-halloween-pumpkin text-halloween-void" : "text-white/40 hover:text-white")}><TableIcon className="w-4 h-4" /></button>
             </div>
             <Button onClick={() => setIsConnectModalOpen(true)} className="h-14 px-8 rounded-2xl bg-halloween-bone text-halloween-void font-black uppercase text-xs italic shadow-pumpkin-glow transition-all hover:scale-105 active:scale-95 group">
                CONNECT WEBSITE <Plus className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform" />
             </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <SimpleRollup label="Active Visitors" value={aggregateStats.live} sub="Across all connected sites" color="text-halloween-pumpkin" />
           <SimpleRollup label="24h Total" value={aggregateStats.total24h.toLocaleString()} sub="Verified interactions" color="text-halloween-slime" />
        </section>

        <section className="flex items-center gap-4 bg-halloween-obsidian/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2rem]">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input placeholder="Search your collection..." className="w-full bg-transparent border-none pl-12 h-10 text-sm font-bold placeholder:text-white/10 focus:ring-0" />
           </div>
           <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest gap-2 text-white/40"><Filter className="w-3.5 h-3.5" /> Sort</Button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {sites?.map(site => (
             <SiteCard key={site.id} site={site} />
           ))}
           {!loading && (!sites || sites.length === 0) && (
             <div className="col-span-full py-32 text-center space-y-6 bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5">
                <Globe className="w-16 h-16 text-white/5 mx-auto" />
                <p className="text-xl font-black italic uppercase text-white/40">Your collection is empty</p>
                <Button onClick={() => setIsConnectModalOpen(true)} variant="outline" className="rounded-full px-10 h-12 border-white/10 font-bold uppercase text-[10px]">Add First Website</Button>
             </div>
           )}
        </section>

        <ConnectWebsiteModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} />
      </main>
    </div>
  );
}

function SimpleRollup({ label, value, sub, color }: { label: string, value: string | number, sub: string, color: string }) {
  return (
    <Card className="bg-halloween-obsidian/60 border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
       <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">{label}</p>
          <div className="space-y-1">
             <h3 className={cn("text-5xl font-black italic tracking-tighter tabular-nums", color)}>{value}</h3>
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{sub}</p>
          </div>
       </div>
    </Card>
  );
}

function SiteCard({ site }: { site: CollectionSite }) {
  return (
    <Card className="bg-halloween-obsidian border border-white/5 p-8 rounded-[2.5rem] shadow-2xl hover:border-halloween-pumpkin/40 transition-all group flex flex-col gap-8">
       <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                <Globe className="w-full h-full text-white/20" />
             </div>
             <div className="min-w-0">
                <h4 className="text-lg font-black italic uppercase tracking-tighter truncate">{site.domain}</h4>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-halloween-slime animate-pulse shadow-slime-glow" />
                   <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Active</span>
                </div>
             </div>
          </div>
          <Badge className="bg-white/5 text-white/40 border-none text-[8px] font-black uppercase px-3 py-1 rounded-full italic">{site.providerType}</Badge>
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.02] p-5 rounded-[1.5rem] border border-white/5">
             <p className="text-[8px] font-black uppercase text-white/20 mb-1 tracking-widest">Visitors</p>
             <h5 className="text-2xl font-black italic text-halloween-pumpkin tabular-nums">{site.currentSummaryStats?.liveVisitors || 0}</h5>
          </div>
          <div className="bg-white/[0.02] p-5 rounded-[1.5rem] border border-white/5">
             <p className="text-[8px] font-black uppercase text-white/20 mb-1 tracking-widest">24h Change</p>
             <h5 className="text-2xl font-black italic text-halloween-slime tabular-nums">+{site.currentSummaryStats?.trafficGrowthDelta || 0}%</h5>
          </div>
       </div>

       <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-[9px] font-black uppercase text-white/20 tracking-widest italic">Connected</p>
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-white/5 hover:bg-halloween-pumpkin hover:text-halloween-void transition-all"><ArrowRight className="w-5 h-5" /></Button>
       </div>
    </Card>
  );
}
