"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Try searching 'AI' to find new tools.",
  "Tip: Save apps to build your collection.",
  "Check the 'Trending' tab for what's hot.",
  "Submit your own web app via Profile.",
  "Use 'Magic Categorize' for fast uploads.",
];

export function Navigation() {
  const pathname = usePathname();
  const [suggestionIdx, setSuggestionIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIdx((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Hide navigation on auth and onboarding pages
  const isAuthPage = pathname === "/login" || pathname === "/onboarding";
  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/">
            <Logo showText />
          </Link>
        </div>

        {/* Smart Suggestion Bar - Hyper Responsive for phone, ipad, laptop, monitor */}
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/5 
          w-auto max-w-[140px] xs:max-w-[180px] sm:max-w-[280px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px]
          animate-in fade-in slide-in-from-top-2 duration-700 transition-all overflow-hidden group hover:bg-white/10">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">
            {SUGGESTIONS[suggestionIdx]}
          </span>
        </div>

        <div className="w-8 h-8 md:hidden" /> {/* Spacer for balance on mobile */}
      </div>
    </nav>
  );
}
