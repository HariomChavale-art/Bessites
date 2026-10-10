import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, PenTool, Search } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Write SEO Titles - Step by Step Guide | Bessites",
  description: "Learn how to engineer high-CTR metadata titles for 2026. Master the art of balancing keyword optimization with human curiosity for absolute discovery.",
  keywords: ["SEO title guide", "CTR optimization", "meta title tips", "Bessites manual", "writing for search"],
};

export default function SeoTitleGuide() {
  const faqData = [
    { q: "Should I include my brand name in every SEO title?", a: "Yes, but always at the end. Your primary focus should be the keyword and the value hook." },
    { q: "Does using numbers in a title really help with rankings?", a: "Numbers don't directly change your ranking, but they significantly improve your CTR." }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Link href="/guide" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Manual Hub
        </Link>

        <article className="space-y-16">
          <header className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 06: Discovery Hooks</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Write <span className="text-primary">SEO Titles</span> - 2026 Masterclass
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              The metadata title is the first interaction node a user encounters in the discovery pipeline.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#psychology" className="hover:text-primary">1. Psychology of the Click</a></li>
              <li><a href="#technical" className="hover:text-primary">2. Technical Length & Structure</a></li>
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="psychology" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> The Psychology of the Click
              </h2>
              <p>
                Every search query represents a real-world problem or desire. The user is scanning a list of results, looking for the most high-fidelity solution with the least amount of effort.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Use emotional triggers like 'Proven', 'Tested', or 'Elite'. In a sea of AI-generated noise, humans crave 'Verified' authority.</p>
              </div>
            </section>

            <section id="technical" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Technical Length & Structure
              </h2>
              <p>
                Search engines like Google don't actually count characters; they measure pixels. The standard limit is approximately 600 pixels, which translates to roughly 55-60 characters.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Aim for 50-58 characters for the highest compatibility across all devices.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use Title Case (Capitalizing Each Word) for better visual hierarchy.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-get-first-100-visitors">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-share-website-on-pinterest">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white text-[9px] font-black uppercase italic shadow-xl">
                   Next Guide <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}