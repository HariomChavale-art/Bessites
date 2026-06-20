
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();

  // Hide navigation on auth and onboarding pages for a focused experience
  const hideOnPaths = ["/login", "/onboarding"];
  if (hideOnPaths.includes(pathname)) return null;

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Search, label: "Search" },
    { 
      href: user ? "/profile" : "/login", 
      icon: user ? User : LogIn, 
      label: user ? "Profile" : "Login" 
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
      <nav className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 flex items-center gap-10 shadow-2xl ring-1 ring-black/20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
