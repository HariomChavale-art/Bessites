import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Zap, Search, Globe, CheckCircle2, Lock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Zero Padding Manifesto | Bessites Methodology",
  description: "A technical deep dive into how Bessites curates the top 1% of the web. Learn about our node-based verification and absolute discovery standards.",
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24 space-y-16">
        <header className="space-y-6 text-center">
          <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
            Internal Protocol 01
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            The Zero Padding <span className="text-primary">Manifesto</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
            Discovery is broken. Most directories are filled with AI-generated filler and "padding" that slows down your workflow. This is how we fix it.
          </p>
        </header>

        <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium italic">
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white border-l-4 border-primary pl-6">
              1. The "Padding" Problem
            </h2>
            <p>
              In the modern web, "padding" refers to the unnecessary layers of content and interaction that stand between a user and their intent. This includes excessive SEO text that provides no value, deceptive UI patterns designed to increase clicks, and unverified links that lead to broken or low-quality tools. At Bessites, we identify this as "Discovery Friction."
            </p>
            <p>
              Most automated search engines reward padding because their algorithms are still based on keyword volume. We move in the opposite direction. Our methodology is built on "Negative Selection"—removing everything that isn't essential until only the high-fidelity utility remains. This is why we call our registry a "Zero Padding" zone.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white border-l-4 border-primary pl-6">
              2. Node-Based Verification
            </h2>
            <p>
              Every submission to Bessites undergoes a three-layer verification process before it is officially indexed as a "Verified Node." We don't just check if the site is online; we analyze its functional integrity.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <li className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-3 text-primary">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">Latency Check</span>
                </div>
                <p className="text-sm opacity-60">We measure Time to First Byte (TTFB). If a site takes longer than 1.5 seconds to respond, it is flagged as "Inefficient."</p>
              </li>
              <li className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-3 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">SSL Fidelity</span>
                </div>
                <p className="text-sm opacity-60">We verify certificate chains. Security is a non-negotiable node in our discovery registry.</p>
              </li>
              <li className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-3 text-primary">
                  <Search className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">Utility Density</span>
                </div>
                <p className="text-sm opacity-60">Does the tool actually work? We perform manual testing of the primary CTA to ensure result delivery.</p>
              </li>
              <li className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-3 text-primary">
                  <Lock className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">Privacy Audit</span>
                </div>
                <p className="text-sm opacity-60">We look for invasive tracking scripts. High-fidelity webs respect user data boundaries.</p>
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white border-l-4 border-primary pl-6">
              3. The Absolute Discovery Standard
            </h2>
            <p>
              "Absolute Discovery" is the point where a search query and a solution achieve a 1:1 match with zero cognitive load. To reach this standard, we use a 100-node interest taxonomy that allows users to pivot through the web with technical precision. 
            </p>
            <p>
              When Ouneo, our AI discovery node, recommends a website, it is doing so based on an "Interaction Ledger" of real human feedback. We don't care about a site's backlink count or domain age; we care about its current utility. If a tool is trending, it's because it's solving problems in real-time for our community of builders.
            </p>
            <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem] space-y-4">
              <h3 className="text-xl font-bold text-white uppercase italic">Our Quality Promise</h3>
              <p className="text-base">We commit to never listing "clone" apps, SEO-spam articles, or products that require mandatory sign-up before showing value. We are building the definitive index of human productivity on the web.</p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white border-l-4 border-primary pl-6">
              4. Continuous Recalibration
            </h2>
            <p>
              The web is not static, and neither is our registry. We perform automated sweeps of our verified nodes every 24 hours. If a site goes offline, changes its pricing model to be deceptive, or adds excessive padding, its ranking in our charts is automatically downgraded.
            </p>
            <p>
              This high-velocity synchronization ensures that when you enter the Bessites discovery pipeline, you are always accessing the most relevant version of the internet. We aren't just archiving the web; we are grooming it for a high-performance future.
            </p>
          </section>

          <footer className="pt-20 border-t border-white/5 text-center">
            <h2 className="text-2xl font-black italic text-white uppercase mb-4 tracking-tighter underline decoration-primary underline-offset-8">Keep Building. Keep Discovering.</h2>
            <p className="text-muted-foreground text-sm uppercase font-black tracking-widest opacity-40 italic">End of Document / Methodology Node verified</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
