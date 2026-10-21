'use client';

import Link from "next/link";
import { Logo } from "./logo";
import { ShieldCheck, Globe, Zap, Mail, Book, Terminal } from "lucide-react";

/**
 * @fileOverview Unified Site Footer.
 * Centralized navigation for all public discovery assets and legal documentation.
 */
export function Footer() {
  return (
    <footer className="bg-[#121117]/80 backdrop-blur-xl border-t border-white/5 py-20 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Logo className="text-3xl" />
            <p className="text-sm text-muted-foreground italic font-medium leading-relaxed">
              Bessites is the premier directory for the top 1% of the modern web. We provide a zero-padding discovery experience for high-velocity creators and builders.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary italic">
              <ShieldCheck className="w-4 h-4" /> 
              <span>Registry Verified 2026</span>
            </div>
          </div>

          {/* Discovery Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Registry Access</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/explore">Explore Websites</FooterLink>
              <FooterLink href="/guide">User Manual Hub</FooterLink>
              <FooterLink href="/toolkit">Creator Toolkits</FooterLink>
              <FooterLink href="/trends">Industry Trends</FooterLink>
              <FooterLink href="/benchmarks">Interaction Benchmarks</FooterLink>
            </nav>
          </div>

          {/* Intelligence Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Intelligence Hub</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/about">Our Origin Story</FooterLink>
              <FooterLink href="/how-it-works">Platform Flow</FooterLink>
              <FooterLink href="/methodology">The Manifesto</FooterLink>
              <FooterLink href="/glossary">Web Lexicon</FooterLink>
              <FooterLink href="/faq">Common FAQ</FooterLink>
            </nav>
          </div>

          {/* Legal/Support Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Terminal Support</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/contact">Open a Ticket</FooterLink>
              <FooterLink href="/privacy-policy">Privacy Protocol</FooterLink>
              <FooterLink href="/terms">Usage Terms</FooterLink>
              <FooterLink href="/disclaimer">Legal Disclaimer</FooterLink>
              <div className="pt-6 border-t border-white/5 space-y-2">
                <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">Global Support System</p>
                <a href="mailto:bessitesofficial@gmail.com" className="text-sm font-bold text-white hover:text-primary transition-colors italic">bessitesofficial@gmail.com</a>
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-[0.4em]">
              © 2024 BESSITES STUDIO / ABSOLUTE DISCOVERY
            </p>
          </div>
          <div className="flex items-center gap-8 opacity-20 grayscale hover:grayscale-0 transition-all">
            <Globe className="w-4 h-4 text-white" />
            <Zap className="w-4 h-4 text-white" />
            <Terminal className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-sm font-bold text-muted-foreground hover:text-white transition-all italic hover:translate-x-1 inline-block"
    >
      {children}
    </Link>
  );
}
