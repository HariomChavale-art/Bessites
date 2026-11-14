'use client';

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { MasonryFeed } from "@/components/masonry-feed";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock, Loader2 } from "lucide-react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getBroadCategoriesForTag } from "@/lib/category-mapping";
import { Footer } from "@/components/footer";

/**
 * Bessites Discovery Node - Interest-Based Orchestration.
 * Features a high-fidelity masonry layout with dynamic discovery tabs.
 */
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
  const userBroadInterests = profile?.interests || [];

  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), where("status", "==", "approved"));
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
      websiteName: s.websiteName || s.name,
      name: s.name || s.url?.split('//')[1]?.split('.')[0] || "New Project",
      developer: s.userEmail || "Community",
      description: s.description || "User submitted project",
      longDescription: s.longDescription || s.description || "A new project shared via Bessites.",
      rating: 0,
      reviewCount: 0,
      categories: s.categories || ["Web App"],
      imageUrl: s.logoUrl || "",
      screenshots: [],
      url: s.url,
      pricing: s.pricing || "Free",
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

  const filteredWebsites = useMemo(() => {
    let results = [...allAvailableWebsites];
    
    const matchesUserInterest = (site: any) => 
      site.categories.some((tag: string) => {
        const mappedBroads = getBroadCategoriesForTag(tag);
        return mappedBroads.some(b => userBroadInterests.includes(b));
      });

    switch (activeTab) {
      case "trending":
        results.sort((a, b) => {
          const aMatch = matchesUserInterest(a) ? 1 : 0;
          const bMatch = matchesUserInterest(b) ? 1 : 0;
          if (aMatch !== bMatch) return bMatch - aMatch;

          const statsA = globalStats?.find(s => s.id === a.id);
          const statsB = globalStats?.find(s => s.id === b.id);
          const scoreA = (a.baseVisits || 0) + (statsA?.visitCount || 0);
          const scoreB = (b.baseVisits || 0) + (statsB?.visitCount || 0);
          return scoreB - scoreA;
        });
        break;

      case "new":
        results.sort((a, b) => {
          const aMatch = matchesUserInterest(a) ? 1 : 0;
          const bMatch = matchesUserInterest(b) ? 1 : 0;
          if (aMatch !== bMatch) return bMatch - aMatch;

          const timeA = a.timestamp?.seconds || a.baseSaves || 0;
          const timeB = b.timestamp?.seconds || b.baseSaves || 0;
          return timeB - timeA;
        });
        break;

      case "foryou":
      default:
        results.sort((a, b) => {
          const aMatch = matchesUserInterest(a) ? 1 : 0;
          const bMatch = matchesUserInterest(b) ? 1 : 0;
          if (aMatch !== bMatch) return bMatch - aMatch;

          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }
    
    return results;
  }, [activeTab, userBroadInterests, allAvailableWebsites, globalStats]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <Navigation />
      
      <main className="flex-1">
        <section className="container mx-auto px-4 mt-12 mb-12 flex justify-center">
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
            <Tabs defaultValue="foryou" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-transparent h-auto gap-2">
                <TabsTrigger value="foryou" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary transition-all flex items-center gap-2 italic">
                  <Sparkles className="w-4 h-4" /> For You
                </TabsTrigger>
                <TabsTrigger value="trending" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary flex items-center gap-2 italic">
                  <TrendingUp className="w-4 h-4" /> Trending
                </TabsTrigger>
                <TabsTrigger value="new" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary flex items-center gap-2 italic">
                  <Clock className="w-4 h-4" /> New
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        <section className="container mx-auto px-2 mb-24">
          <MasonryFeed initialWebsites={filteredWebsites as any} hideEndMessage={true} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
