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
    // Detect region via TimeZone as a zero-latency proxy
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
        "w-full h-16 sm:h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-widest text-lg shadow-2xl hover:scale-105 transition-all group",
        className
      )}
    >
      <div className="flex flex-col items-center">
        <span className="text-center px-4 leading-tight">
          Go Pro - Find the perfect tool and websites for you
        </span>
        <span className="text-[10px] opacity-60 font-bold tracking-[0.3em] mt-1">
          {pricing}
        </span>
      </div>
    </Button>
  );
}
