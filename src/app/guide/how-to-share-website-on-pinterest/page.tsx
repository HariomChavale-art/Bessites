import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Share2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pinterest Distribution Guide - Step by Step | Bessites",
  description: "Unlock evergreen traffic with Pinterest. Learn how to create high-fidelity pins, optimize for visual search, and build a permanent discovery node.",
  keywords: ["pinterest marketing", "website traffic guide", "visual search SEO", "Bessites manual", "get visitors from pinterest"],
};

export default function PinterestGuide() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Link href="/guide" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Manual Hub
        </Link>

        <article className="space-y-16">
          <header className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 07: Visual Discovery</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              Pinterest <span className="text-primary">Distribution</span> - Evergreen Traffic Guide
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Pinterest is frequently misunderstood as a simple social network, but in 2026, it operates as a high-fidelity visual search engine. Unlike Instagram or Twitter, where content has a lifespan of hours, a 'Pin' on Pinterest is a permanent discovery node that can drive traffic to your website for years. It is 'Zero Padding' marketing: you create an asset once, and it continues to provide value indefinitely. This manual explains how to integrate Pinterest into your distribution pipeline to achieve sustainable, long-term growth.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#visual-logic" className="hover:text-primary">1. Pinterest Visual Search Logic</a></li>
              <li><a href="#pin-creation" className="hover:text-primary">2. Creating High-Fidelity Pins</a></li>
              <li><a href="#keywords" className="hover:text-primary">3. Optimizing for the Search Node</a></li>
              <li><a href="#automation" className="hover:text-primary">4. Building a Continuous Pipeline</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="visual-logic" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Pinterest Visual Search Logic
              </h2>
              <p>
                To succeed on Pinterest, you must stop thinking about 'likes' and start thinking about 'relevance'. Pinterest's algorithm uses computer vision to analyze your images and match them with user intent. When a user searches for 'Web Design Ideas', the algorithm scans millions of pins to find the highest-fidelity visual match. This is why high-resolution, clear imagery is a mandatory technical requirement. A blurry or low-quality pin is a broken node that will never be indexed in the main search results.
              </p>
              <p>
                Pinterest users are planners. They are in the early stages of the discovery pipeline, looking for inspiration and tools for their next project. By positioning your website as a 'Solution' or 'Inspiration Source' within this visual grid, you capture users before they even reach traditional search engines like Google. This 'Pre-Search' discovery is incredibly powerful for new websites that lack domain authority but have high-quality visual assets or brand marks.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Pinterest is 100% intent-driven. Use a 'Business Account' to access the Pinterest Analytics node, which tells you exactly what your audience is searching for. Use this data to recalibrate your pin strategy monthly.</p>
              </div>
            </section>

            <section id="pin-creation" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Creating High-Fidelity Pins
              </h2>
              <p>
                The vertical aspect ratio is the primary constraint of the Pinterest grid. Always use a 2:3 ratio (e.g., 1000 x 1500 pixels). Square or horizontal images take up less space and have a significantly lower CTR. Your pin should have a clear 'Hook'—a text overlay that tells the user exactly what they will get if they click. For example, if you are promoting a tool from the Bessites registry, your text could be 'The Best 7 AI Tools for 2026'.
              </p>
              <p>
                Color contrast is your ally. Use your brand colors, but ensure the text is readable over the background. Use high-quality photography or clean vector illustrations (like those found on Storyset). Every pin must include your brand logo in a consistent corner to build recognition. Remember: a pin is a gateway to your URL. If the visual doesn't promise a high-fidelity experience, the user will never leave the Pinterest node to visit your site.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use large, bold fonts for text overlays to ensure readability on mobile devices.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Create 3-5 unique pins for every 1 article or tool to target different aesthetic segments.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use 'Idea Pins' to provide short video tutorials or walkthroughs of your digital properties.</span></li>
              </ul>
            </section>

            <section id="keywords" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Optimizing for the Search Node
              </h2>
              <p>
                Metadata is the bridge between your image and the search query. Your pin title and description must be keyword-rich but natural. Don't just list keywords; tell a story. Instead of 'AI tools, tech, software', write 'Discover the most powerful AI tools of 2026 for developers and creative teams.' This descriptive approach helps Pinterest's semantic engine categorize your pin correctly.
              </p>
              <p>
                Alt-text is a critical technical requirement for accessibility and SEO. Describe the image in detail, including your primary keywords. This provides the algorithm with a secondary data node to verify the content of your pin. Use hashtags sparingly (2-3 per pin) and focus on specific interests found in the Bessites taxonomy. Proper categorization ensures your pins appear in the 'Related Pins' section of high-authority assets, triggering a secondary wave of discovery.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Example:</p>
                <p className="text-sm">Title: '7 Free Coding Tools for 2026'<br />Description: 'Master your frontend workflow with these verified tools. Perfect for React and Next.js developers seeking zero-padding resources.'</p>
              </div>
            </section>

            <section id="automation" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Building a Continuous Pipeline
              </h2>
              <p>
                Consistency is the primary driver of Pinterest authority. The algorithm favors accounts that pin daily. However, manual pinning is a low-velocity task. We recommend using tools like Tailwind or Canva's scheduler to automate your publication pipeline. Schedule 3-5 pins per day, distributed throughout high-traffic periods. This ensures your pins are constantly feeding the discovery node.
              </p>
              <p>
                Monitor your 'Outbound Clicks' metric. This is the most high-fidelity data point on Pinterest, as it represents a user successfully moving from the visual search node to your website. If a pin has high impressions but low clicks, your 'Hook' or 'Call to Action' needs recalibration. Experiment with different colors, fonts, and value propositions. Continuous iteration is the hallmark of a professional creator in the absolute discovery ecosystem.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Pinterest is a powerful, evergreen distribution node that rewards quality and consistency. By understanding the visual search logic, creating high-fidelity vertical pins, optimizing your metadata, and building an automated publication pipeline, you create a permanent stream of high-intent traffic for your website. Unlike other social nodes, Pinterest's value compounds over time. Start today, stay intentional, and watch your digital properties achieve absolute discovery within the visual grid.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">How long does it take for a new pin to start driving traffic?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Pinterest is a long-term node. While some pins can go viral in days, most take 30-90 days to gain significant search authority and start delivering consistent, daily visitors to your URL.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Do I need to follow other users on Pinterest to get discovered?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">No. Unlike Instagram, your 'Follower' count is not a primary ranking signal on Pinterest. Discovery is driven by search relevance and visual fidelity. Focus on creating great pins rather than social engagement.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Can I pin the same URL multiple times with different images?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Yes, and you should. This is a core strategy for maximizing reach. Create distinct visuals (e.g., one with a photo, one with an illustration, one with just text) for the same page to capture different user segments.</p>
                </div>
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-write-seo-title">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-use-bessites">
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
            "mainEntity": [
              { "@type": "Question", "name": "How long for Pinterest traffic to start?", "acceptedAnswer": { "@type": "Answer", "text": "Expect 30-90 days for pins to gain full search authority." } },
              { "@type": "Question", "name": "Are followers important on Pinterest?", "acceptedAnswer": { "@type": "Answer", "text": "No, search relevance and visual quality are the primary discovery drivers." } },
              { "@type": "Question", "name": "Can I use multiple pins for one URL?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, creating multiple distinct visuals is a recommended strategy." } }
            ]
          })
        }}
      />
    </div>
  );
}
