import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Target, Users } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Your First 100 Visitors - Step by Step Guide | Bessites",
  description: "The momentum manual for new websites. Learn how to cross the zero-visitor mark using intentional outreach and high-fidelity discovery nodes.",
  keywords: ["first 100 visitors", "get website traffic fast", "launch strategy", "Bessites manual", "website growth"],
};

export default function First100VisitorsGuide() {
  const faqData = [
    { q: "How long should it realistically take to get the first 100 visitors?", a: "With proactive manual outreach and a successful soft launch on a registry like Bessites.store, you should be able to cross the 100-visitor mark within 7-14 days." },
    { q: "Should I consider paying for ads to get my first 100 visitors quickly?", a: "No. Organic visitors provide higher fidelity feedback and signal true product-market fit." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 05: Launch Momentum</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Get Your First <span className="text-primary">100 Visitors</span> - Launch Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Crossing the 'Zero Visitor' threshold is the most psychological and technical barrier for any new digital property.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#direct-outreach" className="hover:text-primary">1. High-Fidelity Direct Outreach</a></li>
              <li><a href="#platform-launch" className="hover:text-primary">2. The 'Soft Launch' Strategy</a></li>
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="direct-outreach" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> High-Fidelity Direct Outreach
              </h2>
              <p>
                Your first 10 visitors should come from people you know or individuals you have personally identified as high-intent users.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Don't ask for a 'share' yet. Ask for 'one specific improvement'. People love being experts, and their feedback will make your next 90 visitors even more likely to stay.</p>
              </div>
            </section>

            <section id="platform-launch" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> The soft Launch Strategy
              </h2>
              <p>
                A 'Soft Launch' involves releasing your project to a controlled community before a major public blast. This is where high-fidelity directories like Bessites.store become your most valuable asset.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Complete your Bessites profile with a clear brand mark to maximize trust.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-make-website-faster">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-write-seo-title">
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