'use client';

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

/**
 * Brand Logo component updated to use text-only branding.
 * Features Poppins Black Italic styling for a premium look.
 */
export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-2xl font-headline font-black text-white tracking-tighter uppercase italic selection:bg-primary selection:text-white">
        BESSITES
      </span>
    </div>
  );
}
