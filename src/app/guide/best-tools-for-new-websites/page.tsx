import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Box, Hammer } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Tools for New Websites - Resource Manual | Bessites",
  description: "Build a high-fidelity tech stack. Discover the best free and professional tools for hosting, design, and growth in 2026 with zero padding.",
  keywords: ["best tools for websites", "web development resources", "free hosting tools", "Bessites manual", "website building stack"],
};

export default function BestToolsGuide() {
  const faqData = [
    { q: "Is it better to use all-in-one platforms or specialized tools?", a: "For high-fidelity results, specialized tools are usually superior. An all-in-one platform often includes 'Padding'—features you don't need that slow down your site. Using best-in-class nodes like Vercel for hosting and Supabase for data ensures a modular, high-performance architecture." },
    { q: "Are these tools suitable for complete beginners?", a: "Yes. Most modern web tools have moved toward intuitive, dashboard-driven interfaces. While some have a technical floor, our manual focuses on resources that prioritize ease of discovery and rapid deployment for creators at any skill level." }
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
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 16: Resources</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              Best Tools for <span className="text-primary">New Websites</span> - Resource Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Choosing the right tools is the difference between building a high-velocity digital asset and a bloated, slow-loading node. In 2026, the 'Zero Padding' standard is what separates successful creators from the noise. You don't need a thousand features; you need five high-fidelity tools that work together perfectly.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#infrastructure" className="hover:text-primary">1. High-Fidelity Infrastructure</a></li>
              <li><a href="#visual-stack" className="hover:text-primary">2. The Visual Design Stack</a></li>
              <li><a href="#data-auth" className="hover:text-primary">3. Data & Authentication Nodes</a></li>
              <li><a href="#faq" className="hover:text-primary">4. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="infrastructure" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> High-Fidelity Infrastructure
              </h2>
              <p>
                Your infrastructure is the foundation of your website. For new projects in 2026, we recommend a serverless approach that prioritizes speed and global distribution. Vercel and Netlify are the industry standards for hosting modern frontend frameworks like Next.js or Astro. These platforms handle everything from SSL certification to CDN edge delivery automatically.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Use Cloudflare for your DNS node. It provides the fastest propagation speeds in the world and includes a robust security layer that filters out bot traffic before it even reaches your host.</p>
              </div>
            </section>

            <section id="visual-stack" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> The Visual Design Stack
              </h2>
              <p>
                Visual fidelity is how you build immediate trust with your audience. For design, Figma remains the undisputed leader. It allows you to create high-fidelity mockups and design systems that translate directly into code. For creators who aren't professional designers, tools like Canva or Aceternity UI provide 'Zero Padding' templates and components.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use Picular for keyword-based color discovery and branding inspiration.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Optimize every brand mark with Squoosh.app before uploading to your site.</span></li>
              </ul>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-make-website-mobile-friendly">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-grow-from-zero">
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