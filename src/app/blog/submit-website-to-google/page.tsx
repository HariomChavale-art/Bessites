"use client"

import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  Globe, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Search,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

/**
 * @fileOverview Technical guide for website indexing in 2026.
 * SEO Metadata:
 * - Title: How to Submit Your Website to Google in 2026 | Bessites Guide
 * - Description: The definitive guide to indexing your website on Google Search using modern tools, indexing APIs, and Search Console.
 */

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog Hub
        </Link>

        <article className="space-y-16">
          <header className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Masterclass</Badge>
              <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-widest italic">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> May 15, 2026</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 12 Min Read</span>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Submit Your Website to <span className="text-primary">Google</span> in 2026
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              The discovery pipeline has evolved. In 2026, mere submission isn't enough; you need high-fidelity indexing and real-time connectivity to stay visible.
            </p>
          </article>

          <div className="space-y-12 text-zinc-300 leading-relaxed text-lg font-medium">
            <section className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> The New Indexing Landscape
              </h2>
              <p>
                In the modern web ecosystem, traditional crawling has been augmented by high-velocity AI discovery nodes. Google's algorithm now prioritizes websites that provide clear, "Zero Padding" data structures. To get noticed, your submission process must be intentional and technically precise.
              </p>
              <p>
                The first step to appearing in search results is ensuring Google knows your website exists. While Google's bots (Googlebot) are constantly scanning the web, manually notifying them of your new digital property accelerates the process from weeks to hours.
              </p>
            </section>

            <section className="space-y-6 bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[3rem]">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Google Search Console: Your Command Center
              </h2>
              <p>
                Google Search Console (GSC) remains the definitive gateway for indexing. To begin:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span><strong>Verify Ownership:</strong> Use DNS records or an HTML file to prove you control the domain. DNS verification is the gold standard in 2026.</span>
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span><strong>URL Inspection:</strong> Use the inspection tool to check if a specific page is available to Google. This provides real-time feedback on crawlability.</span>
                </li>
              </ul>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Leveraging the Indexing API
              </h2>
              <p>
                For high-velocity websites like job boards, news hubs, or directory sites (similar to Bessites), the standard crawl cycle is too slow. The **Google Indexing API** allows you to push updates to Google immediately.
              </p>
              <div className="bg-black/50 p-6 rounded-2xl font-mono text-xs text-primary/80 border border-primary/10">
                // Example Indexing API Request Header<br />
                POST /v3/urlNotifications:publish<br />
                Host: indexing.googleapis.com<br />
                Content-Type: application/json<br /><br />
                {"{"} "url": "https://your-brand.com/new-page", "type": "URL_UPDATED" {"}"}
              </div>
              <p>
                Implementing this via a server-side hook ensures that every time you publish a new asset, Googlebot is notified within seconds.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> XML Sitemaps & Robots.txt
              </h2>
              <p>
                Your sitemap is the technical map of your digital architecture. In 2026, Google expects clean, segmented sitemaps that prioritize high-value content.
              </p>
              <p>
                Ensure your `robots.txt` file is not accidentally blocking critical assets. A single "Disallow: /" can wipe your entire presence from the search node.
              </p>
            </section>

            <section className="space-y-10 pt-10 border-t border-white/5">
              <div className="flex items-center gap-4">
                <HelpCircle className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Technical FAQ</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <FAQItem 
                  q="How long does it take for Google to index a new site?" 
                  a="With manual submission via GSC, indexing can occur in 24-48 hours. Using the Indexing API can reduce this to less than 4 hours." 
                />
                <FAQItem 
                  q="Is it free to submit my website to Google?" 
                  a="Yes. Google Search Console and indexing are free services. Beware of any node or service asking for payment to 'register' you with Google." 
                />
                <FAQItem 
                  q="Why is my site showing up for my name but not keywords?" 
                  a="This indicates you are indexed but lack 'Authority'. Focus on high-fidelity content and backlinks from verified discovery nodes like Bessites." 
                />
                <FAQItem 
                  q="Does social media help with indexing?" 
                  a="Social signals are not a direct ranking factor, but high traffic from social nodes triggers faster re-crawls by Googlebot." 
                />
                <FAQItem 
                  q="What is 'Zero Padding' indexing?" 
                  a="It's a content standard where you strip away fluff and low-value pages from your sitemap, ensuring Googlebot only spends its 'crawl budget' on your best assets." 
                />
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 text-center space-y-6">
            <h3 className="text-2xl font-black italic uppercase text-white">Ready for Absolute Discovery?</h3>
            <p className="text-muted-foreground max-w-lg mx-auto italic">
              Once your site is indexed, submit it to the Bessites Registry to reach our global community of creators.
            </p>
            <Link href="/submit">
              <button className="h-16 px-12 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest italic shadow-2xl glow-primary transition-all hover:scale-105 active:scale-95">
                SUBMIT TO REGISTRY <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  return (
    <Card className="bg-white/[0.02] border-white/5 p-6 rounded-3xl space-y-2">
      <h4 className="text-lg font-bold text-white italic">Q: {q}</h4>
      <p className="text-sm text-zinc-400 font-medium leading-relaxed">{a}</p>
    </Card>
  );
}
