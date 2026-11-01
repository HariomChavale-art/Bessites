'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * @fileOverview Client Error Boundary.
 * Captches runtime failures and provides a professional fallback UI.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Discovery Node Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Connection Interrupted.</h2>
        <p className="text-muted-foreground italic max-w-md mx-auto">
          Our discovery system had a problem loading this node. Please try to synchronize again.
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
