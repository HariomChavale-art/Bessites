
"use client"

import { Navigation } from "@/components/navigation";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <div className="bg-white/[0.02] border border-white/5 p-8 sm:p-16 rounded-[3rem] space-y-12">
          <header className="space-y-4 border-b border-white/5 pb-8">
            <div className="bg-primary/10 w-16 h-16 flex items-center justify-center rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic leading-tight">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-muted-foreground font-medium">Effective Date: June 2024</p>
          </header>

          <div className="prose prose-invert prose-primary max-w-none space-y-8 text-muted-foreground leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>By accessing or using Bessites.store ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Description of Service</h2>
              <p>Bessites is a curated directory and community platform for discovering web applications, tools, and digital resources. We provide information and community insights about third-party websites.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. User Conduct</h2>
              <p>You agree to use the Service only for lawful purposes. You are prohibited from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submitting fraudulent, misleading, or malicious content.</li>
                <li>Attempting to interfere with the security or operation of the site.</li>
                <li>Scraping or extracting data from the Service without permission.</li>
                <li>Posting offensive, harassing, or illegal material in community reviews.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. User Submissions</h2>
              <p>When you submit a website or post a review, you grant Bessites a non-exclusive, royalty-free, perpetual license to use, display, and distribute that content on our platform. You represent that you have the right to share any information you submit.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Intellectual Property</h2>
              <p>All brand names, logos, and content created by Bessites are the property of Bessites. Third-party logos and names displayed in our directory remain the property of their respective owners and are used here for informational and identification purposes only.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Disclaimer of Warranties</h2>
              <p>The Service is provided "as is" and "as available." We do not warrant the accuracy, completeness, or reliability of any information in our directory. Your use of third-party websites linked from Bessites is at your own risk.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Limitation of Liability</h2>
              <p>In no event shall Bessites be liable for any indirect, incidental, or consequential damages arising out of your use of the Service or the websites listed herein.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Your continued use of the Service after changes are posted constitutes your acceptance of the new terms.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">9. Contact</h2>
              <p>For any questions regarding these terms, please contact us at: <br />
              <span className="text-white font-bold">legal@bessites.store</span></p>
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
            © 2024 Bessites. Usage Terms.
          </p>
        </div>
      </footer>
    </div>
  );
}
