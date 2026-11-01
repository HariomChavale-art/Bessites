'use client';

import { Button } from '@/components/ui/button';

/**
 * @fileOverview Global Error Boundary for root node crashes.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#0D0C12] text-white flex flex-col items-center justify-center min-h-screen space-y-6 font-body">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-center">System Failure.</h2>
        <p className="text-white/40 italic text-center px-6">The main discovery engine failed to initialize.</p>
        <Button 
          onClick={() => reset()} 
          className="rounded-full h-16 px-10 bg-primary text-white font-black uppercase italic"
        >
          Restart Application
        </Button>
      </body>
    </html>
  );
}
