
"use client"

import { Website } from "@/lib/mock-data";
import { WebsiteCard } from "./website-card";
import { Button } from "./ui/button";
import { useState, useMemo } from "react";

interface MasonryFeedProps {
  initialWebsites: Website[];
}

export function MasonryFeed({ initialWebsites }: MasonryFeedProps) {
  // Use a state to manage the slice of websites shown if we had a large list.
  // For now, we ensure we only show unique websites from the provided list.
  const [displayCount, setDisplayCount] = useState(12);
  const [loading, setLoading] = useState(false);

  // Filter out any duplicates just in case the input has them
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
    // Simulate loading state then show more unique items from the list
    setTimeout(() => {
      setDisplayCount(prev => prev + 12);
      setLoading(false);
    }, 600);
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
            className="rounded-full px-12 py-6 border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white"
          >
            {loading ? "Discovering more niche apps..." : "Load More Suggestions"}
          </Button>
        </div>
      )}

      {!hasMore && uniqueWebsites.length > 0 && (
        <div className="text-center py-20 opacity-20">
          <p className="text-sm font-bold uppercase tracking-widest">You've reached the edge of the web</p>
        </div>
      )}
    </div>
  );
}
