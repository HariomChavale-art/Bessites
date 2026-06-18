"use client"

import Link from "next/link";
import { Search, Plus, User, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg glow-primary">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            NetFlow
          </span>
        </Link>

        <div className="flex-1 max-w-xl relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search websites, categories, creators..." 
            className="pl-10 bg-white/5 border-white/10 rounded-full focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/submit">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/10 rounded-full">
              <Plus className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/10 rounded-full">
            <User className="w-5 h-5" />
          </Button>
          <Button className="hidden md:flex bg-primary hover:bg-primary/90 text-white rounded-full px-6 glow-primary">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}