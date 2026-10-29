import { Navigation } from "@/components/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Globe, BarChart3, ArrowRight } from "lucide-react";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "How It Works | Bessites - Find Great Tools",
  description: "Learn how to use Bessites to find modern websites, add your own projects, and see your stats.",
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
              Bessites makes it easy to find great websites. Whether you are looking for a new tool or want people to find your site, we are here to help.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              num="01" 
              icon={UserPlus} 
              title="Make Your Profile" 
              desc="Choose your interests from our list. This helps us show you websites you will actually like." 
            />
            <StepCard 
              num="02" 
              icon={Globe} 
              title="Add Your Site" 
              desc="Submit your own website to our list. We check every site to make sure it's useful and safe." 
            />
            <StepCard 
              num="03" 
              icon={BarChart3} 
              title="Check Your Stats" 
              desc="Use our Creator Hub to see how many people visit and like your site. You can also boost your site to reach more people." 
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

      <Footer />
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
