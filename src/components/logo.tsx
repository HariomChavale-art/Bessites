'use client';

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showText && (
        <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
          Bessites
        </span>
      )}
    </div>
  );
}
