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
  Share2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WebsiteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const website = MOCK_WEBSITES.find(w => w.id === id);

  if (!website) return <div>Website not found</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8 hover:bg-white/5 text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to feed
        </Button>

        {/* Hero Section - Play Store Style */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-[2rem] overflow-hidden border border-white/10 glow-primary shadow-2xl">
            <Image 
              src={website.imageUrl} 
              alt={website.name} 
              fill 
              className="object-cover"
              data-ai-hint="app icon"
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-2">
              {website.name}
            </h1>
            <p className="text-primary font-medium text-lg mb-4">
              {website.developer}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
              <div className="flex flex-col items-center border-r border-white/10 pr-6">
                <div className="flex items-center gap-1 text-white font-bold text-lg mb-0.5">
                  {website.rating} <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <span className="text-muted-foreground text-xs">{website.reviewCount.toLocaleString()} reviews</span>
              </div>
              <div className="flex flex-col items-center border-r border-white/10 pr-6">
                <span className="text-white font-bold text-lg mb-0.5">{website.size}</span>
                <span className="text-muted-foreground text-xs">File size</span>
              </div>
              <div className="flex flex-col items-center">
                <Badge variant="outline" className="border-white/20 text-white font-bold text-sm h-6 px-2 mb-0.5">3+</Badge>
                <span className="text-muted-foreground text-xs">Rated for 3+</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-10 glow-primary">
                <a href={website.url} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/5">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Screenshots Horizontal Scroll */}
        <section className="mb-12">
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {website.screenshots.map((ss, idx) => (
              <div key={idx} className="relative aspect-[16/9] h-64 md:h-96 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
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
        </section>

        {/* Grid Info Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-xl font-headline font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                About this website
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {website.longDescription}
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {website.categories.map(cat => (
                  <Badge key={cat} className="bg-primary/10 text-primary border-none hover:bg-primary/20 transition-colors py-1.5 px-4 rounded-full">
                    {cat}
                  </Badge>
                ))}
              </div>
            </section>

            <Separator className="bg-white/5" />

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-headline font-bold text-white">Ratings & reviews</h2>
                <Button variant="link" className="text-primary p-0">See all reviews</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl font-extrabold text-white mb-2">{website.rating}</div>
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[1, 2, 3, 4].map(i => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">{website.reviewCount.toLocaleString()}</div>
                </div>
                
                <div className="md:col-span-3 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground w-2">{rating}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : 2}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Review */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">JD</div>
                    <div>
                      <div className="text-sm font-bold text-white">Jane Designer</div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2 h-2 text-yellow-500 fill-yellow-500" />)}
                        <span className="ml-2">Feb 12, 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "Absolutely love the workflow of this tool. It bridges the gap between browser convenience and professional power perfectly."
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar Meta Column */}
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-2xl border border-white/5 space-y-6">
              <h3 className="font-headline font-bold text-white text-lg">Technical Specs</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <History className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Updated on</div>
                    <div className="text-sm text-white font-medium">{website.updatedAt}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Globe className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Version</div>
                    <div className="text-sm text-white font-medium">{website.version}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Security</div>
                    <div className="text-sm text-white font-medium">SSL Verified</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageSquare className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Contact</div>
                    <div className="text-sm text-primary font-medium cursor-pointer hover:underline">Support Hub</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 className="font-headline font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" fill="currentColor" />
                AI Content Match
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our discovery engine thinks this matches your recent interest in <strong>Modern UI</strong> and <strong>Productivity Tools</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}