import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Briefcase, Code, Palette, Rocket, Zap, HeartPulse } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "High-Velocity Creator Toolkits | Bessites Resources",
  description: "The Solo Founder's 1% Toolkit. Discover curated golden stacks for developers, designers, and entrepreneurs with zero padding.",
};

export default function ToolkitPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-16 sm:py-24 space-y-16">
        <header className="space-y-6 text-center">
          <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
            Resource Manual 02
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            High-Velocity <span className="text-primary">Toolkits</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
            Stop guessing your stack. These are the verified "Golden Nodes" used by the top 1% of digital creators to ship faster with absolute fidelity.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ToolkitCard 
            icon={Rocket} 
            title="The Solo Founder Node" 
            desc="Optimized for rapid shipping and zero overhead. Reach your first 1,000 users with these high-fidelity discovery tools."
            tools={["Linear", "Vercel", "Supabase", "Resend", "Clerk"]}
          />
          <ToolkitCard 
            icon={Palette} 
            title="The UI/UX Mastery Node" 
            desc="Build sophisticated, motion-rich experiences. The designer's blueprint for modern high-end web interfaces."
            tools={["Figma", "Aceternity UI", "Spline", "Shots.so", "Coolors"]}
          />
          <ToolkitCard 
            icon={Code} 
            title="The AI Engineer Node" 
            desc="Automate your engineering pipeline. Leverage deep language models for full-stack deployment velocity."
            tools={["Cursor", "v0 by Vercel", "PostHog", "Upstash", "ElevenLabs"]}
          />
          <ToolkitCard 
            icon={HeartPulse} 
            title="The Content Velocity Node" 
            desc="Scale your distribution across all nodes. Strategic assets for high-impact social and registry discovery."
            tools={["Typefully", "Storyset", "Krea AI", "Luma AI", "Descript"]}
          />
        </div>

        <div className="pt-20 space-y-12 text-zinc-300 leading-relaxed text-lg font-medium italic max-w-3xl mx-auto">
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Why Use a Toolkit?</h2>
            <p>
              Individual tools are useful, but a toolkit is a "Discovery Advantage." When you use tools that share a common design language and technical infrastructure, your "Friction Node" drops to zero. 
            </p>
            <p>
              For example, using Tailwind-native components from Aceternity UI alongside Vercel's deployment pipeline creates a high-fidelity feedback loop that allows you to iterate on your UI twice as fast as using legacy frameworks. We call this "Node Synergy."
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Building Your Own Node</h2>
            <p>
              The Bessites methodology suggests that every creator should have a personal "Registry" of assets they trust. Don't add a tool just because it is popular; add it because it satisfies the "Zero Padding" standard. Use our Creator Hub to save these tools to your personal dashboard and build your high-velocity workflow node by node.
            </p>
          </section>
        </div>

        <footer className="pt-20 border-t border-white/5 text-center">
          <p className="text-sm font-black italic text-primary uppercase tracking-[0.2em] mb-4">The toolkit for absolute discovery</p>
          <div className="flex justify-center gap-8 opacity-20">
             <Zap className="w-8 h-8" /><Briefcase className="w-8 h-8" /><Globe className="w-8 h-8" />
          </div>
        </footer>
      </main>
    </div>
  );
}

function ToolkitCard({ icon: Icon, title, desc, tools }: { icon: any, title: string, desc: string, tools: string[] }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-10 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden group hover:border-primary/40 transition-all">
       <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors"><Icon className="w-16 h-16" /></div>
       <div className="space-y-4">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{title}</h3>
          <p className="text-sm text-muted-foreground italic font-medium leading-relaxed">{desc}</p>
       </div>
       <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Active Tool Node</p>
          <div className="flex flex-wrap gap-2">
             {tools.map(tool => (
               <Badge key={tool} variant="outline" className="bg-white/5 border-white/10 text-white text-[10px] font-bold px-3 py-1 italic">{tool}</Badge>
             ))}
          </div>
       </div>
    </Card>
  )
}
