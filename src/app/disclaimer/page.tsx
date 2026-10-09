import { Navigation } from "@/components/navigation";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | Bessites",
  description: "Bessites legal disclaimer regarding third-party links, information accuracy, and general usage.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <div className="bg-[#121117] border border-white/5 p-8 sm:p-16 rounded-[3.5rem] shadow-2xl space-y-12">
          <header className="space-y-4 border-b border-white/5 pb-8">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic">
              Legal <span className="text-primary">Disclaimer</span>
            </h1>
          </header>

          <div className="space-y-8 text-zinc-300 leading-relaxed text-lg font-medium italic">
            <p>
              The information provided by Bessites ("we," "us," or "our") on https://bessites.store (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
            </p>

            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight pt-4">External Links Disclaimer</h2>
            <p>
              The Site contains links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
            </p>

            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight pt-4">Professional Disclaimer</h2>
            <p>
              The Site cannot and does not contain professional advice. The information is provided for general discovery and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. The use or reliance of any information contained on the Site is solely at your own risk.
            </p>

            <p>
              We prioritize "Zero Padding" and "Absolute Discovery," but the nature of the web means that third-party services can change their terms, pricing, or status at any time. Bessites is not responsible for any issues arising from the use of tools listed within our discovery node.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 italic">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>
          <p className="text-xs text-muted-foreground opacity-20 font-black uppercase tracking-widest">© 2024 Bessites Studio. Powered by Bessites.</p>
        </div>
      </footer>
    </div>
  );
}
