"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  LayoutGrid, 
  Sparkles, 
  Gamepad2, 
  Wrench, 
  Cpu, 
  Palette, 
  Zap, 
  X, 
  TrendingUp, 
  Tag, 
  MoreHorizontal, 
  Laptop, 
  BookOpen, 
  Music, 
  Camera, 
  ShieldCheck, 
  FileText, 
  Globe,
  PenTool,
  Code,
  Rocket,
  Cloud,
  Brain,
  Map,
  PartyPopper,
  Paintbrush,
  Mic,
  Newspaper,
  Hammer,
  BarChart3,
  Lightbulb,
  Briefcase,
  List,
  Home,
  FlaskConical,
  Atom,
  Calculator,
  Film,
  Tv,
  Plane,
  Utensils,
  Dumbbell,
  Leaf,
  Info,
  History
} from "lucide-react";
import Link from "next/link";
import { WebsitePreview } from "@/components/website-preview";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useFirestore, useDoc, useUser, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CATEGORIES = [
  { name: "AI", icon: Sparkles, color: "text-purple-400" },
  { name: "Gaming", icon: Gamepad2, color: "text-red-400" },
  { name: "Coding", icon: Code, color: "text-blue-400" },
  { name: "Design", icon: Palette, color: "text-pink-400" },
  { name: "Space", icon: Rocket, color: "text-indigo-400" },
  { name: "Earth & Weather", icon: Cloud, color: "text-cyan-400" },
  { name: "Brain Games", icon: Brain, color: "text-amber-400" },
  { name: "Geography", icon: Map, color: "text-green-400" },
  { name: "Fun", icon: PartyPopper, color: "text-yellow-400" },
  { name: "OSINT", icon: Search, color: "text-slate-400" },
  { name: "Creative", icon: Paintbrush, color: "text-rose-400" },
  { name: "Voice", icon: Mic, color: "text-violet-400" },
  { name: "Music", icon: Music, color: "text-blue-300" },
  { name: "Reading", icon: BookOpen, color: "text-emerald-400" },
  { name: "News", icon: Newspaper, color: "text-orange-400" },
  { name: "Utilities", icon: Hammer, color: "text-stone-400" },
  { name: "Internet", icon: Globe, color: "text-sky-400" },
  { name: "SEO", icon: BarChart3, color: "text-lime-400" },
  { name: "Startups", icon: Rocket, color: "text-red-300" },
  { name: "Ideas", icon: Lightbulb, color: "text-yellow-300" },
  { name: "Freelancing", icon: Briefcase, color: "text-teal-400" },
  { name: "AI Directories", icon: List, color: "text-fuchsia-400" },
  { name: "Home", icon: Home, color: "text-orange-300" },
  { name: "Science", icon: FlaskConical, color: "text-blue-500" },
  { name: "Physics", icon: Atom, color: "text-purple-500" },
  { name: "Math", icon: Calculator, color: "text-green-500" },
  { name: "Movies", icon: Film, color: "text-red-500" },
  { name: "TV", icon: Tv, color: "text-orange-500" },
  { name: "Travel", icon: Plane, color: "text-cyan-500" },
  { name: "Food", icon: Utensils, color: "text-yellow-500" },
  { name: "Fitness", icon: Dumbbell, color: "text-rose-500" },
  { name: "Nature", icon: Leaf, color: "text-emerald-500" },
  { name: "Interesting", icon: Info, color: "text-zinc-400" },
  { name: "PDF", icon: FileText, color: "text-red-300" },
  { name: "Productivity", icon: Laptop, color: "text-indigo-400" },
  { name: "History", icon: History, color: "text-amber-600" },
];

const TRENDING_CATEGORY_NAMES = ["AI", "Gaming", "Space", "Geography", "Fun", "Startups", "History"];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useUser();
  const db = useFirestore();

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userDocRef);
  const userInterests = profile?.interests || [];

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
      categories: s.categories || ["Web App"],
      url: s.url,
      pricing: "Free",
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

  const visibleCategories = useMemo(() => {
    const relevant = CATEGORIES.filter(c => 
      TRENDING_CATEGORY_NAMES.includes(c.name) || userInterests.includes(c.name)
    );
    const seen = new Set();
    return relevant.filter(c => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    }).slice(0, 10);
  }, [userInterests]);

  const filteredModalCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return CATEGORIES;
    return CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase().trim())
    );
  }, [categorySearchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-16 sm:space-y-24 pb-48">
        
        <section className="max-w-4xl mx-auto w-full pt-4 sm:pt-8">
          <div className="relative group">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search hidden gems..." 
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
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              Top Interests
            </h2>
            <div className="flex gap-2">
              {selectedCategory && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCategory(null)}
                  className="text-primary font-bold hover:bg-white/5"
                >
                  <X className="w-4 h-4 mr-2" /> Clear
                </Button>
              )}
              <Dialog onOpenChange={(open) => !open && setCategorySearchQuery("")}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 font-bold">
                    <MoreHorizontal className="w-4 h-4 mr-2" /> More Interests
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background border-white/10 text-white rounded-[2.5rem] max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden">
                  <DialogHeader className="p-8 pb-4">
                    <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">All Discovery Tags</DialogTitle>
                    <div className="relative mt-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Filter categories..." 
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 rounded-xl h-12 text-sm font-bold focus:ring-primary"
                      />
                    </div>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {filteredModalCategories.length > 0 ? (
                        filteredModalCategories.map((cat) => (
                          <Button 
                            key={cat.name} 
                            variant="outline" 
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setCategorySearchQuery("");
                            }}
                            className={cn(
                              "h-16 bg-white/5 border-white/5 hover:bg-white/10 rounded-2xl flex items-center gap-3 px-4 transition-all text-left justify-start",
                              selectedCategory === cat.name && "border-primary bg-primary/10"
                            )}
                          >
                            <cat.icon className={cn(`w-5 h-5 shrink-0`, cat.color)} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white truncate">{cat.name}</span>
                          </Button>
                        ))
                      ) : (
                        <div className="col-span-full py-12 text-center text-muted-foreground font-medium italic">
                          No categories match your search.
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-6">
            {visibleCategories.map((cat) => (
              <Button 
                key={cat.name} 
                variant="outline" 
                onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
                className={cn(
                  "h-16 sm:h-24 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-start gap-3 sm:gap-4 px-4 sm:px-6 transition-all hover:scale-[1.02]",
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
              {selectedCategory || searchQuery ? "Matching Results" : "Discovery Feed"}
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
                <p className="text-xl text-muted-foreground font-medium">No results found. Try a different interest.</p>
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
  const totalLikes = stats?.likeCount || 0;
  const totalVisits = stats?.visitCount || 0;
  const isTrending = totalVisits > 50 || totalLikes > 10;

  return (
    <div className="group relative">
      <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-12 p-5 sm:p-8 rounded-3xl sm:rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 overflow-hidden min-h-fit">
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
                "flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider bg-white text-black border-none"
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

        <div className="flex-1 min-w-0 py-2">
          <Link href={`/website/${app.id}`} className="block mb-4">
            <h4 className="text-xl sm:text-3xl font-extrabold text-white leading-tight tracking-tighter group-hover:text-primary transition-colors whitespace-normal">
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
