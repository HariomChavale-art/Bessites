import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bessites User Manual - Official Help Center",
  description: "Learn how to use Bessites to discover modern webs and grow your digital assets with our official user manual and documentation.",
};

const GUIDES = [
  {
    slug: "how-to-submit-website-to-bessites",
    title: "How to Submit Your Website to Bessites - Complete Guide",
    description: "Learn the step-by-step process of adding your digital property to the Bessites registry for absolute discovery.",
    category: "Registry Basics"
  }
];

export default function GuideIndexPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-16 sm:py-24 space-y-16">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-4 py-1 uppercase font-black tracking-widest italic">
            Official Documentation
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            User <span className="text-primary">Manual</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic opacity-60">
            Professional documentation for digital creators and builders.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GUIDES.map((guide) => (
            <Link key={guide.slug} href={`/guide/${guide.slug}`} className="group">
              <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] h-full flex flex-col space-y-6 hover:border-emerald-500/40 transition-all shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl" />
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase">
                    {guide.category}
                  </Badge>
                  <Book className="w-4 h-4 text-white/20" />
                </div>

                <div className="space-y-4 flex-1">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-emerald-400 transition-colors leading-tight">
                    {guide.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed font-medium line-clamp-3 italic">
                    {guide.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between group-hover:text-emerald-400 transition-colors">
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Open Documentation</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
          <GraduationCap className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-muted-foreground italic font-medium opacity-20 uppercase tracking-widest text-xs">
            Additional manual nodes synchronizing...
          </p>
        </div>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <p className="text-xs text-muted-foreground opacity-20 font-black uppercase tracking-widest">© 2024 Bessites User Manual. Professional Discovery Node.</p>
        </div>
      </footer>
    </div>
  );
}
