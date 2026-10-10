import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Share2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pinterest Distribution Guide - Step by Step | Bessites",
  description: "Unlock evergreen traffic with Pinterest. Learn how to create high-fidelity pins, optimize for visual search, and build a permanent discovery node.",
  keywords: ["pinterest marketing", "website traffic guide", "visual search SEO", "Bessites manual", "get visitors from pinterest"],
};

export default function PinterestGuide() {
  const faqData = [
    { q: "How long does it take for a new pin to start driving traffic?", a: "Pinterest is a long-term node. While some pins can go viral in days, most take 30-90 days to gain significant search authority." },
    { q: "Do I need to follow other users on Pinterest to get discovered?", a: "No. Unlike Instagram, your 'Follower' count is not a primary ranking signal on Pinterest. Discovery is driven by search relevance and visual fidelity." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 07: Visual Discovery</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              Pinterest <span className="text-primary">Distribution</span> - Evergreen Traffic Guide
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Pinterest is frequently misunderstood as a simple social network, but in 2026, it operates as a high-fidelity visual search engine.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#visual-logic" className="hover:text-primary">1. Pinterest Visual Search Logic</a></li>
              <li><a href="#pin-creation" className="hover:text-primary">2. Creating High-Fidelity Pins</a></li>
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="visual-logic" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Pinterest Visual Search Logic
              </h2>
              <p>
                To succeed on Pinterest, you must stop thinking about 'likes' and start thinking about 'relevance'. Pinterest's algorithm uses computer vision to analyze your images and match them with user intent.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Pinterest is 100% intent-driven. Use a 'Business Account' to access the Pinterest Analytics node, which tells you exactly what your audience is searching for.</p>
              </div>
            </section>

            <section id="pin-creation" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Creating High-Fidelity Pins
              </h2>
              <p>
                The vertical aspect ratio is the primary constraint of the Pinterest grid. Always use a 2:3 ratio (e.g., 1000 x 1500 pixels). Square or horizontal images take up less space and have a significantly lower CTR.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use large, bold fonts for text overlays to ensure readability on mobile devices.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Create 3-5 unique pins for every 1 article or tool to target different aesthetic segments.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-write-seo-title">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-use-bessites">
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