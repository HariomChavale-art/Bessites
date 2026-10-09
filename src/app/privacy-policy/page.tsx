import { Navigation } from "@/components/navigation";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Bessites",
  description: "Bessites Privacy Policy. Learn how we collect, use, and protect your data within our discovery registry.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <div className="bg-[#121117] border border-white/5 p-8 sm:p-16 rounded-[3.5rem] shadow-2xl space-y-12">
          <header className="space-y-4 border-b border-white/5 pb-8">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic">
              Privacy Policy
            </h1>
            <p className="text-primary font-bold text-sm uppercase tracking-widest italic">Last Updated: October 8, 2026</p>
          </header>

          <div className="space-y-12 text-zinc-300 leading-relaxed text-lg font-medium italic">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">1. Introduction</h2>
              <p>
                Welcome to Bessites (bessites.store). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website and use our discovery services.
              </p>
              <p>
                By accessing Bessites, you consent to the data practices described in this policy. We prioritize transparency and ensure that your experience within our "Zero Padding" environment remains secure and professional.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">2. Information We Collect</h2>
              <p>
                We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, or when you participate in activities on the site (such as submitting a website to our registry).
              </p>
              <p>
                This information may include your name, email address, profile picture, and the URLs of the digital properties you submit. We also automatically collect certain information when you visit, such as your IP address, browser characteristics, and interaction patterns within our discovery node.
              </p>
            </section>

            <section className="space-y-4 bg-primary/5 p-8 rounded-3xl border border-primary/20">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">3. Cookies and Tracking (AdSense)</h2>
              <p>
                Bessites uses cookies and similar tracking technologies to access or store information. We use Google AdSense to serve advertisements on our site. Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to our site or other websites.
              </p>
              <p>
                Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet. You may opt out of personalized advertising by visiting Ads Settings or aboutads.info.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">4. Third-Party Services</h2>
              <p>
                We utilize high-fidelity third-party services to power the Bessites experience, including Firebase (Authentication and Firestore), Google Analytics, and Vercel. These services may collect and process data in accordance with their own privacy policies. We encourage you to review their policies to understand how they handle your information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">5. Data Protection</h2>
              <p>
                We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
              </p>
              <p>
                Your Interaction Ledger and Wallet data are protected via industry-standard encryption protocols. We never sell your personal data to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">6. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights under applicable data protection laws. These may include the right to request access to and obtain a copy of your personal information, to request rectification or erasure, or to restrict the processing of your personal information.
              </p>
            </section>

            <section className="pt-8 border-t border-white/5 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-40">Contact Our Privacy Node</p>
              <p className="text-white font-bold italic">support@bessites.store</p>
            </section>
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
