"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { ChevronRight, Heart, Eye } from "lucide-react";
import { WebsitePreview } from "./website-preview";
import { useMemo } from "react";
import { useFirestore, useDoc, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { getBroadCategoriesForTag } from "@/lib/category-mapping";

interface WebsiteCardProps {
  website: Website;
  index: number;
}

/**
 * Asymmetrical Interlocking Card System.
 * Rebuilt with multi-dark theme shades and interest-based patterning.
 */
export function WebsiteCard({ website, index }: WebsiteCardProps) {
  const db = useFirestore();
  const { user } = useUser();
  const variant = index % 4;

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);
  const { data: profile } = useDoc(userDocRef);
  const userInterests = profile?.interests || [];

  const isBestFit = useMemo(() => {
    return website.categories.some(tag => {
      const mappedBroads = getBroadCategoriesForTag(tag);
      return mappedBroads.some(b => userInterests.includes(b));
    });
  }, [website.categories, userInterests]);

  const statsRef = useMemo(() => {
    if (!db) return null;
    return doc(db, "websiteStats", website.id);
  }, [db, website.id]);
  const { data: stats } = useDoc(statsRef);

  const brandName = website.websiteName || website.name;
  const description = website.description || website.longDescription || "Discovery Asset";
  const domain = website.url.replace('https://', '').replace('www.', '').split('/')[0];

  // Dark Theme Variant Styles
  const bgStyles = [
    "bg-[#0D0D12]", // Deepest Black
    "bg-[#13131A]", // Midnight
    "bg-[#1A1A24]", // Charcoal
    "bg-[#0F1117]"  // Dark Slate
  ];

  const borderColors = [
    "border-blue-500/20 group-hover:border-blue-500/50",
    "border-purple-500/20 group-hover:border-purple-500/50",
    "border-indigo-500/20 group-hover:border-indigo-500/50",
    "border-zinc-500/20 group-hover:border-zinc-500/50"
  ];

  const InnerContent = () => (
    <div className="flex flex-col h-full relative z-10">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden p-2 shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
          <WebsitePreview 
            websiteUrl={website.url}
            fallbackUrl={stats?.logoUrl || website.imageUrl}
            alt={brandName}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        <span className={cn(
          "px-2 py-0.5 text-[8px] font-black tracking-widest uppercase rounded-md border italic",
          website.pricing === 'Paid' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        )}>
          {website.pricing}
        </span>
      </div>

      <div className="flex-1 space-y-1">
        <h3 className="text-[15px] font-bold text-white tracking-tight group-hover:text-primary transition-colors truncate">
          {brandName}
        </h3>
        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-medium italic opacity-60">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-3 border-t border-white/[0.06] text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
        <span className="truncate max-w-[80%] font-mono opacity-40">{domain}</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );

  return (
    <Link 
      href={`/website/${website.id}`}
      className="block group transition-all active:scale-[0.98] w-full"
    >
      <div className={cn(
        "relative p-6 border transition-all duration-500 shadow-2xl overflow-hidden",
        bgStyles[index % bgStyles.length],
        borderColors[index % borderColors.length],
        variant === 0 && "[clip-path:polygon(0_0,100%_8%,100%_100%,0_92%)]",
        variant === 1 && "[clip-path:polygon(0_8%,100%_0,100%_92%,0_100%)]",
        variant === 2 && "rounded-[2.5rem] rounded-tr-sm rounded-bl-sm",
        variant === 3 && "[clip-path:polygon(16px_0%,100%_0%,100%_calc(100%-16px),calc(100%-16px)_100%,0%_100%,0%_16px)]"
      )}>
        {/* Interest Best Fit Pattern */}
        {isBestFit && (
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
        )}
        
        <InnerContent />
      </div>
    </Link>
  );
}
