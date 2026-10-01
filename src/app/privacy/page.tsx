
"use client"

import { Navigation } from "@/components/navigation";
import { Shield, Cookie, Users, Lock, Eye, CheckCircle2 } from "lucide-react";

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
              Privacy <span className="text-primary">Master Ledger</span>
            </h1>
            <p className="text-muted-foreground font-medium">Last Synchronized: February 2024 | Version 1.2</p>
          </header>

          <div className="prose prose-invert prose-primary max-w-none space-y-10 text-muted-foreground leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Eye className="w-5 h-5 text-primary" /> 1. Data Integrity and Scope
              </h2>
              <p>Welcome to Bessites.store (the "Service"). We are committed to maintaining the highest standards of data privacy and transparency. This policy outlines how we collect, process, and safeguard your information when you interact with our discovery engine. By using our Service, you consent to the data practices described in this ledger.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Cookie className="w-5 h-5 text-primary" /> 2. Google AdSense and Third-Party Vendors
              </h2>
              <p>Bessites uses <strong>Google AdSense</strong> and other third-party vendors to serve advertisements. These vendors, including Google, use cookies to serve ads based on a user's prior visits to Bessites or other websites.</p>
              <ul className="list-disc pl-6 space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                <li><strong>DART Cookies:</strong> Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
                <li><strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary underline" target="_blank">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" className="text-primary underline" target="_blank">www.aboutads.info</a>.</li>
                <li><strong>Third-Party Vendor Disclosures:</strong> We may also display ads from other third-party ad networks. You can visit those vendor websites to opt out of the use of cookies for personalized advertising if the vendor or ad network offers this capability.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" /> 3. Information We Collect
              </h2>
              <p>We collect information to provide a better, more personalized discovery experience. This includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Identifiers:</strong> Name, email address, and profile photography when you create a curator account.</li>
                <li><strong>Usage Data:</strong> We log interactions such as tool saves, appreciations, and clicks to build your personalized discovery feed.</li>
                <li><strong>Technical Data:</strong> IP addresses, browser types, and device information collected automatically through logs and cookies.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" /> 4. Data Sharing and Transparency
              </h2>
              <p>Bessites <strong>does not sell your personal data</strong>. We only share information with trusted service providers who assist in operating our site, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" /> 5. Security Measures
              </h2>
              <p>We implement a variety of security measures to maintain the safety of your personal information. Your data is housed behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems. All sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.</p>
            </section>

            <section className="space-y-4 border-t border-white/5 pt-8">
              <h2 className="text-2xl font-bold text-white">6. Contact Our Privacy Node</h2>
              <p>For any questions regarding this Master Ledger, please reach out directly to our privacy officer at:</p>
              <p className="text-xl font-bold text-white">bessitesofficial@gmail.com</p>
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
            © 2024 Bessites Studio. Professional Discovery Hub.
          </p>
        </div>
      </footer>
    </div>
  );
}
