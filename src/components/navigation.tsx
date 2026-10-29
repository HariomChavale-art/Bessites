"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, 
  Menu, 
  Globe, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  BookOpen,
  Book,
  Plus
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Logo } from "./logo";

const TIPS = [
  "✨ Find the best creator tools updated every day.",
  "Tip: See how many people like your site in your stats.",
  "Check the 'Popular' tab for the best websites.",
  "Add your own website in the Creator Hub.",
  "Need help? Email us at: support@bessites.store",
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % TIPS.length);
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
    { label: 'My Websites', icon: Globe, href: '/my-websites' },
    { label: 'Activity Stats', icon: BarChart3, href: '/analytics' },
    { label: 'My Audience', icon: Users, href: '/audience' },
    { label: 'Settings', icon: Settings, href: '/settings' },
    { label: 'Help & Support', icon: HelpCircle, href: '/support' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-white/5 py-2 sm:py-0">
      <div className="container mx-auto px-4 h-20 sm:h-24 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-start gap-1 shrink-0">
            <Link href="/" className="group">
              <Logo className="text-xl sm:text-4xl transition-transform group-hover:scale-105" />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-7 sm:w-10 sm:h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center">
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#0B0A0F] border-r border-white/5 p-0 w-80 overflow-hidden shadow-2xl">
                 <SheetHeader className="p-8 pb-4">
                    <SheetTitle className="text-white font-black uppercase tracking-widest text-[10px] italic text-left opacity-40">Creator Menu</SheetTitle>
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
                                pathname === link.href 
                                  ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" 
                                  : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
                              )}
                            >
                              {pathname === link.href && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(123,51,255,1)]" />}
                              <link.icon className={cn("w-5 h-5", pathname === link.href ? "text-primary" : "group-hover:scale-110 transition-transform")} />
                              <span className="text-sm font-bold tracking-tight">{link.label}</span>
                            </button>
                          ))}

                          <div className="pt-8 pb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 ml-4 mb-2">Instructions</p>
                            <button
                              onClick={() => { router.push('/guide'); }}
                              className={cn(
                                "w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all group relative overflow-hidden",
                                pathname?.startsWith('/guide') 
                                  ? "text-white bg-gradient-to-r from-emerald-500/40 to-transparent shadow-lg" 
                                  : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
                              )}
                            >
                              {pathname?.startsWith('/guide') && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,1)]" />}
                              <BookOpen className={cn("w-5 h-5", pathname?.startsWith('/guide') ? "text-emerald-500" : "group-hover:scale-110 transition-transform")} />
                              <span className="text-sm font-bold tracking-tight">How to Use</span>
                            </button>
                          </div>
                       </nav>
                    </div>
                    {user && (
                      <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01]">
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-all text-sm font-bold group">
                          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                 </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="hidden lg:flex items-center gap-2">
             <Link href="/guide">
                <Button variant="ghost" className={cn("text-[10px] font-black uppercase tracking-[0.2em] italic transition-all", pathname?.startsWith('/guide') ? "text-primary" : "text-white/40 hover:text-white")}>
                   <Book className="w-4 h-4 mr-2" /> Guides
                </Button>
             </Link>
             <Link href="/submit">
                <Button className="h-10 rounded-xl bg-white text-black font-black uppercase italic text-[10px] tracking-widest px-6 shadow-xl transition-all hover:scale-105 active:scale-95">
                   <Plus className="w-4 h-4 mr-2" /> Add Site
                </Button>
             </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-white/5 
          flex-1 min-w-0 max-w-2xl
          animate-in fade-in slide-in-from-top-2 duration-700 transition-all group hover:bg-white/10 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] sm:text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider whitespace-normal leading-tight text-center flex-1 line-clamp-1">
            {TIPS[tipIdx]}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
           <Link href="/explore">
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-white/5">
                 <Globe className="w-5 h-5 text-white/40 hover:text-white transition-colors" />
              </Button>
           </Link>
        </div>
      </div>
    </nav>
  );
}