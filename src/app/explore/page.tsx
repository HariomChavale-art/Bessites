
"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES, Website } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight, LayoutGrid, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils, MoreVertical, ExternalLink } from "lucide-react";
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
  const trending = MOCK_WEBSITES.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)).slice(0, 6);
  const newlyAdded = MOCK_WEBSITES.filter(w => w.updatedAt.includes("2024")).reverse().slice(0, 6);
  const recommended = MOCK_WEBSITES.filter(w => w.rating >= 4.8).slice(0, 6);
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

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-12 space-y-24 pb-48">
        
        {/* Categories Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white flex items-center gap-4 tracking-tighter">
              <LayoutGrid className="w-8 h-8 text-primary" />
              Browse by Interest
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Button 
                key={cat.name} 
                variant="outline" 
                className="h-24 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 rounded-3xl flex items-center justify-start gap-6 px-8 transition-all hover:scale-[1.02]"
              >
                <cat.icon className={`w-10 h-10 ${cat.color}`} />
                <span className="text-lg font-bold text-white">{cat.name}</span>
              </Button>
            ))}
          </div>
        </section>

        <Separator className="bg-white/5" />

        {/* New Releases Section */}
        <CuratedListSection 
          title="Newly Added" 
          items={newlyAdded} 
        />

        <Separator className="bg-white/5" />

        {/* Trending Section */}
        <CuratedListSection 
          title="Trending Now" 
          items={trending} 
        />

        <Separator className="bg-white/5" />

        {/* Recommended Section */}
        <CuratedListSection 
          title="Top Rated" 
          items={recommended} 
        />

      </main>
    </div>
  );
}

function CuratedListSection({ title, items }: { title: string, items: Website[] }) {
  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-extrabold text-white tracking-tighter">{title}</h2>
        <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-white/5 text-lg">View All Collections</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-12">
        {items.map((app) => (
          <Link key={app.id} href={`/website/${app.id}`} className="group relative">
            <div className="flex flex-col md:flex-row items-start gap-12 p-8 rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 overflow-hidden">
              
              {/* Vertical Logo + Name Block */}
              <div className="flex flex-col items-center gap-5 w-full md:w-56 shrink-0 text-center">
                <div className="relative w-44 h-44 rounded-[3rem] overflow-hidden bg-card/80 border border-white/10 p-6 shadow-2xl group-hover:scale-105 transition-transform duration-700 ring-1 ring-white/5">
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
                  <span className="text-2xl font-black text-white group-hover:text-primary transition-colors tracking-tight block">
                    {app.name}
                  </span>
                  <Badge variant="secondary" className="bg-white/10 text-[10px] uppercase font-black tracking-widest px-3 py-1 text-muted-foreground border-none">
                    {app.categories[0]}
                  </Badge>
                </div>
              </div>

              {/* Catchy Title + Detailed Description Block */}
              <div className="flex-1 min-w-0 md:pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <h4 className="text-3xl font-extrabold text-white leading-tight tracking-tighter group-hover:text-primary transition-colors">
                    {app.description}
                  </h4>
                  {app.isSponsored && (
                    <Badge variant="outline" className="text-[10px] py-1 px-3 border-primary/30 text-primary uppercase font-black shrink-0">
                      Ad
                    </Badge>
                  )}
                </div>

                <p className="text-xl text-muted-foreground line-clamp-3 leading-relaxed mb-8 font-medium">
                  {app.longDescription}
                </p>

                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white">{app.rating}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i <= Math.floor(app.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="h-6 w-[1px] bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-lg">{app.reviewCount.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Active Users</span>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="hidden lg:flex flex-col items-center justify-center gap-6 shrink-0 pl-4">
                 <Button className="bg-white text-background hover:bg-white/90 rounded-2xl h-16 px-10 font-black text-lg shadow-2xl transition-all active:scale-95">
                    GET <ExternalLink className="w-5 h-5 ml-2" strokeWidth={3} />
                 </Button>
                 <Button variant="ghost" className="text-muted-foreground font-bold hover:bg-white/5 rounded-xl">
                   Save to Feed
                 </Button>
              </div>

              <div className="absolute top-8 right-8 lg:hidden">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreVertical className="w-8 h-8" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
