'use client';

import Link from "next/link";
import { Logo } from "./logo";

/**
 * Shared Footer component for professional trust and brand consistency.
 */
export function Footer() {
  return (
    <footer className="mt-auto w-full py-12 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-zinc-500">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <a href="mailto:bessitesofficial@gmail.com" className="hover:text-white transition-colors">Contact</a>
          <a href="https://www.instagram.com/bessites_official" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="https://x.com/Bessites" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 italic">Built by Bessites</p>
          <p className="text-[11px] text-zinc-600">© 2024 Bessites Studio</p>
        </div>
      </div>
    </footer>
  );
}
