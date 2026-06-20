
"use client"

import Link from "next/link";
import { Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-primary p-1.5 rounded-lg glow-primary transition-transform group-hover:scale-110">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="hidden sm:inline font-headline text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            NetFlow
          </span>
        </Link>

        <div className="flex-1 max-w-xl relative group mx-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search for websites..." 
            className="pl-10 bg-white/5 border-white/10 rounded-full focus:ring-primary focus:border-primary transition-all h-10"
          />
        </div>

        <div className="w-[40px] sm:w-[120px] flex justify-end">
          {/* Balanced UI spacer */}
        </div>
      </div>
    </nav>
  );
}
