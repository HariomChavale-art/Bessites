'use client';

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

/**
 * Brand Logo component updated to use unified text branding.
 * Features BES (purple-blue / secondary) and SITES (dark purple / primary) 
 * with Poppins Black Italic styling and tracking-tighter attributes.
 */
export function Logo({ className, showText = true }: LogoProps) {
  return (
    <span className={cn("font-headline font-black tracking-tighter uppercase italic selection:bg-primary selection:text-white leading-none", className)}>
      <span className="text-secondary">BES</span><span className="text-primary">SITES</span>
    </span>
  );
}
