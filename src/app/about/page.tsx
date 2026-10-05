"use client"

import { Navigation } from "@/components/navigation";

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
              Bessites is a simple platform where we find and list the best free online tools on the internet. From AI tools, video downloaders, image editors, to writing and design tools - we test hundreds of websites so you don't have to waste time.
            </p>

            <p>
              Our goal is to help you find the right tool for your work in seconds. We hand-pick every tool and we also build our own useful tools for our users to ensure a "Zero Padding" digital experience.
            </p>

            <p>
              We started Bessites to make the internet more useful and less confusing. By organizing the world's best web resources into curated interest nodes, we provide a seamless discovery pipeline that evolves as fast as the web itself.
            </p>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center italic">
              <p className="text-white font-medium">
                Have a suggestion for a tool? Contact us at <br />
                <span className="text-primary font-black not-italic">bessitesofficial@gmail.com</span>
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
            Official Support: bessitesofficial@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}
