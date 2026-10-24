"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { WebsitePreview } from "./website-preview";
import { cn } from "@/lib/utils";

interface WebsiteCardProps {
  website: Website;
  index: number;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const domain = website.url.replace('https://', '').replace('www.', '').split('/')[0];

  return (
    <Link 
      href={`/website/${website.id}`}
      className="block group active:scale-[0.98] transition-all"
    >
      <div className="relative p-5 bg-halloween-crypt border border-white/[0.07] hover:border-white/[0.15] transition-all duration-300 rounded-xl shadow-specular">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-black border border-white/[0.06] p-1.5 shadow-xl">
              <WebsitePreview 
                websiteUrl={website.url}
                alt={website.name}
                className="w-full h-full object-contain"
              />
            </div>
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase rounded border",
              website.pricing === 'Paid' 
                ? "border-white/10 text-zinc-400" 
                : "border-emerald-500/20 text-emerald-400"
            )}>
              {website.pricing}
            </span>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold text-halloween-bone group-hover:text-primary transition-colors mb-1 leading-snug">
              {website.websiteName || website.name}
            </h3>
            <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed font-medium">
              {website.description}
            </p>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-600 truncate uppercase tracking-widest">
              {domain}
            </span>
            <div className="text-[11px] font-medium text-zinc-500 group-hover:text-white transition-colors">
              Visit ↗
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}