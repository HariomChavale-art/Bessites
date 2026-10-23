'use client';

import React, { useEffect, useState } from 'react';

/**
 * @fileOverview Ambient Halloween Background.
 * Features drifting fog spheres and floating embers with performance optimizations.
 */
export function SpookyBackground() {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Easter Egg: Typing "pumpkin"
      const keys = (window as any)._keys || '';
      (window as any)._keys = (keys + e.key).slice(-7);
      
      if ((window as any)._keys === 'pumpkin') {
        setIsTyping(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-halloween-void">
      {/* Fog Layers */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-halloween-witchcraft/10 blur-[120px] rounded-full animate-fog-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-halloween-pumpkin/5 blur-[120px] rounded-full animate-fog-float [animation-delay:2s]" />
      
      {/* Embers */}
      {!isTyping && Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-halloween-pumpkin rounded-full blur-[1px] animate-ember-drift"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10%',
            animationDuration: `${10 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: 0.4
          }}
        />
      ))}

      {/* Easter Egg Shower */}
      {isTyping && Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`burst-${i}`}
          className="absolute w-2 h-2 bg-halloween-pumpkin-glow rounded-full blur-[2px] animate-ember-drift"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10%',
            animationDuration: '2s',
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
    </div>
  );
}
