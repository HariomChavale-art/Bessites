import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Make Your Website Faster - Step by Step Guide | Bessites",
  description: "Optimizing website performance for 2026. Learn about Core Web Vitals, image compression, and CDN distribution for a zero-latency experience.",
  keywords: ["website speed optimization", "fast loading website", "Core Web Vitals guide", "Bessites manual", "performance optimization"],
};

export default function FastWebsiteGuide() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Link href="/guide" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Manual Hub
        </Link>

        <article className="space-y-16">
          <header className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 04: Performance</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Make Your Website <span className="text-primary">Faster</span> - 2026 Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              In 2026, speed is not just a feature; it is a fundamental requirement for discovery. Users expect a zero-latency experience, and search algorithms like Google's prioritize Core Web Vitals as a primary ranking node. A slow website is a hidden website. This manual provides technical strategies to optimize your loading pipeline, from image compression to globally distributed delivery.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#vitals" className="hover:text-primary">1. Understanding Core Web Vitals</a></li>
              <li><a href="#assets" className="hover:text-primary">2. Asset & Image Optimization</a></li>
              <li><a href="#delivery" className="hover:text-primary">3. CDN & Edge Delivery</a></li>
              <li><a href="#code-efficiency" className="hover:text-primary">4. Code Splitting & Caching</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="vitals" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Mastering Core Web Vitals
              </h2>
              <p>
                Core Web Vitals are a set of specific factors that Google considers important in a webpage's overall user experience. They consist of three specific page speed and user interaction measurements: Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS). Understanding these nodes is critical for any professional builder.
              </p>
              <p>
                LCP measures how long it takes for the main content to load. Aim for 2.5 seconds or faster. CLS measures visual stability; if your elements jump around as the page loads, your score will drop. FID (now being superseded by INP) measures responsiveness. You can test your scores using Chrome DevTools or PageSpeed Insights.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Use the 'Performance' tab in Chrome to record a load profile. Look for long-running scripts and large render-blocking assets that are slowing down your LCP.</p>
              </div>
            </section>

            <section id="assets" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Asset & Image Optimization
              </h2>
              <p>
                Images are the heaviest part of most modern websites. To maintain high fidelity without high latency, you must use modern image formats like WebP or AVIF. These formats provide superior compression compared to JPEG or PNG, often reducing file size by 50-80% with no visible loss in quality.
              </p>
              <p>
                Always specify image dimensions (width and height) to prevent Cumulative Layout Shift. Use 'lazy loading' for images below the fold so they only download when the user scrolls to them. This preserves the 'Initial Load' bandwidth for critical assets like your logo and hero section.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use tools like Squoosh.app to compress brand marks manually.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Implement SVG for icons and simple graphics to ensure zero-pixelation.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Remove unnecessary metadata from image files using automated scripts.</span></li>
              </ul>
            </section>

            <section id="delivery" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> CDN & Edge Delivery
              </h2>
              <p>
                Distance is the enemy of speed. A Content Delivery Network (CDN) stores copies of your website on servers located all around the world. When a user visits your site, they are served the data from the node closest to them, significantly reducing the 'Time to First Byte' (TTFB).
              </p>
              <p>
                For high-velocity platforms like Bessites.store, we recommend using Cloudflare or Vercel Edge. These services provide global distribution with zero manual configuration. They also handle critical security tasks like DDoS protection and SSL termination at the edge, ensuring your site is both fast and secure globally.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Enable 'Auto Minify' for CSS and JS in your CDN settings. This removes unnecessary whitespace and comments, reducing the total payload size automatically.</p>
              </div>
            </section>

            <section id="code-efficiency" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Code Splitting & Caching
              </h2>
              <p>
                Modern frameworks like Next.js handle code-splitting automatically, ensuring that users only download the JavaScript necessary for the current page. However, you must be careful with third-party libraries. A single heavy library can bloat your bundle size and destroy your performance score.
              </p>
              <p>
                Implement aggressive caching strategies. Set 'Cache-Control' headers for static assets so they are stored in the user's browser. This makes subsequent visits to your site nearly instantaneous, as the browser doesn't need to re-fetch the logo, fonts, or primary CSS files.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Speed is the ultimate user experience metric. By mastering Core Web Vitals, optimizing your assets, and utilizing global delivery networks, you create a zero-latency environment that delights users and satisfies search algorithms. A fast website builds trust and increases retention within the discovery pipeline. Keep your node light, keep your assets optimized, and build the fastest version of the web.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">What is the ideal load time for a website?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Aim for under 2 seconds for a complete page load on mobile connections. Your 'Largest Contentful Paint' (LCP) should occur in under 2.5 seconds to pass Google's quality node.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Do I need a paid CDN to be fast?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">No, free tiers from Cloudflare or Vercel provide exceptional global delivery for most sites. Paid tiers are usually only necessary for enterprise-scale traffic or advanced security needs.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">How do fonts affect website speed?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Custom web fonts can be heavy. Use 'font-display: swap' to show a fallback font while your custom font loads, ensuring your content is readable immediately without delay.</p>
                </div>
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-submit-to-google">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-get-first-100-visitors">
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
