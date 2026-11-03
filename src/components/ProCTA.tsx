
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview ProCTA - High-fidelity region-aware subscription trigger.
 * Prices: ₹1599/year (IN) or $19/year (Global).
 */
export function ProCTA({ className }: { className?: string }) {
  const [pricing, setPricing] = useState({ text: 'Go Pro - $19/year', sub: '($1.58/mo)' });

  useEffect(() => {
    // Detect region via TimeZone as a zero-latency proxy
    const isIndia = Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Kolkata';
    if (isIndia) {
      setPricing({ text: 'Go Pro - ₹1599/year', sub: '(Best Value)' });
    }
  }, []);

  const handleSubscribe = () => {
    window.open('https://subscription.bessites.store/l/Bessites?wanted=true', '_blank');
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
        <span className="flex items-center gap-2">
          {pricing.text} <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </span>
        <span className="text-[9px] opacity-60 font-bold tracking-[0.3em] mt-0.5">{pricing.sub}</span>
      </div>
    </Button>
  );
}
