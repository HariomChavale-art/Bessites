import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Globe, ShieldCheck, Zap, Heart } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "About Us | Bessites - Find Great Tools",
  description: "Learn more about Bessites, the best place to find modern websites and digital tools. Only useful content, no fluff.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <div className="space-y-16">
          <header className="text-center space-y-6">
            <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
              Our Story
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
              About <span className="text-primary">Bessites</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
              Bessites is a website list made to help you find the best parts of the modern web. We only list websites that are actually useful for creators and builders.
            </p>
          </header>

          <section className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white border-l-4 border-primary pl-6">
              Why we started Bessites
            </h2>
            <div className="space-y-6 text-lg text-zinc-300 leading-relaxed font-medium italic">
              <p>
                The internet today is hard to search. Even with millions of new sites, finding high-quality tools is difficult because big companies often hide the small, useful sites.
              </p>
              <p>
                We built Bessites to change that. We don't use robots to find sites; we have real people pick them. We want to give developers, designers, and business owners a place to find exactly what they need in seconds.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <ShieldCheck className="w-8 h-8" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">For Website Owners</h3>
              </div>
              <p className="text-muted-foreground italic font-medium leading-relaxed">
                Creators can add their websites to our list. This helps new tools get noticed and find their first users in our professional community.
              </p>
            </Card>

            <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Globe className="w-8 h-8" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">For Visitors</h3>
              </div>
              <p className="text-muted-foreground italic font-medium leading-relaxed">
                Explore a list of many useful categories. Whether you need an AI tool or a way to build a website, Bessites helps you find it fast.
              </p>
            </Card>
          </div>

          <div className="pt-20 border-t border-white/5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              <div><p className="text-3xl font-black italic text-white">Many</p><p className="text-[10px] font-black uppercase tracking-widest text-primary">Categories</p></div>
              <div><p className="text-3xl font-black italic text-white">Verified</p><p className="text-[10px] font-black uppercase tracking-widest text-primary">Websites</p></div>
              <div><p className="text-3xl font-black italic text-white">Active</p><p className="text-[10px] font-black uppercase tracking-widest text-primary">Daily Views</p></div>
              <div><p className="text-3xl font-black italic text-white">All</p><p className="text-[10px] font-black uppercase tracking-widest text-primary">Sectors</p></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
