import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Smartphone, Layout, Zap } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Friendly Optimization Guide - Step by Step | Bessites",
  description: "Master the mobile-first web. Learn how to optimize your site for touch interactions, responsive layouts, and zero-latency mobile discovery.",
  keywords: ["mobile friendly website guide", "responsive design tips 2026", "mobile SEO best practices", "Bessites manual", "mobile user experience"],
};

export default function MobileFriendlyGuide() {
  const faqData = [
    { q: "What is 'Mobile-First Indexing'?", a: "It is a standard where Google primarily uses the mobile version of your website for indexing and ranking. If your mobile node is poor or lacks content found on the desktop version, your overall discovery potential will be significantly reduced." },
    { q: "How small should my touch targets be?", a: "The minimum recommended size for touch targets (buttons/links) is 48x48 pixels. They should also have at least 8 pixels of spacing between them to prevent accidental clicks. This 'Interaction Fidelity' is a key metric for mobile usability." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 15: Interaction UX</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Make Your Website <span className="text-primary">Mobile Friendly</span> - 2026 Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              In 2026, over 70% of digital discovery happens on mobile devices. If your website is not optimized for a small-screen experience, you are effectively ignoring the vast majority of your potential audience. Mobile-friendliness is not just about 'shrinking' your site; it is about rethinkng your 'Interaction Nodes' for touch-based navigation and vertical scrolling.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#responsive" className="hover:text-primary">1. Responsive Layout Nodes</a></li>
              <li><a href="#touch" className="hover:text-primary">2. Touch Interaction Targets</a></li>
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="responsive" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Responsive Layout Nodes
              </h2>
              <p>
                The foundation of mobile-friendliness is a responsive grid. We recommend using Tailwind CSS or CSS Grid to build layouts that automatically recalibrate based on screen width. Use 'Breakpoints' to shift from multi-column desktop views to single-column mobile views.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Never use fixed-width elements (e.g., `width: 800px`). Always use percentage-based widths or `max-width` to ensure your components never overflow the mobile viewport node.</p>
              </div>
            </section>

            <section id="touch" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Touch Interaction Targets
              </h2>
              <p>
                Mobile users don't have a precise cursor; they have thumbs. Your buttons and links must be large enough to be easily tapped. The standard technical requirement is 48x48 pixels for all touch targets.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Maintain a minimum touch target size of 48px to pass mobile usability audits.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Avoid placing links too close to the edges of the screen where they are hard to reach.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-use-search-console">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/best-tools-for-new-websites">
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