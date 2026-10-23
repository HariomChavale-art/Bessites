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
  index: number;
}

/**
 * Halloween Variant Card System.
 * Glassmorphic panels with spectral border glows.
 */
export function WebsiteCard({ website, index }: WebsiteCardProps) {
  const db = useFirestore();
  const variant = index % 4;

  const statsRef = useMemo(() => {
    if (!db) return null;
    return doc(db, "websiteStats", website.id);
  }, [db, website.id]);

  const { data: stats } = useDoc(statsRef);

  const brandName = website.websiteName || website.name;
  const description = website.description || website.longDescription || "Spectral Asset";
  const domain = website.url.replace('https://', '').replace('www.', '').split('/')[0];

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case "Paid": return "bg-halloween-obsidian text-halloween-bone border-halloween-bone/10";
      case "Free": return "bg-halloween-slime/10 text-halloween-slime border-halloween-slime/20 shadow-slime-glow";
      default: return "bg-halloween-witchcraft/10 text-halloween-mystic border-halloween-witchcraft/20 shadow-witch-glow";
    }
  };

  const InnerContent = ({ colorClass = "group-hover:text-halloween-pumpkin", hideLogo = false }: { colorClass?: string, hideLogo?: boolean }) => (
    <div className="flex flex-col h-full relative z-10">
      <div className="flex items-center justify-between gap-2 mb-3">
        {!hideLogo && (
          <div className="w-10 h-10 rounded-xl bg-halloween-void border border-halloween-pumpkin/20 flex items-center justify-center overflow-hidden p-1.5 shrink-0 shadow-xl group-hover:border-halloween-pumpkin/50 transition-all">
            <WebsitePreview 
              websiteId={website.id}
              websiteUrl={website.url}
              fallbackUrl={stats?.logoUrl || website.imageUrl}
              alt={brandName}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        )}
        <div className={cn(!hideLogo ? "" : "ml-auto")}>
          <span className={cn(
            "px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-md border",
            getPricingStyle(website.pricing)
          )}>
            {website.pricing}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-1">
        <h3 className={cn("text-[14px] font-bold text-halloween-bone tracking-tight transition-colors", colorClass)}>
          {brandName}
        </h3>
        <p className="text-[11px] text-halloween-fog line-clamp-2 leading-relaxed font-medium italic">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06] text-[9px] text-halloween-fog/40 font-bold uppercase tracking-widest">
        <span className="truncate max-w-[80%] font-mono">{domain}</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:text-halloween-pumpkin transition-all" />
      </div>
    </div>
  );

  return (
    <Link 
      href={`/website/${website.id}`}
      className="block group transition-transform active:scale-[0.98] w-full"
    >
      <div className={cn(
        "relative p-5 bg-halloween-obsidian/80 backdrop-blur-xl border border-halloween-pumpkin/10 group-hover:border-halloween-pumpkin/40 transition-all duration-500 overflow-hidden shadow-2xl",
        variant === 0 && "[clip-path:polygon(0_0,100%_0,100%_100%,12%_100%,0_88%)]",
        variant === 1 && "[clip-path:polygon(0_0,88%_0,100%_12%,100%_100%,0_100%)]",
        variant === 2 && "rounded-[2rem]",
        variant === 3 && "[clip-path:polygon(0_12%,12%_0,100%_0,100%_100%,0_100%)]"
      )}>
        {/* Cobweb Accent */}
        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L100 100M100 0L0 100M50 0V100M0 50H100" stroke="white" strokeWidth="0.5"/>
            <circle cx="0" cy="0" r="20" stroke="white" strokeWidth="0.5"/>
            <circle cx="0" cy="0" r="40" stroke="white" strokeWidth="0.5"/>
            <circle cx="0" cy="0" r="60" stroke="white" strokeWidth="0.5"/>
          </svg>
        </div>
        <InnerContent />
      </div>
    </Link>
  );
}
