
"use client"

import { useParams, useRouter } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WebsiteCard } from "@/components/website-card";
import { 
  Star, 
  ArrowLeft, 
  Globe, 
  Info, 
  ShieldCheck, 
  Share2,
  ChevronRight,
  Bookmark,
  Lock,
  Zap,
  Smartphone,
  MoreVertical
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WebsiteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const website = MOCK_WEBSITES.find(w => w.id === id);

  if (!website) return <div className="p-8 text-center text-white">Website not found</div>;

  // Filter similar websites for the Pinterest grid at the bottom
  const similarWebsites = MOCK_WEBSITES.filter(w => w.id !== id && w.categories.some(cat => website.categories.includes(cat))).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-6 pb-24">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-white/5 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Hero Section - App Icon & Title */}
        <div className="flex gap-6 mb-8">
          <div className="relative w-28 h-28 shrink-0 rounded-[1.8rem] overflow-hidden shadow-2xl border border-white/10">
            <Image 
              src={website.imageUrl} 
              alt={website.name} 
              fill 
              className="object-cover"
              data-ai-hint="app logo"
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-white mb-1 leading-tight tracking-tight">
              {website.name}
            </h1>
            <p className="text-[#8ab4f8] font-semibold text-base mb-1">
              {website.url.replace('https://', '')}
            </p>
            <p className="text-muted-foreground text-sm font-medium">
              {website.categories.join(' & ')}
            </p>
          </div>
        </div>

        {/* High-level Stats Row */}
        <div className="flex items-start justify-between px-2 mb-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-white font-bold text-base">
              {website.rating} <Star className="w-4 h-4 fill-white" />
            </div>
            <span className="text-muted-foreground text-[11px] mt-1 whitespace-nowrap">{website.reviewCount.toLocaleString()} reviews <Info className="w-3 h-3 inline ml-0.5 opacity-50" /></span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center">
            <div className="text-white font-bold text-base">120K+</div>
            <span className="text-muted-foreground text-[11px] mt-1 whitespace-nowrap">Active users <Info className="w-3 h-3 inline ml-0.5 opacity-50" /></span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center">
            <div className="text-white font-bold text-base">2.4M</div>
            <span className="text-muted-foreground text-[11px] mt-1 whitespace-nowrap">Monthly visits <Info className="w-3 h-3 inline ml-0.5 opacity-50" /></span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-green-500 font-bold text-base">
              <ShieldCheck className="w-4 h-4" /> 100%
            </div>
            <span className="text-muted-foreground text-[11px] mt-1 whitespace-nowrap">Uptime <Info className="w-3 h-3 inline ml-0.5 opacity-50" /></span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex gap-3 mb-4">
          <Button asChild className="flex-[2] bg-[#8ab4f8] hover:bg-[#8ab4f8]/90 text-background font-bold rounded-xl h-12 gap-2">
            <a href={website.url} target="_blank" rel="noopener noreferrer">
              <Globe className="w-5 h-5" /> Visit Website
            </a>
          </Button>
          <Button variant="outline" className="flex-1 border-white/10 bg-white/5 rounded-xl h-12 font-semibold text-white gap-2">
            <Bookmark className="w-5 h-5" /> Save
          </Button>
          <Button variant="outline" className="flex-1 border-white/10 bg-white/5 rounded-xl h-12 font-semibold text-white gap-2">
            <Share2 className="w-5 h-5" /> Share
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-8 text-[11px] font-medium text-muted-foreground">
          <Lock className="w-3 h-3 text-green-500" />
          Secure connection <span className="mx-1 opacity-30">•</span> {website.url}
        </div>

        {/* Feature Cards Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar -mx-4 px-4">
          {[
            { title: "Discover", desc: "Explore curated content from around the web." },
            { title: "Create", desc: "Share your world and engage with the community." },
            { title: "AI Assistant", desc: "Get smart help and ideas instantly." },
            { title: "Watch", desc: "Endless videos and shorts curated for you." }
          ].map((feature, idx) => (
            <div key={idx} className="relative w-[160px] aspect-[9/16] shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-card p-4 flex flex-col">
              <div className="mb-2">
                <h4 className="text-[#8ab4f8] text-sm font-bold">{feature.title}</h4>
                <p className="text-white text-[10px] leading-tight font-medium">{feature.desc}</p>
              </div>
              <div className="flex-1 relative mt-2 rounded-lg overflow-hidden border border-white/5">
                <Image 
                  src={website.screenshots[0] || "https://picsum.photos/seed/feature/400/600"} 
                  alt={feature.title} 
                  fill 
                  className="object-cover opacity-60"
                />
              </div>
            </div>
          ))}
        </div>

        {/* About Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 group cursor-pointer">
            <h2 className="text-xl font-bold text-white tracking-tight">About this website</h2>
            <div className="bg-white/5 p-2 rounded-full group-hover:bg-white/10 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            {website.longDescription}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {website.categories.map(cat => (
              <Badge key={cat} variant="outline" className="border-white/10 text-muted-foreground bg-white/5 py-1.5 px-4 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors">
                {cat}
              </Badge>
            ))}
          </div>
        </section>

        {/* Trust & Performance Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Load Speed", val: "0.9s", icon: Zap, color: "text-yellow-500" },
            { label: "SSL Secured", val: "Secured", icon: ShieldCheck, color: "text-green-500" },
            { label: "Countries", val: "190+", icon: Globe, color: "text-[#8ab4f8]" },
            { label: "Mobile Friendly", val: "98/100", icon: Smartphone, color: "text-yellow-400" }
          ].map((metric, idx) => (
            <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center text-center">
              <metric.icon className={`w-5 h-5 mb-2 ${metric.color}`} />
              <div className="text-white font-bold text-xs">{metric.val}</div>
              <div className="text-muted-foreground text-[10px] mt-0.5">{metric.label} <Info className="w-2.5 h-2.5 inline opacity-30" /></div>
            </div>
          ))}
        </div>

        {/* Ratings & reviews Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 group cursor-pointer">
            <h2 className="text-xl font-bold text-white tracking-tight">Ratings & reviews</h2>
            <div className="bg-white/5 p-2 rounded-full group-hover:bg-white/10 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex items-start gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2 tracking-tighter">{website.rating}</div>
              <div className="flex justify-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(website.rating) ? 'text-[#8ab4f8] fill-[#8ab4f8]' : 'text-white/20'}`} />
                ))}
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">{website.reviewCount.toLocaleString()} reviews</div>
            </div>
            
            <div className="flex-1 space-y-2 pt-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground w-2 font-bold">{rating}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#8ab4f8]" 
                      style={{ width: `${rating === 5 ? 85 : rating === 4 ? 12 : 3}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator className="bg-white/5 mb-12" />

        {/* Similar Websites - Pinterest Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Similar websites</h2>
            <Button variant="link" className="text-[#8ab4f8] font-bold p-0">See all</Button>
          </div>
          
          <div className="columns-2 gap-4">
            {similarWebsites.map((site) => (
              <WebsiteCard key={site.id} website={site} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
