
"use client"

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "./logo";

export function Navigation() {
  const { user, loading } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/">
            <Logo showText />
          </Link>
        </div>

        {/* Right Side: Auth & Notifications */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {!loading && (
            <>
              {user ? (
                <Link href="/profile">
                  <Avatar className="w-8 h-8 border border-white/10">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                      {user.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-sm font-bold text-muted-foreground hover:text-white px-2 sm:px-4">
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
