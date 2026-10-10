import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Target, Users } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Your First 100 Visitors - Step by Step Guide | Bessites",
  description: "The momentum manual for new websites. Learn how to cross the zero-visitor mark using intentional outreach and high-fidelity discovery nodes.",
  keywords: ["first 100 visitors", "get website traffic fast", "launch strategy", "Bessites manual", "website growth"],
};

export default function First100VisitorsGuide() {
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
              Crossing the 'Zero Visitor' threshold is the most psychological and technical barrier for any new digital property. Most creators wait for an algorithm to pick them up, but absolute discovery requires intentional, manual force. This manual provides a high-velocity blueprint to secure your first 100 high-intent visitors through peer outreach, distribution nodes, and community leverage.
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
              <li><a href="#momentum-nodes" className="hover:text-primary">3. Identifying Momentum Nodes</a></li>
              <li><a href="#tracking-quality" className="hover:text-primary">4. Tracking Early Engagement</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="direct-outreach" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> High-Fidelity Direct Outreach
              </h2>
              <p>
                Your first 10 visitors should come from people you know or individuals you have personally identified as target users. This is not about spamming friends; it is about intentional, peer-to-peer distribution. Identify 5 professional peers or mentors who would actually benefit from your tool and send them a personalized, 2-sentence message.
              </p>
              <p>
                Example: 'Hey, I built this simple CSS grid generator to save myself time. Thought you might find it useful for your current project.' This direct outreach builds your initial 'Interaction Ledger' and provides early feedback that an algorithm can't see. These first few users are critical for testing your site's performance and conversion node in a real-world environment.
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
                A 'Soft Launch' involves releasing your project to a controlled community before a major public blast. This is where high-fidelity directories like Bessites.store become your most valuable asset. Unlike Product Hunt, which is a one-day burst, Bessites is an evergreen registry where professional users discover tools based on intent.
              </p>
              <p>
                Submit your project to our discovery node under the correct interest category. Our community is built of high-velocity creators who are actively looking for 'Zero Padding' tools. This will typically bring your next 30-50 visitors within the first 48 hours of approval. These are high-quality, verified hits that signal to search engines that your site has real utility.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Complete your Bessites profile with a clear brand mark to maximize trust.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Tag your submission with specific metadata for Ouneo AI discovery.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Monitor your early likes and saves to gauge 'Product-Market Fit'.</span></li>
              </ul>
            </section>

            <section id="momentum-nodes" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Identifying Momentum Nodes
              </h2>
              <p>
                Your next 40 visitors will come from 'Momentum Nodes'—specific niche communities on Reddit, Discord, or niche forums where your tool solves a viral pain point. Don't look for the biggest subreddits; look for the most specific ones. If you built a tool for vintage car collectors, r/cars is too broad; r/vintageparts is your momentum node.
              </p>
              <p>
                Provide a helpful comment that solves a current discussion, and mention your tool as the technical solution you used. This approach has a 10x higher conversion rate than a generic 'Check out my site' post. One well-placed comment in a high-intent community can bridge the gap from 50 to 100 visitors in a single afternoon.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Use the 'Show HN' section on Hacker News if your project is technical. It's a high-authority node that can deliver thousands of visitors if it hits the front page.</p>
              </div>
            </section>

            <section id="tracking-quality" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Tracking Early Engagement
              </h2>
              <p>
                Once you reach 100 visitors, your priority shifts from quantity to quality. Use your analytics node to see how long these users stayed. Did they reach your 'Success Action'? If 100 people visited and 0 clicked your main button, your messaging node is failing.
              </p>
              <p>
                Bessites.store provides an 'Audience Pulse' feature in the Creator Hub that helps you track these early metrics without needing complex external tools. Use this data to recalibrate your landing page for the next 1,000 visitors. The first 100 are your data set; use them to build the future of your property.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Reaching your first 100 visitors is a marathon of intentional distribution. By focusing on direct outreach, soft launching on high-fidelity registries like Bessites.store, and identifying specific momentum nodes, you create a verified foundation for future growth. Crossing this threshold proves your website exists; now it is time to optimize for scale. Build with zero padding, distribution with high intent, and discovery will follow.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">How long should it take to get 100 visitors?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">With proactive outreach and a successful soft launch on Bessites.store, you should cross the 100-visitor mark within 7-14 days of going live.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Should I pay for ads to get my first 100 visitors?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">No. Organic visitors provide higher fidelity feedback. Save your budget for scaling once you have proven that your site converts and provides real utility.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">What if my traffic stops after the launch burst?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">This is normal. Focus on 'Evergreen Nodes' like Pinterest or long-term registry listings to maintain a steady baseline of 5-10 visitors per day while you build SEO authority.</p>
                </div>
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-make-website-faster">
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
