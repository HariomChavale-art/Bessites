"use client"

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CollectionSite } from '@/types/collection';
import { ConnectWebsiteModal } from '@/components/collection/ConnectWebsiteModal';

export default function CollectionDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const sitesRef = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "collections_sites"), where("ownerId", "==", user.uid), orderBy("lastSyncedAt", "desc"));
  }, [user, db]);

  const { data: sites, loading } = useCollection<CollectionSite>(sitesRef);

  const aggregate = useMemo(() => {
    if (!sites || sites.length === 0) return { live: 0, total24h: 0 };
    return {
      live: sites.reduce((acc, s) => acc + (s.currentSummaryStats?.liveVisitors || 0), 0),
      total24h: sites.reduce((acc, s) => acc + (s.currentSummaryStats?.visitors24h || 0), 0)
    };
  }, [sites]);

  return (
    <div className="min-h-screen bg-halloween-void text-halloween-bone font-body antialiased">
      <Navigation />
      
      <main className="container mx-auto max-w-6xl px-4 py-16 space-y-12 pb-32">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold italic text-white leading-none">Connected sites.</h1>
            <p className="text-[13px] font-medium text-zinc-500 italic">Live traffic, response latency, and referrals across your domains.</p>
          </div>
          <Button onClick={() => setIsConnectModalOpen(true)} className="h-11 px-6 rounded-lg bg-white text-black font-semibold uppercase text-[11px] tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
            Connect domain
          </Button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden shadow-specular">
           <Rollup label="Active visitors now" value={aggregate.live} />
           <Rollup label="24h unique visitors" value={aggregate.total24h.toLocaleString()} />
           <Rollup label="Avg response time" value="114ms" />
           <Rollup label="Bessites referrals" value="412" />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {sites?.map(site => (
             <Card key={site.id} className="bg-halloween-crypt border-white/[0.07] p-6 rounded-xl shadow-specular group">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black border border-white/5 flex items-center justify-center"><Globe className="w-4 h-4 text-zinc-600" /></div>
                      <span className="text-[14px] font-semibold text-white">{site.domain}</span>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active visitors</p>
                   <h3 className="text-3xl font-mono tabular-nums font-semibold">{site.currentSummaryStats?.liveVisitors || 0}</h3>
                </div>
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                   <span>Synced 14s ago</span>
                   <span className="text-emerald-500">+12.5%</span>
                </div>
             </Card>
           ))}
           {!loading && (!sites || sites.length === 0) && (
             <div className="col-span-full py-32 text-center space-y-6 bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
                <p className="text-zinc-600 italic font-medium">No connected domains. Start monitoring your traffic nodes.</p>
                <Button onClick={() => setIsConnectModalOpen(true)} variant="outline" className="h-9 px-4 text-[11px] font-bold uppercase border-white/10">Add website</Button>
             </div>
           )}
        </section>

        <ConnectWebsiteModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} />
      </main>
    </div>
  );
}

function Rollup({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-halloween-void p-8 space-y-2">
       <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{label}</p>
       <h3 className="text-3xl font-mono font-semibold text-white tabular-nums">{value}</h3>
    </div>
  );
}