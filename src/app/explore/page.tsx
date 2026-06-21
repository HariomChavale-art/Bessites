
"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES, Website } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Star, LayoutGrid, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils, MoreVertical, ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import { WebsitePreview } from "@/components/website-preview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, deleteDoc, increment } from "firebase/firestore";

const CATEGORIES = [
  { name: "AI & Tech", icon: Sparkles, color: "text-purple-400" },
  { name: "Gaming", icon: Gamepad2, color: "text-red-400" },
  { name: "Tools", icon: Wrench, color: "text-blue-400" },
  { name: "Education", icon: GraduationCap, color: "text-green-400" },
  { name: "Design", icon: Palette, color: "text-pink-400" },
  { name: "Dev", icon: Cpu, color: "text-orange-400" },
  { name: "Health", icon: HeartPulse, color: "text-rose-400" },
  { name: "Food", icon: Utensils, color: "text-amber-400" },
];

export default function ExplorePage() {
  const trending = MOCK_WEBSITES.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)).slice(0, 6);
  const newlyAdded = MOCK_WEBSITES.filter(w => w.updatedAt.includes("2024")).reverse().slice(0, 6);
  const recommended = MOCK_WEBSITES.filter(w => w.rating >= 4.8).slice(0, 6);
  const playTabs = ["For you", "Top charts", "Children", "Premium", "Categories"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <Tabs defaultValue="For you" className="w-full">
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
              className="pl-12 sm:pl-16 bg-white/5 border-white/10 rounded-2xl sm:rounded-[2.5rem] h-14 sm:h-20 text-base sm:text-xl font-bold focus:ring-primary focus:border-primary transition-all shadow-xl"
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-bold text-white flex items-center gap-3 sm:gap-4 tracking-tighter">
              <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              Browse by Interest
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <Button 
                key={cat.name} 
                variant="outline" 
                className="h-16 sm:h-24 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-start gap-3 sm:gap-6 px-4 sm:px-8 transition-all hover:scale-[1.02]"
              >
                <cat.icon className={`w-6 h-6 sm:w-10 sm:h-10 ${cat.color} shrink-0`} />
                <span className="text-sm sm:text-lg font-bold text-white truncate">{cat.name}</span>
              </Button>
            ))}
          </div>
        </section>

        <Separator className="bg-white/5" />

        <CuratedListSection title="Newly Added" items={newlyAdded} />
        <Separator className="bg-white/5" />
        <CuratedListSection title="Trending Now" items={trending} />
        <Separator className="bg-white/5" />
        <CuratedListSection title="Top Rated" items={recommended} />

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

  return (
    <Link href={`/website/${app.id}`} className="group relative">
      <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-12 p-5 sm:p-8 rounded-3xl sm:rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 overflow-hidden">
        
        <div className="flex flex-col items-center gap-3 sm:gap-5 w-full md:w-48 shrink-0 text-center">
          <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-card/80 border border-white/10 p-4 sm:p-6 shadow-xl group-hover:scale-105 transition-transform duration-700">
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
            {app.isSponsored && (
              <Badge variant="outline" className="text-[9px] py-0.5 px-2 border-primary/30 text-primary uppercase font-black shrink-0">
                Ad
              </Badge>
            )}
          </div>

          <p className="text-sm sm:text-xl text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed mb-6 sm:mb-8 font-medium">
            {app.longDescription}
          </p>

          <div className="flex items-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-lg sm:text-2xl font-black text-white">{app.rating}</span>
              <div className="flex gap-0.5 sm:gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${i <= Math.floor(app.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="h-4 sm:h-6 w-[1px] bg-white/10" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm sm:text-lg">{app.reviewCount.toLocaleString()}</span>
              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Users</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center gap-4 shrink-0 pl-4">
           <Button className="bg-white text-background hover:bg-white/90 rounded-2xl h-14 px-8 font-black text-lg shadow-xl">
              GET <ExternalLink className="w-5 h-5 ml-2" />
           </Button>
           <Button 
            variant="ghost" 
            onClick={handleLike}
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
            onClick={handleLike}
            className={liked ? "text-primary" : "text-muted-foreground"}
          >
             <Heart className={liked ? "fill-current w-6 h-6" : "w-6 h-6"} />
           </Button>
           <Button variant="ghost" size="icon" className="text-muted-foreground">
             <MoreVertical className="w-6 h-6" />
           </Button>
        </div>
      </div>
    </Link>
  );
}
