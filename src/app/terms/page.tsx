"use client"

import { Navigation } from "@/components/navigation";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <div className="bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[2rem] space-y-8 shadow-2xl">
          <header className="space-y-2 border-b border-white/5 pb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">
              Terms of Service for http://Bessites.store
            </h1>
            <p className="text-muted-foreground font-bold text-sm">Effective Date: May 2026</p>
          </header>

          <div className="space-y-8 text-muted-foreground leading-relaxed text-base">
            <section>
              <h2 className="text-xl font-bold text-white mb-2 italic">1. Acceptance of Terms</h2>
              <p>
                By accessing and using http://Bessites.store, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or tools.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2 italic">2. Use of Our Tools</h2>
              <p>
                Our discovery tools and AI search engine (Ouneo) are free to use for finding web resources. You must not misuse our services, attempt to disrupt our systems, or use the site to facilitate any harmful activity.
              </p>
            </section>

            <section className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
              <h2 className="text-xl font-bold text-white mb-2 italic">3. AI Content & Misuse Policy</h2>
              <p>
                Users are strictly prohibited from using any AI tools found on this site to create illegal, obscene, or misleading fake content, including deepfakes and non-consensual imagery. This policy is strictly enforced to comply with Google’s Terms of Service and global digital safety regulations. Violators will be blocked from accessing the site permanently.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2 italic">4. Third-Party Websites</h2>
              <p>
                We provide curated links to other websites for your convenience. We do not own, control, or take responsibility for the content, privacy policies, or actions of any third-party websites linked within our registry.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2 italic">5. Disclaimer</h2>
              <p>
                All tools and information are provided "as is" without any warranty of any kind. Bessites is not liable for any damages, losses, or data issues that may arise from your use of this website or the tools listed herein.
              </p>
            </section>

            <section className="pt-6 border-t border-white/5">
              <p className="text-sm font-medium">
                For questions regarding these terms, contact our support node: <br />
                <span className="text-white font-black italic">bessitesofficial@gmail.com</span>
              </p>
            </section>
          </div>
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
            © 2026 http://Bessites.store | Powered by Bessites
          </p>
        </div>
      </footer>
    </div>
  );
}
