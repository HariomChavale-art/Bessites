import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-10 animate-in zoom-in duration-700">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <div className="relative w-32 h-32 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Compass className="w-16 h-16 text-primary animate-pulse" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              404 <span className="text-primary">NODE NOT FOUND</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium italic px-4">
              Sorry, this discovery node does not exist in our current registry. Let's get you back on track.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/">
              <Button className="w-full h-16 rounded-full bg-white text-black hover:bg-white/90 text-xl font-black italic shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition-transform" /> BACK TO HOMEPAGE
              </Button>
            </Link>
            <Link href="/explore">
               <Button variant="ghost" className="text-sm font-black uppercase tracking-widest text-primary italic hover:bg-primary/10 h-12 rounded-full">
                  OR EXPLORE THE REGISTRY
               </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center opacity-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Lost in Discovery / Error Node 404</p>
      </footer>
    </div>
  );
}
