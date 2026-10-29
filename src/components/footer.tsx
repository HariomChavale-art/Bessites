'use client';

import Link from "next/link";
import { Logo } from "./logo";
import { ShieldCheck, Globe, Zap, Mail, Book, Terminal } from "lucide-react";

/**
 * Footer - Simplified headers and link text.
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
              Bessites is the best place to find modern websites and digital tools. We pick the best sites so you can find what you need fast.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary italic">
              <ShieldCheck className="w-4 h-4" /> 
              <span>Verified Sites 2026</span>
            </div>
          </div>

          {/* Discovery Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Find Websites</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/explore">Explore List</FooterLink>
              <FooterLink href="/guide">How-To Guides</FooterLink>
              <FooterLink href="/toolkit">Tool Kits</FooterLink>
              <FooterLink href="/trends">New Trends</FooterLink>
              <FooterLink href="/benchmarks">Quality Standards</FooterLink>
            </nav>
          </div>

          {/* Intelligence Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Information</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/about">Our Story</FooterLink>
              <FooterLink href="/how-it-works">How It Works</FooterLink>
              <FooterLink href="/methodology">Our Standards</FooterLink>
              <FooterLink href="/glossary">Dictionary</FooterLink>
              <FooterLink href="/faq">Common Questions</FooterLink>
            </nav>
          </div>

          {/* Legal/Support Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Support</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/contact">Send a Message</FooterLink>
              <FooterLink href="/privacy-policy">Privacy Rules</FooterLink>
              <FooterLink href="/terms">Terms of Use</FooterLink>
              <FooterLink href="/disclaimer">Legal Rules</FooterLink>
              <div className="pt-6 border-t border-white/5 space-y-2">
                <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">Global Support</p>
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
              © 2024 BESSITES STUDIO / FIND THE BEST
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
