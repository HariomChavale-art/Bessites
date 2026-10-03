
"use client"

import { Navigation } from "@/components/navigation";
import { FileText, ShieldAlert } from "lucide-react";

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
                By using http://Bessites.store you agree to be bound by these terms. If you do not agree, please do not use our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2 italic">2. Use of Our Tools</h2>
              <p>
                Our discovery tools are free to use for finding web resources. You must not misuse our services, attempt to hack our systems, or use the site to harm others.
              </p>
            </section>

            <section className="bg-primary/5 p-6 rounded-2xl border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <ShieldAlert className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 italic flex items-center gap-2">
                3. AI Content & Misuse Policy
              </h2>
              <p className="text-white/80 font-medium">
                Users are strictly prohibited from using any AI tools found on this site to create illegal, obscene, or misleading fake content, including deepfakes and non-consensual imagery. This policy is in place to comply with Google’s terms and global digital safety rules. Violators will be blocked from the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2 italic">4. Third-Party Websites</h2>
              <p>
                We provide links to other websites for your convenience. We do not own or control these sites and are not responsible for their content, privacy policies, or actions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2 italic">5. Disclaimer</h2>
              <p>
                All tools and information are provided "as is" without any warranty. We are not liable for any damages, losses, or issues that may arise from your use of this website.
              </p>
            </section>

            <section className="pt-6 border-t border-white/5">
              <p className="text-sm font-medium">
                For questions, contact: <br />
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
            © 2026 http://Bessites.store | Absolute Discovery
          </p>
        </div>
      </footer>
    </div>
  );
}
