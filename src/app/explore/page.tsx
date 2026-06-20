
"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES, Website } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, MoreVertical, LayoutGrid, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils, Baby, Rocket, Laptop } from "lucide-react";
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
  // Filtering actual websites for specific curated sections
  const featured = MOCK_WEBSITES.filter(w => w.isSponsored).slice(0, 5);
  
  const gamersChoice = MOCK_WEBSITES.filter(w => 
    w.categories.some(cat => ["Gaming", "Strategy"].includes(cat))
  ).slice(0, 12);
  
  const kidsFavourite = MOCK_WEBSITES.filter(w => 
    w.categories.some(cat => ["Fun", "Education", "Art"].includes(cat))
  ).slice(0, 12);
  
  const aiProductivity = MOCK_WEBSITES.filter(w => 
    w.categories.some(cat => ["AI", "Productivity", "Tools", "Dev"].includes(cat))
  ).slice(0, 12);
  
  const topCharts = MOCK_WEBSITES.sort((a, b) => b.rating - a.rating).slice(0, 6);
  
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

      <main className="flex-1 container mx-auto px-4 py-6 space-y-12 pb-32">
        
        {/* Featured Hero Carousel */}
        <section>
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {featured.map((app) => (
                <CarouselItem key={app.id}>
                  <Link href={`/website/${app.id}`}>
                    <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] border border-white/5 bg-card shadow-2xl transition-transform hover:scale-[0.99]">
                      <div className="relative aspect-[16/9] w-full">
                        <Image 
                          src={app.imageUrl} 
                          alt={app.name} 
                          fill 
                          className="object-cover opacity-80"
                          data-ai-hint="app banner"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary/90 hover:bg-primary text-white rounded-full px-3 py-1 border-none font-semibold text-[10px] uppercase tracking-wider">
                            Editor's Choice
                          </Badge>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-lg md:text-2xl font-bold line-clamp-2 leading-tight drop-shadow-md">
                            {app.description}
                          </h3>
                        </div>
                      </div>

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
                          <Button className="bg-[#8ab4f8] hover:bg-[#8ab4f8]/90 text-background rounded-xl px-6 font-bold h-9">
                            Visit
                          </Button>
                          <span className="text-[9px] text-muted-foreground mt-1">{app.pricing}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
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

        {/* Gamer's Choice - Horizontal List */}
        <CuratedSection 
          title="Gamer's Choice" 
          subtitle="The best web-based gaming experiences" 
          items={gamersChoice} 
          icon={<Gamepad2 className="w-5 h-5 text-red-500" />}
        />

        {/* Top Charts / Suggested For You - Vertical List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Top Rated <span className="text-muted-foreground font-normal mx-1">•</span> Suggested for You
            </h2>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {topCharts.map((app) => (
              <Link key={app.id} href={`/website/${app.id}`} className="flex items-center gap-4 group">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/5 shadow-md shrink-0 group-hover:scale-95 transition-transform">
                  <Image src={app.imageUrl} alt={app.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{app.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{app.categories[0]} • {app.developer}</p>
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
                <Button variant="ghost" size="sm" className="text-[#8ab4f8] font-bold hover:bg-white/5">Visit</Button>
              </Link>
            ))}
          </div>
        </section>

        {/* Kids' Favourite - Horizontal List */}
        <CuratedSection 
          title="Kids' Favourite" 
          subtitle="Fun, education, and creative play" 
          items={kidsFavourite} 
          icon={<Baby className="w-5 h-5 text-pink-500" />}
        />

        {/* AI & Productivity - Horizontal List */}
        <CuratedSection 
          title="AI & Productivity" 
          subtitle="Work smarter with intelligent tools" 
          items={aiProductivity} 
          icon={<Rocket className="w-5 h-5 text-blue-500" />}
        />

      </main>
    </div>
  );
}

function CuratedSection({ title, subtitle, items, icon }: { title: string, subtitle: string, items: Website[], icon: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {icon}
            {title}
          </h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Button variant="link" className="text-[#8ab4f8] text-sm p-0 font-bold">See all</Button>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
        {items.map((app) => (
          <Link key={app.id} href={`/website/${app.id}`} className="min-w-[140px] max-w-[140px] flex flex-col gap-2 group">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 shadow-lg group-hover:scale-95 transition-transform">
              <Image src={app.imageUrl} alt={app.name} fill className="object-cover" />
            </div>
            <div className="px-1">
              <h3 className="text-[12px] font-bold text-white truncate leading-tight group-hover:text-[#8ab4f8] transition-colors">{app.name}</h3>
              <p className="text-[10px] text-muted-foreground truncate">{app.categories[0]}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-white">{app.rating}</span>
                <Star className="w-2.5 h-2.5 text-white fill-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
