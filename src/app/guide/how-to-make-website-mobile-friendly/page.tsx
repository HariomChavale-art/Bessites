import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Smartphone, Layout, Zap } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Friendly Optimization Guide - Step by Step | Bessites",
  description: "Master the mobile-first web. Learn how to optimize your site for touch interactions, responsive layouts, and zero-latency mobile discovery.",
  keywords: ["mobile friendly website guide", "responsive design tips 2026", "mobile SEO best practices", "Bessites manual", "mobile user experience"],
};

export default function MobileFriendlyGuide() {
  const faqData = [
    { q: "What is 'Mobile-First Indexing'?", a: "It is a standard where Google primarily uses the mobile version of your website for indexing and ranking. If your mobile node is poor or lacks content found on the desktop version, your overall discovery potential will be significantly reduced." },
    { q: "How small should my touch targets be?", a: "The minimum recommended size for touch targets (buttons/links) is 48x48 pixels. They should also have at least 8 pixels of spacing between them to prevent accidental clicks. This 'Interaction Fidelity' is a key metric for mobile usability." },
    { q: "Does page speed matter more on mobile?", a: "Yes. Mobile users often have slower or less stable connections. A 'Zero Padding' technical setup that minimizes payload size and prioritizes critical rendering is essential for retaining mobile visitors and ranking higher." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 15: Interaction UX</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Make Your Website <span className="text-primary">Mobile Friendly</span> - 2026 Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              In 2026, over 70% of digital discovery happens on mobile devices. If your website is not optimized for a small-screen experience, you are effectively ignoring the vast majority of your potential audience. Mobile-friendliness is not just about 'shrinking' your site; it is about rethinkng your 'Interaction Nodes' for touch-based navigation and vertical scrolling. Search engines now use mobile-first indexing as a mandatory standard. This manual provides a technical blueprint to achieve a zero-latency, high-fidelity mobile experience for your digital property.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#responsive" className="hover:text-primary">1. Responsive Layout Nodes</a></li>
              <li><a href="#touch" className="hover:text-primary">2. Touch Interaction Targets</a></li>
              <li><a href="#assets" className="hover:text-primary">3. Mobile Asset Optimization</a></li>
              <li><a href="#testing" className="hover:text-primary">4. Testing for Mobile Fidelity</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="responsive" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Responsive Layout Nodes
              </h2>
              <p>
                The foundation of mobile-friendliness is a responsive grid. We recommend using Tailwind CSS or CSS Grid to build layouts that automatically recalibrate based on screen width. Use 'Breakpoints' to shift from multi-column desktop views to single-column mobile views. This ensures your content remains readable without the user needing to zoom or scroll horizontally—a major 'Padding' signal that search bots penalize.
              </p>
              <p>
                Prioritize vertical hierarchy. On a small screen, the most important discovery node (your H1 and main CTA) should be visible 'Above the Fold' without any scrolling. Use fluid typography (rem/em units) rather than fixed pixel sizes to ensure your brand marks and descriptions scale gracefully across different mobile resolutions. Consistency is the primary driver of trust in the discovery pipeline.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Never use fixed-width elements (e.g., `width: 800px`). Always use percentage-based widths or `max-width` to ensure your components never overflow the mobile viewport node.</p>
              </div>
            </section>

            <section id="touch" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Touch Interaction Targets
              </h2>
              <p>
                Mobile users don't have a precise cursor; they have thumbs. Your buttons and links must be large enough to be easily tapped. The standard technical requirement is 48x48 pixels for all touch targets. If your links are too close together, users will experience 'Fat Finger' errors, leading to frustration and a high bounce rate. This interaction failure is a negative quality signal for both users and search nodes.
              </p>
              <p>
                Implement 'Active' and 'Focus' states for your touch elements. When a user taps a button, they should receive immediate visual feedback (like a subtle color shift or scale effect). This 'Interaction Fidelity' builds a sense of speed and reliability. For Bessites creators, ensuring your 'Visit' and 'Save' buttons work perfectly on mobile is the fastest way to improve your community engagement metrics.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Maintain a minimum touch target size of 48px to pass mobile usability audits.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Avoid placing links too close to the edges of the screen where they are hard to reach.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use large, clear fonts (at least 16px) for all primary body text on mobile.</span></li>
              </ul>
            </section>

            <section id="assets" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Mobile Asset Optimization
              </h2>
              <p>
                Mobile connections are often less stable than desktop nodes. To maintain a zero-latency experience, you must optimize your assets for mobile delivery. Use modern image formats like WebP and serve 'Responsive Images' using the `srcset` attribute. This allows the browser to download a smaller version of your brand mark for mobile users, saving bandwidth and improving load speed.
              </p>
              <p>
                Minify your CSS and JavaScript payloads. Every extra kilobyte of code is 'Padding' that delays the discovery of your site. Use a Content Delivery Network (CDN) to serve your assets from the edge node closest to the user. Fast loading builds immediate trust and is one of the most powerful ranking signals for mobile search results. A fast mobile site is a discovered mobile site.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Performance Goal:</p>
                <p className="text-sm">Aim for a 'Largest Contentful Paint' (LCP) of under 2.5 seconds on a standard mobile connection to satisfy Google's quality standard.</p>
              </div>
            </section>

            <section id="testing" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Testing for Mobile Fidelity
              </h2>
              <p>
                Don't guess; test. Use tools like the 'Google Mobile-Friendly Test' or Chrome DevTools (using the device toggle) to see how your site performs on different screen sizes. Look for 'Layout Shifts' where elements move around during loading—this is a major technical error called CLS that search engines penalize. Your mobile node must be as stable as your desktop node.
              </p>
              <p>
                We also recommend manual testing on real devices. Borrow different phones to see if your navigation menu is easy to open and if your forms are easy to fill out on a small screen. If your site is hard to use, users will leave, and your 'Interaction Ledger' will suffer. Continuous testing and recalibration are the only ways to achieve absolute discovery in the mobile-first era.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Mobile-friendliness is a mandatory requirement for digital discovery in 2026. By focusing on responsive layout nodes, high-fidelity touch interactions, asset optimization, and continuous testing, you create an environment where mobile users can find and use your tools with ease. Remember: absolute discovery happens where the users are, and today, they are on their phones. Build for the small screen, optimize for utility, and let your digital property shine across all devices.
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
             <Link href="/guide/how-to-use-search-console">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/best-tools-for-new-websites">
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
