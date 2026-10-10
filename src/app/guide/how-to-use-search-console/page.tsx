import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Search, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mastering Google Search Console - Guide | Bessites",
  description: "Learn how to use Google Search Console as a data command center. Monitor performance, fix indexing errors, and drive absolute discovery for your site.",
  keywords: ["google search console guide", "GSC tutorial for beginners", "website performance tracking", "Bessites manual", "fix indexing errors"],
};

export default function SearchConsoleGuide() {
  const faqData = [
    { q: "Is Google Search Console free for all users?", a: "Yes, GSC is a free service provided by Google. It is the definitive tool for any website owner looking to monitor their presence in search results and should be considered a mandatory part of your discovery infrastructure." },
    { q: "How long does it take for data to show up in GSC?", a: "New properties usually take 24-48 hours to start displaying performance data. After the initial period, data is updated daily with a lag of approximately 1-2 days." },
    { q: "What should I do if GSC reports an 'Indexing Error'?", a: "Use the 'URL Inspection' tool to identify the specific technical issue (e.g., 404, robots.txt block). Once fixed, click 'Validate Fix' to notify Google's bots that the discovery node is healthy again." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 14: Data Command</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              Mastering Google <span className="text-primary">Search Console</span> - User Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Google Search Console (GSC) is the definitive data command center for any digital property. Without it, you are flying blind in the discovery pipeline. It provides a direct view of how Google's algorithms see your website—including which keywords bring traffic, which pages are failing to index, and how your core vitals are performing. Mastering GSC is critical for achieving absolute discovery with zero padding. This manual provides a tactical walkthrough to set up, analyze, and optimize your site using GSC data nodes.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#setup" className="hover:text-primary">1. Setup & Verification Infrastructure</a></li>
              <li><a href="#performance" className="hover:text-primary">2. Analyzing the Performance Node</a></li>
              <li><a href="#inspection" className="hover:text-primary">3. The Inspection Tool Advantage</a></li>
              <li><a href="#health" className="hover:text-primary">4. Monitoring Site Health & Errors</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="setup" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Setup & Verification Infrastructure
              </h2>
              <p>
                Before you can access your data, you must authenticate your domain. GSC offers several verification methods, but DNS verification is the high-fidelity standard. It proves ownership at the network level and covers all subdomains. To begin, sign in to the Search Console and add your domain property. Google will provide a unique TXT record that you must add to your DNS settings (e.g., in Cloudflare or your registrar).
              </p>
              <p>
                Once verified, GSC begins logging interactions. It is important to verify your domain early, as data is not tracked retrospectively. For creators on Bessites, verifying your site in GSC is the first step toward tracking the traffic you receive from our registry. It allows you to see exactly which 'Referral Nodes' are driving the most value to your site.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Use a 'Domain Property' instead of a 'URL Prefix Property'. This ensures that all versions of your site (www vs non-www, http vs https) are tracked under a single, unified node.</p>
              </div>
            </section>

            <section id="performance" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Analyzing the Performance Node
              </h2>
              <p>
                The Performance report is the heart of GSC. It shows four critical metrics: Total Clicks, Total Impressions, Average CTR, and Average Position. Clicks are users who successfully reached your site. Impressions are how often your link appeared in a search node. CTR (Click-Through Rate) measures your headline efficiency. Position is your rank in the discovery grid.
              </p>
              <p>
                To use this data effectively, look for 'Low CTR' keywords. If you have 10,000 impressions but only 10 clicks, your metadata title is failing. Recalibrate your SEO titles based on our 'Discovery Hooks' guide to improve your CTR. High CTR is a quality signal that often leads to higher rankings. Data-driven iteration is the hallmark of a professional creator.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Filter performance by 'Page' to identify your highest-value discovery nodes.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Monitor 'Query' data to see exactly what users are typing to find you.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Compare date ranges to track your growth velocity over time.</span></li>
              </ul>
            </section>

            <section id="inspection" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> The URL Inspection Tool Advantage
              </h2>
              <p>
                The URL Inspection tool allows you to check the live status of any page on your site. If you've just launched a new tool or published a new guide, enter the URL into the search bar at the top of GSC. It will tell you if the page is currently indexed. If not, you can click 'Request Indexing' to force Google's bots to visit your site immediately.
              </p>
              <p>
                This tool also provides a 'Live Test' feature. It renders your page as a bot would see it, checking for mobile usability and technical errors. This is the highest fidelity way to verify your 'Zero Padding' standard. If the bot sees errors or blocked scripts, your discovery potential is compromised. Use this tool every time you update a major node on your site.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Efficiency Hack:</p>
                <p className="text-sm">Don't wait for Google to crawl you. Request indexing for your top 5 pages every time you make a significant update to improve discovery velocity.</p>
              </div>
            </section>

            <section id="health" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Monitoring Site Health & Errors
              </h2>
              <p>
                GSC acts as an early warning system for your site. The 'Indexing' report shows you if any pages are failing due to 404 errors, server timeouts, or 'NoIndex' tags. A healthy discovery node should have zero critical errors. If errors persist, search engines will deprioritize your site in the rankings, assuming it is low-quality or broken.
              </p>
              <p>
                The 'Core Web Vitals' report measures your site's speed and stability on real user devices. In 2026, a 'Poor' score in LCP (Largest Contentful Paint) or CLS (Cumulative Layout Shift) is a ranking death sentence. Use this data to identify which pages need performance optimization. Absolute discovery requires a zero-latency, error-free experience for every visitor.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Mastering Google Search Console is the key to data-driven growth. By setting up proper verification, analyzing performance nodes, utilizing the inspection tool, and monitoring site health, you turn discovery into a technical discipline. Don't leave your ranking to chance; use GSC to see exactly how your site is performing and where it needs recalibration. Your visibility is a reflection of your data fidelity. Stay active in your command center and keep building the future of the web.
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
             <Link href="/guide/how-to-create-sitemap">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-make-website-mobile-friendly">
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
