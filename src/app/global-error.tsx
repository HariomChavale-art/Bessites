'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#0B0A0F] text-white flex flex-col items-center justify-center min-h-screen space-y-6">
        <h2 className="text-4xl font-black italic uppercase">System Crash.</h2>
        <p className="text-white/40 italic">The root node failed to initialize.</p>
        <Button onClick={() => reset()} className="rounded-full px-10 bg-primary font-black uppercase italic">
          Reset System
        </Button>
      </body>
    </html>
  );
}
