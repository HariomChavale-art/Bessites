import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  Globe,
  Zap
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Submit Your Website to Bessites - Step by Step Guide | Bessites",
  description: "Learn the official process for adding your digital property to the Bessites registry. Ensure your website meets our professional quality standards.",
  keywords: ["Bessites guide", "submit website", "digital discovery", "website promotion", "user manual"],
};

export default function SubmitGuidePage() {
  const faqData = [
    {
      q: "How long does the manual review process take for new submissions?",
      a: "Our curation node typically reviews all new submissions within 24 to 48 hours. During this period, our experts verify the URL safety, content quality, and category alignment. You can track your status in the 'My Websites' section of your creator studio dashboard. If there is a high volume of entries, it might take a bit longer, but we prioritize quality over speed."
    },
    {
      q: "Can I submit multiple websites under one single creator account?",
      a: "Yes, Bessites supports multi-node ownership. You can submit as many unique digital properties as you own. Each submission is treated as an individual asset in our discovery pipeline and will have its own analytics and interaction ledger. We encourage creators to list all their professional tools to build a stronger presence in our registry."
    },
    {
      q: "What are the most common reasons a submission might get rejected?",
      a: "Rejections typically occur if the website contains excessive 'padding' (filler content), broken links, or if it doesn't provide clear utility to our professional audience. We also reject sites that are purely for SEO manipulation or duplicate existing services without adding new value. We prioritize high-fidelity tools and modern webs that meet our 'Zero Duplication' standard."
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
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 01: Registry Basics</Badge>
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">
                Published: Oct 10, 2026 • 12 Min Read
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Submit Your Website to <span className="text-primary">Bessites</span> - Complete Guide
            </h1>
            
            <div className="space-y-6 text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-emerald-500 pl-8 py-2">
              <p>
                Starting a new website is a monumental step, but making it visible to a professional audience is where most creators struggle. In an era of automated scrapers and low-value content, your project needs a high-fidelity distribution channel that values quality over quantity. Getting your website into the hands of the right audience requires more than just a URL; it requires a presence in a registry that people trust.
              </p>
              <p>
                Bessites.store was built to solve this exact problem. By providing a curated space for the top 1% of the web, we ensure that high-quality tools don't get lost in the noise. Submitting your website to our registry is the first step in achieving absolute discovery. This guide will walk you through the entire process, from preparing your brand assets to tracking your first visitors in our interaction ledger.
              </p>
            </div>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#what-is-bessites" className="hover:text-emerald-400 transition-colors">1. What is Bessites.store?</a></li>
              <li><a href="#why-submit" className="hover:text-emerald-400 transition-colors">2. Why You Should Submit</a></li>
              <li><a href="#step-by-step" className="hover:text-emerald-400 transition-colors">3. Step-by-Step Instructions</a></li>
              <li><a href="#post-submission" className="hover:text-emerald-400 transition-colors">4. Post-Submission Workflow</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            
            <section id="what-is-bessites" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-emerald-500 text-4xl">01</span> What is Bessites.store?
              </h2>
              <p>
                Bessites.store is not just another web directory; it is a professional discovery engine designed for the modern web. We operate on a strict "Zero Padding" policy, which means every listing in our registry is verified for actual utility. Unlike search engines that rely on complex, often biased algorithms, Bessites relies on human-centric curation and intentional categorization. We organize the web into 10 broad sectors and 100 specific interest nodes, ranging from AI tools and coding frameworks to niche lifestyle hobbies and creative assets.
              </p>
              <p>
                Our platform serves as a bridge between high-velocity creators and a community of professional users looking for the best tools to improve their workflows. When a website is listed on Bessites, it becomes part of a permanent registry that values high-fidelity data and zero duplication. We focus on "Absolute Discovery," ensuring that when a user searches for a specific solution, they find exactly what they need without having to dig through pages of low-value advertisements or placeholder sites.
              </p>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-emerald-400 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Bessites is optimized for "intent-based" discovery. This means our users aren't just browsing; they are looking for specific tools to solve real problems. Align your description with this intent.</p>
              </div>
            </section>

            <section id="why-submit" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-emerald-500 text-4xl">02</span> Why You Should Submit Your Website
              </h2>
              <p>
                In the current digital landscape, organic search authority can take months or even years to build. For a new website, this "waiting period" can be fatal. Submitting to Bessites.store gives your project an immediate distribution node that bypasses traditional search delays. By listing your project here, you are signaling to both our community and search engine crawlers that your website is a professional, high-value asset worthy of attention.
              </p>
              <p>
                Beyond simple visibility, Bessites provides you with a suite of creator tools. Our "Interaction Ledger" tracks how people engage with your link—including visits, appreciations (likes), and saves. This data is invaluable for understanding your "Product-Market Fit" in the early stages of your launch.
              </p>
              <ul className="space-y-6 pt-4 list-none">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-bold text-white uppercase text-sm tracking-widest">Immediate Authority</p>
                    <p className="text-sm opacity-70">Get listed alongside the top 1% of modern webs, instantly boosting your brand's perceived quality.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-bold text-white uppercase text-sm tracking-widest">High-Intent Traffic</p>
                    <p className="text-sm opacity-70">Reach a professional audience that is actively seeking new tools, resulting in higher conversion rates.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-bold text-white uppercase text-sm tracking-widest">Algorithmic Momentum</p>
                    <p className="text-sm opacity-70">Positive signals from our interaction ledger help your site rise to the top of our trending charts.</p>
                  </div>
                </li>
              </ul>
            </section>

            <section id="step-by-step" className="space-y-8">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-emerald-500 text-4xl">03</span> Step-by-Step - How to Submit
              </h2>
              <div className="grid grid-cols-1 gap-6 pt-4">
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black italic shadow-lg">1</div>
                    <h3 className="text-xl font-bold text-white uppercase italic">Authenticate & URL Entry</h3>
                  </div>
                  <p className="text-sm leading-relaxed opacity-80">
                    First, login to your Bessites account and navigate to the "Submit" page. Enter your primary, live URL. Our system will perform a real-time reachability check.
                  </p>
                </div>
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black italic shadow-lg">2</div>
                    <h3 className="text-xl font-bold text-white uppercase italic">Brand Mark Upload</h3>
                  </div>
                  <p className="text-sm leading-relaxed opacity-80">
                    Upload a high-resolution logo for your website. This brand mark is critical for visual discovery in our card-based feed.
                  </p>
                </div>
              </div>
            </section>

            <section id="post-submission" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-emerald-500 text-4xl">04</span> What Happens After You Submit?
              </h2>
              <p>
                Once you click "Publish Project," your entry is moved into our moderation queue. Unlike automated directories, Bessites.store uses human curators to verify every single submission. This process usually takes between 24 and 48 hours.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Reaching absolute discovery is a technical discipline of distribution. By submitting your website to Bessites.store, you are taking a proactive step in building your brand's authority.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <div className="flex items-center gap-4 text-emerald-400">
                <HelpCircle className="w-8 h-8" />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              </div>
              <div className="grid grid-cols-1 gap-8">
                {faqData.map((faq, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-xl font-bold text-white italic">Q: {faq.q}</h3>
                    <p className="text-zinc-400 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
             <Link href="/guide">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Manual Hub
                </Button>
             </Link>
             <div className="flex gap-4">
                <Link href="/guide/how-to-get-free-traffic">
                  <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase italic shadow-xl">
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