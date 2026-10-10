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
              Reddit is the internet's most high-fidelity feedback node, but it is also the most hostile toward traditional advertising. Redditors can detect 'Padding'—marketing fluff and disingenuous outreach—within seconds. A single wrong move can lead to a permanent ban from a subreddit. However, if you master the art of 'Value-First Distribution', Reddit can deliver thousands of high-intent visitors to your URL in a single afternoon. This manual provides a tactical blueprint to navigate Reddit properly and turn communities into discovery engines.
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
              <li><a href="#targeting" className="hover:text-primary">3. Targeting Niche Sub-Nodes</a></li>
              <li><a href="#engagement" className="hover:text-primary">4. Managing the Feedback Loop</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="rules" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Decoding Subreddit Rules & Etiquette
              </h2>
              <p>
                Every subreddit is its own independent node with its own culture and governance. Before you post a single link, you must read the sidebar rules. Most subreddits have strict 'Anti-Self-Promotion' policies. If you ignore these, your post will be deleted by the 'Automod' script instantly. To achieve absolute discovery, you must respect the community's boundaries. Spend at least 3 days 'Listening' to the node—read the top posts, see what gets upvoted, and understand the technical depth required.
              </p>
              <p>
                Redditors value transparency. If you built the tool yourself, say so. Don't pretend to be a 'Random User' who found it—this is a low-fidelity tactic that is easily detected by checking your post history. Authenticity is your primary defense against the 'Spam' label. Use a personal, human tone and admit that you are looking for feedback. When you position yourself as a 'Learner' rather than a 'Salesman', the community is much more likely to support your discovery journey.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Check the 'Reddit Karma' requirements for your target subreddits. Many nodes require you to have at least 10-50 karma from other communities before you can publish a link. This prevents 'Throwaway' accounts from spamming.</p>
              </div>
            </section>

            <section id="value-first" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> The Value-First Strategy
              </h2>
              <p>
                The 'Value-First' strategy involves providing 90% of the solution within the Reddit post itself. If you built a tool to optimize CSS, don't just post 'Check out my tool'. Instead, write a post titled 'How I optimized my CSS bundle by 40% with these 5 techniques'. Explain the logic, show the code, and provide the technical depth. At the very bottom of the post, add a 'PS' with your link: 'I built a small web app to automate these steps if anyone wants to use it for free.'
              </p>
              <p>
                This approach transforms your post from an 'Advertisement' to an 'Educational Resource'. Even if users don't click the link, they will upvote the post because it provides 'Zero Padding' value to the community. Upvotes increase the visibility of your post in the 'Hot' and 'Top' discovery grids, which eventually leads to thousands of clicks over several days. You are leveraging the algorithm by satisfying the human users first.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use 'Text Posts' rather than 'Link Posts' to provide context and value upfront.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Focus on solving a specific, viral pain point within the subreddit's niche.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Always offer your tool for free to the Reddit community to build initial trust and momentum.</span></li>
              </ul>
            </section>

            <section id="targeting" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Targeting Niche Sub-Nodes
              </h2>
              <p>
                Don't aim for the massive subreddits like r/technology or r/internet first. These are high-noise nodes where your post will likely be buried in minutes. Instead, target specific 'Sub-Nodes' that align with the Bessites taxonomy. If you built a tool for writers, target r/writing or r/selfpublish. If it's a coding tool, target r/webdev or r/reactjs. In these smaller, high-intent communities, one upvote is worth 100 on a generic subreddit because it signals relevance.
              </p>
              <p>
                Use tools like 'Reddit List' or search for 'Subreddit Finder' to identify these niche groups. Look for communities with high active user counts rather than just large total member counts. An active node is a healthy discovery gateway. When you post in these specific groups, you are reaching a 'Verified Audience' that is actively looking for the tools you have built. Absolute discovery is about precision, not volume.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Example:</p>
                <p className="text-sm">For a new AI tool, don't just post on r/AI. Post on r/SideProject or r/AlphaAndBetaUsers where people are specifically looking to test new digital properties.</p>
              </div>
            </section>

            <section id="engagement" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Managing the Feedback Loop
              </h2>
              <p>
                The first hour after posting is critical. You must stay active in the comments to manage the 'Feedback Loop'. If someone asks a question, answer it with technical depth. If someone gives a critique, thank them and explain how you will recalibrate your tool based on their input. This human interaction signals to the Reddit algorithm that the post is a 'Living Discussion', which keeps it at the top of the feed longer.
              </p>
              <p>
                Avoid arguing with 'Trolls'. Every community has negative actors who will try to shut down your discovery node. Ignore them and focus on the users providing 'High-Fidelity' feedback. This feedback is actually more valuable than the traffic itself, as it tells you exactly what professional users want from your site. Use this interaction ledger to improve your website before your next major distribution burst.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Reddit is a high-velocity discovery node that requires respect, authenticity, and technical depth. By decoding subreddit rules, leading with value, targeting niche sub-nodes, and actively managing your feedback loop, you turn a hostile environment into your most powerful distribution channel. Remember: Reddit is not for 'Selling'; it is for 'Solving'. If you solve a problem for a community, they will naturally help you achieve absolute discovery. Stay human, stay helpful, and keep building for the community.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">What should I do if my post is removed by a moderator?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Don't delete the post and repost it immediately; this is a 'Spam' signal. Send a polite message to the moderators asking for clarification on which rule you violated. Often, if you offer to remove the link and keep the text, they will reinstate the post, which still builds your brand authority.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Is it okay to use multiple accounts to upvote my own post?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">No. Reddit has one of the most advanced 'Vote Manipulation' detectors in the world. Using multiple accounts from the same IP or fingerprint will lead to an instant shadow-ban of your domain. This will kill your discovery potential permanently. Trust the organic power of your value.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">How often can I post about my website on Reddit?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">The 9:1 rule is the industry standard: for every 1 post about your own project, you should have 9 high-value contributions to other discussions. This builds your 'Verified Curator' status and ensures that when you do post your link, it is seen as a rare and valuable event.</p>
                </div>
              </div>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What if my post is removed?", "acceptedAnswer": { "@type": "Answer", "text": "Contact moderators politely for clarification instead of reposting immediately." } },
              { "@type": "Question", "name": "Is self-upvoting okay?", "acceptedAnswer": { "@type": "Answer", "text": "No, vote manipulation will lead to a permanent domain ban on Reddit." } },
              { "@type": "Question", "name": "How often should I post?", "acceptedAnswer": { "@type": "Answer", "text": "Follow the 9:1 rule: nine community contributions for every one self-promotional post." } }
            ]
          })
        }}
      />
    </div>
  );
}
