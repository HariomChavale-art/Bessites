"use client"

import { Website } from "@/lib/mock-data";
import { WebsiteCard } from "./website-card";
import { Button } from "./ui/button";
import { useState } from "react";

interface MasonryFeedProps {
  initialWebsites: Website[];
}

export function MasonryFeed({ initialWebsites }: MasonryFeedProps) {
  const [websites, setWebsites] = useState(initialWebsites);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    // Simulate infinite scroll by appending more items
    setTimeout(() => {
      setWebsites(prev => [...prev, ...initialWebsites.map(w => ({ ...w, id: `${w.id}-${Date.now()}` }))]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-6 p-2 sm:p-4">
        {websites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>
      
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
    </div>
  );
}
