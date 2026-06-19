
"use client"

import { useParams, useRouter } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  ArrowLeft, 
  Download, 
  Globe, 
  Info, 
  ShieldCheck, 
  History, 
  MessageSquare,
  Share2,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WebsiteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const website = MOCK_WEBSITES.find(w => w.id === id);

  if (!website) return <div className="p-8 text-center text-white">Website not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-6 pb-24">
        {/* Top Header - Back and More */}
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
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Hero Section - Play Store Screenshot Style */}
        <div className="flex gap-6 mb-8">
          <div className="relative w-24 h-24 shrink-0 rounded-[1.5rem] overflow-hidden shadow-xl">
            <Image 
              src={website.imageUrl} 
              alt={website.name} 
              fill 
              className="object-cover"
              data-ai-hint="app icon"
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-white mb-1 leading-tight">
              {website.name}
            </h1>
            <p className="text-[#85a3ff] font-medium text-sm">
              {website.developer}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              In-app purchases
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between px-2 mb-8 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-white font-bold text-sm">
              {website.rating} <Star className="w-3 h-3 fill-white" />
            </div>
            <span className="text-muted-foreground text-[10px] mt-1">{website.reviewCount.toLocaleString()} reviews</span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <div className="border border-white/40 text-white font-bold text-[10px] h-4 px-1 rounded flex items-center justify-center">3+</div>
            <span className="text-muted-foreground text-[10px] mt-1">Rated for 3+ <Info className="w-2.5 h-2.5 inline ml-0.5" /></span>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <Download className="w-4 h-4 text-white" />
            <span className="text-muted-foreground text-[10px] mt-1">{website.size}</span>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="flex gap-2 mb-4">
          <Button asChild className="flex-1 bg-[#8ab4f8] hover:bg-[#8ab4f8]/90 text-background font-bold rounded-full h-11">
            <a href={website.url} target="_blank" rel="noopener noreferrer">
              Visit
            </a>
          </Button>
          <Button variant="ghost" className="bg-white/5 rounded-full h-11 px-3">
            <ChevronDown className="w-5 h-5 text-white" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mb-8">
          Available on web. Multiple platforms available.
        </p>

        {/* Screenshots Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-3 pb-8 no-scrollbar -mx-4 px-4">
          {website.screenshots.concat(website.screenshots).map((ss, idx) => (
            <div key={idx} className="relative aspect-[9/16] h-64 shrink-0 rounded-xl overflow-hidden border border-white/10">
              <Image 
                src={ss} 
                alt={`${website.name} screenshot ${idx + 1}`} 
                fill 
                className="object-cover"
                data-ai-hint="app screenshot"
              />
            </div>
          ))}
        </div>

        {/* About Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">About this website</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {website.longDescription}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {website.categories.map(cat => (
              <Badge key={cat} variant="outline" className="border-white/20 text-muted-foreground bg-transparent py-1 px-4 rounded-full text-xs font-normal">
                {cat}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="bg-white/5 mb-8" />

        {/* Ratings & reviews */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Ratings & reviews</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="flex items-start gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-1">{website.rating}</div>
                <div className="flex justify-center gap-0.5 mb-2">
                  {[1, 2, 3, 4].map(i => <Star key={i} className="w-3 h-3 text-white fill-white" />)}
                  <Star className="w-3 h-3 text-white" />
                </div>
                <div className="text-[10px] text-muted-foreground">{website.reviewCount.toLocaleString()} reviews</div>
              </div>
              
              <div className="flex-1 space-y-1.5 pt-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground w-2">{rating}</span>
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#8ab4f8]" 
                        style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : 2}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
