'use client';

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

/**
 * Brand Logo component updated to use unified text branding.
 * Features BESS (white) ITES (primary) with Poppins Black Italic styling.
 */
export function Logo({ className, showText = true }: LogoProps) {
  return (
    <span className={cn("font-headline font-black text-white tracking-tighter uppercase italic selection:bg-primary selection:text-white leading-none", className)}>
      BESS<span className="text-primary">ITES</span>
    </span>
  );
}
