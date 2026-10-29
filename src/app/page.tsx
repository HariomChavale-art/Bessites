'use client';

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { MasonryFeed } from "@/components/masonry-feed";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock, Loader2, Globe, ShieldCheck, Zap, Heart } from "lucide-react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getBroadCategoriesForTag } from "@/lib/category-mapping";
import { Footer } from "@/components/footer";

/**
 * Bessites Main Page - Simplified for everyone to understand.
 * We use simple words like "Find" and "Best" instead of complex jargon.
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
      name: s.name || s.url?.split('//')[1]?.split('.')[0] || "New Website",
      developer: s.userEmail || "Community",
      description: s.description || "A high quality website from our list.",
      longDescription: s.longDescription || s.description || "A new website shared on Bessites.",
      categories: s.categories || ["Web App"],
      url: s.url,
      pricing: s.pricing || "Free",
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
    
    results.sort((a, b) => {
      const nameA = (a.websiteName || a.name || "").toLowerCase();
      const nameB = (b.websiteName || b.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });

    if (activeTab === "trending") {
      results.sort((a, b) => {
        const statsA = globalStats?.find(s => s.id === a.id);
        const statsB = globalStats?.find(s => s.id === b.id);
        const scoreA = (statsA?.visitCount || 0) + (statsA?.likeCount || 0) * 2;
        const scoreB = (statsB?.visitCount || 0) + (statsB?.likeCount || 0) * 2;
        return scoreB - scoreA;
      });
      return results.slice(0, 50);
    }

    if (activeTab === "foryou") {
      const matches = results.filter(w => 
        w.categories.some(tag => {
          const mappedBroads = getBroadCategoriesForTag(tag);
          return mappedBroads.some(b => userBroadInterests.includes(b));
        })
      );
      const nonMatches = results.filter(w => !matches.includes(w));
      return [...matches, ...nonMatches];
    }
    
    return results;
  }, [activeTab, userBroadInterests, allAvailableWebsites, globalStats]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <Navigation />
      
      <main className="flex-1">
        <section className="container mx-auto px-4 mt-20 mb-12 text-center space-y-6">
           <h1 className="text-6xl sm:text-8xl font-black italic text-white tracking-tighter uppercase leading-tight">
             Find the <span className="text-primary">Best Tools.</span>
           </h1>
           <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
             A high quality list of the best websites on the internet. Picked by real people for builders like you.
           </p>
        </section>

        <section className="container mx-auto px-4 mb-12 flex justify-center">
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
            <Tabs defaultValue="foryou" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-transparent h-auto gap-2">
                <TabsTrigger value="foryou" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary transition-all flex items-center gap-2 italic">
                  <Sparkles className="w-4 h-4" /> For You
                </TabsTrigger>
                <TabsTrigger value="trending" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary flex items-center gap-2 italic">
                  <TrendingUp className="w-4 h-4" /> Popular
                </TabsTrigger>
                <TabsTrigger value="new" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary flex items-center gap-2 italic">
                  <Clock className="w-4 h-4" /> Recently Added
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        <section className="container mx-auto px-4 mb-24">
          <MasonryFeed initialWebsites={filteredWebsites as any} hideEndMessage={true} />
        </section>

        <section className="container mx-auto px-4 py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Only the <span className="text-primary">Best Sites</span></h2>
              <p className="text-muted-foreground text-lg italic">We find the top 1% of the web so you don't have to waste time.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 text-primary">
                  <Globe className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase italic">Global List</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  Bessites is a premier website list that finds the most useful parts of the internet. Every site is checked by hand to make sure it is helpful and not full of ads.
                </p>
              </div>

              <div className="space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase italic">Verified Websites</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  Unlike big search engines, we use real people to pick sites. We look for sites that actually work and provide real value to the community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
