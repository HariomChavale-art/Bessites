
'use client';

import { useEffect, useState } from 'react';

interface AdSenseUnitProps {
  slot: string;
  className?: string;
}

/**
 * @fileOverview High-fidelity AdSense Unit with publisher content verification.
 * Ensures ads only initialize 2 seconds after the primary registry cards are rendered.
 */
export function AdSenseUnit({ slot, className }: AdSenseUnitProps) {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    // 1. Mandatory 2-second delay to clear initial loading/blank states
    const timer = setTimeout(() => {
      // 2. Check for substantial publisher content (at least 3 cards)
      const grid = document.querySelector('.website-grid');
      const cards = grid?.querySelectorAll('.website-card-item');
      const detailView = document.querySelector('.website-detail-container');
      
      const hasGridContent = cards && cards.length >= 3;
      const hasDetailContent = !!detailView;

      // Only allow loading if we are NOT in an empty state
      if (hasGridContent || hasDetailContent) {
        setCanLoad(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (canLoad) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.warn('AdSense Push Failure:', e);
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
