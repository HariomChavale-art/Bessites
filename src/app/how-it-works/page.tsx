import { Navigation } from "@/components/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Globe, BarChart3, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Bessites Discovery Engine",
  description: "Learn how to use Bessites to discover modern webs, submit your projects, and track your discovery impact.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="space-y-24">
          <header className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
              How It <span className="text-primary">Works</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic leading-relaxed">
              Bessites simplifies the discovery pipeline. Whether you are a visitor seeking tools or a creator seeking users, our node-based registry is built for high-velocity results.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              num="01" 
              icon={UserPlus} 
              title="Create Your Profile" 
              desc="Identify your interests from our 100-node registry. This personalizes your 'For You' discovery feed instantly." 
            />
            <StepCard 
              num="02" 
              icon={Globe} 
              title="Add Your Website" 
              desc="Submit your digital property to the registry. Each submission is manually reviewed to ensure a Zero Padding standard." 
            />
            <StepCard 
              num="03" 
              icon={BarChart3} 
              title="Track Impact" 
              desc="Use our Creator Hub to monitor real-time visits, likes, and saves. Launch global ad campaigns to boost your reach." 
            />
          </div>

          <div className="flex justify-center pt-12">
            <Link href="/submit">
               <Button className="h-20 px-12 rounded-full bg-white text-black hover:bg-white/90 text-2xl font-black italic shadow-2xl transition-all hover:scale-105 active:scale-95 group uppercase tracking-widest">
                  ADD YOUR WEBSITE NOW <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
               </Button>
            </Link>
          </div>
        </div>
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

function StepCard({ num, icon: Icon, title, desc }: { num: string, icon: any, title: string, desc: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 text-6xl font-black italic text-white/5 group-hover:text-primary/10 transition-colors">{num}</div>
      <div className="space-y-6 relative z-10">
        <div className="p-5 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{title}</h3>
          <p className="text-muted-foreground italic font-medium leading-relaxed">{desc}</p>
        </div>
      </div>
    </Card>
  )
}
