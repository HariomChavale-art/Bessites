import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Share2, Shield } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promote on Reddit Properly - Step by Step Guide | Bessites",
  description: "Master Reddit distribution without getting banned. Learn the 'Value First' strategy to drive viral traffic to your website in 2026.",
  keywords: ["reddit marketing guide", "how to promote on reddit", "get reddit traffic", "Bessites manual", "reddit growth strategy"],
};

export default function RedditGuide() {
  const faqData = [
    { q: "What should I do if my post is removed by a moderator?", a: "Don't delete the post and repost it immediately; this is a 'Spam' signal. Send a polite message to the moderators asking for clarification on which rule you violated." },
    { q: "Is it okay to use multiple accounts to upvote my own post?", a: "No. Reddit has one of the most advanced 'Vote Manipulation' detectors in the world. Using multiple accounts from the same IP or fingerprint will lead to an instant shadow-ban of your domain." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 10: Community Leverage</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Promote on <span className="text-primary">Reddit</span> Properly - 2026 Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Reddit is the internet's most high-fidelity feedback node, but it is also the most hostile toward traditional advertising. Redditors can detect 'Padding' within seconds.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#rules" className="hover:text-primary">1. Decoding Subreddit Rules</a></li>
              <li><a href="#value-first" className="hover:text-primary">2. The Value-First Strategy</a></li>
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="rules" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Decoding Subreddit Rules & Etiquette
              </h2>
              <p>
                Every subreddit is its own independent node with its own culture and governance. Before you post a single link, you must read the sidebar rules. Most subreddits have strict 'Anti-Self-Promotion' policies.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Check the 'Reddit Karma' requirements for your target subreddits. Many nodes require you to have at least 10-50 karma from other communities before you can publish a link.</p>
              </div>
            </section>

            <section id="value-first" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> The Value-First Strategy
              </h2>
              <p>
                The 'Value-First' strategy involves providing 90% of the solution within the Reddit post itself. If you built a tool to optimize CSS, don't just post 'Check out my tool'.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use 'Text Posts' rather than 'Link Posts' to provide context and value upfront.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Focus on solving a specific, viral pain point within the subreddit's niche.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-get-backlinks-free">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white text-[9px] font-black uppercase italic shadow-xl">
                   Manual Hub <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}