
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WebsiteLaunch } from '@/types/launch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebsitePreview } from '@/components/website-preview';
import { ArrowBigUp, MessageSquare, ExternalLink, Activity, Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaunchCardProps {
  launch: WebsiteLaunch;
  isPodium?: boolean;
  rank?: number;
  hasVoted?: boolean;
  onVote: () => void;
}

export function LaunchCard({ launch, isPodium, rank, hasVoted, onVote }: LaunchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        "group relative bg-[#12111A] border-white/5 overflow-hidden transition-all duration-500 hover:border-primary/40",
        isPodium ? "p-1 rounded-[3rem] shadow-2xl" : "p-4 rounded-3xl"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Header / Podium Frame */}
      <div className={cn(
        "relative rounded-[2.5rem] overflow-hidden bg-[#0A0910]",
        isPodium ? "aspect-[16/10]" : "aspect-video"
      )}>
        {/* The "Responsive Peel" interaction */}
        <div className="absolute inset-0 transition-transform duration-700 ease-in-out">
          <WebsitePreview 
            websiteUrl={launch.url} 
            fallbackUrl={launch.previewImageUrl}
            className={cn("w-full h-full object-cover transition-opacity duration-700", isHovered ? "opacity-40" : "opacity-100")}
          />
        </div>

        {/* Hover Overlays */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center gap-6 animate-in fade-in zoom-in duration-300">
             <button className="p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-primary transition-all">
                <Monitor className="w-6 h-6" />
             </button>
             <button className="p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-primary transition-all">
                <Smartphone className="w-6 h-6" />
             </button>
             <Link href={`/launches/${launch.id}`} className="p-4 rounded-full bg-primary text-white shadow-xl hover:scale-110 transition-all">
                <Activity className="w-6 h-6" />
             </Link>
          </div>
        )}

        {/* Podium Rank Badge */}
        {isPodium && (
          <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-black italic text-xl shadow-2xl border-4 border-[#0A0910]">
            #{rank}
          </div>
        )}

        {/* Live Pulse Indicator */}
        <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{launch.uniqueClicks} Exploring</span>
        </div>
      </div>

      {/* Content Area */}
      <div className={cn("p-6 space-y-4", isPodium ? "pt-10" : "")}>
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
               {launch.title}
             </h3>
             <p className="text-sm text-muted-foreground font-medium italic line-clamp-1 opacity-70">
               {launch.tagline}
             </p>
          </div>

          {/* SPOTLIGHT BOOST BUTTON (Original Upvote Treatment) */}
          <button 
            onClick={(e) => { e.preventDefault(); onVote(); }}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all active:scale-95 shadow-xl",
              hasVoted 
                ? "bg-primary border-primary text-white shadow-primary/20" 
                : "bg-white/5 border-white/10 text-white/40 hover:border-primary/40 hover:text-white"
            )}
          >
            <ArrowBigUp className={cn("w-7 h-7 mb-0.5", hasVoted && "fill-current")} />
            <span className="text-xs font-black tabular-nums">{launch.upvoteCount}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
           <Badge variant="outline" className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase italic">
              {launch.category}
           </Badge>
           {launch.vibeTags.slice(0, 2).map(tag => (
             <span key={tag} className="text-[9px] font-bold text-white/20 uppercase tracking-widest">#{tag}</span>
           ))}
           <div className="ml-auto flex items-center gap-4 text-white/20">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase"><MessageSquare className="w-3.5 h-3.5" /> {launch.commentCount}</span>
           </div>
        </div>
      </div>
    </Card>
  );
}
