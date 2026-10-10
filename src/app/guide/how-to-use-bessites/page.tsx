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
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Link href="/guide" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Manual Hub
        </Link>

        <article className="space-y-16">
          <header className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 08: Platform Mastery</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Use <span className="text-primary">Bessites</span> Effectively - Platform Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Bessites.store is more than a simple web directory; it is a high-velocity discovery ecosystem built for the modern creator. Whether you are a visitor seeking the web's top 1% of tools or a builder looking to scale your first thousand users, understanding the internal mechanics of our platform is critical. This manual deconstructs the Bessites architecture—from our interlocking card system to the Ouneo AI discovery node—to help you achieve absolute discovery with zero padding.
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
              <li><a href="#creator-hub" className="hover:text-primary">3. Navigating the Creator Hub</a></li>
              <li><a href="#interactions" className="hover:text-primary">4. Using the Interaction Ledger</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="discovery-logic" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Understanding Discovery Logic
              </h2>
              <p>
                The primary discovery engine on Bessites is built on three pillars: Freshness, Interaction, and Relevance. When you open the home feed, the 'For You' node uses your onboarding interest data to curate a personalized grid of webs. This ensures you only see content that aligns with your professional workflow. Our interlocking card system uses asymmetrical geometry to present tools in a non-linear format, encouraging exploratory discovery rather than just list-based reading.
              </p>
              <p>
                Trending rank is calculated every 24 hours based on our Interaction Ledger. We don't just count clicks; we measure 'Value Actions' like site visits, appreciations (likes), and registry saves. A tool that consistently solves problems for our community will naturally rise to the top of the trending node. This merit-based system ensures that high-fidelity assets are rewarded with maximum visibility, while 'Padding'—low-value or repetitive sites—remains in the background of the registry.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Regularly update your 'Interest Profile' in your settings. As your professional needs evolve, your discovery feed should evolve with you to provide fresh inspiration and tools.</p>
              </div>
            </section>

            <section id="ouneo" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Mastering Ouneo AI Search
              </h2>
              <p>
                Ouneo is your conversational partner in the discovery pipeline. Instead of using complex Boolean search queries, you can speak to Ouneo in natural language. For example, asking 'I need a tool to compress images for my blog' will trigger Ouneo to scan our registry of 100+ interest nodes and recommend the best-matching verified assets. Ouneo doesn't just provide links; it provides 'Reasons' why a specific tool is the absolute discovery for your current request.
              </p>
              <p>
                To get the most out of Ouneo, be specific about your intent. Instead of searching for 'AI', try 'AI video editors for short-form content'. The more technical depth you provide, the higher the fidelity of the recommendations. Ouneo is connected to our master registry in real-time, meaning it can discover new submissions within seconds of their approval by our moderation node. It is the most high-velocity search tool in our ecosystem.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use Ouneo to find niche tools that might be buried deep in category filters.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Ask Ouneo for 'Alternatives' to popular software to find fresh, zero-padding webs.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Leverage Ouneo's history to recall tools you've discovered in previous sessions.</span></li>
              </ul>
            </section>

            <section id="creator-hub" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Navigating the Creator Hub
              </h2>
              <p>
                If you are a builder, the Creator Hub is your central command center. This is where you submit your digital properties, manage your live listings, and monitor your impact. Submission is a four-step technical process: URL entry, brand mark upload, category selection, and value proposition writing. Each step is designed to maximize your asset's discovery potential. Once submitted, your project enters our human moderation queue for verification.
              </p>
              <p>
                Within the hub, you can track the status of your submissions in real-time. If a node is 'Pending', our curators are verifying its utility. Once 'Approved', it becomes a live entry in the global registry. The hub also contains your 'Financial Node'—the Wallet. Here, you can fund your account to launch featured promotions, which place your brand in prime positions across the home feed and trending charts for instant momentum.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Example Action:</p>
                <p className="text-sm">Use the 'Edit' feature in the hub to refine your website description based on Ouneo's discovery patterns. High-relevance descriptions lead to higher internal search rankings.</p>
              </div>
            </section>

            <section id="interactions" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Using the Interaction Ledger
              </h2>
              <p>
                The Interaction Ledger is our transparent data node that tracks how the community engages with your content. In your 'My Websites' dashboard, you can see granular data for each of your approved assets. Clicks represent immediate interest, while 'Appreciations' (likes) signal long-term utility. 'Registry Saves' are the highest fidelity signal, indicating that a user intends to integrate your tool into their permanent workflow.
              </p>
              <p>
                Use this ledger to measure 'Product-Market Fit'. If your site has high views but zero saves, your landing page node is likely underperforming or contains too much 'Padding'. This data allows you to iterate on your brand marks and messaging with technical precision. Absolute discovery is not a static event; it is a continuous cycle of measurement and recalibration driven by real human interactions logged on the Bessites network.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Mastering the Bessites platform is the first step toward achieving your growth goals. Whether you are discovering the next big tool or building it, our node-based architecture is designed to support your high-velocity workflow. By utilizing Ouneo AI, engaging with the Creator Hub, and monitoring your Interaction Ledger, you turn discovery into a technical advantage. Stay intentional, build with zero padding, and let the Bessites discovery pipeline help you reach the top 1% of the modern web.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Is Ouneo AI free for all users?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Yes, Ouneo is a primary feature of our platform and is free for all registered curators. It is designed to be your permanent discovery partner, helping you navigate our registry of 100+ interest nodes with ease.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">How can I increase my trending rank on Bessites?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Trending rank is driven by the Interaction Ledger. To rise to the top, focus on providing a high-utility, zero-padding experience. Encouraging users to 'Save' your tool to their registry is the fastest way to gain momentum.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">What happens if my wallet balance runs out during a promotion?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Your promotion will automatically pause once the daily budget is met. You can refill your wallet at any time in the 'Financial Node' section of the Creator Hub to resume your global ad-boost campaign instantly.</p>
                </div>
              </div>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Is Ouneo AI free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, Ouneo is a free conversational discovery partner for all registered curators." } },
              { "@type": "Question", "name": "How to increase trending rank?", "acceptedAnswer": { "@type": "Answer", "text": "Maximize 'Registry Saves' and high-utility interactions to rise in the charts." } },
              { "@type": "Question", "name": "What if my wallet runs out?", "acceptedAnswer": { "@type": "Answer", "text": "Promotions pause automatically and can be resumed once funds are added." } }
            ]
          })
        }}
      />
    </div>
  );
}
