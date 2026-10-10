import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, PenTool, Search } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Write SEO Titles - Step by Step Guide | Bessites",
  description: "Learn how to engineer high-CTR metadata titles for 2026. Master the art of balancing keyword optimization with human curiosity for absolute discovery.",
  keywords: ["SEO title guide", "CTR optimization", "meta title tips", "Bessites manual", "writing for search"],
};

export default function SeoTitleGuide() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Link href="/guide" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Manual Hub
        </Link>

        <article className="space-y-16">
          <header className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 06: Discovery Hooks</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Write <span className="text-primary">SEO Titles</span> - 2026 Masterclass
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              The metadata title is the first interaction node a user encounters in the discovery pipeline. In 2026, where AI-generated content has saturated search results, a generic title is a death sentence for your click-through rate (CTR). You are not just writing for a robot; you are writing to trigger a human decision in under 0.5 seconds. This manual provides a technical blueprint to engineer titles that satisfy both the search node's ranking logic and the user's immediate intent.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#psychology" className="hover:text-primary">1. Psychology of the Click</a></li>
              <li><a href="#technical" className="hover:text-primary">2. Technical Length & Structure</a></li>
              <li><a href="#keywords" className="hover:text-primary">3. High-Fidelity Keyword Placement</a></li>
              <li><a href="#hooks" className="hover:text-primary">4. Using Visual & Bracketing Hooks</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="psychology" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> The Psychology of the Click
              </h2>
              <p>
                Every search query represents a real-world problem or desire. The user is scanning a list of results, looking for the most high-fidelity solution with the least amount of effort. Your title must communicate immediate utility and zero padding. To do this, you must understand the 'Problem-Solution' node. A user doesn't want 'A list of tools'; they want '7 tools to save me 3 hours'. By framing your title around a specific, measurable result, you bridge the gap between their intent and your content.
              </p>
              <p>
                Intent comes in four primary flavors: Informational, Navigational, Commercial, and Transactional. For a discovery engine like Bessites.store, most users are in the 'Commercial' or 'Transactional' phase—they want a specific tool to perform a specific action. Your SEO title must mirror this by using strong action verbs like 'Generate', 'Build', 'Discover', or 'Optimize'. Avoid passive language. A passive title is a low-velocity node that will be ignored in the fast-paced search grid of 2026.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Use emotional triggers like 'Proven', 'Tested', or 'Elite'. In a sea of AI-generated noise, humans crave 'Verified' authority. This is why Bessites.store prioritizes verified assets in its internal discovery logic.</p>
              </div>
            </section>

            <section id="technical" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Technical Length & Pixel Limits
              </h2>
              <p>
                Search engines like Google don't actually count characters; they measure pixels. The standard limit is approximately 600 pixels, which translates to roughly 55-60 characters. If your title exceeds this, it will be truncated with an ellipsis (...), which breaks the discovery hook and signals poor quality to the user. A truncated title is 'Padding'—it's data that is there but provides no value. Your goal is 'Zero Padding' in your metadata.
              </p>
              <p>
                Keep your most important information—the primary keyword and the value prop—within the first 40 characters. This ensures that even on small mobile screens, the user sees the core benefit of clicking. If your title is 'How to Make a Website Faster - A Step by Step Guide for 2026', the 'Make a Website Faster' part must be visible at all times. Use your brand name at the end of the title, separated by a pipe (|) or dash (-), to build long-term authority without sacrificing immediate CTR.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Aim for 50-58 characters for the highest compatibility across all devices.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use Title Case (Capitalizing Each Word) for better visual hierarchy and readability.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Avoid ALL CAPS, as it is often flagged as spam by modern discovery algorithms.</span></li>
              </ul>
            </section>

            <section id="keywords" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> High-Fidelity Keyword Placement
              </h2>
              <p>
                The 'Front-Loading' technique involves placing your primary keyword as close to the beginning of the title as possible. This is the highest fidelity signal you can send to a search node. When a user searches for 'SEO Titles' and your title starts with 'SEO Titles: How to...', there is an instant cognitive match. This relevance node is the primary driver of both ranking and CTR.
              </p>
              <p>
                However, avoid 'Keyword Stuffing'. A title like 'SEO Titles, Meta Titles, SEO Headers, Write Titles' is a low-value entry that will be penalized. In 2026, semantic discovery is more important than raw keyword matching. Use one primary keyword and one natural modifier. For example, if your primary keyword is 'Backlinks', your modifier could be 'Free' or '2026 Strategy'. This creates a balanced title that appeals to the algorithm's logic and the human's desire for specific, fresh information.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Example:</p>
                <p className="text-sm">Bad: 'Tutorial for writing titles for your website.'<br />Good: 'How to Write SEO Titles: High-CTR Masterclass (2026)'</p>
              </div>
            </section>

            <section id="hooks" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Using Visual & Bracketing Hooks
              </h2>
              <p>
                Visual hooks like brackets [], parentheses (), or numbers are the 'Secret Sauce' of high-CTR titles. Data from millions of search results shows that titles with these elements get up to 38% more clicks. Why? Because they break the visual monotony of the search page. Brackets allow you to add a 'Bonus' or 'Qualifier' that makes your link look more high-fidelity than the competition.
              </p>
              <p>
                Use numbers to quantify the value, e.g., '7 Steps' or '99% Success Rate'. Numbers provide a cognitive shortcut that suggests the content is structured and easy to consume. Use brackets to specify the format or a current year, e.g., '[Guide]' or '(New for 2026)'. This signals to the user that they are clicking on a fresh, relevant node in the registry. Absolute discovery is about being the most obvious choice in the grid, and these hooks are your primary tools to achieve that.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Writing SEO titles is an iterative process of refinement. It is the bridge between your high-value content and a potential user. By focusing on the psychology of intent, maintaining technical pixel limits, front-loading high-fidelity keywords, and using visual hooks, you create a discovery node that is impossible to ignore. Remember: in 2026, the best title is the one that promises a 'Zero Padding' solution and delivers it instantly. Use the tools provided in this manual to audit your current titles and start driving higher traffic to your digital properties today.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Should I include my brand name in every SEO title?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Yes, but always at the end. Your primary focus should be the keyword and the value hook. Including 'Bessites' at the end of your titles builds brand authority over time as you appear more frequently in relevant search nodes.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Does using numbers in a title really help with rankings?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Numbers don't directly change your ranking, but they significantly improve your CTR. Since Google uses CTR as a high-fidelity quality signal, a higher click rate will eventually lead to higher rankings in the discovery grid.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Is it better to use a pipe (|) or a dash (-) to separate brand names?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Technically, there is no difference in the eyes of the search node. However, many designers prefer the pipe (|) as it is visually cleaner and takes up fewer pixels, allowing more room for your primary discovery hook.</p>
                </div>
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-get-first-100-visitors">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-share-website-on-pinterest">
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
              { "@type": "Question", "name": "Should I include my brand name in titles?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, but place it at the end to keep the primary hook visible." } },
              { "@type": "Question", "name": "Do numbers help rankings?", "acceptedAnswer": { "@type": "Answer", "text": "They improve CTR, which is a high-fidelity ranking signal." } },
              { "@type": "Question", "name": "Pipe or dash for separators?", "acceptedAnswer": { "@type": "Answer", "text": "The pipe symbol (|) is often preferred for saving pixel space." } }
            ]
          })
        }}
      />
    </div>
  );
}
