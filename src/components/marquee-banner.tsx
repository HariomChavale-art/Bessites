
"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { WebsitePreview } from "./website-preview";

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
            <div className="relative w-12 h-12 rounded-xl overflow-hidden mr-4 border border-white/10 group-hover:border-primary transition-colors bg-card">
              <WebsitePreview 
                websiteId={item.id}
                websiteUrl={item.url}
                fallbackUrl={item.imageUrl}
                alt={item.name}
                width={48}
                height={48}
                mode="logo"
                className="w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-white group-hover:text-primary transition-colors">
                  {item.name}
                </span>
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
