"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils, X, Briefcase, Zap, Layout, TrendingUp, Tag } from "lucide-react";
import Link from "next/link";
import { WebsitePreview } from "@/components/website-preview";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useFirestore, useCollection, useDoc } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Gaming", icon: Gamepad2, color: "text-red-400" },
  { name: "AI", icon: Sparkles, color: "text-purple-400" },
  { name: "Tools", icon: Wrench, color: "text-blue-400" },
  { name: "Productivity", icon: Briefcase, color: "text-indigo-400" },
  { name: "Education", icon: GraduationCap, color: "text-green-400" },
  { name: "Design", icon: Palette, color: "text-pink-400" },
  { name: "Dev", icon: Cpu, color: "text-orange-400" },
  { name: "3D", icon: Layout, color: "text-violet-400" },
  { name: "Fun", icon: Zap, color: "text-blue-300" },
  { name: "Health", icon: HeartPulse, color: "text-rose-400" },
  { name: "Food", icon: Utensils, color: "text-amber-400" },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const db = useFirestore();

  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "submissions");
  }, [db]);

  const { data: submittedSites } = useCollection(submissionsRef);

  const allWebsites = useMemo(() => {
    const firestoreSites = (submittedSites || []).map(s => ({
      id: s.id,
      name: s.name || s.url?.split('//')[1]?.split('.')[0] || "New Project",
      developer: s.userEmail || "Community",
      description: s.description || "User submitted project",
      longDescription: s.longDescription || "A project shared by the Bessites community.",
      categories: s.categories || ["Web App"],
      rating: 0,
      reviewCount: 0,
      pricing: "Free",
      imageUrl: s.logoUrl || "",
      screenshots: [],
      url: s.url,
      updatedAt: "2024",
      ...s
    }));
    
    const uniquePool = [...MOCK_WEBSITES];
    const seenIds = new Set(uniquePool.map(w => w.id));
    
    firestoreSites.forEach(s => {
      if (!seenIds.has(s.id)) {
        uniquePool.push(s);
        seenIds.add(s.id);
      }
    });

    return uniquePool;
  }, [submittedSites]);

  const filteredResults = useMemo(() => {
    return allWebsites.filter(app => {
      const queryText = searchQuery.toLowerCase().trim();
      
      const matchesSearch = !searchQuery || 
        app.name.toLowerCase().includes(queryText) ||
        app.description.toLowerCase().includes(queryText) ||
        app.url.toLowerCase().includes(queryText) ||
        app.categories.some(cat => cat.toLowerCase().includes(queryText));
      
      const matchesCategory = !selectedCategory || 
        app.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allWebsites]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-16 sm:space-y-24 pb-48">
        
        <section className="max-w-4xl mx-auto w-full pt-4 sm:pt-8">
          <div className="relative group">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by name, category, or URL..." 
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

        <section>
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-bold text-white flex items-center gap-3 sm:gap-4 tracking-tighter">
              <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              Browse by Interest
            </h2>
            {selectedCategory && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCategory(null)}
                className="text-primary font-bold hover:bg-white/5"
              >
                <X className="w-4 h-4 mr-2" /> Clear filter
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <Button 
                key={cat.name} 
                variant="outline" 
                onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
                className={cn(
                  "h-16 sm:h-24 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-start gap-3 sm:gap-6 px-4 sm:px-8 transition-all hover:scale-[1.02]",
                  selectedCategory === cat.name && "border-primary bg-primary/10"
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
              {selectedCategory || searchQuery ? "Matching Results" : "All Unique Projects"}
              <span className="ml-4 text-sm font-medium text-muted-foreground">({filteredResults.length})</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:gap-12">
            {filteredResults.length > 0 ? (
              filteredResults.map((app) => (
                <ExploreItemRow key={app.id} app={app as any} />
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <LayoutGrid className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
                <p className="text-xl text-muted-foreground font-medium">No matches found. Try exploring by interest.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ExploreItemRow({ app }: { app: any }) {
  const db = useFirestore();
  
  const statsRef = useMemo(() => {
    if (!db) return null;
    return doc(db, "websiteStats", app.id);
  }, [db, app.id]);

  const { data: stats } = useDoc(statsRef);

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case "Paid": return "bg-white text-black border-none";
      case "Free": return "bg-black text-white border-white/20";
      case "Freemium":
      default: return "bg-secondary text-secondary-foreground border-white/10";
    }
  };

  const totalLikes = stats?.likeCount || 0;
  const totalVisits = stats?.visitCount || 0;
  const isTrending = totalVisits > 100 || totalLikes > 20;

  return (
    <div className="group relative">
      <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-12 p-5 sm:p-8 rounded-3xl sm:rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 overflow-hidden">
        <Link href={`/website/${app.id}`} className="flex flex-col items-center gap-3 sm:gap-5 w-full md:w-48 shrink-0 text-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-card/80 border border-white/10 shadow-xl group-hover:scale-105 transition-transform duration-700">
            <WebsitePreview 
              websiteId={app.id}
              websiteUrl={app.url}
              fallbackUrl={app.imageUrl || ""}
              alt={app.name}
              width={512}
              height={512}
              className="w-full h-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider",
                getPricingStyle(app.pricing)
              )}>
                <Tag className="w-3 h-3" />
                {app.pricing}
              </div>
              {isTrending && (
                <div className="flex items-center gap-1 bg-primary text-white px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter italic">
                  <TrendingUp className="w-2.5 h-2.5" /> Community Pick
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="flex-1 min-w-0 text-center md:text-left">
          <Link href={`/website/${app.id}`} className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-3">
            <h4 className="text-xl sm:text-3xl font-extrabold text-white leading-tight tracking-tighter group-hover:text-primary transition-colors line-clamp-2">
              {app.name} • <span className="text-muted-foreground font-normal">{app.description}</span>
            </h4>
          </Link>
          <div className="text-[10px] sm:text-xs text-muted-foreground/30 font-medium tracking-widest uppercase">
            {app.url.replace('https://', '').replace('www.', '').split('/')[0]}
          </div>
        </div>
      </div>
    </div>
  );
}
