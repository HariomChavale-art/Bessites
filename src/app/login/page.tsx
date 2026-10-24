'use client';

import React, { useState, useEffect } from 'react';
import { FallingWebsitesHalloweenCanvas } from '@/components/login/FallingWebsitesHalloweenCanvas';
import { HalloweenGlassLoginCard } from '@/components/login/HalloweenGlassLoginCard';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <main className="min-h-screen w-full bg-[#09090B]" />;

  return (
    <main className="relative min-h-screen w-full bg-[#09090B] flex items-center justify-center overflow-hidden">
      <FallingWebsitesHalloweenCanvas />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B] pointer-events-none opacity-60" />
      <HalloweenGlassLoginCard />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-600 text-[11px] font-medium tracking-widest uppercase italic opacity-40">
        Swipe or drag anywhere to bend the gravity field
      </div>
    </main>
  );
}