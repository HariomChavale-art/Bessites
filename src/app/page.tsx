
"use client"

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
        // Logic: Filter based on whether any tag maps to the user's selected broad categories
        const matches = results.filter(w => 
          w.categories.some(tag => {
            const mappedBroads = getBroadCategoriesForTag(tag);
            return mappedBroads.some(b => userBroadInterests.includes(b));
          })
        );
        const nonMatches = results.filter(w => !matches.includes(w));
        const shuffledNonMatches = [...nonMatches].sort(() => Math.random() - 0.5);
        
        matches.sort((a, b) => {
          const aCount = a.categories.filter(tag => getBroadCategoriesForTag(tag).some(b => userBroadInterests.includes(b))).length;
          const bCount = b.categories.filter(tag => getBroadCategoriesForTag(tag).some(b => userBroadInterests.includes(b))).length;
          return bCount - aCount;
        });

        results = [...matches, ...shuffledNonMatches];
        break;
    }
    
    return results;
  }, [activeTab, userBroadInterests, allAvailableWebsites, globalStats]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <Navigation />
      
      <main className="flex-1">
        {/* NEW VINTAGE FRAME HERO SECTION */}
        <section className="container mx-auto px-4 mt-8 sm:mt-12 mb-12">
          <div className="relative w-full max-w-5xl mx-auto">
            {/* The Ornate Frame Layout */}
            <div className="relative min-h-[250px] sm:min-h-[350px] md:min-h-[400px] w-full flex items-center justify-center overflow-hidden border border-white/5 bg-white/[0.01] rounded-[3rem] sm:rounded-[5rem]">
              
              {/* Decorative Flourishes Mimicking the provided image */}
              <div className="absolute left-0 top-0 bottom-0 w-1/4 hidden lg:flex items-center justify-center opacity-10 pointer-events-none">
                 <div className="w-64 h-64 border-8 border-white/50 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white/30 rounded-full border-dotted" />
                 </div>
              </div>
              
              {/* Central Message Container */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12">
                <div className="mb-8 flex items-center gap-4 text-primary opacity-50">
                  <div className="h-px w-8 sm:w-16 bg-current" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] italic">Registry Node Status</span>
                  <div className="h-px w-8 sm:w-16 bg-current" />
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  WEBSITE <br />
                  <span className="text-primary underline decoration-white/10 underline-offset-[12px]">INCOMING</span>
                </h1>

                <p className="mt-10 text-muted-foreground font-bold text-[9px] sm:text-xs uppercase tracking-[0.4em] opacity-40 max-w-lg italic">
                  The Discovery Pipeline is currently synchronizing high-fidelity assets for the community.
                </p>
              </div>

              {/* Right Side Frame Ornament */}
              <div className="absolute right-0 top-0 bottom-0 w-12 border-l border-white/5 hidden lg:block opacity-20">
                 <div className="h-full w-full bg-gradient-to-l from-white/10 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/[0.01] p-6 rounded-[2rem] border border-white/5">
            <div className="space-y-1">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Discovery <span className="text-primary">Node</span></h2>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 italic">Filter verified assets by community pulse</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5 overflow-x-auto no-scrollbar shrink-0">
              <Tabs defaultValue="foryou" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-transparent h-auto gap-1">
                  <TabsTrigger value="foryou" className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary transition-all flex items-center gap-2 italic"><Sparkles className="w-4 h-4" /> For You</TabsTrigger>
                  <TabsTrigger value="trending" className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary flex items-center gap-2 italic"><TrendingUp className="w-4 h-4" /> Trending</TabsTrigger>
                  <TabsTrigger value="new" className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary flex items-center gap-2 italic"><Clock className="w-4 h-4" /> New</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-2">
          <MasonryFeed key={activeTab + userBroadInterests.join(',') + filteredWebsites.length} initialWebsites={filteredWebsites} hideEndMessage={true} />
        </section>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 italic">
            <a href="/about" className="hover:text-primary transition-colors">About Us</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          <p className="text-xs text-muted-foreground opacity-20 font-black uppercase tracking-widest">© 2024 Bessites Studio. Absolute Discovery.</p>
        </div>
      </footer>
    </div>
  );
}
