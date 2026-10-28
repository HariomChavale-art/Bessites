'use client';

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { MasonryFeed } from "@/components/masonry-feed";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Loader2, Sparkles, TrendingUp, Clock } from "lucide-react";
import { OuneoAssistant } from "@/components/ouneo-assistant";

export default function Home() {
  const [activeTab, setActiveTab] = useState("foryou");
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), where("status", "==", "approved"));
  }, [db]);

  const { data: firestoreSites, loading: submissionsLoading } = useCollection(submissionsRef);

  const filteredWebsites = useMemo(() => {
    const registry = [...(firestoreSites || []), ...MOCK_WEBSITES];
    
    // Deduplicate by URL
    const seen = new Set();
    let results = registry.filter(s => {
      const url = s.url?.toLowerCase().trim();
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    });
    
    // Deterministic Stable Sort
    if (activeTab === "trending") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0) || a.name.localeCompare(b.name));
    } else if (activeTab === "new") {
      results.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return results;
  }, [activeTab, firestoreSites]);

  if (authLoading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        <section className="container mx-auto px-4 mt-20 mb-12 text-center space-y-6">
           <h1 className="text-6xl sm:text-8xl font-black italic text-white tracking-tighter uppercase leading-tight">
             Absolute <span className="text-primary">Discovery.</span>
           </h1>
           <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
             A high-fidelity registry indexing the highest tier of the modern web. Curated for builders, by builders.
           </p>
        </section>

        <section className="container mx-auto px-4 mb-20">
          <OuneoAssistant />
        </section>

        <section className="container mx-auto px-4 mb-12 flex justify-center">
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
            <Tabs defaultValue="foryou" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-transparent h-auto gap-2">
                <TabsTrigger value="foryou" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all flex items-center gap-2 italic">
                  <Sparkles className="w-4 h-4" /> For You
                </TabsTrigger>
                <TabsTrigger value="trending" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all flex items-center gap-2 italic">
                  <TrendingUp className="w-4 h-4" /> Trending
                </TabsTrigger>
                <TabsTrigger value="new" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all flex items-center gap-2 italic">
                  <Clock className="w-4 h-4" /> New
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        <section className="container mx-auto px-4 mb-24">
          {submissionsLoading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">Synchronizing Registry...</p>
            </div>
          ) : (
            <MasonryFeed initialWebsites={filteredWebsites as any} hideEndMessage={true} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}