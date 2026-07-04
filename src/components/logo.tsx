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
          {/* Stylized 'B' for Bessites */}
          <path
            d="M25 20H55C65 20 75 25 75 40C75 50 70 55 60 55C70 55 80 60 80 75C80 85 70 95 55 95H25V20Z"
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M25 55H55"
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Star accent */}
          <path
            d="M85 15L88 22H95L89 26L91 33L85 29L79 33L81 26L75 22H82L85 15Z"
            fill="white"
          />
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
