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

export function FallingWebsitesHalloweenCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gusts, setGusts] = useState<{ x: number; y: number; id: number }[]>([]);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const mouseVel = useRef({ x: 0, y: 0 });
  const globalWind = useRef({ x: 0, y: 0.1 }); // Default slight downward gravity

  useEffect(() => {
    const count = 35;
    const initial: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: `p-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.1,
      vy: 0.05 + Math.random() * 0.1,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 0.5,
      size: 80 + Math.random() * 100,
      website: MOCK_WEBSITES[i % MOCK_WEBSITES.length],
      type: Math.random() > 0.8 ? 'relic' : 'website',
      relicType: ['pumpkin', 'skull', 'ticket'][Math.floor(Math.random() * 3)] as any
    }));
    setParticles(initial);

    let lastX = 0;
    let lastY = 0;
    let frame: number;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const dx = x - lastX;
      const dy = y - lastY;
      
      mouseVel.current = { x: dx * 0.1, y: dy * 0.1 };
      mousePos.current = { x, y };
      
      lastX = x;
      lastY = y;

      // Apply "Spell Gust" to global wind temporarily
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        globalWind.current.x += dx * 0.005;
        globalWind.current.y += dy * 0.005;
        
        // Add visual gust point
        const gustId = Date.now();
        setGusts(prev => [...prev.slice(-10), { x, y, id: gustId }]);
        setTimeout(() => setGusts(prev => prev.filter(g => g.id !== gustId)), 400);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    const animate = () => {
      // Decelerate wind back to vertical gravity
      globalWind.current.x *= 0.95;
      globalWind.current.y = globalWind.current.y * 0.95 + 0.1 * 0.05;

      setParticles(prev => prev.map(p => {
        let { x, y, vx, vy, rotation } = p;
        
        // Physics integration
        vx += globalWind.current.x * (p.size / 100);
        vy += globalWind.current.y * (p.size / 100);
        
        // Tilt based on horizontal velocity
        const targetRotation = vx * 15;
        rotation = rotation * 0.9 + targetRotation * 0.1;
        
        // Friction
        vx *= 0.98;
        vy *= 0.98;
        
        x += vx;
        y += vy;

        // Wrap around
        if (y > 115) { y = -20; x = Math.random() * 100; vx = 0; }
        if (y < -20) { y = 115; vx = 0; }
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
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-halloween-void">
      {/* Ambient Fog */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-halloween-witchcraft/5 to-transparent animate-pulse" />
      
      {/* Gust Visuals */}
      {gusts.map(g => (
        <div 
          key={g.id}
          className="absolute w-20 h-2 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent blur-xl rounded-full"
          style={{ left: g.x, top: g.y, transform: `translate(-50%, -50%) rotate(${Math.atan2(mouseVel.current.y, mouseVel.current.x)}rad)` }}
        />
      ))}

      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute transition-transform duration-75 will-change-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: p.type === 'website' ? `${p.size * 0.6}px` : `${p.size}px`,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
          }}
        >
          {p.type === 'website' ? (
            <div className="w-full h-full rounded-xl bg-[#12111A] border border-orange-500/20 shadow-pumpkin-glow overflow-hidden relative group">
              {/* Spectral Trail via CSS Shadow */}
              <div className="absolute inset-[-20px] bg-orange-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <WebsitePreview 
                websiteUrl={p.website.url} 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-80 transition-opacity" 
              />
              {/* Ember Wake (Simplified) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-t from-orange-500/20 to-transparent blur-sm" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center filter drop-shadow-pumpkin-glow animate-pulse">
              {p.relicType === 'pumpkin' && <span className="text-4xl scale-125">🎃</span>}
              {p.relicType === 'skull' && <span className="text-4xl scale-125">💀</span>}
              {p.relicType === 'ticket' && <span className="text-4xl scale-125">🎫</span>}
            </div>
          )}
          
          {/* Constant Ember Trail */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-orange-500/20 to-transparent blur-[2px]" />
        </div>
      ))}
    </div>
  );
}