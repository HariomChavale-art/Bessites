import { Navigation } from "@/components/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ | Bessites Absolute Discovery",
  description: "Frequently Asked Questions about Bessites discovery engine, website submissions, and creator tools.",
};

const FAQS = [
  { q: "What is Bessites?", a: "Bessites is a professional directory for modern webs and digital tools. We focus on 'Zero Padding' curation, meaning we only list functional, high-quality resources." },
  { q: "Is it free to add a website?", a: "Yes, standard submissions are completely free. We also offer a premium wallet-based promotion system for creators looking for instant reach." },
  { q: "How long does review take?", a: "Most websites are reviewed within 24-48 hours. Our curators verify every URL for safety, quality, and relevance." },
  { q: "Can I edit my submission?", a: "Currently, you can manage your submissions from your Profile Hub. If you need to change a live URL, contact our support node." },
  { q: "What is the Wallet used for?", a: "The Wallet allows you to launch ad campaigns and featured placements within the discovery feed and trending charts." },
  { q: "Do you use tracking cookies?", a: "We use standard analytics and AdSense cookies to improve your experience. See our Privacy Policy for full details." },
  { q: "How do I report a listing?", a: "Every listing has a detail page where you can contact support. You can also email us directly at support@bessites.store." },
  { q: "Is registration required?", a: "Registration is required to submit projects and track analytics, but anyone can browse the public registry without an account." },
  { q: "What are 'Interest Nodes'?", a: "Nodes are our categorization system. We track 100 specific interests across 10 broad sectors like AI, Gaming, and Design." },
  { q: "Can I delete my account?", a: "Yes, account deletion requests can be sent via our contact page. This will purge all your submission and profile data." },
  { q: "How are trending sites ranked?", a: "Trending rank is calculated based on our Interaction Ledger—counting visits, likes, and shares within the last 24 hours." },
  { q: "Does Bessites build tools?", a: "Yes, we build internal 'Zero Padding' tools like Ouneo (our AI assistant) and various utility nodes for our users." },
  { q: "Are the tools on Bessites safe?", a: "We manually review every link, but we are not responsible for the content of third-party sites. Always exercise standard web safety." },
  { q: "How do I contact the team?", a: "Visit our Contact page or email us directly. We reply within 24-48 hours." },
  { q: "Where is Bessites based?", a: "Bessites is built and maintained by a high-velocity team operating out of India." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-16 sm:py-24 space-y-16">
        <header className="text-center space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Discovery <span className="text-primary">FAQ</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic opacity-60">
            Answers to our most frequent queries.
          </p>
        </header>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQS.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-white/5 bg-white/[0.02] px-8 py-2 rounded-[2rem] shadow-xl">
              <AccordionTrigger className="text-white font-bold italic hover:no-underline uppercase text-sm tracking-widest text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400 italic text-base leading-relaxed pt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
