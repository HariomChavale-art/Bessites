"use client"

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight, 
  RotateCcw, 
  Globe, 
  Star, 
  Zap, 
  TrendingUp,
  Loader2
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { INTERESTS } from "@/lib/category-mapping";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { WebsitePreview } from "@/components/website-preview";

type FalmidoStep = 1 | 2 | 3 | 4;

export default function FalmidoPage() {
  const db = useFirestore();
  const [step, setStep] = useState<FalmidoStep>(1);
  
  // Selection State
  const [category, setCategory] = useState<string>("");
  const [pricing, setPricing] = useState<string>("");
  const [priority, setPriority] = useState<string>("");

  // Data Fetching
  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), where("status", "==", "approved"));
  }, [db]);
  const { data: liveSites, loading: sitesLoading } = useCollection(submissionsRef);

  const statsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);
  const { data: liveStats } = useCollection(statsRef);

  // Top 10 Categories from registry
  const topCategories = useMemo(() => {
    return INTERESTS.slice(0, 10).map(i => i.name);
  }, []);

  // Filtering Logic
  const results = useMemo(() => {
    if (step !== 4) return [];

    // Combine Mock + Live
    const allSites = [...MOCK_WEBSITES].map(s => ({ ...s, source: 'mock' }));
    if (liveSites) {
      liveSites.forEach((ls: any) => {
        if (!allSites.find(s => s.url === ls.url)) {
          allSites.push({ ...ls, source: 'live' });
        }
      });
    }

    let filtered = allSites.filter(site => {
      const matchesCategory = site.categories.includes(category);
      const matchesPricing = pricing === "Any" || site.pricing === pricing;
      return matchesCategory && matchesPricing;
    });

    // Sorting Logic
    filtered.sort((a: any, b: any) => {
      if (priority === "Most popular") {
        const statsA = liveStats?.find(s => s.id === a.id);
        const statsB = liveStats?.find(s => s.id === b.id);
        const scoreA = (a.baseVisits || 0) + (statsA?.visitCount || 0);
        const scoreB = (b.baseVisits || 0) + (statsB?.visitCount || 0);
        return scoreB - scoreA;
      }
      if (priority === "Most useful") {
        const statsA = liveStats?.find(s => s.id === a.id);
        const statsB = liveStats?.find(s => s.id === b.id);
        const scoreA = (a.rating || 4) + (statsA?.likeCount || 0) * 0.1;
        const scoreB = (b.rating || 4) + (statsB?.likeCount || 0) * 0.1;
        return scoreB - scoreA;
      }
      if (priority === "Newest") {
        // Mock newest by baseSaves as a proxy, Live by timestamp
        const timeA = a.timestamp?.seconds || a.baseSaves || 0;
        const timeB = b.timestamp?.seconds || b.baseSaves || 0;
        return timeB - timeA;
      }
      return 0;
    });

    return filtered.slice(0, 5);
  }, [step, category, pricing, priority, liveSites, liveStats]);

  const reset = () => {
    setStep(1);
    setCategory("");
    setPricing("");
    setPriority("");
  };

  return (
    <div className="min-h-screen bg-background text-white font-body flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-2xl px-6 py-12 sm:py-20 flex flex-col justify-center">
        
        {step < 4 && (
          <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Compass className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Hi, I'm Falmido.</h1>
            <p className="text-muted-foreground font-medium italic">Answer three quick questions and I'll find sites that fit you.</p>
          </div>
        )}

        <div className="space-y-8">
          {/* STEP 1: CATEGORY */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-center italic">What are you looking for?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topCategories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setCategory(cat); setStep(2); }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all text-sm font-black uppercase tracking-widest text-left flex justify-between items-center group"
                  >
                    {cat}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PRICING */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep(1)} className="text-zinc-500 hover:text-white px-0 font-bold"><ChevronLeft className="mr-2 w-4 h-4" /> Back</Button>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Question 2/3</span>
              </div>
              <h2 className="text-2xl font-bold text-center italic">What pricing do you prefer?</h2>
              <div className="grid grid-cols-1 gap-3">
                {["Free", "Freemium", "Paid", "Any"].map(p => (
                  <button 
                    key={p}
                    onClick={() => { setPricing(p); setStep(3); }}
                    className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all text-base font-black uppercase tracking-widest italic flex items-center justify-between group"
                  >
                    {p}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PRIORITY */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} className="text-zinc-500 hover:text-white px-0 font-bold"><ChevronLeft className="mr-2 w-4 h-4" /> Back</Button>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Final Question</span>
              </div>
              <h2 className="text-2xl font-bold text-center italic">What matters most?</h2>
              <div className="grid grid-cols-1 gap-3">
                {["Most popular", "Most useful", "Newest"].map(p => (
                  <button 
                    key={p}
                    onClick={() => { setPriority(p); setStep(4); }}
                    className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all text-base font-black uppercase tracking-widest italic flex items-center justify-between group"
                  >
                    {p}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: RESULTS */}
          {step === 4 && (
            <div className="space-y-10 animate-in zoom-in-95 duration-700">
              <div className="text-center space-y-2">
                <Badge className="bg-primary/20 text-primary border-none px-4 py-1 uppercase font-black italic tracking-widest">Falmido's Selection</Badge>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Your matches.</h2>
              </div>

              <div className="space-y-4">
                {results.length > 0 ? (
                  <>
                    {results.map((site: any) => (
                      <Card key={site.id} className="bg-[#121117] border-white/5 p-6 rounded-[2.5rem] flex items-center gap-6 group hover:border-primary/20 transition-all shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/5 p-2 shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <WebsitePreview websiteUrl={site.url} fallbackUrl={site.logoUrl || site.imageUrl} alt={site.name} className="w-full h-full object-contain rounded-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold truncate group-hover:text-primary transition-colors">{site.websiteName || site.name}</h4>
                            <span className="text-[9px] font-black uppercase border border-primary/20 px-2 py-0.5 rounded-md text-primary/80">{site.pricing}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-medium italic line-clamp-1 opacity-60">{site.description}</p>
                        </div>
                        <a 
                          href={site.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all shrink-0 shadow-lg"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </a>
                      </Card>
                    ))}
                    {results.length < 5 && (
                      <p className="text-center text-[11px] font-black uppercase text-zinc-600 tracking-widest italic pt-4">Only {results.length} matches. Try 'Any' for pricing.</p>
                    )}
                  </>
                ) : (
                  <div className="py-20 text-center space-y-4 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
                    <TrendingUp className="w-12 h-12 text-zinc-800 mx-auto" />
                    <p className="text-xl font-bold italic text-zinc-500">No matches yet. Try a different category.</p>
                  </div>
                )}
              </div>

              <Button 
                onClick={reset} 
                className="w-full h-16 rounded-[2rem] bg-white text-black font-black uppercase italic tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                <RotateCcw className="mr-3 w-5 h-5" /> Start Again
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}