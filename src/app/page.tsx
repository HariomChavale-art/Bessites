"use client"

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { MarqueeBanner } from "@/components/marquee-banner";
import { MasonryFeed } from "@/components/masonry-feed";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock, Loader2 } from "lucide-react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Home() {
  const [activeTab, setActiveTab] = useState("foryou");
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userDocRef);
  const userInterests = profile?.interests || [];

  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "submissions");
  }, [db]);

  const { data: submittedSites } = useCollection(submissionsRef);

  const statsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);

  const { data: globalStats } = useCollection(statsRef);

  const allAvailableWebsites = useMemo(() => {
    const firestoreSites = (submittedSites || []).map(s => ({
      id: s.id,
      name: s.name || s.url?.split('//')[1]?.split('.')[0] || "New Project",
      developer: s.userEmail || "Community",
      description: s.description || "User submitted project",
      longDescription: s.longDescription || "A new project shared via Bessites.",
      rating: 0,
      reviewCount: 0,
      categories: s.categories || ["Web App"],
      imageUrl: s.logoUrl || "",
      screenshots: [],
      url: s.url,
      pricing: "Free" as const,
      updatedAt: "2024",
      size: "N/A",
      version: "1.0",
      ...s
    }));
    
    const uniquePool = [...MOCK_WEBSITES];
    const seenIds = new Set(uniquePool.map(w => w.id));
    
    firestoreSites.forEach(s => {
      if (!seenIds.has(s.id)) {
        uniquePool.push(s as any);
        seenIds.add(s.id);
      }
    });

    return uniquePool;
  }, [submittedSites]);

  const featuredWebsites = useMemo(() => {
    return allAvailableWebsites.slice(0, 15);
  }, [allAvailableWebsites]);

  const filteredWebsites = useMemo(() => {
    const featuredIds = new Set(featuredWebsites.map(w => w.id));
    const mainList = allAvailableWebsites.filter(w => !featuredIds.has(w.id));
    let results = [...mainList];
    
    switch (activeTab) {
      case "trending":
        results.sort((a, b) => {
          const statsA = globalStats?.find(s => s.id === a.id);
          const statsB = globalStats?.find(s => s.id === b.id);
          const scoreA = (statsA?.visitCount || 0) + (statsA?.likeCount || 0) * 2 + (statsA?.shareCount || 0) * 1.5;
          const scoreB = (statsB?.visitCount || 0) + (statsB?.likeCount || 0) * 2 + (statsB?.shareCount || 0) * 1.5;
          return scoreB - scoreA;
        });
        results = results.slice(0, 50);
        break;
      case "new":
        results.reverse();
        break;
      case "foryou":
      default:
        results.sort((a, b) => {
          const aMatchCount = a.categories.filter(c => userInterests.includes(c)).length;
          const bMatchCount = b.categories.filter(c => userInterests.includes(c)).length;
          
          if (bMatchCount !== aMatchCount) {
            return bMatchCount - aMatchCount;
          }
          return a.name.localeCompare(b.name);
        });
        break;
    }
    
    return results;
  }, [activeTab, userInterests, featuredWebsites, allAvailableWebsites, globalStats]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        <section className="mt-4">
          <div className="container mx-auto px-4 mb-4">
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary glow-primary" />
              Staff Picks
            </h2>
          </div>
          <MarqueeBanner items={featuredWebsites} />
        </section>

        <section className="container mx-auto px-4 mt-8 sm:mt-12 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tighter">
                Discover your next <span className="text-primary italic">flow</span>.
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
                Your interest-driven directory of modern webs.
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
          {activeTab === 'trending' && (
            <div className="container mx-auto px-4 mb-6">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black text-white uppercase tracking-widest italic">Top 50 Community Picks</span>
               </div>
            </div>
          )}
          <MasonryFeed key={activeTab + userInterests.join(',') + filteredWebsites.length} initialWebsites={filteredWebsites} />
        </section>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Bessites. Zero Duplication. Zero Padding.
          </p>
        </div>
      </footer>
    </div>
  );
}
