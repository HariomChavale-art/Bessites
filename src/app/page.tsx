'use client';

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { MasonryFeed } from "@/components/masonry-feed";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getBroadCategoriesForTag } from "@/lib/category-mapping";
import { Footer } from "@/components/footer";
import { Loader2 } from "lucide-react";

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
    const seen = new Set();
    let results = registry.filter(s => {
      const url = s.url?.toLowerCase().trim();
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    });
    
    if (activeTab === "trending") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (activeTab === "new") {
      results.reverse();
    }
    
    return results;
  }, [activeTab, firestoreSites]);

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navigation />
      
      <main className="flex-1">
        <section className="container mx-auto px-4 mt-24 mb-16 text-center space-y-6">
           <h1 className="text-5xl sm:text-7xl font-semibold italic text-halloween-bone leading-tight tracking-tightest">
             Discovery <span className="text-primary">Registry.</span>
           </h1>
           <p className="text-xl text-zinc-500 font-medium italic max-w-2xl mx-auto">
             A living index of the internet's most useful, well-crafted websites.
           </p>
        </section>

        <section className="container mx-auto px-4 mb-12 flex justify-center">
          <div className="bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] shadow-specular">
            <Tabs defaultValue="foryou" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-transparent h-auto gap-1">
                {['foryou', 'trending', 'new'].map(t => (
                  <TabsTrigger key={t} value={t} className="rounded-lg px-6 py-2 text-[11px] font-semibold uppercase tracking-widest data-[state=active]:bg-white/[0.08] data-[state=active]:text-white transition-all italic">
                    {t.replace(/([A-Z])/g, ' $1').trim()}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </section>

        <section className="container mx-auto px-2 mb-24">
          {submissionsLoading ? (
            <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-800" /></div>
          ) : (
            <MasonryFeed initialWebsites={filteredWebsites as any} hideEndMessage={true} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}