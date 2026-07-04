'use client';

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#18151F] to-[#0A0A0B] border border-white/10 shadow-2xl overflow-hidden group">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 transition-transform group-hover:scale-110 duration-500"
        >
          {/* Main distinctive shape */}
          <path
            d="M10 30L35 85L50 55L65 85L90 30"
            stroke="url(#logo-gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* The Home/Dock Shape at the base */}
          <path
            d="M40 85L40 65L50 55L60 65L60 85H40Z"
            fill="white"
          />
          <defs>
            <linearGradient id="logo-gradient" x1="10" y1="30" x2="90" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#7B33FF" />
            </linearGradient>
          </defs>
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
