import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bessites Blog | Strategic Discovery Insights",
  description: "Professional strategies for digital creators, SEO masters, and high-velocity teams. Learn how to scale your digital presence.",
};

const BLOG_POSTS = [
  {
    slug: "free-traffic-for-new-website",
    title: "How to Get More Traffic to Your Website (7 Working Methods in 2026)",
    description: "The definitive guide to scaling your first users using multi-node distribution strategies across search, social, and curated registries.",
    date: "Oct 8, 2026",
    readTime: "7 min read",
    category: "Growth Strategy"
  },
  {
    slug: "submit-website-to-google",
    title: "How to Submit Your Website to Google in 2026: The Absolute Guide",
    description: "Master the discovery pipeline by learning how to properly index your digital property in the era of AI search and real-time crawling.",
    date: "May 15, 2026",
    readTime: "12 min read",
    category: "SEO & Growth"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-16 sm:py-24 space-y-16">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
            Bessites Intelligence
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Bessites <span className="text-primary">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic opacity-60">
            Professional strategies for digital creators, builders, and high-velocity teams.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] h-full flex flex-col space-y-6 hover:border-primary/40 transition-all shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed font-medium line-clamp-3 italic">
                    {post.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between group-hover:text-primary transition-colors">
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Read Entry</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {BLOG_POSTS.length <= 2 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01]">
            <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-muted-foreground italic font-medium opacity-20 uppercase tracking-widest text-xs">
              More strategic nodes synchronizing...
            </p>
          </div>
        )}
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 italic">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>
          <p className="text-xs text-muted-foreground opacity-20 font-black uppercase tracking-widest">© 2024 Bessites Studio. Powered by Bessites.</p>
        </div>
      </footer>
    </div>
  );
}
