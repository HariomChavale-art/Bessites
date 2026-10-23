
"use client"

import React from 'react';
import { StackDocument } from '@/types/stacks';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Bookmark, ArrowRight, Share2, Zap, ShieldCheck, Unlock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StackCardProps {
  stack: StackDocument;
  index?: number;
}

export function StackCard({ stack }: StackCardProps) {
  return (
    <Link href={`/stacks/${stack.slug}`} className="group block">
      <Card className="bg-[#12111A] border-white/5 p-6 rounded-[2.5rem] hover:border-primary/40 transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        
        {/* Layered Stack Visual */}
        <div className="relative h-40 w-full flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative w-full h-full perspective-1000">
            {stack.previewItems.slice(0, 3).map((item, idx) => (
              <div 
                key={item.id}
                className={cn(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-2xl bg-[#0D0C14] border border-white/10 shadow-2xl flex items-center justify-center p-4 transition-all duration-700",
                  "group-hover:rotate-0 group-hover:translate-x-[-50%] group-hover:translate-y-[-50%]"
                )}
                style={{
                  transform: `translate(-50%, -50%) 
                             translateY(${idx * -12}px) 
                             translateX(${idx * 12}px) 
                             rotate(${idx * 4}deg) 
                             scale(${1 - idx * 0.05})`,
                  zIndex: 10 - idx
                }}
              >
                <img 
                  src={item.faviconUrl} 
                  alt={item.title} 
                  className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Area */}
        <div className="space-y-4 relative z-10">
          <div className="space-y-1">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors truncate">
              {stack.title}
            </h3>
            <p className="text-xs text-muted-foreground font-medium italic line-clamp-2 leading-relaxed opacity-60">
              {stack.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
             {stack.badges.isFullyFree && <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] font-black uppercase italic gap-1"><Zap className="w-2 h-2" /> 100% Free</Badge>}
             {stack.badges.isAdFree && <Badge className="bg-blue-500/10 text-blue-400 border-none text-[8px] font-black uppercase italic gap-1"><ShieldCheck className="w-2 h-2" /> No Ads</Badge>}
             {stack.badges.isNoSignup && <Badge className="bg-amber-500/10 text-amber-400 border-none text-[8px] font-black uppercase italic gap-1"><Unlock className="w-2 h-2" /> No Login</Badge>}
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5 ring-1 ring-white/10">
                  <AvatarImage src={stack.creatorSnapshot.avatarUrl} />
                  <AvatarFallback>{stack.creatorSnapshot.displayName[0]}</AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stack.creatorSnapshot.displayName}</span>
             </div>
             <div className="flex items-center gap-4 text-white/20">
                <span className="text-[9px] font-black uppercase flex items-center gap-1.5"><Heart className="w-3 h-3" /> {stack.upvoteCount}</span>
                <span className="text-[9px] font-black uppercase flex items-center gap-1.5"><Bookmark className="w-3 h-3" /> {stack.saveCount}</span>
             </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
