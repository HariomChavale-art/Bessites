"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface WebsiteCardProps {
  website: Website;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <Link href={`/website/${website.id}`} className="block break-inside-avoid mb-6 group">
      <div className="relative rounded-3xl overflow-hidden bg-card/60 border border-white/5 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:bg-card/80">
        
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <Image 
            src={website.imageUrl} 
            alt={website.name}
            width={600}
            height={800}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            data-ai-hint={website.imageHint}
          />
          
          {/* Floating Rating Badge (Top Left) */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xl px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-white tracking-tight">{website.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Faded Blur Overlay - Shortened height from h-32 to h-20 */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card via-card/40 to-transparent backdrop-blur-[1px]" />
        </div>

        {/* Content Section - Sunk into the image with -mt-8 (tightened from -mt-12) */}
        <div className="p-6 pt-0 space-y-3 relative z-10 -mt-8">
          {/* Title and Pricing Row */}
          <div className="flex items-end justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-headline font-bold text-xl text-white group-hover:text-primary transition-colors truncate drop-shadow-md">
                {website.name}
              </h3>
            </div>
            <Badge 
              variant="outline" 
              className={`
                text-[10px] font-extrabold px-2.5 py-1 rounded-lg border-none shrink-0 shadow-sm
                ${website.pricing === 'Free' ? 'bg-white/10 text-white/70' : 'bg-primary/30 text-white'}
              `}
            >
              {website.pricing?.toUpperCase() || 'FREE'}
            </Badge>
          </div>

          {/* Short Description */}
          <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed font-medium">
            {website.description}
          </p>

          <Separator className="bg-white/10" />

          {/* Categories / Metadata */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">
              {website.categories[0]}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
              {website.categories.slice(1).join(' / ')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
