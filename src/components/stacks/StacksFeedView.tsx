
"use client"

import React, { useState, useMemo } from 'react';
import { StackDocument, StackTag } from '@/types/stacks';
import { StackCard } from './StackCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Layers, Plus, TrendingUp, Clock, Star, Zap, ShieldCheck, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StacksFeedViewProps {
  initialStacks: StackDocument[];
}

const UTILITY_FILTERS: { id: StackTag, icon: any, label: string }[] = [
  { id: '100% Free', icon: Zap, label: '100% Free' },
  { id: 'Zero Ads', icon: ShieldCheck, label: 'Zero Ads' },
  { id: 'No Signup', icon: Unlock, label: 'No Signup' },
  { id: 'Open Source', icon: Layers, label: 'Open Source' },
];

export function StacksFeedView({ initialStacks }: StacksFeedViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'top' | 'new'>('trending');
  const [activeFilters, setActiveFilters] = useState<StackTag[]>([]);

  const toggleFilter = (tag: StackTag) => {
    setActiveFilters(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredStacks = useMemo(() => {
    return initialStacks.filter(stack => {
      const matchesSearch = stack.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           stack.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilters = activeFilters.every(f => stack.tags.includes(f));
      return matchesSearch && matchesFilters;
    });
  }, [initialStacks, searchQuery, activeFilters]);

  return (
    <div className="space-y-12">
      {/* Hero Control Bar */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">System <span className="text-primary">Stacks.</span></h1>
          <p className="text-sm text-muted-foreground font-medium italic opacity-60">Community-curated website playlists with zero padding.</p>
        </div>
        <Button className="h-14 px-8 rounded-full bg-white text-black font-black uppercase italic tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-white/5">
           BUILD NEW STACK <Plus className="w-4 h-4 ml-2" />
        </Button>
      </header>

      {/* Filter Matrix */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-[2.5rem]">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search community stacks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none pl-14 h-12 text-sm font-bold focus-visible:ring-0"
            />
          </div>
          
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 shrink-0">
             <button onClick={() => setActiveTab('trending')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase italic transition-all", activeTab === 'trending' ? "bg-primary text-white" : "text-white/40 hover:text-white")}>Trending</button>
             <button onClick={() => setActiveTab('top')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase italic transition-all", activeTab === 'top' ? "bg-primary text-white" : "text-white/40 hover:text-white")}>Top Rated</button>
             <button onClick={() => setActiveTab('new')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase italic transition-all", activeTab === 'new' ? "bg-primary text-white" : "text-white/40 hover:text-white")}>Recently Created</button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-2">
           <span className="text-[10px] font-black uppercase text-white/20 tracking-widest mr-2 italic">Utility Check:</span>
           {UTILITY_FILTERS.map(f => (
             <button 
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={cn(
                "px-5 py-2 rounded-full text-[9px] font-black uppercase italic tracking-widest border transition-all flex items-center gap-2",
                activeFilters.includes(f.id) 
                  ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(123,51,255,0.3)]" 
                  : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
              )}
             >
               <f.icon className="w-3 h-3" />
               {f.label}
             </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
        {filteredStacks.map((stack, idx) => (
          <StackCard key={stack.id} stack={stack} index={idx} />
        ))}
        {filteredStacks.length === 0 && (
          <div className="col-span-full py-32 text-center space-y-6 bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5">
             <Layers className="w-16 h-16 text-white/5 mx-auto" />
             <p className="text-xl font-black italic uppercase text-white/20">No matching stacks found.</p>
             <Button variant="outline" className="rounded-full px-8 h-12 uppercase font-bold text-[10px] border-white/10" onClick={() => { setSearchQuery(''); setActiveFilters([]); }}>Clear Discovery Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
