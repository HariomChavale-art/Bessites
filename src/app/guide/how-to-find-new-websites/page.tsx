import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Search, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Find New Websites - Step by Step Guide | Bessites",
  description: "Stop relying on boring algorithms. Learn how to discover niche tools, hidden webs, and modern apps using the Bessites extensive interest registry.",
  keywords: ["find new websites", "discover niche tools", "website discovery guide", "Bessites manual", "hidden gems web"],
};

export default function FindWebsitesGuide() {
  const faqData = [
    { q: "Why is it getting harder to find new websites on Google?", a: "Traditional search engines increasingly prioritize large corporate entities and SEO-optimized content over raw utility. This creates 'Discovery Bubbles' where only the most popular sites are shown." },
    { q: "How does Bessites help me find niche tools?", a: "Bessites uses an extensive interest registry and human curation to index the highest tier of the web. It provides a multidimensional map of categories where utility is the primary ranking signal." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 11: Discovery Logic</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Find <span className="text-primary">New Websites</span> - Discovery Guide
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              The modern internet has a discovery problem. This manual provides a blueprint to break out of your algorithmic bubble using the Bessites registry.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#bubbe-bursting" className="hover:text-primary">1. Bursting the Search Bubble</a></li>
              <li><a href="#interest-grid" className="hover:text-primary">2. Using the Extensive Registry</a></li>
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="bubbe-bursting" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Bursting the Search Bubble
              </h2>
              <p>
                To find something new, you must move beyond keyword-based search and toward 'Curated Gateways'. Every website listed in our registry is manually verified for 'Zero Padding'.
              </p>
            </section>

            <section id="interest-grid" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Using the Registry
              </h2>
              <p>
                The heart of Bessites is our extensive interest registry. We have organized the productive web into broad sectors, ranging from AI & Tech to Niche Lifestyle hobbies.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use the 'For You' tab to see a personalized feed.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-promote-on-reddit">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-increase-website-ranking">
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
