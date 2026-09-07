
"use client"

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { MasonryFeed } from "@/components/masonry-feed";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock, Loader2, Star, Zap } from "lucide-react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getBroadCategoriesForTag } from "@/lib/category-mapping";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
      categories: s.categories || ["Web App"],
      imageUrl: s.logoUrl || "",
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
        const matches = results.filter(w => 
          w.categories.some(tag => {
            const mappedBroads = getBroadCategoriesForTag(tag);
            return mappedBroads.some(b => userBroadInterests.includes(b));
          })
        );
        const nonMatches = results.filter(w => !matches.includes(w));
        const shuffledNonMatches = [...nonMatches].sort(() => Math.random() - 0.5);
        results = [...matches, ...shuffledNonMatches];
        break;
    }
    
    return results;
  }, [activeTab, userBroadInterests, allAvailableWebsites, globalStats]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

  const featuredPartner = allAvailableWebsites[0]; // Logic for selecting spotlight

  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <Navigation />
      
      <main className="flex-1">
        {/* Featured Partner Spotlight */}
        <section className="container mx-auto px-4 mt-12 mb-8">
           <Card className="bg-gradient-to-br from-primary/10 to-transparent border border-white/5 rounded-[3rem] p-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                 <div className="w-32 h-32 rounded-3xl bg-black/40 border border-white/10 p-6 shrink-0 shadow-inner">
                    <img src={featuredPartner?.imageUrl || `https://logo.clearbit.com/${featuredPartner?.url.split('//')[1]?.split('/')[0]}`} alt="Featured" className="w-full h-full object-contain" />
                 </div>
                 <div className="flex-1 space-y-4 text-center md:text-left">
                    <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1 italic">⭐ Featured Partner</Badge>
                    <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-white">{featuredPartner?.websiteName || featuredPartner?.name}</h2>
                    <p className="text-muted-foreground font-medium max-w-2xl italic leading-relaxed text-lg line-clamp-2">
                       {featuredPartner?.description}
                    </p>
                    <div className="flex items-center gap-6 justify-center md:justify-start">
                       <a 
                        href={featuredPartner?.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="h-12 px-10 rounded-xl bg-white text-black font-black uppercase text-xs italic flex items-center gap-2 hover:scale-105 transition-transform"
                       >
                         Visit Asset <Zap className="w-4 h-4 fill-current" />
                       </a>
                    </div>
                 </div>
              </div>
           </Card>
        </section>

        <section className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                Discovery <span className="text-primary">Pipeline</span>
              </h1>
              <p className="text-muted-foreground font-medium text-sm sm:text-base max-w-lg opacity-60">
                The leading professional directory for zero-bloat digital utility.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/[0.02] p-1.5 rounded-[1.5rem] border border-white/5 overflow-x-auto no-scrollbar">
              <Tabs defaultValue="foryou" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-transparent h-auto gap-1">
                  <TabsTrigger value="foryou" className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary transition-all flex items-center gap-2 italic"><Sparkles className="w-4 h-4" /> For You</TabsTrigger>
                  <TabsTrigger value="trending" className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary flex items-center gap-2 italic"><TrendingUp className="w-4 h-4" /> Trending</TabsTrigger>
                  <TabsTrigger value="new" className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary flex items-center gap-2 italic"><Clock className="w-4 h-4" /> New</TabsTrigger>
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
