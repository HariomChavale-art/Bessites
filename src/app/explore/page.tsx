"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  TrendingUp, 
  X, 
  Tag, 
  LayoutGrid,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { WebsitePreview } from "@/components/website-preview";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { BROAD_CATEGORIES, INTERESTS, getInterestsForTag } from "@/lib/category-mapping";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const { user } = useUser();
  const db = useFirestore();

  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), where("status", "==", "approved"));
  }, [db]);

  const { data: submittedSites } = useCollection(submissionsRef);

  const allWebsites = useMemo(() => {
    const firestoreSites = (submittedSites || []).map(s => ({
      id: s.id,
      name: s.name || s.url?.split('//')[1]?.split('.')[0] || "New Project",
      websiteName: s.websiteName || s.name,
      developer: s.userEmail || "Community",
      description: s.description || "User submitted project",
      categories: s.categories || ["Web App"],
      url: s.url,
      pricing: "Free",
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

  const filteredResults = useMemo(() => {
    return allWebsites.filter(app => {
      const queryText = searchQuery.toLowerCase().trim();
      const brand = (app.websiteName || app.name).toLowerCase();
      const matchesSearch = !searchQuery || 
        brand.includes(queryText) ||
        app.description.toLowerCase().includes(queryText) ||
        app.url.toLowerCase().includes(queryText) ||
        app.categories.some(cat => cat.toLowerCase().includes(queryText));
      
      const mappedInterests = (app.categories || []).flatMap(tag => getInterestsForTag(tag));
      const matchesInterest = !selectedInterest || mappedInterests.includes(selectedInterest);
      
      const matchesSector = !selectedSector || INTERESTS.some(i => i.group === selectedSector && mappedInterests.includes(i.name));
        
      return matchesSearch && matchesInterest && matchesSector;
    });
  }, [searchQuery, selectedInterest, selectedSector, allWebsites]);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-16 sm:space-y-24">
        
        <section className="max-w-4xl mx-auto w-full pt-4 sm:pt-8">
          <div className="relative group">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search 250+ tools..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 sm:pl-16 bg-white/5 border-white/10 rounded-2xl sm:rounded-[2.5rem] h-14 sm:h-20 text-base sm:text-xl font-bold focus:ring-primary focus:border-primary transition-all shadow-xl"
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-bold text-white flex items-center gap-3 sm:gap-4 tracking-tighter">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              Broad Sectors
            </h2>
            {(selectedInterest || selectedSector) && (
              <button 
                onClick={() => { setSelectedInterest(null); setSelectedSector(null); }}
                className="text-primary font-bold hover:bg-white/5 text-xs px-4"
              >
                <X className="w-4 h-4 mr-2 inline" /> Clear Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-6">
            {BROAD_CATEGORIES.map((cat) => (
              <Button 
                key={cat.id} 
                variant="outline" 
                onClick={() => setSelectedSector(cat.id === selectedSector ? null : cat.id)}
                className={cn(
                  "h-16 sm:h-24 bg-white/5 border-white/5 hover:bg-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-start gap-3 sm:gap-4 px-4 sm:px-6 transition-all",
                  selectedSector === cat.id && "border-primary bg-primary/10"
                )}
              >
                <cat.icon className={cn(`w-6 h-6 sm:w-10 sm:h-10 shrink-0`, cat.color)} />
                <span className="text-xs sm:text-sm font-bold text-white truncate">{cat.name}</span>
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-8 sm:space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tighter">
              {selectedInterest || selectedSector || searchQuery ? "Matching Results" : "Discovery Feed"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:gap-12">
            {filteredResults.length > 0 ? (
              filteredResults.map((app) => (
                <ExploreItemRow key={`${app.id}-${app.name}`} app={app as any} />
              ))
            ) : (
              <div className="py-20 text-center space-y-4 bg-white/[0.02] rounded-[3rem] border border-white/5">
                <LayoutGrid className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
                <p className="text-xl text-white font-bold italic tracking-tighter uppercase">Zero Matches Found</p>
                <Button variant="outline" onClick={() => { setSelectedInterest(null); setSelectedSector(null); setSearchQuery(""); }} className="rounded-full">Show All</Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ExploreItemRow({ app }: { app: any }) {
  const brandName = app.websiteName || app.name;
  const rawExplainingTitle = app.websiteName ? app.name : app.description?.split('.')[0] || "Discovery Hub";
  
  // Clean explainer title
  const explainer = rawExplainingTitle.includes('|') 
    ? rawExplainingTitle.split('|')[1].trim() 
    : rawExplainingTitle.replace(brandName, '').replace(/^[\s\-|]+/, '').trim() || "Discover More";
    
  // Combine format: Brand Name | Short Explainer
  const displayTitle = `${brandName} | ${explainer.slice(0, 40)}${explainer.length > 40 ? '...' : ''}`;
    
  const uniqueCategories = Array.from(new Set(app.categories || []));

  return (
    <div className="group relative">
      <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-12 p-5 sm:p-8 rounded-3xl sm:rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 overflow-hidden min-h-fit">
        <Link href={`/website/${app.id}`} className="flex flex-col items-center gap-3 sm:gap-5 w-full md:w-48 shrink-0 text-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden flex items-center justify-center p-4 shadow-xl group-hover:scale-105 transition-transform">
            <WebsitePreview 
              websiteId={app.id}
              websiteUrl={app.url}
              fallbackUrl={app.logoUrl || app.imageUrl || ""}
              alt={brandName}
              width={512}
              height={512}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-black text-[10px] font-black uppercase">
            <Tag className="w-3 h-3" />
            {app.pricing}
          </div>
        </Link>

        <div className="flex-1 min-w-0 py-2">
          <div className="block mb-4">
            <h4 className="text-xl sm:text-3xl font-headline font-bold italic text-white leading-tight tracking-tighter">
              {displayTitle}
            </h4>
            <div className="flex items-center gap-3 mt-3 mb-2">
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] italic">
                Verified Asset
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {uniqueCategories.slice(0, 4).map((cat: any) => (
              <span key={`${app.id}-${cat}`} className="text-[9px] font-black uppercase tracking-widest text-primary/60 border border-primary/10 px-2.5 py-1 rounded-lg">{cat}</span>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <Link href={`/website/${app.id}`}>
              <Button className="rounded-xl h-10 px-6 bg-primary text-white font-bold uppercase text-[10px] italic">View Insight</Button>
            </Link>
            <a 
              href={app.url} 
              target="_blank" 
              className="text-[10px] font-bold text-zinc-400 hover:text-purple-400 uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              Visit <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
