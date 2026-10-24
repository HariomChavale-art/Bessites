'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MOCK_WEBSITES } from '@/lib/mock-data';
import { WebsitePreview } from '@/components/website-preview';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  size: number;
  website: any;
  type: 'website' | 'relic';
  relicType?: 'pumpkin' | 'skull' | 'ticket';
}

interface Trail {
  x: number;
  y: number;
  opacity: number;
  color: string;
}

export function FallingWebsitesHalloweenCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const mouseVel = useRef({ x: 0, y: 0 });
  const globalWind = useRef({ x: 0, y: 0.1 }); // Default slight downward gravity

  useEffect(() => {
    const count = 30;
    const initial: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: `p-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.1,
      vy: 0.05 + Math.random() * 0.1,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 0.2,
      size: 100 + Math.random() * 80,
      website: MOCK_WEBSITES[i % MOCK_WEBSITES.length],
      type: Math.random() > 0.85 ? 'relic' : 'website',
      relicType: ['pumpkin', 'skull', 'ticket'][Math.floor(Math.random() * 3)] as any
    }));
    setParticles(initial);

    let lastX = 0;
    let lastY = 0;
    let frame: number;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      mouseVel.current = {
        x: (x - lastX) * 0.05,
        y: (y - lastY) * 0.05
      };
      
      mousePos.current = { x, y };
      lastX = x;
      lastY = y;

      // Apply "Spell Gust" to global wind temporarily
      globalWind.current.x += mouseVel.current.x * 0.1;
      globalWind.current.y += mouseVel.current.y * 0.1;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    const animate = () => {
      // Decelerate wind back to vertical gravity
      globalWind.current.x *= 0.98;
      globalWind.current.y = globalWind.current.y * 0.98 + 0.1 * 0.02;

      setParticles(prev => prev.map(p => {
        let { x, y, vx, vy, rotation, vr } = p;
        
        // Physics integration
        vx += globalWind.current.x * 0.1;
        vy += globalWind.current.y * 0.1;
        
        // Drag
        vx *= 0.99;
        vy *= 0.99;
        
        x += vx;
        y += vy;
        rotation += vr + (vx * 2);

        // Wrap around
        if (y > 110) { y = -15; x = Math.random() * 100; }
        if (y < -15) { y = 110; }
        if (x > 110) x = -10;
        if (x < -10) x = 110;

        return { ...p, x, y, vx, vy, rotation };
      }));

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute transition-transform duration-75 will-change-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: p.type === 'website' ? `${p.size * 0.6}px` : `${p.size * 0.8}px`,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
          }}
        >
          {p.type === 'website' ? (
            <div className="w-full h-full rounded-xl bg-[#12111A] border-2 border-orange-500/20 shadow-pumpkin-glow overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-purple-500/10 z-10" />
              <WebsitePreview 
                websiteUrl={p.website.url} 
                className="w-full h-full object-cover grayscale opacity-60" 
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center filter drop-shadow-pumpkin-glow animate-pulse">
              {p.relicType === 'pumpkin' && <span className="text-4xl">🎃</span>}
              {p.relicType === 'skull' && <span className="text-4xl">💀</span>}
              {p.relicType === 'ticket' && <span className="text-4xl">🎫</span>}
            </div>
          )}
          
          {/* Spectral Trail (CSS-based simplicity) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-2xl bg-orange-500/5 -z-10 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}
