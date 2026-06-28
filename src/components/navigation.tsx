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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/">
            <Logo showText />
          </Link>
        </div>

        {/* Smart Suggestion Bar - Hyper Responsive, showing full text without cutting */}
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full border border-white/5 
          w-auto flex-1 max-w-[200px] xs:max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-2xl
          animate-in fade-in slide-in-from-top-2 duration-700 transition-all group hover:bg-white/10 overflow-visible">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider whitespace-normal leading-tight text-center flex-1">
            {SUGGESTIONS[suggestionIdx]}
          </span>
        </div>

        <div className="w-8 h-8 md:hidden shrink-0" /> {/* Spacer for balance on mobile */}
      </div>
    </nav>
  );
}
