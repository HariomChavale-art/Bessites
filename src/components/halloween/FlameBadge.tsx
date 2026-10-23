'use client';

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlameBadgeProps {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  children: React.ReactNode;
}

export function FlameBadge({ intensity = 'medium', className, children }: FlameBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-halloween-pumpkin/10 border border-halloween-pumpkin/20 text-halloween-pumpkin text-[10px] font-black uppercase tracking-widest italic shadow-pumpkin-glow",
      className
    )}>
      <Flame className={cn(
        "w-3 h-3 animate-flame-flicker fill-current",
        intensity === 'high' && "text-red-500",
        intensity === 'low' && "text-halloween-pumpkin/60"
      )} />
      {children}
    </div>
  );
}
