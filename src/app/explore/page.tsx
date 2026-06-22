
"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES, Website } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils, ExternalLink, Heart, Tag, X } from "lucide-react";
import Link from "next/link";
import { WebsitePreview } from "@/components/website-preview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, deleteDoc, increment } from "firebase/firestore";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "AI", icon: Sparkles, color: "text-purple-400" },
  { name: "Gaming", icon: Gamepad2, color: "text-red-400" },
  { name: "Tools", icon: Wrench, color: "text-blue-400" },
  { name: "Education", icon: GraduationCap, color: "text-green-400" },
  { name: "Design", icon: Palette, color: "text-pink-400" },
  { name: "Dev", icon: Cpu, color: "text-orange-400" },
  { name: "Health", icon: HeartPulse, color: "text-rose-400" },
  { name: "Food", icon: Utensils, color: "text-amber-400" },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Default lists for the curated view
  const trending = useMemo(() => [...MOCK_WEBSITES].sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)).slice(0, 6), []);
  const newlyAdded = useMemo(() => MOCK_WEBSITES.filter(w => w.updatedAt.includes("2024")).reverse().slice(0, 6), []);
  const recommended = useMemo(() => MOCK_WEBSITES.filter(w => w.rating >= 4.8).slice(0, 6), []);
  
  const playTabs = ["Premium", "Categories"];

  // Search and Category filtering logic
  const filteredResults = useMemo(() => {
    if (!searchQuery && !selectedCategory) return null;
    
    return MOCK_WEBSITES.filter(app => {
      const matchesSearch = !searchQuery || 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        app.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <Tabs defaultValue="Categories" className="w-full">
            <TabsList className="bg-transparent h-12 w-full justify-start gap-4 sm:gap-8 overflow-x-auto no-scrollbar rounded-none border-none p-0">
              {playTabs.map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-2 text-[13px] sm:text-sm font-semibold text-muted-foreground transition-all shrink-0"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-16 sm:space-y-24 pb-48">
        
        <section className="max-w-4xl mx-auto w-full">
          <div className="relative group">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search for tools, games, and web apps..." 
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
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
                <span className="text-sm sm:text-lg font-bold text-white truncate">{cat.name}</span>
              </Button>
            ))}
          </div>
        </section>

        {filteredResults ? (
          <section className="space-y-8 sm:space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tighter">
                {selectedCategory ? `${selectedCategory} Results` : "Search Results"}
                <span className="ml-4 text-sm font-medium text-muted-foreground">({filteredResults.length} items)</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:gap-12">
              {filteredResults.length > 0 ? (
                filteredResults.map((app) => (
                  <ExploreItemRow key={app.id} app={app} />
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <LayoutGrid className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
                  <p className="text-xl text-muted-foreground font-medium">No results found for your search.</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            <Separator className="bg-white/5" />
            <CuratedListSection title="Newly Added" items={newlyAdded} />
            <Separator className="bg-white/5" />
            <CuratedListSection title="Trending Now" items={trending} />
            <Separator className="bg-white/5" />
            <CuratedListSection title="Top Recommended" items={recommended} />
          </>
        )}

      </main>
    </div>
  );
}

function CuratedListSection({ title, items }: { title: string, items: Website[] }) {
  return (
    <section className="space-y-8 sm:space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tighter">{title}</h2>
        <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-white/5 text-sm sm:text-lg">View All</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:gap-12">
        {items.map((app) => (
          <ExploreItemRow key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}

function ExploreItemRow({ app }: { app: Website }) {
  const { user } = useUser();
  const db = useFirestore();
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    
    const likeRef = doc(db, "users", user.uid, "likedWebsites", app.id);
    const statsRef = doc(db, "websiteStats", app.id);

    if (liked) {
      deleteDoc(likeRef);
      setDoc(statsRef, { ratingSum: increment(-1), ratingCount: increment(-1) }, { merge: true });
    } else {
      setDoc(likeRef, { id: app.id, timestamp: new Date().toISOString() });
      setDoc(statsRef, { ratingSum: increment(5), ratingCount: increment(1) }, { merge: true });
    }
    setLiked(!liked);
  };

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case "Paid": return "bg-black text-white border-white/20";
      case "Free": return "bg-white text-black border-none";
      case "Freemium":
      default: return "bg-secondary text-secondary-foreground border-white/10";
    }
  };

  return (
    <Link href={`/website/${app.id}`} className="group relative">
      <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-12 p-5 sm:p-8 rounded-3xl sm:rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 overflow-hidden">
        
        <div className="flex flex-col items-center gap-3 sm:gap-5 w-full md:w-48 shrink-0 text-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-card/80 border border-white/10 p-4 sm:p-6 shadow-xl group-hover:scale-105 transition-transform duration-700">
            <WebsitePreview 
              websiteId={app.id}
              websiteUrl={app.url}
              fallbackUrl={app.imageUrl}
              alt={app.name}
              width={512}
              height={512}
              mode="logo"
              className="w-full h-full"
            />
          </div>
          <div className="space-y-1">
            <span className="text-xl sm:text-2xl font-black text-white group-hover:text-primary transition-colors tracking-tight block">
              {app.name}
            </span>
            <Badge variant="secondary" className="bg-white/10 text-[9px] uppercase font-black tracking-widest px-2 sm:px-3 py-1 text-muted-foreground border-none">
              {app.categories[0]}
            </Badge>
          </div>
        </div>

        <div className="flex-1 min-w-0 md:pt-4">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="text-xl sm:text-3xl font-extrabold text-white leading-tight tracking-tighter group-hover:text-primary transition-colors line-clamp-2">
              {app.description}
            </h4>
          </div>

          <p className="text-sm sm:text-xl text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed mb-6 sm:mb-8 font-medium">
            {app.longDescription}
          </p>

          <div className="flex items-center gap-6 sm:gap-10">
            <div className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-base font-black uppercase tracking-wider",
              getPricingStyle(app.pricing)
            )}>
              <Tag className="w-5 h-5" />
              {app.pricing}
            </div>
            <div className="h-4 sm:h-6 w-[1px] bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm sm:text-lg flex items-center gap-2 italic">
                {app.updatedAt}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Last Updated</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center gap-4 shrink-0 pl-4">
           <Button className="bg-white text-background hover:bg-white/90 rounded-2xl h-14 px-8 font-black text-lg shadow-xl">
              GET <ExternalLink className="w-5 h-5 ml-2" />
           </Button>
           <Button 
            variant="ghost" 
            onClick={(e) => {
              e.preventDefault();
              handleLike(e);
            }}
            className={liked ? "text-primary" : "text-muted-foreground"}
          >
             <Heart className={liked ? "fill-current w-5 h-5 mr-2" : "w-5 h-5 mr-2"} />
             {liked ? "Liked" : "Like"}
           </Button>
        </div>

        <div className="absolute top-5 right-5 lg:hidden flex gap-2">
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.preventDefault();
              handleLike(e);
            }}
            className={liked ? "text-primary" : "text-muted-foreground"}
          >
             <Heart className={liked ? "fill-current w-6 h-6" : "w-6 h-6"} />
           </Button>
        </div>
      </div>
    </Link>
  );
}
