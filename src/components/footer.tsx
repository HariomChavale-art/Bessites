'use client';

import Link from "next/link";

/**
 * Shared footer. Links match the real page routes.
 */
export function Footer() {
  const linkClass =
    "text-base text-[#A981FF] transition-colors hover:text-[#F5F0FA] focus:outline-none focus-visible:text-[#F5F0FA]";

  return (
    <footer className="mt-auto w-full border-t border-[#381149] px-6 py-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
        >
          <Link href="/about" className={linkClass}>About</Link>
          <Link href="/terms" className={linkClass}>Terms</Link>
          <Link href="/privacy-policy" className={linkClass}>Privacy</Link>
          <Link href="/contact" className={linkClass}>Contact</Link>
          <a
            href="https://www.instagram.com/bessites_official"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Instagram
          </a>
          <a
            href="https://x.com/Bessites"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            X
          </a>
        </nav>

        <p className="text-sm text-[#A981FF]/70">
          &copy; {new Date().getFullYear()} Bessites
        </p>
      </div>
    </footer>
  );
}
