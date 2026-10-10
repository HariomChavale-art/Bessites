import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Submit Your Website to Bessites - Step by Step Guide | Bessites",
  description: "Official user manual for Bessites.store. Learn how to prepare, submit, and optimize your digital property for absolute discovery in our registry.",
  keywords: ["Bessites guide", "submit website", "digital discovery", "website promotion", "user manual"],
};

export default function SubmitGuidePage() {
  const faqData = [
    {
      q: "How long does the manual review process take?",
      a: "Our curation node typically reviews all submissions within 24 to 48 hours. During this period, our experts verify the URL safety, content quality, and category alignment. You can track your status in the 'My Websites' section of your creator studio dashboard."
    },
    {
      q: "Can I submit multiple websites under one account?",
      a: "Yes, Bessites supports multi-node ownership. You can submit as many unique digital properties as you own. Each submission is treated as an individual asset in our discovery pipeline and will have its own analytics and interaction ledger."
    },
    {
      q: "What makes a submission get rejected?",
      a: "Rejections typically occur if the website contains excessive 'padding' (filler content), broken links, or if it doesn't provide clear utility to our professional audience. We prioritize high-fidelity tools and modern webs that meet our 'Zero Duplication' standard."
    }
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
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 01: Basics</Badge>
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">
                Last Updated: Oct 10, 2026
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Submit Your Website to <span className="text-primary">Bessites</span> - Complete Guide
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-emerald-500 pl-8 py-2">
              Launching a digital project is a significant achievement, but the real challenge begins with discovery. In a digital environment crowded with noise and low-value content, getting your website into the hands of the right audience requires a high-fidelity distribution channel. This guide explains how to properly index your project in the Bessites.store registry to achieve absolute visibility within our professional community.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#prep" className="hover:text-emerald-400 transition-colors">1. Preparation Checklist</a></li>
              <li><a href="#steps" className="hover:text-emerald-400 transition-colors">2. Step-by-Step Submission</a></li>
              <li><a href="#optimize" className="hover:text-emerald-400 transition-colors">3. Optimizing Your Listing</a></li>
              <li><a href="#tracking" className="hover:text-emerald-400 transition-colors">4. Impact Monitoring</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            
            {/* Section 1 */}
            <section id="prep" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-emerald-500 text-4xl">01</span> Preparing Your Asset for Registry
              </h2>
              <p>
                Before you initiate the submission process on Bessites.store, it is vital to ensure your digital property is optimized for review. Our curation node focuses on high-fidelity tools that provide immediate value. A poorly configured website not only risks rejection but also fails to capture the interest of our professional audience.
              </p>
              <ul className="space-y-4 pt-4 list-none">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Verify that your SSL certificate is valid and your URL is globally reachable.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Clean up your landing page metadata to ensure clear descriptive text is present.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Prepare a high-resolution brand mark (logo) in PNG or SVG format.</span></li>
              </ul>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-emerald-400 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Perform a 'Page Speed' test before submitting. High-velocity users on Bessites expect low-latency experiences. A fast site is much more likely to receive premium curation status.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="steps" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-emerald-500 text-4xl">02</span> The Submission Process Step-by-Step
              </h2>
              <p>
                Once your preparation is complete, the actual submission to the Bessites registry is a streamlined, user-friendly process designed for momentum. We have removed the friction commonly found in traditional web directories. Follow these exact steps to broadcast your project to our discovery pipeline.
              </p>
              <p>
                First, authenticate your creator account using the secure login node. Navigate to the 'Submit' page, which is the command center for all new registry entries. You will be asked to provide your live URL, a descriptive name for the website, and a concise explanation of its primary function.
              </p>
              <ul className="space-y-4 pt-4 list-none">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Upload your brand mark to our secure storage node for visual identification.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Select your primary interest node from our 100-category taxonomy.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Add specific metadata tags to help our AI search engine, Ouneo, find you.</span></li>
              </ul>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">In the 'Access Model' field, be honest about your pricing (Free/Paid). Transparency builds immediate trust within the discovery network.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="optimize" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-emerald-500 text-4xl">03</span> Optimizing Your Listing for Discovery
              </h2>
              <p>
                Submitting is only the first phase. To achieve 'Absolute Discovery' on Bessites.store, your listing must be engineered to capture user intent. Our interaction ledgers track visits, likes, and saves, which directly influence your ranking in the 'Trending' nodes. Optimization is the bridge between a simple listing and a high-impact asset.
              </p>
              <p>
                Your description should focus on the specific problem your tool solves. Instead of general marketing fluff, use technical clarity. For example, if you are submitting a CSS generator, explain exactly what kind of code it produces. This level of detail satisfies both the human reader and our internal indexing algorithms.
              </p>
              <ul className="space-y-4 pt-4 list-none">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Use clear, benefit-driven headlines that include your primary keyword.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Tag your project with both broad sectors and niche interests for maximum reach.</span></li>
              </ul>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-emerald-400 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Double-check your 'Detailed Tags' section. Ouneo AI uses these tags to recommend your site during conversational discovery sessions.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="tracking" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-emerald-500 text-4xl">04</span> Impact Monitoring & Creator Hub
              </h2>
              <p>
                Knowledge is power in the digital growth cycle. After your site is approved and live in the Bessites.store registry, you gain access to real-time analytics via the Creator Hub. This dashboard is your window into how the community is discovering and interacting with your digital property.
              </p>
              <p>
                You can track unique visits, the volume of saves (which indicates retention), and social shares. Monitoring these metrics allows you to recalibrate your listing or even your website itself based on real user behavior. Our interaction data is high-fidelity, meaning we filter out bot traffic to give you a true picture of human engagement.
              </p>
              <ul className="space-y-4 pt-4 list-none">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Analyze which interest nodes are driving the most traffic to your URL.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /><span>Compare your trending score against similar tools in your category.</span></li>
              </ul>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Check your 'Audience Pulse' weekly. Spikes in interaction data often correlate with being featured in our staff picks or trending charts.</p>
              </div>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Achieving absolute visibility in the modern web doesn't happen by accident. It is the result of intentional submission and continuous optimization within high-fidelity discovery nodes. By following this manual, you have positioned your website on the professional registry of Bessites.store, ensuring it is discovered by the top 1% of the web's creators and builders. Keep optimizing, keep tracking, and most importantly, keep building the future of the internet.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <div className="flex items-center gap-4 text-emerald-400">
                <HelpCircle className="w-8 h-8" />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {faqData.map((faq, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-xl font-bold text-white italic">Q: {faq.q}</h3>
                    <p className="text-zinc-400 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Schema and Navigation */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqData.map(f => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a
                  }
                }))
              })
            }}
          />

          <footer className="pt-20 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
             <Link href="/guide">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Manual Hub
                </Button>
             </Link>
             <div className="flex gap-4">
                <Button disabled variant="outline" className="rounded-xl border-white/5 bg-white/5 text-[9px] font-black uppercase opacity-20 italic">
                   Previous Guide
                </Button>
                <Link href="/guide">
                  <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase italic shadow-xl shadow-emerald-500/10">
                     Next Guide <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
             </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
