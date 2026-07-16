'use client';

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative w-10 h-10 shrink-0 group">
        {/* Browser Frame SVG Logo */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="bessites-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D79FF" />
              <stop offset="100%" stopColor="#AB33FF" />
            </linearGradient>
            <filter id="glass-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Main Card / stylized 'B' back */}
          <rect x="15" y="15" width="70" height="70" rx="18" fill="url(#bessites-grad)" />
          
          {/* Glass Header */}
          <rect x="15" y="15" width="70" height="22" rx="12" fill="white" fillOpacity="0.15" />
          
          {/* Window Controls */}
          <circle cx="28" cy="26" r="3" fill="#FF5F56" />
          <circle cx="38" cy="26" r="3" fill="#FFBD2E" />
          <circle cx="48" cy="26" r="3" fill="#27C93F" />
          
          {/* Internal Content Blocks (The Web Layout) */}
          <rect x="25" y="45" width="22" height="12" rx="4" fill="white" fillOpacity="0.2" />
          <rect x="53" y="45" width="22" height="12" rx="4" fill="white" fillOpacity="0.2" />
          <rect x="25" y="63" width="50" height="12" rx="4" fill="white" fillOpacity="0.4" />
          
          {/* Shine effect */}
          <path d="M20 20 L80 80" stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
      {showText && (
        <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
          Bessites
        </span>
      )}
    </div>
  );
}
