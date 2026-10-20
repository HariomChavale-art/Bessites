
'use client';

import { Navigation } from "@/components/navigation";
import { OuneoAssistant } from "@/components/ouneo-assistant";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function OuneoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center pt-16 sm:pt-24 px-4">
        <div className="max-w-4xl w-full text-center space-y-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic mx-auto">
             Conversational AI Discovery
          </Badge>
          <div className="space-y-2">
            <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              Meet <span className="text-primary">Ouneo</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic opacity-60">
              Your professional partner for absolute website discovery.
            </p>
          </div>
        </div>

        <div className="w-full mb-32">
          <OuneoAssistant />
        </div>

        <section className="container mx-auto px-4 py-20 border-t border-white/5">
          <div className="max-w-3xl mx-auto space-y-12 text-center">
             <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                <Sparkles className="w-10 h-10 text-primary" />
             </div>
             <div className="space-y-6">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">How Ouneo Helps</h2>
                <p className="text-lg text-muted-foreground italic leading-relaxed">
                  Ouneo is trained on the complete Bessites registry of 405 high-utility websites. Unlike standard search engines, Ouneo understands the context of your creative and technical requests. 
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                   <div className="space-y-2">
                      <p className="text-primary font-black uppercase text-[10px] tracking-widest">Natural Logic</p>
                      <p className="text-xs text-white/40 font-medium">Speak naturally about your goals and problems.</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-primary font-black uppercase text-[10px] tracking-widest">Verified Results</p>
                      <p className="text-xs text-white/40 font-medium">Only receive matches from our audited registry.</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-primary font-black uppercase text-[10px] tracking-widest">Zero Padding</p>
                      <p className="text-xs text-white/40 font-medium">Direct paths to utility without the algorithmic noise.</p>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
