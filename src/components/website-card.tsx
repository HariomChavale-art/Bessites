"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { ChevronRight, Heart, Eye } from "lucide-react";
import { WebsitePreview } from "./website-preview";
import { cn } from "@/lib/utils";

interface WebsiteCardProps {
  website: Website;
  index: number;
}

/**
 * Bessites High-Fidelity Website Card.
 * Updated with Glassmorphic styling: semi-transparent background and backdrop-blur.
 */
export function WebsiteCard({ website, index }: WebsiteCardProps) {
  const brandName = website.websiteName || website.name;
  const domain = website.url.replace('https://', '').replace('www.', '').split('/')[0];

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case "Paid": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Free": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Freemium": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-white/5 text-white/40 border-white/10";
    }
  };

  return (
    <Link 
      href={`/website/${website.id}`}
      className="block group transition-all active:scale-[0.98] w-full website-card-item"
    >
      <div className="relative p-5 bg-white/[0.01] backdrop-blur-xl border border-white/5 group-hover:border-primary/40 transition-all duration-300 rounded-[2rem] shadow-2xl overflow-hidden">
        
        {/* Interaction Metrics Overlay (Subtle) */}
        <div className="absolute top-4 left-4 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-1 text-[8px] font-black text-white/60">
              <Eye className="w-2.5 h-2.5" /> {website.baseVisits}
           </div>
           <div className="flex items-center gap-1 text-[8px] font-black text-white/60">
              <Heart className="w-2.5 h-2.5" /> {website.baseLikes}
           </div>
        </div>

        {/* Pricing Tag */}
        <div className="absolute top-4 right-4">
          <span className={cn(
            "px-2 py-0.5 text-[8px] font-black tracking-widest uppercase rounded-lg border italic",
            getPricingStyle(website.pricing)
          )}>
            {website.pricing}
          </span>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center overflow-hidden p-2 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
            <WebsitePreview 
              websiteUrl={website.url}
              fallbackUrl={website.imageUrl}
              alt={brandName}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="text-center space-y-1 w-full">
            <h3 className="text-[15px] font-bold text-white tracking-tight group-hover:text-primary transition-colors truncate px-2">
              {brandName}
            </h3>
            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-medium italic opacity-60 px-2">
              {website.description || "A high-fidelity project in the Bessites discovery hub."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/[0.06] text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
          <span className="truncate max-w-[80%] font-mono opacity-40">{domain}</span>
          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}