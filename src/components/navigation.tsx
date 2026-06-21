
"use client"

import Link from "next/link";
import { Search, Zap, Menu, Bell, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/firebase";

export function Navigation() {
  const { user } = useUser();
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Left Side: Menu & Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
            <Menu className="w-6 h-6" />
          </Button>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl glow-primary transition-all group-hover:scale-110 group-hover:rotate-12">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
          </Link>
        </div>

        {/* Center: Search & Dropdown (Programs) */}
        <div className="flex-1 flex items-center gap-6 max-w-2xl px-4">
          <Link href="/explore" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
            <LayoutGrid className="w-4 h-4" />
            Programs
          </Link>
          
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search for websites..." 
              className="pl-11 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary transition-all h-11 text-sm font-medium"
            />
          </div>
        </div>

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
          </Button>
          
          <Link href="/profile">
            <Avatar className="w-9 h-9 border-2 border-white/10 ring-2 ring-primary/20 cursor-pointer hover:scale-110 transition-transform">
              {user?.photoURL ? (
                <AvatarImage src={user.photoURL} />
              ) : (
                <AvatarFallback className="bg-pink-500 text-white font-bold text-xs">
                  {user?.displayName?.charAt(0) || 'H'}
                </AvatarFallback>
              )}
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
}
