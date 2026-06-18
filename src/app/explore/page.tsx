"use client"

import { Navigation } from "@/components/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Zap, Gift, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ExplorePage() {
  const topCharts = MOCK_WEBSITES.sort((a, b) => b.rating - a.rating).slice(0, 5);
  const newlyUpdated = MOCK_WEBSITES.slice(5, 10);
  const categories = ["Gaming", "Design", "Productivity", "Education", "Fun", "Tools"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline font-bold text-white mb-8">Explore</h1>

        {/* Categories Chips */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
          {categories.map((cat) => (
            <Badge 
              key={cat} 
              variant="outline" 
              className="px-6 py-2 rounded-full border-white/10 bg-white/5 hover:bg-primary hover:text-white cursor-pointer transition-all whitespace-nowrap text-sm font-medium"
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Play Store Style Section: Top Charts */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Charts
            </h2>
            <Link href="/" className="text-sm text-primary font-medium">See more</Link>
          </div>
          
          <div className="space-y-4">
            {topCharts.map((app, idx) => (
              <Link key={app.id} href={`/website/${app.id}`} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-colors group">
                <span className="w-6 text-center font-bold text-muted-foreground">{idx + 1}</span>
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                  <Image src={app.imageUrl} alt={app.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate group-hover:text-primary transition-colors">{app.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{app.developer} • {app.categories[0]}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-medium text-white">{app.rating}</span>
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Horizontal Section: Recommended */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Recommended for you
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {newlyUpdated.map((app) => (
              <Link key={app.id} href={`/website/${app.id}`} className="min-w-[160px] max-w-[160px] flex flex-col gap-2 group">
                <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-xl group-hover:scale-95 transition-transform duration-300">
                  <Image src={app.imageUrl} alt={app.name} fill className="object-cover" />
                </div>
                <div className="px-1">
                  <h3 className="text-sm font-bold text-white truncate">{app.name}</h3>
                  <p className="text-xs text-muted-foreground">{app.size}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Grid: Events & Offers */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" />
            Events & Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/20 to-purple-900/20 border-white/10 p-6 rounded-3xl overflow-hidden relative group cursor-pointer">
              <div className="relative z-10">
                <Badge className="bg-white/10 text-white mb-4">Limited Time</Badge>
                <h3 className="text-2xl font-bold text-white mb-2">Creative Week</h3>
                <p className="text-muted-foreground text-sm max-w-[200px]">Unlock premium filters on design apps this week.</p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-20 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-40 h-40 text-white" />
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-white/10 p-6 rounded-3xl overflow-hidden relative group cursor-pointer">
              <div className="relative z-10">
                <Badge className="bg-white/10 text-white mb-4">New Release</Badge>
                <h3 className="text-2xl font-bold text-white mb-2">Retro Revival</h3>
                <p className="text-muted-foreground text-sm max-w-[200px]">Explore the newly added arcade collection.</p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-20 group-hover:scale-110 transition-transform">
                <Trophy className="w-40 h-40 text-white" />
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
