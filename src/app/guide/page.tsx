import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, ChevronRight, GraduationCap, Sparkles, Zap, Globe, Search, Clock, Target, TrendingUp, PenTool, Layout, Share2, Database, Smartphone, Settings, BarChart3, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Guides | Bessites - How to Grow Your Website",
  description: "Learn how to use Bessites with our easy guides. Find out how to add projects, get more visitors, and improve your site.",
};

const GUIDES = [
  { slug: "how-to-submit-website", title: "How to Add Your Website", icon: Globe, category: "The Basics" },
  { slug: "how-to-get-free-traffic", title: "How to Get More Visitors", icon: Zap, category: "Growth Tips" },
  { slug: "how-to-submit-to-google", title: "How to Show Up on Google", icon: Search, category: "Search Tips" },
  { slug: "how-to-make-website-faster", title: "How to Make Your Site Fast", icon: Clock, category: "Performance" },
  { slug: "how-to-get-first-100-visitors", title: "Get Your First 100 Visitors", icon: Target, category: "Launch" },
  { slug: "how-to-write-seo-title", title: "Writing Better Search Titles", icon: PenTool, category: "Search Tips" },
  { slug: "how-to-share-website-on-pinterest", title: "Using Pinterest to Grow", icon: Share2, category: "Social Media" },
  { slug: "how-to-use-bessites", title: "How to Use Bessites Better", icon: Sparkles, category: "Platform" },
  { slug: "how-to-get-backlinks-free", title: "Getting Other Sites to Link to You", icon: TrendingUp, category: "Search Tips" },
  { slug: "how-to-promote-on-reddit", title: "Sharing Your Site on Reddit", icon: Share2, category: "Social Media" },
  { slug: "how-to-find-new-websites", title: "Finding New Websites to Use", icon: Globe, category: "Platform" },
  { slug: "how-to-increase-website-ranking", title: "Ranking Higher in Search", icon: BarChart3, category: "Search Tips" },
  { slug: "how-to-create-sitemap", title: "Making a Website Map", icon: Database, category: "Technical Tips" },
  { slug: "how-to-use-search-console", title: "Using Google Search Tools", icon: Search, category: "Technical Tips" },
  { slug: "how-to-make-website-mobile-friendly", title: "Making Your Site Good for Phones", icon: Smartphone, category: "Performance" },
  { slug: "best-tools-for-new-websites", title: "Best Tools for New Sites", icon: Sparkles, category: "Resources" },
  { slug: "how-to-grow-from-zero", title: "Growing from Zero Visitors", icon: Zap, category: "Growth Tips" },
  { slug: "how-to-get-website-discovered", title: "How to Get People to Find You", icon: Target, category: "Launch" },
  { slug: "common-mistakes-new-websites", title: "Common Mistakes New Sites Make", icon: AlertCircle, category: "Resources" },
  { slug: "how-to-track-website-traffic", title: "Tracking Your Website Visitors", icon: BarChart3, category: "Technical Tips" },
];

export default function GuideIndexPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-16 sm:py-24 space-y-16">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
            Learning Center
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            User <span className="text-primary">Manual</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic opacity-60">
            Easy-to-follow guides for digital creators and builders.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <Link key={guide.slug} href={`/guide/${guide.slug}`} className="group">
              <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] h-full flex flex-col space-y-6 hover:border-primary/40 transition-all shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-white/10 bg-white/5 text-white/40 text-[10px] font-black uppercase">
                    {guide.category}
                  </Badge>
                  <guide.icon className="w-5 h-5 text-primary/40 group-hover:text-primary group-hover:scale-110 transition-all" />
                </div>

                <div className="space-y-2 flex-1">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors leading-tight">
                    {guide.title}
                  </h2>
                  <p className="text-muted-foreground text-xs font-medium italic opacity-60">
                    Learn how to {guide.title.toLowerCase()}.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between group-hover:text-primary transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Guide</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground opacity-20 font-black uppercase tracking-widest italic">© 2024 Bessites Manual. Helping You Grow.</p>
        </div>
      </footer>
    </div>
  );
}
