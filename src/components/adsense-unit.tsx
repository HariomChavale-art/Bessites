'use client';

import { useEffect, useState } from 'react';

interface AdSenseUnitProps {
  slot: string;
  className?: string;
}

/**
 * @fileOverview High-fidelity AdSense Unit with Safety Checks.
 * Ensures ads only load when substantial publisher content is visible.
 * Prevents "No Content" violations by enforcing a 2s delay and element counting.
 */
export function AdSenseUnit({ slot, className }: AdSenseUnitProps) {
  const [canLoad, setCanCanLoad] = useState(false);

  useEffect(() => {
    // 1. Mandatory 2-second delay after mount to clear loading states
    const timer = setTimeout(() => {
      // 2. Check for substantial publisher content
      // We look for a grid with at least 3 items or specific content containers
      const grid = document.querySelector('.website-grid');
      const cards = grid?.querySelectorAll('.website-card-item');
      const detailView = document.querySelector('.website-detail-container');
      
      const hasGridContent = cards && cards.length >= 3;
      const hasDetailContent = !!detailView;

      if (hasGridContent || hasDetailContent) {
        setCanCanLoad(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (canLoad) {
      try {
        // Safe push to the AdSense global queue
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense Initialization Failure:', e);
      }
    }
  }, [canLoad]);

  if (!canLoad) return null;

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-6811475243465738"
        data-ad-slot={slot}
      />
    </div>
  );
}
