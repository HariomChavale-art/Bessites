
"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, MoreVertical, LayoutGrid, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const suggested = MOCK_WEBSITES.slice(0, 6);
  const trending = MOCK_WEBSITES.slice(6, 12);
  const playTabs = ["For you", "Top charts", "Children", "Premium", "Categories", "New releases", "Editor's Choice"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Play Store Top Tabs */}
      <div className="sticky top-16 z-40 bg-background border-b border-white/5">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="For you" className="w-full">
            <TabsList className="bg-transparent h-12 w-full justify-start gap-6 overflow-x-auto no-scrollbar rounded-none border-none p-0">
              {playTabs.map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-2 text-sm font-medium text-muted-foreground transition-all"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 space-y-10 pb-32">
        
        {/* Featured Hero Carousel */}
        <section>
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {featured.map((app) => (
                <CarouselItem key={app.id}>
                  <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] border border-white/5 bg-card shadow-2xl">
                    {/* Background Artwork */}
                    <div className="relative aspect-[16/9] w-full">
                      <Image 
                        src={app.screenshots[0]} 
                        alt={app.name} 
                        fill 
                        className="object-cover opacity-80"
                        data-ai-hint="app banner"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      
                      {/* Floating Update Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-3 py-1 border-none font-semibold">
                          Update available
                        </Badge>
                      </div>
                      
                      {/* Hero Content Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-lg md:text-xl font-bold line-clamp-2 leading-tight">
                          {app.description}
                        </h3>
                      </div>
                    </div>

                    {/* App Info Bar */}
                    <div className="p-4 flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                        <Image src={app.imageUrl} alt={app.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{app.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{app.developer}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-white">{app.rating}</span>
                          <Star className="w-3 h-3 text-white fill-white" />
                          <span className="text-[10px] text-muted-foreground border border-white/20 px-1 rounded">3+</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 font-bold h-9">
                          Visit
                        </Button>
                        <span className="text-[9px] text-muted-foreground mt-1">In-app purchases</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Categories Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Button 
                key={cat.name} 
                variant="outline" 
                className="h-14 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 rounded-2xl flex items-center justify-start gap-3 px-4 transition-all"
              >
                <cat.icon className={`w-5 h-5 ${cat.color}`} />
                <span className="text-sm font-semibold text-white">{cat.name}</span>
              </Button>
            ))}
          </div>
        </section>

        {/* Suggested For You - Vertical List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Sponsored <span className="text-muted-foreground font-normal mx-1">•</span> Suggested for You
            </h2>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {suggested.map((app) => (
              <Link key={app.id} href={`/website/${app.id}`} className="flex items-center gap-4 group">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/5 shadow-md shrink-0 group-hover:scale-95 transition-transform">
                  <Image src={app.imageUrl} alt={app.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{app.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{app.categories[0]} • {app.size}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold text-white">{app.rating}</span>
                      <Star className="w-2.5 h-2.5 text-white fill-white" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Verified
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Horizontal Category Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Editors' Choice</h2>
            <Button variant="link" className="text-primary text-sm p-0">See more</Button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {trending.map((app) => (
              <Link key={app.id} href={`/website/${app.id}`} className="min-w-[120px] max-w-[120px] flex flex-col gap-2 group">
                <div className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-white/5 shadow-lg group-hover:scale-95 transition-transform">
                  <Image src={app.imageUrl} alt={app.name} fill className="object-cover" />
                </div>
                <div className="px-1">
                  <h3 className="text-[11px] font-bold text-white truncate leading-tight">{app.name}</h3>
                  <p className="text-[10px] text-muted-foreground truncate">{app.size}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
