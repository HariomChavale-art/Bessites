import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Globe } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use Bessites Effectively - Step by Step | Bessites",
  description: "Master the Bessites discovery engine. Learn how to navigate the registry, use Ouneo AI, and maximize your impact as a creator.",
  keywords: ["Bessites user guide", "how to use Bessites", "creator studio manual", "Ouneo AI help", "digital discovery tips"],
};

export default function UseBessitesGuide() {
  const faqData = [
    { q: "Is Ouneo AI free for all users?", a: "Yes, Ouneo is a primary feature of our platform and is free for all registered curators. It is designed to be your permanent discovery partner." },
    { q: "How can I increase my trending rank on Bessites?", a: "Trending rank is driven by the Interaction Ledger. To rise to the top, focus on providing a high-utility, zero-padding experience." }
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
            <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
              Module 08: Platform Mastery
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Use <span className="text-primary">Bessites</span> Effectively - Platform Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Bessites is a high-velocity discovery ecosystem built for the modern creator. Whether you are a visitor seeking the top tier of tools or a builder looking to scale, understanding the mechanics of our platform is critical.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#discovery-logic" className="hover:text-primary">1. Understanding Discovery Logic</a></li>
              <li><a href="#ouneo" className="hover:text-primary">2. Mastering Ouneo AI Search</a></li>
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="discovery-logic" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Understanding Discovery Logic
              </h2>
              <p>
                The primary discovery engine on Bessites is built on three pillars: Freshness, Interaction, and Relevance. When you open the home feed, the 'For You' section uses your onboarding data to curate a personalized grid of websites.
              </p>
            </section>

            <section id="ouneo" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Mastering Ouneo AI Search
              </h2>
              <p>
                Ouneo is your conversational partner in the discovery pipeline. Instead of using complex search queries, you can speak to Ouneo in natural language. Ouneo scans our registry of extensive categories and recommends the best-matching verified assets.
              </p>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-share-website-on-pinterest">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-get-backlinks-free">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white text-[9px] font-black uppercase italic shadow-xl">
                   Next Guide <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}
