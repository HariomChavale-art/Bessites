
"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES, Website } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight, LayoutGrid, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils, Baby, Rocket, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WebsitePreview } from "@/components/website-preview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const CATEGORIES = [
  { name: "AI & Future", icon: Sparkles, color: "text-purple-400" },
  { name: "Gaming", icon: Gamepad2, color: "text-red-400" },
  { name: "Tools", icon: Wrench, color: "text-blue-400" },
  { name: "Education", icon: GraduationCap, color: "text-green-400" },
  { name: "Design", icon: Palette, color: "text-pink-400" },
  { name: "Developer", icon: Cpu, color: "text-orange-400" },
  { name: "Health", icon: HeartPulse, color: "text-rose-400" },
  { name: "Food", icon: Utensils, color: "text-amber-400" },
];

export default function ExplorePage() {
  const featured = MOCK_WEBSITES.filter(w => w.isSponsored).slice(0, 3);
  
  const trending = MOCK_WEBSITES.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)).slice(0, 4);
  
  const newlyAdded = MOCK_WEBSITES.filter(w => w.updatedAt.includes("2024")).reverse().slice(0, 4);
  
  const recommended = MOCK_WEBSITES.filter(w => w.rating >= 4.8).slice(0, 4);
  
  const playTabs = ["For you", "Top charts", "Children", "Premium", "Categories"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Play Store Top Tabs */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="For you" className="w-full">
            <TabsList className="bg-transparent h-12 w-full justify-start gap-8 overflow-x-auto no-scrollbar rounded-none border-none p-0">
              {playTabs.map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-2 text-sm font-semibold text-muted-foreground transition-all"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8 space-y-12 pb-32">
        
        {/* Categories Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
              <LayoutGrid className="w-5 h-5 text-primary" />
              Browse Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Button 
                key={cat.name} 
                variant="outline" 
                className="h-16 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 rounded-2xl flex items-center justify-start gap-4 px-5 transition-all"
              >
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
                <span className="text-sm font-bold text-white">{cat.name}</span>
              </Button>
            ))}
          </div>
        </section>

        <Separator className="bg-white/5" />

        {/* New Releases Section */}
        <CuratedListSection 
          title="New" 
          items={newlyAdded} 
        />

        <Separator className="bg-white/5" />

        {/* Trending Section */}
        <CuratedListSection 
          title="Trending" 
          items={trending} 
        />

        <Separator className="bg-white/5" />

        {/* Recommended Section */}
        <CuratedListSection 
          title="Recommended" 
          items={recommended} 
        />

        <Separator className="bg-white/5" />

        {/* Accounting/Utility Mock Section */}
        <CuratedListSection 
          title="Productivity & Accounting" 
          items={MOCK_WEBSITES.filter(w => w.categories.includes("Tools")).slice(4, 8)} 
        />

      </main>
    </div>
  );
}

function CuratedListSection({ title, items }: { title: string, items: Website[] }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-white/5">See all</Button>
      </div>
      
      <div className="space-y-4">
        {items.map((app) => (
          <Link key={app.id} href={`/website/${app.id}`} className="flex items-center gap-8 p-4 rounded-[2.5rem] hover:bg-white/5 transition-colors group">
            {/* Main App Logo - Increased Size */}
            <div className="relative w-28 h-28 rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 p-5 shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-500">
              <WebsitePreview 
                websiteId={app.id}
                websiteUrl={app.url}
                fallbackUrl={app.imageUrl}
                alt={app.name}
                width={256}
                height={256}
                mode="logo"
                className="w-full h-full"
              />
            </div>

            {/* App Info */}
            <div className="flex-1 min-w-0 py-2">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white truncate group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                {app.isSponsored && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/30 text-primary uppercase font-bold">
                    Ad
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                {app.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{app.rating}</span>
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                </div>
                <Badge variant="secondary" className="bg-white/5 text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-2.5 py-0.5 border-white/5">
                  {app.categories[0]}
                </Badge>
              </div>
            </div>

            {/* Secondary Action - Hidden on small mobile */}
            <div className="hidden sm:flex flex-col items-center justify-center gap-3 shrink-0">
               <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/5 p-4 opacity-80">
                <WebsitePreview 
                  websiteId={app.id}
                  websiteUrl={app.url}
                  fallbackUrl={app.imageUrl}
                  alt={app.name}
                  width={128}
                  height={128}
                  mode="logo"
                  className="w-full h-full grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              <Button size="sm" variant="ghost" className="text-xs font-bold uppercase tracking-widest text-[#8ab4f8] h-8 px-0 hover:bg-transparent group-hover:translate-x-1 transition-transform">
                Visit <ChevronRight className="w-4 h-4 ml-0.5" />
              </Button>
            </div>

            <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
