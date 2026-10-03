
"use client"

import { Navigation } from "@/components/navigation";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <div className="bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[2rem] space-y-8">
          <header className="space-y-2 border-b border-white/5 pb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">
              Privacy Policy for http://Bessites.store
            </h1>
            <p className="text-muted-foreground font-bold text-sm">Effective Date: May 2026</p>
          </header>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-base">
            <section>
              <h2 className="text-xl font-bold text-white mb-2">1. Data Collection</h2>
              <p>
                Bessites.store is a public discovery directory. We DO NOT require users to create an account or log in. We DO NOT collect personal information such as your name, email address, or payment details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2">2. Log Data and Cookies</h2>
              <p>
                We collect standard Log Data (IP address and browser type) for security and performance. We use cookies to enhance your experience. Third-party vendors, including Google, use cookies to serve ads based on your visits to this or other websites.
              </p>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h2 className="text-xl font-bold text-white mb-2">3. Google AdSense & DART Cookies</h2>
              <p className="mb-4">
                Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site. You may opt out of personalized advertising by visiting the link below:
              </p>
              <a href="https://ad.google.com/home" className="text-primary font-bold underline" target="_blank" rel="noopener noreferrer">
                Opt-out of Personalized Ads
              </a>
            </section>

            <section className="border-l-4 border-primary pl-4">
              <h2 className="text-xl font-bold text-white mb-2">4. AI Tools Disclaimer</h2>
              <p>
                Bessites provides links to various AI resources. Users are strictly prohibited from using information found on this site to create illegal fake images, videos, or deepfakes. Misuse for creating misleading or harmful content is a violation of our terms.
              </p>
            </section>

            <section className="pt-6 border-t border-white/5">
              <h2 className="text-xl font-bold text-white mb-2">5. Contact</h2>
              <p>
                If you have questions, contact us at: <br />
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
            © 2026 Bessites.store | Absolute Discovery
          </p>
        </div>
      </footer>
    </div>
  );
}
