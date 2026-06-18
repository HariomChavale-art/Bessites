"use client"

import { Website } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface MarqueeBannerProps {
  items: Website[];
}

export function MarqueeBanner({ items }: MarqueeBannerProps) {
  // Triple the items to ensure seamless infinite scroll
  const marqueeItems = [...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-card/30 border-y border-white/5 py-6">
      <div className="flex whitespace-nowrap animate-marquee-slow hover:[animation-play-state:paused]">
        {marqueeItems.map((item, idx) => (
          <Link 
            key={`${item.id}-${idx}`} 
            href={`/website/${item.id}`}
            className="inline-flex items-center mx-8 group"
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden mr-4 border border-white/10 group-hover:border-primary transition-colors">
              <Image 
                src={item.imageUrl} 
                alt={item.name} 
                fill 
                className="object-cover"
                data-ai-hint="app icon"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-white group-hover:text-primary transition-colors">
                  {item.name}
                </span>
                {item.isSponsored && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/50 text-primary">
                    Sponsored
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {item.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}