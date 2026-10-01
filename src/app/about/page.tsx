
"use client"

import { Navigation } from "@/components/navigation";
import { Info, Target, Users, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24 space-y-16">
        <section className="text-center space-y-6">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight">
            The <span className="text-primary">Discovery</span> Manifesto
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Bessites is not just another directory. It is a high-fidelity engine dedicated to the 1% of the web that actually matters.
          </p>
        </section>

        <section className="bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[3rem] space-y-10">
          <div className="space-y-8 text-muted-foreground leading-relaxed text-lg">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Sparkles className="text-primary w-6 h-6" /> Why Bessites Exists
              </h2>
              <p>
                In an era dominated by algorithmic echo chambers and SEO-bloated search results, finding truly unique, high-quality digital tools has become an exhausting chore. We founded <strong>Bessites</strong> to serve as a professional filter for the modern web. Our mission is to bridge the gap between obscure excellence and the creators, developers, and enthusiasts who need it most. 
              </p>
              <p>
                We believe in the "Absolute Discovery" philosophy: a commitment to zero duplication and zero padding. Every website, app, and resource in our registry is hand-vetted for its contribution to the digital landscape. Whether it's a revolutionary AI coding assistant or a minimalist procedural driving simulator, we ensure that what you find here is functional, beautiful, and original.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Globe className="text-primary w-6 h-6" /> The Most Diverse Registry
              </h2>
              <p>
                What sets Bessites apart is the sheer breadth of our scope. We maintain a meticulously organized 100-node registry spanning 10 broad sectors including AI & Technology, Design, Music Theory, Quantitative Finance, and even niche hobbies like Ant Keeping or Scale Modeling. This isn't just a list of links; it's a map of human ingenuity.
              </p>
              <p>
                Our team monitors thousands of data points daily to synchronize our feed with the fastest-moving sectors of the internet. By focusing on "niche" high-impact tools, we provide a discovery pipeline that helps you stay ahead of the curve, giving you the resources to build, create, and explore with professional-grade efficiency.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Zap className="text-primary w-6 h-6" /> Curated for Quality
              </h2>
              <p>
                Every entry on Bessites undergoes a rigorous verification process. We analyze performance, UI/UX consistency, and core utility. If a tool doesn't provide genuine value or simply replicates an existing standard without improvement, it doesn't make it to our "Verified Node Asset" list. This high barrier to entry ensures that our community can trust every click, knowing they are accessing the premier versions of the modern web.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl h-fit">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Zero Padding</h3>
                <p className="text-muted-foreground text-sm">We value your time. No filler content, no redundant tools—only the absolute essentials for your discovery journey.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl h-fit">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Community Driven</h3>
                <p className="text-muted-foreground text-sm">Our insights and interaction ledgers are fueled by a global network of professional creators and tech visionaries.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-white uppercase tracking-widest">A Trusted Discovery Node Since 2024</span>
          </div>
        </section>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            <a href="/about" className="hover:text-primary transition-colors">About Us</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          <p className="text-xs text-muted-foreground opacity-50 mb-4">
            Official Support: <a href="mailto:bessitesofficial@gmail.com" className="text-white hover:text-primary transition-colors">bessitesofficial@gmail.com</a>
          </p>
          <p className="text-sm text-muted-foreground opacity-50">
            © 2024 Bessites Studio. Absolute Discovery.
          </p>
        </div>
      </footer>
    </div>
  );
}
