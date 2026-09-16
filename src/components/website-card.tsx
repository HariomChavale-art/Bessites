
"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
      case "Paid": return "bg-white/10 text-white border-white/10";
      case "Free": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Freemium":
      default: return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  const brandName = website.websiteName || website.name;
  const description = website.description || website.longDescription || "Discovery Asset";
  const domain = website.url.replace('https://', '').replace('www.', '').split('/')[0];

  return (
    <Link 
      href={`/website/${website.id}`}
      className="block break-inside-avoid mb-4 group"
    >
      <div className="flex flex-col justify-between p-4 rounded-2xl bg-[#121218] border border-white/[0.08] hover:border-purple-500/40 active:scale-[0.98] transition-all duration-300 shadow-xl overflow-hidden">
        
        {/* Top Row: Compact Icon + Clean Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a1a24] border border-white/10 flex items-center justify-center overflow-hidden p-1.5 shrink-0 shadow-lg">
            <WebsitePreview 
              websiteId={website.id}
              websiteUrl={website.url}
              fallbackUrl={stats?.logoUrl || website.imageUrl}
              alt={brandName}
              width={64}
              height={64}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          
          <span className={cn(
            "px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-md border",
            getPricingStyle(website.pricing)
          )}>
            {website.pricing}
          </span>
        </div>

        {/* Middle: Clean Title & Pitch */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
            {brandName}
          </h3>
          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* Bottom Row: Domain + Arrow */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06] text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
          <span className="truncate max-w-[80%]">{domain}</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}
