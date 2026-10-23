'use client';

import { useEffect, useState } from 'react';
import { Flame, Ghost } from 'lucide-react';
import Link from 'next/link';

export function HalloweenBanner() {
  const [spots, setSpots] = useState(84);

  // Simulate real-time scarcity
  useEffect(() => {
    const interval = setInterval(() => {
      setSpots(prev => Math.max(1, prev - (Math.random() > 0.9 ? 1 : 0)));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#1A0B00] border-b border-halloween-pumpkin/20 py-2.5 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-halloween-pumpkin/5 to-transparent animate-pulse" />
      <div className="container mx-auto px-4 flex items-center justify-center gap-8 whitespace-nowrap animate-marquee md:animate-none">
        <div className="flex items-center gap-3">
          <Flame className="w-4 h-4 text-halloween-pumpkin animate-flame-flicker fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-halloween-bone italic">
            HALLOWEEN FOUNDING PASS: First 100 builders get Lifetime Pro for $19.99
          </span>
          <span className="bg-halloween-pumpkin text-halloween-void px-2 py-0.5 rounded-md text-[9px] font-black">
            ONLY {spots} SPOTS LEFT
          </span>
        </div>
        <Link href="/halloween-pass">
          <button className="text-[9px] font-black uppercase tracking-widest text-halloween-pumpkin border border-halloween-pumpkin/40 px-4 py-1 rounded-full hover:bg-halloween-pumpkin hover:text-halloween-void transition-all shadow-pumpkin-glow">
            CLAIM PASS
          </button>
        </Link>
      </div>
    </div>
  );
}
