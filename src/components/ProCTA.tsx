
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * @fileOverview ProCTA - High-fidelity region-aware subscription trigger.
 * Product: https://bessitesoffical.gumroad.com/l/Bessites
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
    // Official Updated Gumroad Link
    window.open('https://bessitesoffical.gumroad.com/l/Bessites', '_blank');
  };

  return (
    <Button 
      onClick={handleSubscribe}
      className={cn(
        "w-full h-auto min-h-[5rem] sm:min-h-[6rem] py-5 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-widest text-base sm:text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all group whitespace-normal",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center w-full px-4 text-center">
        <span className="leading-tight block">
          Go Pro - Find the perfect tool/webs
        </span>
        <span className="text-[10px] opacity-60 font-bold tracking-[0.3em] mt-2 block">
          {pricing}
        </span>
      </div>
    </Button>
  );
}
