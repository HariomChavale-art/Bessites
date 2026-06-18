"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WebsiteCardProps {
  website: Website;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <Link href={`/website/${website.id}`} className="block break-inside-avoid mb-6 group">
      <div className="relative rounded-2xl overflow-hidden bg-card border border-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(123,51,255,0.15)] group-hover:-translate-y-1">
        {/* Main Visual */}
        <div className="relative aspect-auto">
          <Image 
            src={website.imageUrl} 
            alt={website.name}
            width={600}
            height={800}
            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            data-ai-hint="app interface"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            <div className="bg-primary p-2 rounded-full text-white shadow-lg glow-primary">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-headline font-bold text-lg text-white group-hover:text-primary transition-colors">
                {website.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                By {website.developer}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium text-white">{website.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {website.categories.slice(0, 2).map(cat => (
              <Badge key={cat} variant="secondary" className="text-[10px] bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer border-none">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}