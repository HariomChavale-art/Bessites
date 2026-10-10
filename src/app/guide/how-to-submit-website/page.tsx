import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Info, HelpCircle, Globe } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Submit Your Website - Step by Step Guide | Bessites",
  description: "Learn the official process for adding your digital property to the Bessites registry. Ensure your website meets our professional quality standards.",
  keywords: ["submit website", "website directory", "Bessites manual", "website listing", "digital asset registry"],
};

export default function SubmitWebsiteGuide() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Link href="/guide" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Manual Hub
        </Link>

        <article className="space-y-16">
          <header className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 01: Basics</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Submit Your Website - <span className="text-primary">Complete Manual</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Starting a new website is a monumental step, but making it visible to a professional audience is where most creators struggle. In an era of automated scrapers and low-value content, your project needs a high-fidelity distribution channel. This guide explains how to properly register your website in the Bessites.store registry to ensure absolute discovery and long-term momentum.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#authentication" className="hover:text-primary">1. Account Authentication</a></li>
              <li><a href="#technical-prep" className="hover:text-primary">2. Technical Preparation</a></li>
              <li><a href="#submission-steps" className="hover:text-primary">3. Step-by-Step Submission</a></li>
              <li><a href="#moderation" className="hover:text-primary">4. Moderation Standards</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="authentication" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Account Authentication
              </h2>
              <p>
                Before you can list an asset, you must prove your identity as a verified curator. Our registration node uses secure industry-standard protocols to protect your creator data. Every account on Bessites is more than just a login; it is your gateway to the Creator Studio and Interaction Ledger.
              </p>
              <p>
                To begin, navigate to the login node and select 'Sign Up' if you are a new builder. We recommend using a professional email that matches your domain if possible, though it is not mandatory. Once authenticated, you can customize your curator profile with a high-resolution avatar to build trust within the community.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Complete your 'Interest Profile' immediately after signing up. This helps our AI assistant, Ouneo, understand what kind of tools you build and recommend them to relevant users.</p>
              </div>
            </section>

            <section id="technical-prep" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> Technical Preparation
              </h2>
              <p>
                Bessites operates on a strict 'Zero Padding' policy. This means we only index websites that provide immediate functional value. Before submitting, ensure your website is fully reachable and your SSL certificate is correctly configured. A website that triggers browser security warnings will be rejected by our automated pre-check node.
              </p>
              <p>
                You will also need a high-resolution logo (brand mark). We recommend an aspect ratio of 1:1 for the best visual appearance in our interlocking card system. If your logo is too complex, try a simplified version that remains legible at smaller sizes. Clear visual identification is the first step to achieving high click-through rates (CTR) within the registry.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Verify that your landing page loads in under 3 seconds globally.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Prepare a 1-sentence 'Value Proposition' that explains what your tool does.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Ensure your metadata titles are descriptive and keyword-rich.</span></li>
              </ul>
            </section>

            <section id="submission-steps" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Step-by-Step Submission
              </h2>
              <p>
                The actual submission process is designed for high velocity. Once you are in the 'Submit Project' interface, follow these steps with technical precision:
              </p>
              <p>
                Step 1: Enter your primary URL. Our system will perform a real-time reachability check.
                Step 2: Upload your brand mark. This asset is stored on our secure Supabase node for high-speed delivery.
                Step 3: Select your primary interest category from our 100-node taxonomy. This choice is critical for organic discovery.
                Step 4: Add descriptive tags. These are used by Ouneo AI to surface your site during conversational searches.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Don't use generic names. If your site is 'Figma Plugins', don't just call it 'Figma'. Give it a unique brand name to stand out in the search node.</p>
              </div>
            </section>

            <section id="moderation" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Moderation Standards
              </h2>
              <p>
                Every submission enters a review queue. Our human curators examine your site for quality, utility, and safety. We reject sites that are purely for SEO manipulation, contain excessive 'padding' (ads/filler), or represent duplicate services.
              </p>
              <p>
                The average review time is 24-48 hours. You can monitor your status in the 'My Websites' tab. Once approved, your project is officially indexed in the Bessites.store registry and becomes available for absolute discovery. You can then launch ad-boost campaigns or track real-time audience interaction via your personal dashboard.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Registering your project on Bessites is more than just getting a backlink; it is about joining an ecosystem of high-velocity creators. By providing a clean, functional, and well-documented submission, you position your brand for maximum visibility and community trust. Stay intentional with your metadata, prioritize your brand mark, and let our discovery pipeline handle the rest.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Is there a fee for standard submission?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">No, standard registry submissions are completely free. We prioritize the quality of the web above all else. Premium featured placements are available via the Wallet system for instant reach.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">How do I update my URL after approval?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Currently, once a node is verified, you must contact our support node to change the URL. This prevents broken links and ensures our Interaction Ledger remains accurate.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">What happens if my site is rejected?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">If a project fails moderation, we provide a high-level reason (e.g., 'Excessive Padding'). You can recalibrate your site and resubmit after 7 days once the issues are resolved.</p>
                </div>
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Manual Hub
                </Button>
             </Link>
             <Link href="/guide/how-to-get-free-traffic">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white text-[9px] font-black uppercase italic shadow-xl">
                   Next Guide <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          </footer>
        </article>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Is there a fee for standard submission?", "acceptedAnswer": { "@type": "Answer", "text": "No, standard registry submissions are completely free." } },
              { "@type": "Question", "name": "How do I update my URL after approval?", "acceptedAnswer": { "@type": "Answer", "text": "Contact our support node to change the URL once verified." } },
              { "@type": "Question", "name": "What happens if my site is rejected?", "acceptedAnswer": { "@type": "Answer", "text": "You can recalibrate and resubmit after 7 days." } }
            ]
          })
        }}
      />
    </div>
  );
}
