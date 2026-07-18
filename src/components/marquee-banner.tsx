"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { WebsitePreview } from "./website-preview";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface MarqueeBannerProps {
  items: Website[];
}

/**
 * MarqueeBanner configured for horizontal scrolling staff picks.
 * Provides a clean, ad-free curated experience.
 */
export function MarqueeBanner({ items }: MarqueeBannerProps) {
  // Triple the items to ensure seamless infinite scroll
  const marqueeItems = [...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-white/[0.02] border-y border-white/5 py-8">
      <div className="flex whitespace-nowrap animate-marquee-slow hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing overflow-x-auto no-scrollbar">
        {marqueeItems.map((item, idx) => (
          <Link 
            key={`${item.id}-${idx}`} 
            href={`/website/${item.id}`}
            className="inline-flex items-center mx-10 group"
          >
            <div className="relative w-16 h-16 rounded-[1.25rem] overflow-hidden mr-6 border border-white/10 group-hover:border-primary/40 transition-all bg-card shadow-2xl group-hover:scale-105">
              <WebsitePreview 
                websiteId={item.id}
                websiteUrl={item.url}
                fallbackUrl={item.imageUrl}
                alt={item.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-medium text-muted-foreground opacity-60 tracking-tight">
                {item.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
