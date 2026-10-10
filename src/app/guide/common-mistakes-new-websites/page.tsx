import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, AlertCircle, Trash2, Zap } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Common Mistakes New Websites Make - Resource Manual | Bessites",
  description: "Avoid the 'Padding' traps. Learn the 5 most common technical and strategic mistakes that kill new website growth in 2026.",
  keywords: ["website launch mistakes", "common SEO errors", "improve new website", "Bessites manual", "optimize new site"],
};

export default function CommonMistakesGuide() {
  const faqData = [
    { q: "What is the #1 mistake that kills a new website?", a: "High 'Padding' and Friction. If a user visits your site and has to click three times just to see what you do, they will bounce. Modern discovery requires a zero-friction experience where the 'Value Node' is visible instantly. Removing unnecessary text, pop-ups, and slow animations is the fastest way to fix a failing launch." },
    { q: "Is it okay to use AI-generated content on my new site?", a: "Only if you manually refine it. Search engines and curation nodes like Bessites can easily detect unedited AI spam. If your content lacks human expertise and instructional depth, it will be flagged as 'Low Value' and hidden from the discovery pipeline. Use AI for drafts, but ensure the final node is 100% human-verified." },
    { q: "Why is my site's mobile performance so different from desktop?", a: "New builders often design for desktop first and then 'shrink' for mobile. This is a major mistake. Mobile users have different interaction needs (touch targets, vertical hierarchy). If your mobile node is slow or hard to navigate, you are alienating 70% of your potential discovery audience." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 19: Resources</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              Common Mistakes <span className="text-primary">New Websites</span> Make - Optimization Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Most new websites fail not because of a bad idea, but because of poor technical and strategic execution. In the era of absolute discovery, 'Padding' is the enemy. Whether it's a slow-loading hero section, confusing navigation nodes, or generic AI-generated content, these mistakes signal low quality to both users and discovery algorithms. This manual deconstructs the five most common traps that new creators fall into and provides actionable fixes to ensure your digital property meets the 'Zero Padding' standard. Success in the discovery pipeline is as much about what you remove as what you build.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#high-friction" className="hover:text-primary">1. High-Friction Onboarding</a></li>
              <li><a href="#content-padding" className="hover:text-primary">2. Excessive Content Padding</a></li>
              <li><a href="#technical-neglect" className="hover:text-primary">3. Technical Node Neglect</a></li>
              <li><a href="#isolation" className="hover:text-primary">4. Building in Distribution Isolation</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="high-friction" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> High-Friction Onboarding & UX
              </h2>
              <p>
                The biggest mistake new websites make is requiring too much effort from the user before showing value. If your tool is behind a mandatory sign-up wall, or if your landing page is cluttered with pop-ups and cookie banners, you are creating 'Interaction Friction'. In 2026, users expect a 'Zero Friction' path to utility. They want to see the tool work before they commit their data or time to your node.
              </p>
              <p>
                Remove any unnecessary steps in your conversion node. If your website is a PDF converter, let them convert one file for free without an account. This builds immediate 'Community Proof' and trust. High-fidelity discovery is about proving value first and asking for data second. If your onboarding is a barrier, your 'Interaction Ledger' will show a high bounce rate, which search engines interpret as a sign of low-quality utility.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Audit your landing page with a '3-Second Test'. If a total stranger can't identify your primary utility and value prop within 3 seconds, your navigation node is failing and needs immediate recalibration.</p>
              </div>
            </section>

            <section id="content-padding" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Excessive Content Padding
              </h2>
              <p>
                In an attempt to rank for keywords, many creators fill their pages with 'Padding'—long, repetitive paragraphs that add no value to the user. This is a primary target for modern discovery algorithms like Google's helpful content system. If your 1,000-word guide can be summarized in 100 words without losing utility, you have a padding problem. 'Zero Padding' content is technical, concise, and result-oriented.
              </p>
              <p>
                Stop using AI to generate raw text without heavy manual editing. Generic AI content is a low-fidelity signal that tells curation nodes like Bessites.store that your project is a 'Low Value' clone. Focus on provided 'Unique Insights' and 'Actionable Data' that only a human expert could provide. High-fidelity documentation should be instructional—it should tell the user exactly what to do and how to do it. Value is measured by utility, not word count.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Replace long paragraphs with bulleted lists and technical diagrams for better readability.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Remove any text that is purely for 'SEO' and doesn't directly help the user solve a problem.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use strong, specific verbs instead of passive, descriptive language.</span></li>
              </ul>
            </section>

            <section id="technical-neglect" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Technical Node Neglect (Speed & Mobile)
              </h2>
              <p>
                A slow website is a hidden website. Many new builders neglect 'Core Web Vitals', assuming that their content is enough to win. In 2026, performance is a mandatory technical requirement for discovery. If your LCP (Largest Contentful Paint) is over 3 seconds, or if your mobile layout shifts during loading, you are sending a 'Critical Error' signal to the search nodes. Your discovery potential will be capped, regardless of how good your tool is.
              </p>
              <p>
                Another common mistake is 'Mobile Shrinking'—treating your mobile version as just a smaller desktop site. Mobile users have specific 'Interaction Nodes': they need large touch targets and simplified navigation. If your site is hard to use on a phone, you are losing 70% of the modern web audience. Optimize your assets, use high-fidelity hosting nodes like Vercel, and ensure your mobile UX is as refined as your desktop UX. Zero latency is the hallmark of professional builders.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Example Trap:</p>
                <p className="text-sm">Using heavy hero images (2MB+) without WebP compression. This single technical error can increase your bounce rate by 50% and permanently damage your initial discovery momentum.</p>
              </div>
            </section>

            <section id="isolation" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Building in Distribution Isolation
              </h2>
              <p>
                'Build it and they will come' is the most dangerous myth in the creator economy. Most new websites fail because they are built in 'Distribution Isolation'. The creator spends months building the perfect tool but zero hours on distribution. Without intentional force to push your URL into discovery gateways like Bessites.store, Pinterest, or Reddit, your site will remain a silent node in a sea of billions.
              </p>
              <p>
                Bessites was created specifically to solve this isolation problem. By listing your project in our professional registry, you are connecting your site to an active network of discovery-hungry users. Don't build for a month without one distribution experiment. Every new feature should be accompanied by a distribution burst in your target communities. High-velocity growth is driven by continuous distribution, not a single 'Launch Day' that never happens.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Success in the 2026 digital landscape is a result of technical discipline and zero padding. By avoiding high-friction onboarding, removing content padding, prioritizing technical health, and escaping distribution isolation, you position your digital property for absolute discovery. Audit your site today for these common traps and apply the fixes provided in this manual. Remember: the best websites are those that respect the user's time and provide immediate utility. Build lean, build fast, and let the Bessites discovery pipeline take your project to the top 1% of the web.
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
             <Link href="/guide/how-to-get-website-discovered">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-track-website-traffic">
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

