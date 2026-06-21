
"use client"

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { MarqueeBanner } from "@/components/marquee-banner";
import { MasonryFeed } from "@/components/masonry-feed";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("foryou");
  
  const sponsoredWebsites = MOCK_WEBSITES.filter(w => w.isSponsored);

  const filteredWebsites = useMemo(() => {
    const list = [...MOCK_WEBSITES];
    switch (activeTab) {
      case "trending":
        return list.sort((a, b) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating));
      case "new":
        return list.filter(w => w.updatedAt.includes("2024")).reverse();
      case "foryou":
      default:
        return MOCK_WEBSITES;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="mt-4">
          <div className="container mx-auto px-4 mb-4">
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary glow-primary" />
              Featured Partners
            </h2>
          </div>
          <MarqueeBanner items={sponsoredWebsites} />
        </section>

        <section className="container mx-auto px-4 mt-8 sm:mt-12 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tighter">
                Discover your next <span className="text-primary italic">flow</span>.
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
                The world's first curated directory of web applications, ranked by users.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-card p-1 sm:p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
              <Tabs 
                defaultValue="foryou" 
                className="w-full"
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList className="bg-transparent h-auto gap-1">
                  <TabsTrigger value="foryou" className="rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all flex items-center gap-1.5 sm:gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    For You
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-1.5 sm:gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="new" className="rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-1.5 sm:gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    New
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-2">
          <MasonryFeed key={activeTab} initialWebsites={filteredWebsites} />
        </section>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 NetFlow. Crafted for the future of the web.
          </p>
        </div>
      </footer>
    </div>
  );
}
