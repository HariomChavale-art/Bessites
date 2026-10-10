import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Search, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Get Your Website Discovered - Launch Mastery | Bessites",
  description: "Stop being hidden. Learn the technical blueprint for achieving absolute discovery and visibility for your new website in 2026.",
  keywords: ["website discovery guide", "get website found", "online visibility tips", "Bessites manual", "launch strategy 2026"],
};

export default function GetDiscoveredGuide() {
  const faqData = [
    { q: "Why is my new website not showing up in search results?", a: "This is usually due to a lack of 'Indexing' and 'Authority'. Search engines need to be notified of your existence via Search Console and sitemaps. They also require 'High-Fidelity' signals from other websites—like registry listings on Bessites.store—to verify that your site is a professional, high-quality asset worthy of being discovered." },
    { q: "How long does the discovery process realistically take?", a: "With intentional force, you can be discovered in hours via social and curation nodes. Organic search discovery typically takes 3-6 months. The goal is to use high-velocity distribution to drive initial visitors, which signals quality to the algorithms and accelerates the long-term discovery process." },
    { q: "What is the most effective discovery node for a new builder?", a: "Curated registries like Bessites.store are the most effective. Unlike standard search engines, our audience is pre-filtered for 'Intent'—they are looking for tools like yours. A single approved listing in a relevant node can bring more high-quality users than months of generic SEO." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 18: Launch</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Get Your <span className="text-primary">Website Discovered</span> - Mastery Guide
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Building a great website is only 50% of the journey. The other 50% is ensuring that the world can actually find it. In a digital landscape saturated with millions of new URLs every month, discovery is no longer a passive event—it is a technical discipline of distribution. If you don't intentionally push your site into the discovery nodes where users live, you will remain hidden indefinitely. This manual provides a blueprint to achieve absolute discovery by mastering metadata, leveraging curation gateways like Bessites.store, and building a resilient visibility node in the modern web.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#discovery-logic" className="hover:text-primary">1. Understanding Modern Discovery Logic</a></li>
              <li><a href="#metadata-hooks" className="hover:text-primary">2. Engineering Discovery Hooks</a></li>
              <li><a href="#curation-nodes" className="hover:text-primary">3. Curation Gateways & Registries</a></li>
              <li><a href="#social-proof" className="hover:text-primary">4. Building Community Social Proof</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="discovery-logic" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Understanding Modern Discovery Logic
              </h2>
              <p>
                In 2026, discovery is governed by 'Neural Intent' and 'Verified Interaction'. Search engines and social feeds are moving away from simple keyword matching toward understanding the 'Utility' of a website. When a user performs a search, the algorithm looks for the most high-fidelity match that other humans have already verified as useful. This means that to be discovered, you must first prove your value to a small group of early adopters who will then 'Vote' for your quality via their interactions.
              </p>
              <p>
                Absolute discovery is a technical feedback loop. Your site gets listed in a discovery node (like a registry or social feed), users interact with it, and those interaction signals tell the broader algorithms that your site is worth showing to more people. This is how high-velocity growth works. By understanding that discovery starts with real human validation, you can focus your efforts on the nodes that drive the highest-fidelity interaction signals.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Don't aim for 'Traffic'. Aim for 'Value Actions' like registry saves or appreciations. These signals are weighted 10x higher than a simple click by modern discovery algorithms.</p>
              </div>
            </section>

            <section id="metadata-hooks" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Engineering Discovery Hooks
              </h2>
              <p>
                The metadata title and description are your primary 'Hooks' in the discovery grid. When your site appears in a search result or a registry feed, the user has approximately 0.5 seconds to decide whether to click. Your hook must communicate immediate utility and zero padding. Avoid generic titles like 'My New Web Tool'. Instead, use action-oriented, result-driven hooks like 'Generate 3D Logos in 60 Seconds - High-Fidelity Asset Builder'.
              </p>
              <p>
                Specificity is the Hallmark of discovery. If your website is a color palette generator, tell them exactly how many palettes they can browse or how many brands use your tool. This level of technical depth builds instant cognitive trust. Use brackets [] or parentheses () to highlight your best feature, e.g., '[Free Version Available]'. These visual cues break the monotony of the search grid and significantly increase your Click-Through Rate (CTR), which is a primary discovery signal.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Front-load your most important keywords to satisfy both users and bots.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Ensure your brand mark is sharp and recognizable at small sizes in the discovery feed.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Audit your meta-description to ensure it provides a clear reason to click with no filler.</span></li>
              </ul>
            </section>

            <section id="curation-nodes" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Leveraging Curation Gateways
              </h2>
              <p>
                Curation is the antidote to search engine noise. Modern users prefer finding tools through hand-picked registries like Bessites.store because every listing is a 'Verified Asset'. By submitting your site to our 100-node interest registry, you are placing your brand within the 'Absolute Discovery' pipeline. Our curators verify every URL for quality and relevance, which provides an immediate layer of trust that automated search results lack.
              </p>
              <p>
                Listing on Bessites is not just about a backlink; it is about building your 'Registry Presence'. As users save your tool to their personal registries, your site's 'Discovery Authority' increases. Ouneo, our conversational AI assistant, uses these interaction signals to recommend your site to relevant users in real-time. This high-velocity distribution node is the fastest way to get your first 1,000 visitors and build the community proof required for long-term organic discovery.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Strategy:</p>
                <p className="text-sm">Complete every field in your Bessites submission. technical descriptions and specific tags help our AI node index your site correctly for targeted discovery.</p>
              </div>
            </section>

            <section id="social-proof" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Building Community Social Proof
              </h2>
              <p>
                Discovery is also driven by 'Peer-to-Peer Distribution'. When a professional user finds a tool that solves their problem, they naturally share it with their network in Discord, Slack, or on social media. This 'Word-of-Mouth' node is the highest-fidelity discovery signal possible. To trigger it, your website must provide 'Zero Padding' utility—it must do exactly what it promises, instantly, and without friction.
              </p>
              <p>
                Encourage your early users to 'Appreciate' (like) your site on Bessites. This social proof is visible to every other visitor in the registry and signals that your tool is a 'Verified Winner'. Over time, these community signals aggregate into a robust discovery profile that makes your site impossible to ignore. Absolute discovery is the result of many small, positive interactions logging into the permanent ledger of the web. Build for the human, and the algorithms will follow.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Being discovered in 2026 is a technical discipline of distribution. By understanding modern discovery logic, engineering high-CTR hooks, leveraging curation gateways like Bessites.store, and building community proof, you create a visibility node that survives algorithmic noise. Don't build your project in the shadows; push it into the light of professional registries and communities. Absolute discovery is not a matter of luck; it is a matter of placement and utility. Build something great, list it properly, and let the internet find you.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                {faqData.map((faq, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-xl font-bold text-white italic">{faq.q}</h3>
                    <p className="text-zinc-400 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-grow-from-zero">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/common-mistakes-new-websites">
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
            "mainEntity": faqData.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          })
        }}
      />
    </div>
  );
}

