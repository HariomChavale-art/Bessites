
"use client"

import Link from "next/link";
import { Zap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl glow-primary transition-all group-hover:scale-110 group-hover:rotate-12">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">NetFlow</span>
          </Link>
        </div>

        {/* Right Side: Notifications */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
