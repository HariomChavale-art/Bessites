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
 * Asymmetrical Interlocking Card System.
 * Implements 4 distinct geometric variants that visually puzzle together.
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
  const description = website.description || website.longDescription || "Discovery Asset";
  const domain = website.url.replace('https://', '').replace('www.', '').split('/')[0];

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case "Paid": return "bg-white/10 text-white border-white/10";
      case "Free": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  // Shared Inner Content
  const InnerContent = ({ colorClass = "group-hover:text-primary", hideLogo = false }: { colorClass?: string, hideLogo?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        {!hideLogo && (
          <div className="w-10 h-10 rounded-xl bg-[#1a1a24] border border-white/10 flex items-center justify-center overflow-hidden p-1.5 shrink-0 shadow-lg">
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
        <h3 className={cn("text-[14px] font-bold text-white tracking-tight transition-colors", colorClass)}>
          {brandName}
        </h3>
        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06] text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
        <span className="truncate max-w-[80%] font-mono">{domain}</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );

  return (
    <Link 
      href={`/website/${website.id}`}
      className="block group transition-transform active:scale-[0.98] w-full"
    >
      {variant === 0 && (
        <div className="relative p-5 bg-[#101016]/90 backdrop-blur-md border border-blue-500/20 group-hover:border-blue-400 transition-all duration-300 [clip-path:polygon(0_0,100%_8%,100%_100%,0_92%)]">
          <InnerContent colorClass="group-hover:text-blue-300" />
        </div>
      )}

      {variant === 1 && (
        <div className="relative p-5 bg-[#12121a]/90 backdrop-blur-md border border-purple-500/20 group-hover:border-purple-400 transition-all duration-300 [clip-path:polygon(0_8%,100%_0,100%_92%,0_100%)]">
          <InnerContent colorClass="group-hover:text-purple-300" />
        </div>
      )}

      {variant === 2 && (
        <div className="relative p-5 pt-8 bg-[#0d0d14]/90 backdrop-blur-md border border-cyan-500/20 group-hover:border-cyan-400 transition-all duration-300 rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm mt-4">
          <div className="absolute -top-4 right-4 w-12 h-12 rounded-full border-2 border-cyan-400 bg-[#0d0d16] flex items-center justify-center shadow-lg overflow-hidden p-1.5 z-10 group-hover:scale-110 transition-transform">
             <WebsitePreview 
                websiteId={website.id}
                websiteUrl={website.url}
                fallbackUrl={stats?.logoUrl || website.imageUrl}
                alt={brandName}
                className="w-full h-full object-contain rounded-full"
              />
          </div>
          <InnerContent colorClass="group-hover:text-cyan-300" hideLogo />
        </div>
      )}

      {variant === 3 && (
        <div className="relative p-5 bg-[#14141f]/90 backdrop-blur-md border border-pink-500/20 group-hover:border-pink-400 transition-all duration-300 [clip-path:polygon(16px_0%,100%_0%,100%_calc(100%-16px),calc(100%-16px)_100%,0%_100%,0%_16px)]">
          <InnerContent colorClass="group-hover:text-pink-300" />
        </div>
      )}
    </Link>
  );
}