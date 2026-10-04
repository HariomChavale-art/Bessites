'use client';

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { MasonryFeed } from "@/components/masonry-feed";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Clock, Loader2, ShieldCheck, Globe, Zap, Heart, Info } from "lucide-react";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getBroadCategoriesForTag } from "@/lib/category-mapping";
import { OuneoAssistant } from "@/components/ouneo-assistant";
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
        <section className="container mx-auto px-4 mt-8 sm:mt-12 mb-12">
          <div className="relative w-full max-w-6xl mx-auto aspect-[16/7] sm:aspect-[21/9] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://i.imgur.com/9wYu3Sc.png" 
                alt="Incoming Frame" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                <div className="absolute left-[9.5%] top-[48.5%] -translate-y-1/2 w-[21%] flex items-center justify-center">
                  <h1 className="text-[1.5vw] sm:text-2xl md:text-3xl lg:text-4xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-lg">WEBSITE</h1>
                </div>
                <div className="absolute left-[36%] sm:left-[34%] top-[48.5%] -translate-y-1/2 w-[55%] flex items-center justify-start pl-[2%]">
                  <h1 className="text-[4vw] sm:text-4xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-primary leading-none drop-shadow-2xl">INCOMING</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* High-Value Introduction for AdSense Crawler */}
        <section className="container mx-auto px-4 mb-16 max-w-4xl text-center space-y-6">
          <div className="flex items-center justify-center gap-3 text-primary mb-4">
             <Info className="w-6 h-6" />
             <h2 className="text-xl font-bold uppercase italic tracking-widest">About Ouneo Engine</h2>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed font-medium italic">
            Ouneo is an AI-powered search engine designed to help you discover the absolute best tools from our verified registry of over 1000+ digital assets. Unlike traditional search, Ouneo uses natural language processing to understand your specific workflow needs—whether you're looking to remove a background, generate a cinematic video, or optimize your code. Our mission is to eliminate "Low Value Content" and provide a direct pipeline to functional, hand-picked webs and applications that empower your digital productivity. Start a conversation with our engine below to find the perfect tool for your next project.
          </p>
          <div className="h-px w-24 bg-white/10 mx-auto" />
        </section>

        {/* Ouneo Assistant Implementation */}
        <section className="container mx-auto px-4 mb-20">
          <OuneoAssistant />
        </section>

        <section className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-end gap-8 bg-white/[0.01] p-6 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5 overflow-x-auto no-scrollbar shrink-0 w-full sm:w-auto">
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

        <section className="container mx-auto px-2 mb-24">
          <MasonryFeed key={activeTab + userBroadInterests.join(',') + filteredWebsites.length} initialWebsites={filteredWebsites} hideEndMessage={true} />
        </section>

        {/* AdSense Compliance Content Section */}
        <section className="container mx-auto px-4 py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Absolute <span className="text-primary">Discovery</span> Pipeline</h2>
              <p className="text-muted-foreground text-lg">Uncovering the 1% of the modern web through human-centric curation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 text-primary">
                  <Globe className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase italic">A Global Registry</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Bessites operates as a premier digital directory, meticulously archiving over 100 high-impact interests across the web. Our mission is to solve the problem of "Low Value Content" by providing real, functional, and verified resources to developers, designers, and digital builders. Every asset in our node is manually reviewed to ensure it meets our "Zero Padding" standards.
                </p>
              </div>

              <div className="space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase italic">Verified Node Assets</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike automated search engines, Bessites prioritizes human intelligence. We believe discovery should be an intentional process, not a byproduct of an algorithm. Our interaction ledgers and community feedback nodes provide a layer of trust that automated tools can't replicate. When you discover an asset here, you are accessing the definitive version of that tool.
                </p>
              </div>

              <div className="space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 text-primary">
                  <Zap className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase italic">High-Velocity Growth</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The internet moves at an exponential pace. Bessites is built on a high-velocity framework that synchronizes new tool launches, experimental web art, and enterprise-grade software daily. Our categorized sectors—from AI Image Generation to Quantitative Trading—allow users to pivot through the internet's most productive corners with just a few clicks.
                </p>
              </div>

              <div className="space-y-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 text-primary">
                  <Heart className="w-6 h-6" />
                  <h3 className="text-xl font-bold uppercase italic">The Creator Suite</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Bessites isn't just for discovery; it's a launchpad for creators. Our Creator Hub allows developers to submit their digital properties directly to our global ad-boost pipeline. By leveraging our verified audience, emerging tools can achieve "Absolute Discovery" and build a loyal user base within our professional tech-noir community.
                </p>
              </div>
            </div>

            <div className="pt-10 text-center">
              <p className="text-muted-foreground italic text-sm max-w-2xl mx-auto">
                Discover curated tools and apps updated every 24 hours. No duplication, no padding—only the high-fidelity web tools that empower your digital life.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 italic">
            <a href="/about" className="hover:text-primary transition-colors">About Us</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground opacity-40 font-bold uppercase">Official Support Node</p>
            <a href="mailto:contact@ouneo.com" className="text-sm font-black text-white hover:text-primary transition-colors tracking-widest">contact@ouneo.com</a>
          </div>
          <p className="text-xs text-muted-foreground opacity-20 font-black uppercase tracking-widest pt-8">© 2024 Bessites Studio. Powered by Ouneo.</p>
        </div>
      </footer>
    </div>
  );
}
