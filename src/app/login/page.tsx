'use client';

import React from 'react';
import { FallingWebsitesHalloweenCanvas } from '@/components/login/FallingWebsitesHalloweenCanvas';
import { HalloweenGlassLoginCard } from '@/components/login/HalloweenGlassLoginCard';

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#070709] flex items-center justify-center overflow-hidden">
      {/* Background Physics Layer */}
      <FallingWebsitesHalloweenCanvas />
      
      {/* Overlay atmospheric gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709] pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-radial-at-center from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Auth Card Layer */}
      <HalloweenGlassLoginCard />
    </main>
  );
}
