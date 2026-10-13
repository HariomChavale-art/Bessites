import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrendingUp, Sparkles, Brain, Box, Globe, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Discovery Pulse 2026 | Web Industry Trends",
  description: "Explore the most significant shifts in the digital landscape. From AI discovery nodes to the 3D web, see what is trending in the Bessites registry.",
};

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24 space-y-16">
        <header className="space-y-6 text-center">
          <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
            Industry Intelligence
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            The Discovery <span className="text-primary">Pulse</span> 2026
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
            Analyzing the high-velocity shifts in digital creation, utility architecture, and the future of how humans find what they need.
          </p>
        </header>

        <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium italic">
          <section className="space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <Brain className="w-8 h-8" />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">1. The Rise of Neural Discovery</h2>
            </div>
            <p>
              The most significant trend of 2026 is the transition from "Keyword Matching" to "Neural Discovery." Traditional search engines rely on a user knowing exactly what they want. Neural discovery, powered by agents like Ouneo, relies on understanding the user's intent within the context of their current node.
            </p>
            <p>
              We are seeing a 400% increase in natural language queries within the Bessites registry. Users are no longer searching for "CSS tool"; they are asking, "How do I make my buttons look glassmorphic on a dark background?" This shift requires a new type of metadata tagging that emphasizes "Interaction Potential" over raw keywords.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-4">
              <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-3">
                <Box className="w-5 h-5 text-primary" /> The 3D Web
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Tools like Spline and Three.js are moving from niche experiments to standard UI components. The modern web is gaining depth, quite literally.</p>
            </Card>
            <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-4">
              <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" /> Edge Velocity
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Latency is the new bounce rate. We are tracking a surge in edge-native apps that provide zero-latency utility globally.</p>
            </Card>
          </div>

          <section className="space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">2. Micro-Utility Architecture</h2>
            </div>
            <p>
              The era of the "Mega-App" is facing a challenge from Micro-Utility Architecture. Instead of one tool that does a hundred things poorly, creators are favoring ten "Zero Padding" tools that do one thing with absolute fidelity. 
            </p>
            <p>
              This is reflected in our trending charts. Specialized niche tools for font pairing, SVG optimization, and regex debugging are consistently outperforming broad-spectrum platforms. Users want to solve a specific problem in seconds, not navigate a complex dashboard. This fragmentation is creating a massive opportunity for independent developers who focus on high-fidelity, single-node solutions.
            </p>
          </section>

          <section className="space-y-8">
             <div className="flex items-center gap-4 text-primary">
              <Globe className="w-8 h-8" />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">3. Ethical Curation vs. Algorithmic Noise</h2>
            </div>
            <p>
              As the web becomes saturated with AI-generated "padding," the value of human curation has reached an all-time high. Users are experiencing "Algorithm Fatigue," where the top results of traditional search engines feel untrustworthy or manipulative.
            </p>
            <p>
              The "Curation Node" model used by Bessites represents a return to an intentional web. By prioritizing "Verified Assets" and "Zero Duplication," we provide a sanctuary for discovery that algorithms simply can't replicate. The future of discovery is human-verified, technically audited, and ethically sourced.
            </p>
          </section>

          <footer className="pt-20 border-t border-white/5 text-center">
            <div className="flex items-center justify-center gap-2 text-primary animate-pulse mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Interaction Pulse: HIGH</span>
            </div>
            <p className="text-xs text-muted-foreground opacity-20 font-black uppercase tracking-widest italic">© 2026 Bessites Intelligence Node / All Rights Reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
