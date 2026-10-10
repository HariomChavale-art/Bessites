import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Zap, TrendingUp, Target } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Grow from Zero - High-Velocity Growth Manual | Bessites",
  description: "Stop waiting for the algorithm. Learn how to grow your website from zero to your first thousand users using intentional momentum strategies in 2026.",
  keywords: ["grow website from zero", "website growth strategy", "first 1000 users guide", "Bessites manual", "get more website visitors"],
};

export default function GrowFromZeroGuide() {
  const faqData = [
    { q: "Is 'Going Viral' necessary for growing a new website?", a: "No. Viral growth is often low-fidelity—you get a spike of visitors who never return. Sustainable growth is built on 'Momentum Nodes'—finding high-intent users in niche communities who will actually use your tool and provide feedback." },
    { q: "How long does it take to reach the first 1,000 users?", a: "Realistically, with high-velocity distribution on platforms like Reddit, Pinterest, and Bessites, you can reach 1,000 users in 3-6 months. This timeline depends on the utility of your tool and your consistency in publication. Growth is a technical marathon, not a sprint." },
    { q: "Should I focus on SEO or Social Media first?", a: "Social media and registries (Bessites) drive immediate 'Momentum'. SEO builds long-term 'Authority'. In the beginning, you should spend 80% of your time on social distribution to get immediate users and 20% on SEO to build your foundation." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 17: Growth Strategy</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Grow from <span className="text-primary">Zero</span> - High-Velocity Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Growing from zero is the hardest part of the creator journey. When you have no traffic, no domain authority, and no audience, search engines and social algorithms effectively ignore your existence. You are in the 'Valley of Silence'. To escape it, you must move from passive waiting to intentional force. This manual provides a tactical blueprint to grow your website from zero to your first thousand users by leveraging momentum nodes, high-fidelity distribution, and community proof. Growth is not a gift; it is a technical advantage that you must build step by step.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#momentum-mindset" className="hover:text-primary">1. The High-Velocity Mindset</a></li>
              <li><a href="#niche-distribution" className="hover:text-primary">2. Targeting Momentum Nodes</a></li>
              <li><a href="#curation-leverage" className="hover:text-primary">3. Leveraging Curation Authority</a></li>
              <li><a href="#faq" className="hover:text-primary">4. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="momentum-mindset" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> The High-Velocity Growth Mindset
              </h2>
              <p>
                To grow from zero, you must accept that the algorithm is not your friend—yet. Algorithms reward 'Engagement' and 'Authority', both of which you lack in the beginning. Your primary goal is to generate 'Initial Interaction'. This requires a high-velocity approach: trying multiple distribution channels simultaneously to see which one resonates with your target audience.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Set a 'Interaction Goal' instead of a 'Traffic Goal'. Aim for 10 'Registry Saves' or 5 'Appreciations' per day. This focuses your growth on high-fidelity users who will actually provide long-term authority to your node.</p>
              </div>
            </section>

            <section id="niche-distribution" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Targeting Niche Momentum Nodes
              </h2>
              <p>
                Broad distribution is 'Padding'. If you post your coding tool in a generic 'Technology' group, you will be ignored. Instead, find the 'Niche Nodes' where your tool solves a viral pain point. Use Reddit, Discord, and niche forums to find these communities. One helpful post in r/reactjs is worth more than a thousand impressions on a generic tech news site because the audience has high intent.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Identify 5 specific subreddits or Discord channels where your tool provides utility.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Participate in 3 discussions per day before sharing your own URL to build authority.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/best-tools-for-new-websites">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-get-website-discovered">
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