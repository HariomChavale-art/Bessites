
"use client"

import { Website } from "@/lib/mock-data";
import { WebsiteCard } from "./website-card";
import { Button } from "./ui/button";
import { useState, useMemo, useEffect } from "react";

interface MasonryFeedProps {
  initialWebsites: Website[];
}

export function MasonryFeed({ initialWebsites }: MasonryFeedProps) {
  // Start with a larger initial count to show more upfront
  const [displayCount, setDisplayCount] = useState(24);
  const [loading, setLoading] = useState(false);

  // Ensure strict uniqueness in the display list
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
    // Smooth transition to more items
    setTimeout(() => {
      setDisplayCount(prev => prev + 12);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="w-full">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-6 p-2 sm:p-4">
        {displayedWebsites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
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

      {!hasMore && uniqueWebsites.length > 0 && (
        <div className="text-center py-20 opacity-10">
          <div className="h-px w-32 bg-white/20 mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">End of Collection</p>
        </div>
      )}
      
      {uniqueWebsites.length === 0 && (
        <div className="py-20 text-center opacity-40">
          <p className="text-lg font-bold italic">No websites found here.</p>
        </div>
      )}
    </div>
  );
}
