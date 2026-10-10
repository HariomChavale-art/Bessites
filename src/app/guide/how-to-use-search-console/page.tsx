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
    { q: "How long does it take for data to show up in GSC?", a: "New properties usually take 24-48 hours to start displaying performance data. After the initial period, data is updated daily with a lag of approximately 1-2 days." }
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
              Google Search Console (GSC) is the definitive data command center for any digital property. Without it, you are flying blind in the discovery pipeline. It provides a direct view of how Google's algorithms see your website—including which keywords bring traffic, which pages are failing to index, and how your core vitals are performing.
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
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="setup" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Setup & Verification Infrastructure
              </h2>
              <p>
                Before you can access your data, you must authenticate your domain. GSC offers several verification methods, but DNS verification is the high-fidelity standard. It proves ownership at the network level and covers all subdomains.
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
                The Performance report is the heart of GSC. It shows four critical metrics: Total Clicks, Total Impressions, Average CTR, and Average Position. Clicks are users who successfully reached your site. Impressions are how often your link appeared in a search node.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Filter performance by 'Page' to identify your highest-value discovery nodes.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Monitor 'Query' data to see exactly what users are typing to find you.</span></li>
              </ul>
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
    </div>
  );
}