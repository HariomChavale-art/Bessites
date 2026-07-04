'use client';

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-2xl overflow-hidden group">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 transition-transform group-hover:scale-110 duration-500"
        >
          {/* Bold Official 'B' Logo */}
          <path
            d="M30 20H55C70 20 80 30 80 42.5C80 50 75 55 65 57.5C75 60 85 67.5 85 80C85 92.5 75 100 60 100H30V20Z"
            fill="white"
          />
          <rect x="30" y="20" width="12" height="80" fill="white" />
          <path d="M42 45H55C60 45 65 42 65 37.5C65 33 60 30 55 30H42V45Z" fill="hsl(var(--primary))" />
          <path d="M42 90H60C65 90 70 87 70 80C70 73 65 70 60 70H42V90Z" fill="hsl(var(--primary))" />
        </svg>
      </div>
      {showText && (
        <span className="text-xl font-black text-white tracking-tighter uppercase italic">
          Bessites
        </span>
      )}
    </div>
  );
}
