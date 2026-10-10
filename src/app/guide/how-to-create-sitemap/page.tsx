import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Search, FileText, Database } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Create a Sitemap - Step by Step Guide | Bessites",
  description: "Master the technical blueprint of your website. Learn how to generate, optimize, and submit XML sitemaps for zero-padding indexing in 2026.",
  keywords: ["create xml sitemap", "sitemap generator guide", "website indexing tips", "Bessites manual", "sitemap best practices"],
};

export default function CreateSitemapGuide() {
  const faqData = [
    { q: "What is the difference between an XML and HTML sitemap?", a: "XML sitemaps are technical files designed for search engine bots to crawl and index your site's structure. HTML sitemaps are user-facing pages that help human visitors navigate your content." },
    { q: "Should I include every single page in my sitemap?", a: "No. You should only include 'canonical' URLs that provide value. Exclude duplicate pages, login screens, and search results." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 13: Technical SEO</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Create a <span className="text-primary">Sitemap</span> - Technical Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              A sitemap is the technical map of your digital architecture. Without it, search engines are forced to guess which pages on your site are important.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#what-is-sitemap" className="hover:text-primary">1. What is an XML Sitemap?</a></li>
              <li><a href="#generation" className="hover:text-primary">2. Generating a High-Fidelity Sitemap</a></li>
              <li><a href="#faq" className="hover:text-primary">3. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="what-is-sitemap" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> What is an XML Sitemap?
              </h2>
              <p>
                Think of an XML sitemap as a technical curriculum vitae for your website. It is a simple file that lists every important URL on your site.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Never use multiple sitemaps unless you have over 50,000 URLs. For most modern webs, a single, clean `sitemap.xml` file is the best configuration.</p>
              </div>
            </section>

            <section id="generation" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Generating a High-Fidelity Sitemap
              </h2>
              <p>
                You don't need to write a sitemap manually. Most modern frameworks like Next.js have built-in nodes to generate them automatically.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use dynamic generation to ensure new pages are indexed within 24 hours.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-increase-website-ranking">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-use-search-console">
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