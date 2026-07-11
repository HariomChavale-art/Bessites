
"use client"

import { Navigation } from "@/components/navigation";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <div className="bg-white/[0.02] border border-white/5 p-8 sm:p-16 rounded-[3rem] space-y-12">
          <header className="space-y-4 border-b border-white/5 pb-8">
            <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic leading-tight">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground font-medium">Last Updated: June 2024</p>
          </header>

          <div className="prose prose-invert prose-primary max-w-none space-y-8 text-muted-foreground leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
              <p>Welcome to Bessites.store. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
              <p>We collect information that you provide directly to us, such as when you create an account, submit a website, or contact us. This may include your name, email address, and profile information.</p>
              <p>We also automatically collect certain information when you browse our site, including IP addresses, browser types, and usage patterns through cookies and similar technologies.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Google AdSense and Cookies</h2>
              <p>Bessites uses Google AdSense to serve advertisements. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to Bessites and other sites on the Internet.</p>
              <p>Users may opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" className="text-primary underline">Ad Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" className="text-primary underline">www.aboutads.info</a>.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. How We Use Your Information</h2>
              <p>We use the collected data to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our discovery directory.</li>
                <li>Personalize your experience (e.g., interest-based feeds).</li>
                <li>Process submissions and manage community reviews.</li>
                <li>Communicate with you regarding support or updates.</li>
                <li>Analyze website usage to improve our services.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Data Sharing and Third Parties</h2>
              <p>We do not sell your personal data. We may share information with third-party service providers (such as hosting providers, analytics services, and advertising partners) who perform services on our behalf and are obligated to protect your data.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Your Rights</h2>
              <p>Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your information. You can manage your profile settings or contact us directly for data requests.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at: <br />
              <span className="text-white font-bold">privacy@bessites.store</span></p>
            </section>
          </div>
        </div>
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
            © 2024 Bessites. Privacy First.
          </p>
        </div>
      </footer>
    </div>
  );
}
