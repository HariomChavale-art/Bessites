
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { LaunchCard } from '@/components/launches/LaunchCard';
import { WebsiteLaunch, LaunchPeriod } from '@/types/launch';
import { LaunchService } from '@/lib/launches/launchService';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Trophy, Activity, Loader2, Timer, Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Portfolio', 'Indie Web', 'Web App', 'Editorial', 'E-Commerce', 'Experimental'];

export default function LaunchesPage() {
  const { user } = useUser();
  const [period, setPeriod] = useState<LaunchPeriod>('daily');
  const [category, setCategory] = useState('All');
  const [launches, setLaunches] = useState<WebsiteLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  
  const launchService = useMemo(() => new LaunchService(), []);

  useEffect(() => {
    const loadLaunches = async () => {
      setLoading(true);
      try {
        const snap = await launchService.getLeaderboard(period, category);
        setLaunches(snap.docs.map(doc => doc.data() as WebsiteLaunch));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLaunches();
  }, [period, category, launchService]);

  const handleVote = async (launchId: string) => {
    if (!user) return alert('Authenticate to Spotlight this asset.');
    try {
      // Optimistic update logic would go here
      await launchService.toggleVote(launchId, user.uid, true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white selection:bg-primary/30">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Header */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-12 border-b border-white/5">
          <div className="space-y-4">
             <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
                Registry Spotlight
             </Badge>
             <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                The Daily <br />
                <span className="text-primary">Reveal.</span>
             </h1>
             <div className="flex items-center gap-3 text-muted-foreground font-medium italic">
                <Timer className="w-5 h-5 text-primary" />
                <span>Next Reveal in: <span className="text-white font-black tabular-nums">04:22:15</span></span>
             </div>
          </div>

          <Button className="h-20 px-12 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-2xl font-black italic shadow-2xl transition-all hover:scale-105 group">
             LAUNCH YOUR WEB <Rocket className="w-6 h-6 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </header>

        {/* Filters & Control Node */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white/[0.02] p-4 rounded-[2.5rem] border border-white/5 sticky top-28 z-40 backdrop-blur-xl">
           <div className="flex bg-black/40 p-1.5 rounded-3xl border border-white/5 overflow-x-auto no-scrollbar w-full lg:w-auto">
              {(['daily', 'weekly', 'all-time'] as LaunchPeriod[]).map(p => (
                <button 
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all italic whitespace-nowrap",
                    period === p ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:text-white"
                  )}
                >
                  {p.replace('-', ' ')}
                </button>
              ))}
           </div>

           <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full lg:w-auto px-4 lg:px-0">
              <Filter className="w-4 h-4 text-white/20 shrink-0" />
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-all italic whitespace-nowrap",
                    category === cat ? "text-primary underline decoration-2 underline-offset-8" : "text-white/20 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
           </div>
        </section>

        {/* Podium Area (#1 - #3) */}
        {launches.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {launches.slice(0, 3).map((launch, idx) => (
              <LaunchCard 
                key={launch.id} 
                launch={launch} 
                isPodium 
                rank={idx + 1} 
                onVote={() => handleVote(launch.id)}
              />
            ))}
          </section>
        )}

        {/* Discovery Stream (#4+) */}
        <section className="space-y-8">
           <div className="flex items-center gap-4 text-white/20">
              <Activity className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-[0.4em]">The Stream</h3>
              <div className="h-px flex-1 bg-white/5" />
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {launches.slice(3).map((launch, idx) => (
                <LaunchCard 
                  key={launch.id} 
                  launch={launch} 
                  onVote={() => handleVote(launch.id)}
                />
              ))}
           </div>
        </section>

        {loading && (
          <div className="py-32 flex flex-col items-center gap-6">
             <Loader2 className="w-12 h-12 animate-spin text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Synchronizing Leaderboard...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
