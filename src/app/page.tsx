'use client';

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { MasonryFeed } from "@/components/masonry-feed";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock, Loader2, Globe, ShieldCheck, Zap, Flame } from "lucide-react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getBroadCategoriesForTag } from "@/lib/category-mapping";
import { Footer } from "@/components/footer";
import { OuneoAssistant } from "@/components/ouneo-assistant";
import { FlameBadge } from "@/components/halloween/FlameBadge";

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
    
    switch (activeTab) {
      case "trending":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "new":
        results.reverse();
        break;
      case "foryou":
      default:
        const matches = results.filter(w => 
          (w.categories || []).some((tag: string) => {
            const mappedBroads = getBroadCategoriesForTag(tag);
            return mappedBroads.some(b => userBroadInterests.includes(b));
          })
        );
        const nonMatches = results.filter(w => !matches.includes(w));
        results = [...matches, ...nonMatches];
        break;
    }
    
    return results;
  }, [activeTab, userBroadInterests, firestoreSites]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-halloween-void"><Loader2 className="w-12 h-12 animate-spin text-halloween-pumpkin" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-transparent pb-32">
      <Navigation />
      
      <main className="flex-1">
        <section className="container mx-auto px-4 mt-16 mb-12 text-center space-y-6">
           <div className="flex justify-center">
             <FlameBadge intensity="high">Halloween Registry Active</FlameBadge>
           </div>
           <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter text-halloween-bone">
             Discovery <span className="text-halloween-pumpkin">Grimoire.</span>
           </h1>
           <OuneoAssistant />
        </section>

        <section className="container mx-auto px-4 mb-8 flex justify-center">
          <div className="bg-halloween-obsidian/40 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-halloween-pumpkin/10 overflow-x-auto no-scrollbar shadow-pumpkin-glow">
            <Tabs defaultValue="foryou" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-transparent h-auto gap-1">
                <TabsTrigger value="foryou" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-halloween-pumpkin data-[state=active]:text-halloween-void transition-all flex items-center gap-2 italic"><Sparkles className="w-4 h-4" /> For You</TabsTrigger>
                <TabsTrigger value="trending" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-halloween-pumpkin data-[state=active]:text-halloween-void flex items-center gap-2 italic"><TrendingUp className="w-4 h-4" /> Trending</TabsTrigger>
                <TabsTrigger value="new" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-halloween-pumpkin data-[state=active]:text-halloween-void flex items-center gap-2 italic"><Clock className="w-4 h-4" /> New</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        <section className="container mx-auto px-2 mb-12">
          {submissionsLoading ? (
            <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-halloween-pumpkin" /></div>
          ) : (
            <MasonryFeed initialWebsites={filteredWebsites as any} hideEndMessage={true} />
          )}
        </section>

        <section className="container mx-auto px-4 py-20 border-t border-halloween-pumpkin/10">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-halloween-bone">Absolute <span className="text-halloween-pumpkin">Discovery</span> Crypt</h2>
              <p className="text-halloween-fog text-lg italic">Uncovering the highest tier of the modern web through occult curation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 p-8 rounded-[3rem] bg-halloween-obsidian/40 backdrop-blur-xl border border-halloween-pumpkin/10 shadow-pumpkin-glow">
                <div className="flex items-center gap-3 text-halloween-pumpkin">
                  <Globe className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase italic">A Global Grimoire</h3>
                </div>
                <p className="text-halloween-fog leading-relaxed italic">
                  Bessites operates as a premier digital directory, meticulously archiving high-utility assets across extensive curated categories. Every entry is audited by our spectral nodes.
                </p>
              </div>

              <div className="space-y-4 p-8 rounded-[3rem] bg-halloween-obsidian/40 backdrop-blur-xl border border-halloween-witchcraft/10 shadow-witch-glow">
                <div className="flex items-center gap-3 text-halloween-mystic">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase italic">Verified Phantoms</h3>
                </div>
                <p className="text-halloween-fog leading-relaxed italic">
                  Unlike automated search engines, Bessites prioritizes human intelligence. Our registry is a sanctuary for high-fidelity professional tools.
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
