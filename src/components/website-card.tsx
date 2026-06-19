
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
      <div className="relative rounded-3xl overflow-hidden bg-[#121212] border border-white/5 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-2xl">
        
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <Image 
            src={website.imageUrl} 
            alt={website.name}
            width={600}
            height={800}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={website.imageHint}
          />
          
          {/* Floating Rating Badge (Top Left) */}
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-white">{website.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Bottom Blur Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent backdrop-blur-[4px]" />
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3 relative z-10 -mt-8">
          {/* Title and Pricing Row */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-headline font-bold text-lg text-white group-hover:text-primary transition-colors truncate">
              {website.name}
            </h3>
            <Badge 
              variant="outline" 
              className={`
                text-[10px] font-bold px-2 py-0.5 rounded-md border-none
                ${website.pricing === 'Free' ? 'bg-white/10 text-muted-foreground' : 'bg-primary/20 text-primary'}
              `}
            >
              {website.pricing?.toUpperCase() || 'FREE'}
            </Badge>
          </div>

          {/* Short Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {website.description}
          </p>

          <Separator className="bg-white/5" />

          {/* Categories / Metadata */}
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {website.categories.join(' / ')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
