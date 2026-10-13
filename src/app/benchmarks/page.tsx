import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BarChart3, Activity, Clock, Layout, Smartphone, Globe } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Interaction Benchmarks | High-Fidelity Standards",
  description: "What defines the top 1% of the web? Explore the technical benchmarks for performance, UX stability, and discovery fidelity in 2026.",
};

export default function BenchmarksPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24 space-y-16">
        <header className="space-y-6 text-center">
          <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
            Technical Audit 05
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Interaction <span className="text-primary">Benchmarks</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
            Quantitative standards for the high-fidelity web. These are the metrics we use to verify the "Zero Padding" status of every node in our registry.
          </p>
        </header>

        <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium italic">
          <section className="space-y-10">
             <div className="flex items-center gap-4 text-primary">
                <BarChart3 className="w-8 h-8" />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">1. Core Web Vitals (2026 Standard)</h2>
             </div>
             <p>
                In 2026, Core Web Vitals remain the foundational node of performance auditing. However, the thresholds have moved. Search engines and curation nodes now expect a "Zero Latency" feel. Our benchmarks for the top 1% of the web are as follows:
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BenchmarkMetric label="LCP" target="< 1.2s" desc="Largest Contentful Paint must feel instantaneous." />
                <BenchmarkMetric label="INP" target="< 150ms" desc="Interaction to Next Paint for seamless response." />
                <BenchmarkMetric label="CLS" target="0.0" desc="Cumulative Layout Shift must be eliminated entirely." />
             </div>
          </section>

          <section className="space-y-8">
             <div className="flex items-center gap-4 text-primary">
                <Activity className="w-8 h-8" />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">2. The "Interaction Threshold"</h2>
             </div>
             <p>
                Bessites tracks a unique metric called the "Interaction Threshold." This measures the time from the page load completion to the first user-initiated "Value Action" (e.g., clicking a tool, starting a search). 
             </p>
             <p>
                High-fidelity websites have an interaction threshold of under 5 seconds. If a user has to scroll for 30 seconds or navigate through multiple pop-ups, the "Padding Score" increases, and the discovery authority decreases. We value sites that respect human time nodes and provide immediate paths to utility.
             </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-4">
              <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" /> Mobile Fidelity
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">70% of discovery happens on mobile. Our benchmark requires touch targets to be at least 48x48px with 12px spacing nodes.</p>
            </Card>
            <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-4">
              <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-3">
                <Layout className="w-5 h-5 text-primary" /> Geometric Stability
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Asymmetrical designs must maintain balance. We audit CSS grid structures to ensure 100% responsiveness across every node.</p>
            </Card>
          </div>

          <section className="space-y-8">
             <div className="flex items-center gap-4 text-primary">
                <Globe className="w-8 h-8" />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">3. Discovery Accessibility (WCAG 3.0)</h2>
             </div>
             <p>
                True discovery must be absolute for everyone. We benchmark our nodes against WCAG 3.0 standards, focusing on high-contrast indigo themes and screen-reader compatibility. A site that excludes users based on accessibility is not a verified Bessites asset.
             </p>
             <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem] italic">
                <p className="text-sm font-bold text-primary mb-2 uppercase tracking-widest italic underline underline-offset-4">Audit Protocol</p>
                <p className="text-base text-zinc-300">Every project submitted to the registry is automatically audited by our internal performance node. If your site doesn't meet these benchmarks, we provide a "Recalibration Report" in your Creator Hub to help you reach the top 1%.</p>
             </div>
          </section>

          <footer className="pt-20 border-t border-white/5 text-center">
            <p className="text-sm font-bold text-white/20 uppercase tracking-[0.4em]">Node Verified / Performance Tier: S</p>
            <div className="flex justify-center gap-4 mt-8">
               <div className="w-2 h-2 rounded-full bg-primary" />
               <div className="w-2 h-2 rounded-full bg-primary/40" />
               <div className="w-2 h-2 rounded-full bg-primary/10" />
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function BenchmarkMetric({ label, target, desc }: { label: string, target: string, desc: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-2 text-center">
       <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
       <h4 className="text-2xl font-black italic text-primary">{target}</h4>
       <p className="text-[10px] font-medium text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}
