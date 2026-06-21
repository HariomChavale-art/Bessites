
"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES, Website } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight, LayoutGrid, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils, MoreVertical } from "lucide-react";
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

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 space-y-16 pb-32">
        
        {/* Categories Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
              <LayoutGrid className="w-6 h-6 text-primary" />
              Browse Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Button 
                key={cat.name} 
                variant="outline" 
                className="h-20 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 rounded-2xl flex items-center justify-start gap-5 px-6 transition-all"
              >
                <cat.icon className={`w-8 h-8 ${cat.color}`} />
                <span className="text-base font-bold text-white">{cat.name}</span>
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

      </main>
    </div>
  );
}

function CuratedListSection({ title, items }: { title: string, items: Website[] }) {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
        <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-white/5 text-lg">See all</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {items.map((app) => (
          <Link key={app.id} href={`/website/${app.id}`} className="flex items-center gap-10 p-6 rounded-[3rem] hover:bg-white/5 transition-colors group">
            {/* Main App Logo - Massive Size for Visibility */}
            <div className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 p-6 shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-500">
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

            {/* App Info */}
            <div className="flex-1 min-w-0 py-4">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-3xl font-bold text-white truncate group-hover:text-primary transition-colors tracking-tight">
                  {app.name}
                </h3>
                {app.isSponsored && (
                  <Badge variant="outline" className="text-xs py-0.5 px-2 border-primary/30 text-primary uppercase font-black">
                    Ad
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground line-clamp-2 leading-relaxed mb-4 max-w-2xl font-medium">
                {app.description}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{app.rating}</span>
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <Badge variant="secondary" className="bg-white/5 text-xs text-muted-foreground uppercase font-black tracking-widest px-4 py-1.5 border-white/5">
                  {app.categories[0]}
                </Badge>
              </div>
            </div>

            {/* Secondary Action - Visual Confirmation */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-4 shrink-0 pr-4">
               <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/5 p-4 opacity-90 group-hover:opacity-100 transition-opacity">
                <WebsitePreview 
                  websiteId={app.id}
                  websiteUrl={app.url}
                  fallbackUrl={app.imageUrl}
                  alt={app.name}
                  width={256}
                  height={256}
                  mode="logo"
                  className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <Button size="lg" variant="ghost" className="text-sm font-black uppercase tracking-[0.2em] text-[#8ab4f8] h-10 px-0 hover:bg-transparent group-hover:translate-x-2 transition-transform">
                Visit <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>

            <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
              <MoreVertical className="w-6 h-6" />
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
