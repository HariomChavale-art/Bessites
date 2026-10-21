'use client';

import { Navigation } from "@/components/navigation";
import { OuneoAssistant } from "@/components/ouneo-assistant";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, ShieldCheck, Zap } from "lucide-react";

export default function OuneoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center pt-16 sm:pt-24 px-4">
        <div className="max-w-4xl w-full text-center space-y-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic mx-auto">
             Conversational AI Discovery
          </Badge>
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-9xl font-black text-white tracking-tighter uppercase italic leading-none">
              OUNEO
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic opacity-60 max-w-2xl mx-auto">
              The professional discovery partner for the Bessites registry. Trained on 405 high-utility websites with zero padding.
            </p>
          </div>
        </div>

        <div className="w-full mb-32">
          <OuneoAssistant />
        </div>

        <section className="container mx-auto px-4 py-32 border-t border-white/5">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
             <Feature icon={Globe} title="Verified Registry" desc="Connected directly to our master database of 405 audited assets." />
             <Feature icon={ShieldCheck} title="Zero Hallucinations" desc="Ouneo only recommends websites that exist within the Bessites network." />
             <Feature icon={Zap} title="Absolute Intent" desc="Understand technical problems and provides immediate functional solutions." />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-4 text-center group">
       <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
          <Icon className="w-8 h-8 text-primary" />
       </div>
       <div className="space-y-1">
          <h3 className="text-lg font-black italic uppercase text-white tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
