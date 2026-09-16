
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
  ExternalLink,
  ChevronRight
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
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search 250+ tools..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 bg-white/[0.03] border-white/10 rounded-[2.5rem] h-20 text-xl font-bold focus:ring-primary focus:border-primary transition-all shadow-2xl"
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white flex items-center gap-4 tracking-tighter uppercase italic">
              <TrendingUp className="w-8 h-8 text-primary" />
              Broad Sectors
            </h2>
            {(selectedInterest || selectedSector) && (
              <button 
                onClick={() => { setSelectedInterest(null); setSelectedSector(null); }}
                className="text-primary font-black uppercase tracking-widest hover:bg-white/5 text-[10px] px-4 py-2 rounded-xl"
              >
                <X className="w-4 h-4 mr-2 inline" /> Clear Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {BROAD_CATEGORIES.map((cat) => (
              <Button 
                key={cat.id} 
                variant="outline" 
                onClick={() => setSelectedSector(cat.id === selectedSector ? null : cat.id)}
                className={cn(
                  "h-24 bg-white/[0.02] border-white/5 hover:bg-white/[0.05] rounded-[2rem] flex items-center justify-start gap-4 px-6 transition-all group",
                  selectedSector === cat.id && "border-primary bg-primary/10"
                )}
              >
                <cat.icon className={cn(`w-10 h-10 shrink-0 group-hover:scale-110 transition-transform`, cat.color)} />
                <span className="text-xs font-bold text-white uppercase tracking-widest">{cat.name}</span>
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              {selectedInterest || selectedSector || searchQuery ? "Matching Results" : "Discovery Feed"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((app) => (
                <ExploreItemRow key={`${app.id}-${app.name}`} app={app as any} />
              ))
            ) : (
              <div className="py-24 text-center space-y-4 bg-white/[0.02] rounded-[3.5rem] border border-white/5">
                <LayoutGrid className="w-16 h-16 text-muted-foreground mx-auto opacity-10" />
                <p className="text-2xl text-white font-black italic tracking-tighter uppercase opacity-30">Zero Matches Found</p>
                <Button variant="outline" onClick={() => { setSelectedInterest(null); setSelectedSector(null); setSearchQuery(""); }} className="rounded-full h-12 px-8 uppercase font-bold text-[10px]">Show All Assets</Button>
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
  const description = app.description || "Digital property in the discovery registry.";
  const uniqueCategories = Array.from(new Set(app.categories || []));
  const domain = app.url.replace('https://', '').replace('www.', '').split('/')[0];

  return (
    <Link 
      href={`/website/${app.id}`}
      className="group relative block"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-[2.5rem] bg-[#121218] border border-white/[0.08] hover:border-purple-500/40 transition-all duration-500 overflow-hidden">
        
        <div className="w-16 h-16 rounded-2xl bg-[#1a1a24] border border-white/10 flex items-center justify-center p-2 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
          <WebsitePreview 
            websiteId={app.id}
            websiteUrl={app.url}
            fallbackUrl={app.logoUrl || app.imageUrl || ""}
            alt={brandName}
            width={128}
            height={128}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0 text-center md:text-left space-y-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
              {brandName}
            </h4>
            <div className="flex items-center justify-center md:justify-start gap-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-primary italic px-2 py-0.5 bg-primary/10 rounded-md">Verified Asset</span>
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{app.pricing}</span>
            </div>
          </div>
          <p className="text-sm text-zinc-400 font-medium line-clamp-1 opacity-70">
            {description}
          </p>
        </div>

        <div className="hidden lg:flex flex-wrap gap-2 max-w-[300px] justify-end">
          {uniqueCategories.slice(0, 3).map((cat: any) => (
            <span key={`${app.id}-${cat}`} className="text-[9px] font-black uppercase tracking-widest text-white/20 border border-white/5 px-2.5 py-1 rounded-lg">{cat}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 pl-4 border-l border-white/5">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-zinc-500">{domain}</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
              <ChevronRight className="w-5 h-5 text-white" />
           </div>
        </div>
      </div>
    </Link>
  );
}
