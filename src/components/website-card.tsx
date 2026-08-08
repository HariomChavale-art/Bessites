"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { Tag, TrendingUp } from "lucide-react";
import { WebsitePreview } from "./website-preview";
import { useMemo } from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

interface WebsiteCardProps {
  website: Website;
}

/**
 * WebsiteCard refined for Bessites discovery.
 * - Displays Website Name as primary.
 * - Shows Discovery Title (name) separately.
 * - Hides About/Discovery content until clicked.
 */
export function WebsiteCard({ website }: WebsiteCardProps) {
  const db = useFirestore();
  
  const statsRef = useMemo(() => {
    if (!db) return null;
    return doc(db, "websiteStats", website.id);
  }, [db, website.id]);

  const { data: stats } = useDoc(statsRef);

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case "Paid": return "bg-black text-white border-white/20";
      case "Free": return "bg-white text-black border-none";
      case "Freemium":
      default: return "bg-secondary text-secondary-foreground border-white/10";
    }
  };

  const totalLikes = stats?.likeCount || 0;
  const totalVisits = stats?.visitCount || 0;
  const isTrending = totalVisits > 50 || totalLikes > 10;

  const brandName = website.websiteName || website.name;
  const discoveryTitle = website.websiteName ? website.name : "";

  return (
    <div className="block break-inside-avoid mb-4 sm:mb-6 group">
      <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-card/40 border border-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:bg-card/60 shadow-xl">
        
        <Link href={`/website/${website.id}`} className="relative aspect-square overflow-hidden flex items-center justify-center bg-[#1A1A1A]">
          <WebsitePreview 
            websiteId={website.id}
            websiteUrl={website.url}
            fallbackUrl={stats?.logoUrl || website.imageUrl}
            alt={brandName}
            width={400}
            height={400}
            className="w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
          
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 items-start">
            <div className={cn(
              "flex items-center gap-1 backdrop-blur-xl px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full border shadow-lg",
              getPricingStyle(website.pricing)
            )}>
              <Tag className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider">{website.pricing}</span>
            </div>
            {isTrending && (
              <div className="flex items-center gap-1 bg-primary text-white px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter italic shadow-lg">
                <TrendingUp className="w-2.5 h-2.5" /> Community Pick
              </div>
            )}
          </div>
        </Link>

        <div className="p-3 sm:p-6 pt-2 sm:pt-4">
          <Link href={`/website/${website.id}`} className="text-center block">
            <h3 className="font-headline font-bold text-sm sm:text-lg text-white group-hover:text-primary transition-colors whitespace-normal leading-tight">
              {brandName}
            </h3>
            {discoveryTitle && (
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-1 uppercase tracking-tighter opacity-80">
                {discoveryTitle}
              </p>
            )}
            <p className="text-[9px] sm:text-[10px] text-muted-foreground/30 font-medium tracking-widest uppercase mt-2">
              {website.url.replace('https://', '').replace('www.', '').split('/')[0]}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
