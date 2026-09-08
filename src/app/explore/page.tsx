
"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  TrendingUp, 
  X, 
  Sparkles,
  LayoutGrid,
  Filter,
  ExternalLink
} from "lucide-react";
import { WebsitePreview } from "@/components/website-preview";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { INTERESTS, BROAD_CATEGORIES } from "@/lib/category-mapping";
import Link from "next/link";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const db = useFirestore();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchQuery]);

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

  const filteredResults = useMemo(() => {
    return allWebsites.filter(app => {
      const queryText = debouncedQuery.toLowerCase().trim();
      const matchesSearch = !debouncedQuery || 
        (app.websiteName || app.name).toLowerCase().includes(queryText) ||
        app.description.toLowerCase().includes(queryText) ||
        app.url.toLowerCase().includes(queryText) ||
        app.categories.some(cat => cat.toLowerCase().includes(queryText));
      
      const matchesInterest = !selectedInterest || app.categories.includes(selectedInterest);
      const matchesSector = !selectedSector || app.categories.some(cat => 
        INTERESTS.some(i => i.group === selectedSector && i.name === cat)
      );
        
      return matchesSearch && matchesInterest && matchesSector;
    });
  }, [debouncedQuery, selectedInterest, selectedSector, allWebsites]);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-12">
        
        <section className="max-w-4xl mx-auto w-full pt-4 sm:pt-8">
          <div className="relative group">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search registry (name, tools, description)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 sm:pl-16 bg-white/5 border-white/10 rounded-2xl sm:rounded-[2.5rem] h-14 sm:h-20 text-base sm:text-xl font-bold focus:ring-primary focus:border-primary transition-all shadow-xl"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Quick Filter
            </h2>
            {(selectedSector || selectedInterest || searchQuery) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setSelectedSector(null); setSelectedInterest(null); setSearchQuery(""); }}
                className="text-[10px] font-black uppercase text-primary hover:bg-primary/10"
              >
                Clear All
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 scroll-smooth">
            {BROAD_CATEGORIES.map(sector => (
              <Button
                key={sector.id}
                variant="outline"
                onClick={() => setSelectedSector(selectedSector === sector.id ? null : sector.id)}
                className={cn(
                  "h-12 px-6 rounded-xl bg-white/5 border-white/5 shrink-0 transition-all font-bold text-xs uppercase italic",
                  selectedSector === sector.id ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" : "hover:bg-white/10"
                )}
              >
                <sector.icon className={cn("w-4 h-4 mr-2", !selectedSector && sector.color)} />
                {sector.name}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-8 sm:space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tighter">
              {filteredResults.length} Matching Tools
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/20 italic">
              <TrendingUp className="w-3 h-3" /> Registry Status: Verified
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:gap-12">
            {filteredResults.length > 0 ? (
              filteredResults.map((app) => (
                <ExploreItemRow key={`explore-${app.id}`} app={app as any} />
              ))
            ) : (
              <div className="py-32 text-center space-y-4 bg-white/[0.02] rounded-[3rem] border border-white/5 border-dashed">
                <LayoutGrid className="w-16 h-16 text-muted-foreground mx-auto opacity-10" />
                <div className="space-y-1">
                  <p className="text-xl text-white font-black italic tracking-tighter uppercase">No results found</p>
                  <p className="text-muted-foreground font-medium text-sm">Try broadening your search keywords.</p>
                </div>
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
  const discoveryTitle = app.websiteName ? app.name : "";
  const uniqueCategories = Array.from(new Set(app.categories || []));

  return (
    <div className="group relative">
      <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-12 p-5 sm:p-8 rounded-3xl sm:rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500">
        <Link href={`/website/${app.id}`} className="flex flex-col items-center gap-3 sm:gap-5 w-full md:w-48 shrink-0 text-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden flex items-center justify-center p-4 shadow-xl group-hover:scale-105 transition-transform duration-700">
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
          <div className={cn(
            "px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider bg-white text-black border-none shadow-lg"
          )}>
            {app.pricing || 'Free'}
          </div>
        </Link>

        <div className="flex-1 min-w-0 py-2">
          <div className="block mb-4">
            <h4 className="text-xl sm:text-4xl font-headline font-bold italic text-white leading-tight tracking-tighter truncate">
              {brandName}
            </h4>
            {discoveryTitle && (
              <p className="text-sm sm:text-lg text-white/70 font-medium leading-tight mt-1">
                {discoveryTitle}
              </p>
            )}
          </div>
          <p className="text-sm sm:base text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-2 italic">
            {app.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {uniqueCategories.slice(0, 4).map((cat: string) => (
              <span key={`cat-${app.id}-${cat}`} className="text-[9px] font-black uppercase tracking-widest text-primary/60 border border-primary/10 px-2.5 py-1 rounded-lg">{cat}</span>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <Link href={`/website/${app.id}`}>
              <Button className="rounded-xl h-10 px-8 bg-primary text-white font-black uppercase text-[10px] italic shadow-lg shadow-primary/20">Explore Insight</Button>
            </Link>
            <a 
              href={app.url} 
              target="_blank" 
              rel="noopener noreferrer" 
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
