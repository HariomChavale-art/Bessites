"use client"

import { Navigation } from "@/components/navigation";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <div className="bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[2rem] space-y-8 shadow-2xl">
          <header className="space-y-4 border-b border-white/5 pb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">
              About Us
            </h1>
            <p className="text-primary font-bold text-lg">Welcome to http://Bessites.store!</p>
          </header>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              Bessites is a simple, high-fidelity platform where we find and list the best free online tools on the internet. In a digital landscape cluttered with duplicate content and low-value fillers, we offer a "Zero Padding" experience. From cutting-edge AI tools and video downloaders to professional image editors and design resources—we test hundreds of websites so you don't have to waste time.
            </p>

            <p>
              Our primary goal is to help you find the right tool for your specific work in seconds. We hand-pick every tool listed in our 100-node interest registry, ensuring that every link provides genuine value to our users. Beyond curation, we also develop our own useful web utilities to further empower our community of digital builders, designers, and creators.
            </p>

            <p>
              We started Bessites because we believed the internet should be more useful and less confusing. By organizing the world's best web resources into 10 broad sectors—including AI & Tech, Design, Coding, and Productivity—we provide a seamless discovery pipeline that evolves as fast as the web itself.
            </p>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center italic">
              <p className="text-white font-medium">
                Have a suggestion for a tool or looking for a partnership? Contact us at <br />
                <span className="text-primary font-black not-italic">contact@ouneo.com</span>
              </p>
            </div>

            <p className="text-center pt-4">
              Thank you for trusting Bessites as your discovery partner!
            </p>
          </div>

          <footer className="pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-muted-foreground opacity-50 font-bold uppercase tracking-widest">
              © 2026 http://Bessites.store
            </p>
          </footer>
        </div>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <a href="/about" className="hover:text-primary transition-colors">About Us</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          <p className="text-xs text-muted-foreground opacity-50 font-bold uppercase tracking-widest">
            Official Support: contact@ouneo.com
          </p>
        </div>
      </footer>
    </div>
  );
}
