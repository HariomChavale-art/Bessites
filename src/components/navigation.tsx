"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, 
  Menu, 
  Globe, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  Layers,
  Flame,
  Ghost
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Logo } from "./logo";

const SUGGESTIONS = [
  "🎃 Discover high-fidelity websites curated daily.",
  "✨ Tip: Your activity history tracks real-time engagement.",
  "New websites upvoted in the registry.",
  "Stacks: Community-curated website playlists.",
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const [suggestionIdx, setSuggestionIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIdx((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  const isAuthPage = pathname === "/login" || pathname === "/onboarding";
  if (isAuthPage) return null;

  const sidebarLinks = [
    { label: 'Collection', icon: Ghost, href: '/collection' },
    { label: 'Stacks', icon: Layers, href: '/stacks' },
    { label: 'Launches', icon: Flame, href: '/launches' },
    { label: 'My Websites', icon: Globe, href: '/my-websites' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-halloween-void/80 backdrop-blur-xl border-b border-halloween-pumpkin/10 py-2 sm:py-0">
      <div className="container mx-auto px-4 h-20 sm:h-24 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-start gap-1 shrink-0">
            <Link href="/" className="group">
              <Logo className="text-xl sm:text-4xl transition-transform group-hover:scale-105" />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-7 sm:w-10 sm:h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-halloween-pumpkin/10 hover:border-halloween-pumpkin/20 transition-all flex items-center justify-center relative">
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-halloween-pumpkin rounded-full border-2 border-halloween-void animate-pulse" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-halloween-void border-r border-halloween-pumpkin/10 p-0 w-80 overflow-hidden shadow-[20px_0_50px_rgba(255,107,0,0.1)]">
                 <SheetHeader className="p-8 pb-4">
                    <SheetTitle className="text-halloween-bone font-black uppercase tracking-widest text-[10px] italic text-left opacity-40">Bessites Command</SheetTitle>
                    <div className="mt-4">
                      <Logo className="text-3xl" />
                    </div>
                 </SheetHeader>
                 <div className="flex flex-col h-full">
                    <div className="px-8 flex-1">
                       <nav className="space-y-1 overflow-y-auto no-scrollbar max-h-[calc(100vh-250px)]">
                          {sidebarLinks.map((link, idx) => (
                            <button
                              key={idx}
                              onClick={() => { router.push(link.href); }}
                              className={cn(
                                "w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all group relative overflow-hidden",
                                pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                                  ? "text-halloween-bone bg-gradient-to-r from-halloween-pumpkin/20 to-transparent border border-halloween-pumpkin/10" 
                                  : "text-halloween-fog/60 hover:text-halloween-bone hover:bg-white/5"
                              )}
                            >
                              {(pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-halloween-pumpkin rounded-full shadow-pumpkin-glow" />}
                              <link.icon className={cn("w-5 h-5", (pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))) ? "text-halloween-pumpkin" : "group-hover:scale-110 transition-transform")} />
                              <span className="text-sm font-bold tracking-tight">{link.label}</span>
                            </button>
                          ))}
                       </nav>
                    </div>
                    {user && (
                      <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01]">
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-halloween-fog/40 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-bold group">
                          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                 </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-halloween-obsidian/40 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-halloween-pumpkin/10 
          flex-1 min-w-0 max-w-2xl
          animate-in fade-in slide-in-from-top-2 duration-700 transition-all group hover:border-halloween-pumpkin/30 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 h-4 text-halloween-pumpkin shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] sm:text-xs md:text-sm font-bold text-halloween-fog uppercase tracking-wider whitespace-normal leading-tight text-center flex-1 line-clamp-2 italic">
            {SUGGESTIONS[suggestionIdx]}
          </span>
        </div>

        <div className="w-10 h-10 hidden md:block shrink-0" />
      </div>
    </nav>
  );
}
