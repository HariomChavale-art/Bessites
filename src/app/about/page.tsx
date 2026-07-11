
"use client"

import { Navigation } from "@/components/navigation";
import { Info, Target, Users, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24 space-y-16">
        <section className="text-center space-y-6">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Our <span className="text-primary">Mission</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Bessites is a premier discovery engine dedicated to uncovering the internet's most useful hidden gems.
          </p>
        </section>

        <section className="bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[3rem] space-y-8">
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              In an era of algorithmic noise and crowded search results, finding truly useful, high-quality web tools has become a challenge. <strong>Bessites</strong> was born out of a simple necessity: to create a clean, curated space where innovation meets utility. We don't just list websites; we curate modern webs that provide genuine value to creators, developers, and everyday users.
            </p>
            <p>
              Our platform serves as a professional directory for the "niche" and the "hidden." From AI-driven productivity boosters and independent ethical stores to specialized educational resources and experimental web art, Bessites bridges the gap between obscure excellence and the people who need it.
            </p>
            <p>
              Every entry in our directory is vetted for its unique contribution to the digital landscape. We prioritize tools that offer <strong>zero duplication</strong> and <strong>zero padding</strong>, ensuring that your discovery journey is efficient and inspiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl h-fit">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Curated discovery</h3>
                <p className="text-muted-foreground text-sm">We manually select tools that push the boundaries of what the web can do.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl h-fit">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Community Driven</h3>
                <p className="text-muted-foreground text-sm">Our insights and ratings come from a community of tech enthusiasts and creators.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-white uppercase tracking-widest">A Trusted Resource Since 2024</span>
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
          <p className="text-sm text-muted-foreground opacity-50">
            © 2024 Bessites. Built for the modern web.
          </p>
        </div>
      </footer>
    </div>
  );
}
