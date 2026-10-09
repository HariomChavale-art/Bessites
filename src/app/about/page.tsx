import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Globe, ShieldCheck, Zap, Heart } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Bessites Absolute Discovery",
  description: "Learn more about Bessites, the professional directory for modern webs and digital tools. Zero duplication, zero padding, absolute discovery.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <div className="space-y-16">
          <header className="text-center space-y-6">
            <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
              Our Origin Story
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
              About <span className="text-primary">Bessites</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
              Bessites is a premier digital discovery engine meticulously designed to index the top 1% of the modern web. We operate on a strict "Zero Padding" policy, ensuring that every tool, app, and resource in our registry provides immediate functional value to creators and builders.
            </p>
          </header>

          <section className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white border-l-4 border-primary pl-6">
              Why We Started Bessites
            </h2>
            <div className="space-y-6 text-lg text-zinc-300 leading-relaxed font-medium italic">
              <p>
                The modern internet has a "discovery problem." Despite the millions of websites being launched daily, finding high-quality, specialized tools has become increasingly difficult as search algorithms prioritize large corporations and SEO-heavy content over raw utility. We noticed that many of the internet's most useful resources were being buried under layers of digital "padding"—unnecessary filler content and duplicate listings.
              </p>
              <p>
                We built Bessites to break this cycle. By moving away from automated crawling and focusing on intentional, human-centric curation, we've created a high-fidelity pipeline where the best tools rise to the top. We wanted a place where developers, designers, and entrepreneurs could find exactly what they need in seconds, without having to navigate through low-value search results.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <ShieldCheck className="w-8 h-8" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">For Website Owners</h3>
              </div>
              <p className="text-muted-foreground italic font-medium leading-relaxed">
                Creators can submit their digital properties directly to our global ad-boost pipeline. By leveraging our verified audience, emerging tools can achieve "Absolute Discovery" and build a loyal user base within our professional community.
              </p>
            </Card>

            <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Globe className="w-8 h-8" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">For Visitors</h3>
              </div>
              <p className="text-muted-foreground italic font-medium leading-relaxed">
                Explore a hand-picked registry of 100+ interest nodes. Whether you need an AI tool for video editing or a serverless backend for your next app, Bessites provides a seamless path to the web's most productive corners.
              </p>
            </Card>
          </div>

          <section className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white border-l-4 border-primary pl-6">
              Our Mission
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed font-medium italic">
              Our mission is to empower the next generation of digital creators by providing a "Zero Padding" discovery experience. We believe that the tools you use define the quality of your work, and we are dedicated to ensuring that the highest fidelity resources on the internet are always just a click away. We are building more than a directory; we are building the definitive index of human productivity on the web.
            </p>
          </section>

          <div className="pt-20 border-t border-white/5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              <div><p className="text-3xl font-black italic text-white">100+</p><p className="text-[10px] font-black uppercase tracking-widest text-primary">Interest Nodes</p></div>
              <div><p className="text-3xl font-black italic text-white">250+</p><p className="text-[10px] font-black uppercase tracking-widest text-primary">Verified Tools</p></div>
              <div><p className="text-3xl font-black italic text-white">5k+</p><p className="text-[10px] font-black uppercase tracking-widest text-primary">Daily Views</p></div>
              <div><p className="text-3xl font-black italic text-white">10</p><p className="text-[10px] font-black uppercase tracking-widest text-primary">Broad Sectors</p></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 italic">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>
          <p className="text-xs text-muted-foreground opacity-20 font-black uppercase tracking-widest">© 2024 Bessites Studio. Powered by Bessites.</p>
        </div>
      </footer>
    </div>
  );
}
