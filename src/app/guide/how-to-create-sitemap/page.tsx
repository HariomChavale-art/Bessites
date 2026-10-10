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
    { q: "What is the difference between an XML and HTML sitemap?", a: "XML sitemaps are technical files designed for search engine bots to crawl and index your site's structure. HTML sitemaps are user-facing pages that help human visitors navigate your content. For ranking purposes, the XML sitemap is a mandatory technical requirement." },
    { q: "Should I include every single page in my sitemap?", a: "No. You should only include 'canonical' URLs that provide value. Exclude duplicate pages, login screens, search results, and 'padding' nodes. A clean sitemap ensures bots spend their 'crawl budget' on your highest-quality assets." },
    { q: "How often should I update my sitemap file?", a: "Your sitemap should be dynamic and update automatically whenever you publish new content or tools. If you are using a framework like Next.js, this can be automated via server-side generation to ensure bots always see your freshest discovery nodes." }
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
              A sitemap is the technical map of your digital architecture. Without it, search engines are forced to guess which pages on your site are important, often leading to missed discovery nodes and poor indexing. In 2026, 'Zero Padding' indexing is the standard. This means providing a clean, prioritized list of your best URLs so that bots can discover your utility instantly. This guide provides step-by-step instructions to generate, optimize, and submit a high-fidelity XML sitemap for your modern website.
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
              <li><a href="#optimization" className="hover:text-primary">3. Optimization & Padding Removal</a></li>
              <li><a href="#submission" className="hover:text-primary">4. Submission to Search Nodes</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="what-is-sitemap" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> What is an XML Sitemap?
              </h2>
              <p>
                Think of an XML sitemap as a technical curriculum vitae for your website. It is a simple file (usually named `sitemap.xml`) that lists every important URL on your site. Bots from Google, Bing, and even Ouneo AI use this file to understand your site's hierarchy and find new content. In the era of absolute discovery, your sitemap is your primary technical communication channel with the search ecosystem.
              </p>
              <p>
                Unlike a regular webpage, a sitemap is formatted in XML (Extensible Markup Language), which is easy for machines to parse. It includes data points like the 'last modified' date and the 'priority' of each URL. This metadata helps bots decide which pages to crawl first and how often to return. A well-structured sitemap ensures that your most valuable tools and guides are indexed in hours, not weeks.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Never use multiple sitemaps unless you have over 50,000 URLs. For most modern webs, a single, clean `sitemap.xml` file is the highest fidelity configuration for rapid indexing.</p>
              </div>
            </section>

            <section id="generation" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Generating a High-Fidelity Sitemap
              </h2>
              <p>
                You don't need to write a sitemap manually. Most modern frameworks like Next.js, WordPress, or Ghost have built-in nodes to generate them automatically. For Next.js developers, we recommend using the `next-sitemap` package or a custom server-side function to ensure your sitemap is dynamic. Every time you submit a new project to the Bessites registry, you should verify that your own site's map reflects that new asset.
              </p>
              <p>
                If you are using a static site, you can use online 'Sitemap Generators'. Enter your primary URL, and the tool will crawl your site to create the XML file for you. Once generated, download the file and upload it to your root directory (e.g., `your-brand.com/sitemap.xml`). This makes it accessible to any bot that visits your domain.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use dynamic generation to ensure new pages are indexed within 24 hours.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Ensure every URL in the sitemap uses the HTTPS protocol for security.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Include the `lastmod` attribute to signal fresh content to the bots.</span></li>
              </ul>
            </section>

            <section id="optimization" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Optimization & Padding Removal
              </h2>
              <p>
                The biggest mistake creators make is including too much data in their sitemap. A sitemap should only contain your 'Searchable Utility'. If you have admin pages, private dashboard nodes, or duplicate search result pages, exclude them. This is 'Padding'—it wastes the crawl budget of search bots and slows down the discovery of your real value.
              </p>
              <p>
                Use the `robots.txt` file in conjunction with your sitemap to block bots from low-value areas. A lean sitemap tells the algorithm: 'These are my best assets, index them now.' This clarity is a high-fidelity signal that search engines reward with faster indexing and better rankings. Absolute discovery requires absolute technical focus.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Example Checklist:</p>
                <p className="text-sm">Exclude: /admin, /login, /search, /tags, and any temporary draft pages. Only include public-facing landing pages and tool nodes.</p>
              </div>
            </section>

            <section id="submission" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Submission to Search Nodes
              </h2>
              <p>
                Once your sitemap is live, you must tell the world about it. The primary node for this is Google Search Console (GSC). Navigate to the 'Sitemaps' section in GSC and enter your sitemap URL. Click 'Submit', and Google will instantly attempt to read the file. If successful, you will see a 'Success' status, and Google will begin processing your URLs for indexing.
              </p>
              <p>
                You should also reference your sitemap in your `robots.txt` file by adding a line at the bottom: `Sitemap: https://your-brand.com/sitemap.xml`. This is a universal signal that any bot from Bing to small niche crawlers can understand. For creators on Bessites, having a valid sitemap is a key technical requirement to ensure your project stays updated in our AI discovery engine.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Creating a sitemap is the first technical step toward absolute discovery. By generating a high-fidelity XML file, optimizing it to remove padding, and submitting it to the primary search nodes, you create a direct pipeline for bots to find your utility. Don't leave your discovery to chance; provide a clear map of your digital architecture and watch your indexing speed increase. A well-mapped site is a reachable site. Build your map, submit it today, and let the internet find your work.
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
