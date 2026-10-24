"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { LogOut, LayoutGrid, Layers, Rocket, Ghost } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading || !user) return null;

  const isAuthPage = pathname === "/login" || pathname === "/unlock-access";
  if (isAuthPage) return null;

  const links = [
    { label: 'Collection', href: '/collection', icon: Ghost, count: '1' },
    { label: 'Stacks', href: '/stacks', icon: Layers, count: '8' },
    { label: 'Launches', href: '/launches', icon: Rocket },
  ];

  return (
    <nav className="sticky top-0 z-30 w-full h-14 bg-[#09090B]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="text-lg" />
          </Link>

          <div className="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] rounded-lg border border-white/[0.05]">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all",
                    isActive 
                      ? "bg-white/[0.08] text-white shadow-specular" 
                      : "text-zinc-500 hover:text-zinc-200"
                  )}
                >
                  {link.label}
                  {link.count && (
                    <span className="tabular-nums font-mono text-[10px] opacity-50 px-1 border border-white/10 rounded">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-[11px] font-medium text-orange-400">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            94 founding spots left
          </div>

          <div className="h-8 w-px bg-white/[0.06]" />
          
          <button 
            onClick={() => signOut(auth!)}
            className="flex items-center gap-2 text-zinc-500 hover:text-red-400 transition-colors text-[13px] font-medium group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}