import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Book, Search, Type, Binary, Hash } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modern Web Glossary | Bessites Knowledge Base",
  description: "Master the technical terminology of 2026. From discovery nodes to zero padding, learn the language of absolute discovery.",
};

const TERMS = [
  { term: "Absolute Discovery", def: "The state in which a digital asset reaches its target audience with zero friction and 100% intent alignment. Achieved through high-fidelity metadata and curated registry placement." },
  { term: "Zero Padding", def: "A design and content philosophy that removes all filler text, deceptive UI, and redundant assets. Focuses exclusively on the immediate utility provided by a digital property." },
  { term: "Discovery Node", def: "A single, verified entry in the Bessites registry. Each node represents a functional digital tool, app, or website that has passed the technical audit." },
  { term: "Interaction Ledger", def: "Our transparent data system that logs visits, likes, and saves. This ledger determines the trending rank and community authority of a discovery node." },
  { term: "Neural Intent", def: "A user's underlying goal when performing a search. In 2026, discovery is moving away from keywords and toward mapping these high-level neural patterns." },
  { term: "High-Fidelity Web", def: "Digital properties that prioritize performance (Core Web Vitals), clean code architecture, and high-resolution brand marks. The opposite of the 'Bloated Web'." },
  { term: "Friction Node", def: "Any element on a website that causes a user to delay or abandon their intent. Common friction nodes include mandatory sign-up walls and heavy image payloads." },
  { term: "Curation Gateway", def: "A professional directory or hub (like Bessites) that uses human intelligence to verify and categorize the top 1% of the modern web." },
  { term: "Semantic Discovery", def: "Finding information based on the meaning and context of the data rather than simple string matching." },
  { term: "LCP Fidelity", def: "A measurement of how quickly the 'Largest Contentful Paint' provides actual utility to the user. Fast LCP is a mandatory discovery signal." },
  { term: "Node Decay", def: "The process by which an unmaintained website loses its ranking in the discovery charts due to technical failures or lack of community interaction." },
  { term: "Discovery Synergy", def: "The result of listing a tool in a registry where adjacent tools solve complementary problems, creating a high-velocity workflow for the user." }
];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-16 sm:py-24 space-y-16">
        <header className="space-y-6 text-center">
          <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black tracking-widest italic">
            Registry Index
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Modern Web <span className="text-primary">Lexicon</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
            The definitive dictionary of the 2026 digital era. Understand the terminology that defines the absolute discovery ecosystem.
          </p>
        </header>

        <div className="space-y-12">
          <div className="relative group max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="Search definitions..." 
              className="w-full pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
             {TERMS.map(item => (
               <Card key={item.term} className="bg-[#121117] border-white/5 p-8 rounded-[2rem] shadow-xl hover:border-primary/20 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                     <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-primary/10 transition-colors shrink-0">
                        <Type className="w-6 h-6 text-primary" />
                     </div>
                     <div className="space-y-3">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{item.term}</h2>
                        <p className="text-base text-muted-foreground font-medium italic leading-relaxed">{item.def}</p>
                     </div>
                  </div>
               </Card>
             ))}
          </div>
        </div>

        <section className="pt-20 space-y-10 border-t border-white/5">
           <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center">Mastering the language</h2>
           <div className="space-y-6 text-zinc-300 leading-relaxed text-lg font-medium italic max-w-3xl mx-auto">
              <p>
                To navigate the high-fidelity web, you must speak its language. The terms in this lexicon are not just buzzwords; they represent technical requirements for discovery in the 2026 landscape. Whether you are a builder trying to reduce your "Friction Nodes" or a visitor seeking "Absolute Discovery," understanding these concepts is critical.
              </p>
              <p>
                We update this glossary weekly as new technical standards emerge. The Bessites registry is more than a list; it is a living educational resource for the next generation of web creators. Stay informed, build for the human, and never let "Padding" slow down your discovery.
              </p>
           </div>
        </section>

        <footer className="pt-20 border-t border-white/5 text-center">
          <div className="flex justify-center gap-6 text-white/10">
             <Binary className="w-6 h-6" /><Hash className="w-6 h-6" /><Book className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 mt-8">Bessites Terminology Ledger / Verified</p>
        </footer>
      </main>
    </div>
  );
}
