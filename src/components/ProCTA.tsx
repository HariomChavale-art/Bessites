
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * @fileOverview ProCTA - High-fidelity region-aware subscription trigger.
 * Product: https://bessites2.gumroad.com/l/Bessites
 */
export function ProCTA({ className }: { className?: string }) {
  const [pricing, setPricing] = useState('$19/year');

  useEffect(() => {
    // Detect region via TimeZone as a zero-latency proxy for India
    const isIndia = Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Kolkata';
    if (isIndia) {
      setPricing('₹1599/year');
    }
  }, []);

  const handleSubscribe = () => {
    window.open('https://bessites2.gumroad.com/l/Bessites', '_blank');
  };

  return (
    <Button 
      onClick={handleSubscribe}
      className={cn(
        "w-full h-auto min-h-[4.5rem] sm:min-h-[5.5rem] py-4 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-widest text-base sm:text-lg shadow-2xl hover:scale-102 active:scale-98 transition-all group whitespace-normal",
        className
      )}
    >
      <div className="flex flex-col items-center w-full">
        <span className="text-center px-4 leading-snug">
          Go Pro - Find the perfect tool/webs
        </span>
        <span className="text-[10px] opacity-60 font-bold tracking-[0.3em] mt-1">
          {pricing}
        </span>
      </div>
    </Button>
  );
}
