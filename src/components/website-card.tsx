
"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WebsitePreview } from "./website-preview";

interface WebsiteCardProps {
  website: Website;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <Link href={`/website/${website.id}`} className="block break-inside-avoid mb-6 group">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-card/40 border border-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_rgba(123,51,255,0.15)] group-hover:bg-card/60">
        
        {/* Main Logo Container */}
        <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
          <WebsitePreview 
            websiteId={website.id}
            websiteUrl={website.url}
            fallbackUrl={website.imageUrl}
            alt={website.name}
            width={400}
            height={400}
            mode="logo"
            className="w-2/3 h-2/3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Floating Rating Badge (Top Left) */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xl px-3 py-1 rounded-full border border-white/10 shadow-lg">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-bold text-white tracking-tight">{website.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Pricing Badge (Top Right) */}
          <div className="absolute top-4 right-4 z-10">
             <Badge 
              variant="outline" 
              className={`
                text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border-none shadow-lg backdrop-blur-md
                ${website.pricing === 'Free' ? 'bg-green-500/20 text-green-400' : 'bg-primary/30 text-white'}
              `}
            >
              {website.pricing?.toUpperCase() || 'FREE'}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 pt-2 space-y-3">
          <div className="text-center">
            <h3 className="font-headline font-bold text-lg text-white group-hover:text-primary transition-colors truncate">
              {website.name}
            </h3>
            <p className="text-xs text-muted-foreground/60 font-medium truncate mt-0.5">
              {website.url.replace('https://', '').replace('www.', '').split('/')[0]}
            </p>
          </div>

          <p className="text-[13px] text-muted-foreground/80 line-clamp-2 leading-relaxed text-center font-medium px-2">
            {website.description}
          </p>

          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {website.categories.slice(0, 2).map((cat) => (
              <span key={cat} className="text-[9px] font-bold text-primary/60 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
