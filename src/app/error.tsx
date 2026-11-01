'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * @fileOverview Client Error Boundary.
 * Catches server-side fetch failures and provides a graceful fallback.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("APP_ERROR:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Sync Interrupted.</h2>
        <p className="text-muted-foreground italic max-w-md mx-auto">
          We encountered a technical hitch while fetching the discovery node data. 
        </p>
      </div>
      
      <Button 
        onClick={() => reset()}
        className="rounded-full px-12 h-16 bg-white text-black font-black uppercase italic shadow-2xl hover:scale-105 transition-all"
      >
        Try Again
      </Button>
    </div>
  );
}
