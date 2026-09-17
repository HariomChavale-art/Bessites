
"use client"

import { Website } from "@/lib/mock-data";
import { WebsiteCard } from "./website-card";
import { Button } from "./ui/button";
import { useState, useMemo } from "react";

interface MasonryFeedProps {
  initialWebsites: Website[];
  hideEndMessage?: boolean;
}

/**
 * High-fidelity Masonry Feed.
 * Uses a column-based layout to allow asymmetrical interlocking cards 
 * to flow into each other without rigid row heights.
 */
export function MasonryFeed({ initialWebsites, hideEndMessage = false }: MasonryFeedProps) {
  const [displayCount, setDisplayCount] = useState(24);
  const [loading, setLoading] = useState(false);

  const uniqueWebsites = useMemo(() => {
    const seen = new Set();
    return initialWebsites.filter(w => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    });
  }, [initialWebsites]);

  const displayedWebsites = uniqueWebsites.slice(0, displayCount);
  const hasMore = displayCount < uniqueWebsites.length;

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 12);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="w-full">
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 p-3 max-w-7xl mx-auto space-y-4">
        {displayedWebsites.map((website, idx) => (
          <div key={website.id} className="break-inside-avoid mb-4">
            <WebsiteCard website={website} index={idx} />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-12 mb-20">
          <Button 
            variant="outline" 
            onClick={loadMore} 
            disabled={loading}
            className="rounded-full px-12 py-6 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold h-auto shadow-xl"
          >
            {loading ? "Discovering more niche apps..." : "Load More Websites"}
          </Button>
        </div>
      )}

      {!hasMore && uniqueWebsites.length > 0 && !hideEndMessage && (
        <div className="text-center py-20 opacity-10">
          <div className="h-px w-32 bg-white/20 mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">End of Collection</p>
        </div>
      )}
    </div>
  );
}
