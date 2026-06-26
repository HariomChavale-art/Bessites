
"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const { user, loading } = useUser();
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

        {/* Smart Suggestion Bar */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 max-w-md animate-in fade-in slide-in-from-top-2 duration-700">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {SUGGESTIONS[suggestionIdx]}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {!loading && user && (
            <Link href="/profile">
              <Avatar className="w-8 h-8 border border-white/10 hover:ring-2 hover:ring-primary transition-all">
                <AvatarImage src={user.photoURL || ""} className="object-cover" />
                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                  {user.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          
          {!user && !loading && (
            <Link href="/login">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
