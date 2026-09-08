
"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { Tag } from "lucide-react";
import { WebsitePreview } from "./website-preview";
import { useMemo } from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

interface WebsiteCardProps {
  website: Website;
}

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

  const brandName = website.websiteName || website.name;
  const rawExplainingTitle = website.websiteName ? website.name : (website.description?.split('.')[0] || "Discovery Asset");
  
  const explainer = rawExplainingTitle.includes('|') 
    ? rawExplainingTitle.split('|')[1].trim() 
    : rawExplainingTitle.replace(brandName, '').replace(/^[\s\-|]+/, '').trim() || "Explore Now";
    
  // Format: Name | Explainer
  const displayTitle = `${brandName} | ${explainer.slice(0, 30)}${explainer.length > 30 ? '...' : ''}`;

  return (
    <div className="block break-inside-avoid mb-4 sm:mb-6 group">
      <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-card/40 border border-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:bg-card/60 shadow-xl">
        
        <Link href={`/website/${website.id}`} className="relative aspect-square overflow-hidden flex items-center justify-center bg-white/[0.03] p-4">
          <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 group-hover:border-primary/20 transition-all bg-black/20">
            <WebsitePreview 
              websiteId={website.id}
              websiteUrl={website.url}
              fallbackUrl={stats?.logoUrl || website.imageUrl}
              alt={brandName}
              width={400}
              height={400}
              className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          <div className="absolute top-2 left-2 sm:top-6 sm:left-6 z-10 flex flex-col gap-1.5 items-start">
            <div className={cn(
              "flex items-center gap-1 backdrop-blur-xl px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full border shadow-lg",
              getPricingStyle(website.pricing)
            )}>
              <Tag className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider">{website.pricing}</span>
            </div>
          </div>
        </Link>

        <div className="p-3 sm:p-6 pt-2 sm:pt-4">
          <div className="text-center">
            <h3 className="font-headline font-bold italic text-sm sm:text-lg text-white group-hover:text-primary transition-colors whitespace-normal leading-tight line-clamp-2">
              {displayTitle}
            </h3>
            
            <p className="text-[9px] sm:text-[10px] text-zinc-400 hover:text-purple-400 font-bold tracking-widest uppercase mt-3 pt-3 border-t border-white/5 transition-colors">
              {website.url.replace('https://', '').replace('www.', '').split('/')[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
