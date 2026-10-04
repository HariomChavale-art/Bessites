"use client"

import { Navigation } from "@/components/navigation";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <div className="bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[2rem] shadow-2xl">
          <header className="space-y-2 border-b border-white/5 pb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">
              Privacy Policy for http://Bessites.store
            </h1>
            <p className="text-muted-foreground font-bold text-sm">Effective Date: May 2026</p>
          </header>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-base">
            <section>
              <h2 className="text-xl font-bold text-white mb-2 italic">1. Data Collection</h2>
              <p>
                Bessites.store is a public discovery directory. We DO NOT require users to create an account or log in to browse the registry. We DO NOT collect personal information such as your name, email address, or payment details unless you voluntarily contact us via our support channels.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-2 italic">2. Log Data and Cookies</h2>
              <p>
                We collect standard Log Data (IP address, browser type, and time spent on pages) for security and performance analysis. We use cookies to enhance your experience. These are small data files stored on your device that help us understand how you use our site.
              </p>
            </section>

            <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <h2 className="text-xl font-bold text-white mb-2 italic">3. Google AdSense & Third-Party Vendors</h2>
              <p className="mb-4">
                We use Google AdSense to serve advertisements on our site. Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to Bessites or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.
              </p>
              <p className="mb-4">
                Users may opt out of personalized advertising by visiting:
              </p>
              <a href="https://ad.google.com/home" className="text-primary font-black underline italic" target="_blank" rel="noopener noreferrer">
                Opt-out of Personalized Google Ads
              </a>
            </section>

            <section className="border-l-4 border-primary pl-4">
              <h2 className="text-xl font-bold text-white mb-2 italic">4. AI Tools Disclaimer & User Responsibility</h2>
              <p>
                Bessites provides links to various AI resources. Users are strictly prohibited from using any information or tools found on this site to create illegal fake images, videos, deepfakes, or non-consensual content. Misuse of listed tools for creating misleading or harmful content is a violation of our terms and global digital safety standards.
              </p>
            </section>

            <section className="pt-6 border-t border-white/5">
              <h2 className="text-xl font-bold text-white mb-2 italic">5. Contact Information</h2>
              <p>
                If you have any questions regarding this Privacy Policy, please contact our support node at: <br />
                <span className="text-white font-black italic">contact@ouneo.com</span>
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
            © 2026 Bessites.store | Powered by Ouneo
          </p>
        </div>
      </footer>
    </div>
  );
}
