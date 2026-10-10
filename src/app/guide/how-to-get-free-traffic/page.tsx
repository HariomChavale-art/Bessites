import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Info, HelpCircle, Zap } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Get Free Traffic - Step by Step Guide | Bessites",
  description: "Discover 7 proven methods to drive organic, high-intent traffic to your new website without spending money on ads in 2026.",
  keywords: ["free traffic", "get website visitors", "organic growth", "Bessites growth", "website promotion"],
};

export default function FreeTrafficGuide() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Link href="/guide" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Manual Hub
        </Link>

        <article className="space-y-16">
          <header className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 02: Growth</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Get <span className="text-primary">Free Traffic</span> - 2026 Guide
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Generating your first stream of organic traffic is the ultimate hurdle for any digital creator. Many builders believe that without a massive advertising budget, discovery is impossible. This manual deconstructs that myth, providing you with high-fidelity, no-cost strategies to drive high-intent users directly to your URL from professional distribution nodes and social registries.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#visual-search" className="hover:text-primary">1. Pinterest Visual Search</a></li>
              <li><a href="#community-outreach" className="hover:text-primary">2. Community Outreach</a></li>
              <li><a href="#metadata-hooks" className="hover:text-primary">3. Metadata & CTR Hooks</a></li>
              <li><a href="#registry-leverage" className="hover:text-primary">4. Leveraging Registries</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="visual-search" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Pinterest Visual Search
              </h2>
              <p>
                In 2026, Pinterest remains the most underrated source of evergreen, high-fidelity traffic. Unlike standard social networks where content dies in 24 hours, Pinterest functions as a visual search engine. Every 'Pin' you create is a permanent discovery node that can drive traffic to your website for years to come.
              </p>
              <p>
                To succeed, you must create vertical (2:3 aspect ratio) visuals that solve a specific problem. For example, if you built a coding tool, create an infographic showing a 'Before and After' of your tool in action. Use keyword-rich descriptions to ensure the Pinterest algorithm categorizes your asset correctly. Consistency is key here; aim for 3-5 high-quality pins per week to maintain momentum in the visual grid.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Use 'Idea Pins' to showcase short video walkthroughs. Visual proof of utility is the fastest way to trigger a click-through to your main URL.</p>
              </div>
            </section>

            <section id="community-outreach" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Intent-Based Community Outreach
              </h2>
              <p>
                Reddit and Quora are high-authority nodes where millions of users ask for specific solutions daily. The key to free traffic here is 'Zero Spam'. You must provide immediate, high-value answers that solve 90% of the user's problem without requiring them to click your link.
              </p>
              <p>
                When you provide such high fidelity, your website link (at the bottom as 'Further Reading' or 'Advanced Tool') becomes a trusted recommendation rather than an annoying ad. Identify subreddits like r/webdev, r/startups, or r/productivity where your tool provides utility. Engage in the comments for at least 15 minutes a day to build a verified presence in these communities.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Answer questions with real, technical depth (at least 200 words).</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use a brand-matching username to build recognition.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Never drop raw links; always include descriptive context.</span></li>
              </ul>
            </section>

            <section id="metadata-hooks" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Metadata & CTR Hooks
              </h2>
              <p>
                Even if you rank #1 on a search engine, you won't get traffic if your headline is boring. Click-Through Rate (CTR) optimization is the bridge between visibility and actual visitors. Your metadata title must satisfy both the algorithmic search node and human curiosity.
              </p>
              <p>
                Use brackets or parentheses to highlight a specific value, e.g., '[Free Tool]' or '(New for 2026)'. This small visual cue increases the human interaction rate significantly. Ensure your meta-description is not just a summary, but a 'Hook' that promises a specific result. If your website is a color generator, tell them they can 'Build a Brand Palette in 30 Seconds' instead of just saying 'We generate colors'.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Always list your site on Bessites.store. Our internal search logic prioritizes these same high-CTR hooks, giving you a double boost in discovery.</p>
              </div>
            </section>

            <section id="registry-leverage" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Leveraging High-Fidelity Registries
              </h2>
              <p>
                Curation is the new search. Modern users prefer finding tools through hand-picked registries like Bessites rather than infinite Google search results. By listing your property in our professional directory, you tap into a stream of high-velocity users who are specifically looking for functional webs.
              </p>
              <p>
                Make sure your registry listing is optimized with a clean brand mark and a technical description. Our Interaction Ledger tracks visits and likes, which helps high-quality sites rise to the top of our trending charts. This 'Community Proof' is the most powerful form of free marketing, as it signals quality to every other visitor in the network.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Free traffic is not a matter of luck; it is a technical discipline of distribution. By utilizing visual search, intentional community outreach, and high-fidelity registries like Bessites.store, you build a resilient traffic pipeline that grows over time. Stay consistent with your publication schedule, optimize your hooks daily, and focus on providing zero-padding value to every user who clicks your URL.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">How soon can I see traffic results?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Social and community distribution can bring visitors within hours. Evergreen visual search (Pinterest) typically takes 30-90 days to gain significant authority and volume.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Which platform is best for new sites?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Pinterest is best for long-term evergreen discovery. Reddit is best for high-velocity, immediate feedback bursts. Bessites.store is best for professional registry authority.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Does free traffic help my Google ranking?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Yes. Consistent traffic from diverse nodes signals to Google that your website is useful, which can lead to higher organic search ranking over time.</p>
                </div>
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-submit-website">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-submit-to-google">
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
              { "@type": "Question", "name": "How soon can I see traffic results?", "acceptedAnswer": { "@type": "Answer", "text": "Within hours for social, 30-90 days for visual search." } },
              { "@type": "Question", "name": "Which platform is best for new sites?", "acceptedAnswer": { "@type": "Answer", "text": "Pinterest for long-term, Reddit for immediate feedback." } },
              { "@type": "Question", "name": "Does free traffic help my Google ranking?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, it signals utility and authority to search engines." } }
            ]
          })
        }}
      />
    </div>
  );
}
