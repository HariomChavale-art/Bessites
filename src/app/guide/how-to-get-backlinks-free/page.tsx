import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Get Free Backlinks - Step by Step Guide | Bessites",
  description: "Build domain authority for free. Discover 5 high-fidelity methods to secure quality backlinks from professional registries and communities in 2026.",
  keywords: ["free backlinks guide", "SEO authority tips", "link building 2026", "Bessites manual", "get high quality backlinks"],
};

export default function BacklinksGuide() {
  const faqData = [
    { q: "Do 'NoFollow' links from social media help my SEO?", a: "While 'NoFollow' links don't directly pass authority (PageRank), they drive traffic and signal brand relevance to search nodes." },
    { q: "How many backlinks do I need to start ranking on Google?", a: "Quality is more important than quantity. One high-fidelity link from a curated registry like Bessites.store is more effective than 100 links from unvetted sites." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 09: Domain Authority</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Get <span className="text-primary">Free Backlinks</span> - 2026 Strategy
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Backlinks remain the fundamental currency of the discovery web. In 2026, search algorithms have evolved to detect 'Padding'.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#registry-node" className="hover:text-primary">1. Curation & Registry Listings</a></li>
              <li><a href="#guest-posting" className="hover:text-primary">2. Value-Exchange Guest Posting</a></li>
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="registry-node" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Curation & Registry Listings
              </h2>
              <p>
                The fastest way to get a high-authority backlink for a new website is by listing it in a curated registry like Bessites.store. Unlike automated directories that index anything, Bessites uses human curators to verify every URL.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Never use automated link-building tools. Modern discovery nodes are trained to detect patterns of 'Artificial Growth'. One verified listing on Bessites is worth more than a thousand automated spam links.</p>
              </div>
            </section>

            <section id="guest-posting" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Value-Exchange Guest Posting
              </h2>
              <p>
                Guest posting has evolved from simple keyword-stuffing to 'Value Exchange'. High-authority blogs are looking for deep, technical content that provides 'Zero Padding' utility to their readers.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Focus on quality over quantity; aim for 1-2 high-authority guest posts per month.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Always link to a specific tool or deep-dive guide on your site, not just the homepage.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-use-bessites">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-promote-on-reddit">
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