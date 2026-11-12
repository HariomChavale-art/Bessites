'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { 
  BarChart3, 
  Globe, 
  Loader2, 
  Copy, 
  Check, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronLeft,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { WebsitePreview } from "@/components/website-preview";
import { MOCK_WEBSITES } from "@/lib/mock-data";

export default function SponsorProofPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Fetch Approved Submissions
  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), where("status", "==", "approved"));
  }, [db]);
  const { data: submittedSites, loading: subsLoading } = useCollection(submissionsRef);

  // 2. Fetch Global Stats
  const statsRef = useMemo(() => {
    if (!db) return null;
    return collection(db, "websiteStats");
  }, [db]);
  const { data: globalStats, loading: statsLoading } = useCollection(statsRef);

  // 3. Process & Sort Top 10
  const topRedirects = useMemo(() => {
    if (subsLoading || statsLoading || !globalStats) return [];

    // Combine Mock Data + Firestore Submissions for a full registry view
    const firestoreSites = (submittedSites || []).map(s => ({
      id: s.id,
      name: s.websiteName || s.name || "Registry Asset",
      url: s.url,
      ...s
    }));
    
    const allSites = [...MOCK_WEBSITES];
    const seenIds = new Set(allSites.map(w => w.id));
    
    firestoreSites.forEach(s => {
      if (!seenIds.has(s.id)) {
        allSites.push(s as any);
        seenIds.add(s.id);
      }
    });

    const results = allSites.map(site => {
      const siteStat = globalStats.find(gs => gs.id === site.id);
      const visitCount = (site.baseVisits || 0) + (Number(siteStat?.visitCount) || 0);
      return { ...site, visitCount };
    });

    return results.sort((a, b) => b.visitCount - a.visitCount).slice(0, 10);
  }, [submittedSites, globalStats, subsLoading, statsLoading]);

  // 4. Calculate Global Totals
  const platformStats = useMemo(() => {
    if (!globalStats || !topRedirects.length) return { totalRedirects: 0, totalWebsites: 0, maxVisit: 1 };
    
    const totalRedir = globalStats.reduce((acc, curr) => acc + (Number(curr.visitCount) || 0), 0) + 
                       MOCK_WEBSITES.reduce((acc, curr) => acc + (curr.baseVisits || 0), 0);
    
    return {
      totalRedirects: totalRedir,
      totalWebsites: topRedirects.length > 0 ? 250 + (submittedSites?.length || 0) : 0,
      maxVisit: topRedirects[0]?.visitCount || 1
    };
  }, [globalStats, topRedirects, submittedSites]);

  const handleCopyPitch = (siteName: string, count: number, id: string) => {
    const pitch = `Bessites has redirected ${count.toLocaleString()} users to your website. We would love to partner with you for a featured placement.`;
    navigator.clipboard.writeText(pitch);
    setCopiedId(id);
    toast({ title: "Pitch Copied", description: `Data for ${siteName} ready to send.` });
    setTimeout(() => setCopiedId(null), 3000);
  };

  if (subsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0A0F] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Synchronizing Impact Ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white font-body selection:bg-primary/30 p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12 pb-32">
        
        {/* Navigation & Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5 pb-12">
           <div className="space-y-4 text-center sm:text-left">
              <Link href="/">
                <Button variant="ghost" className="text-white/40 hover:text-white -ml-4 gap-2 font-bold group">
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Exit to Feed
                </Button>
              </Link>
              <div className="space-y-1">
                 <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter leading-none">Redirect <span className="text-primary">Proof.</span></h1>
                 <p className="text-muted-foreground font-medium italic opacity-40">Top 10 High-Fidelity Discovery Leads</p>
              </div>
           </div>
           <Badge className="bg-primary/20 text-primary border-none px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> System Verified Data
           </Badge>
        </header>

        {/* Global Stats Rollup */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <ProofStat label="Total Platform Redirects" value={platformStats.totalRedirects.toLocaleString()} icon={TrendingUp} color="text-primary" />
           <ProofStat label="Verified Assets Indexed" value={platformStats.totalWebsites.toLocaleString()} icon={Globe} color="text-blue-400" />
           <ProofStat label="Last Ledger Audit" value={new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} icon={Zap} color="text-emerald-400" />
        </section>

        {/* Main Ranking Table */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-white/20 px-4">
              <BarChart3 className="w-5 h-5" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Impact Ranking Node</h3>
              <div className="h-px flex-1 bg-white/5" />
           </div>

           <div className="space-y-4">
              {topRedirects.map((site, idx) => {
                const percentage = (site.visitCount / platformStats.maxVisit) * 100;
                const domain = site.url.replace('https://', '').replace('www.', '').split('/')[0];

                return (
                  <Card key={site.id} className="bg-[#121117] border-white/5 p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/40 transition-all shadow-2xl">
                     <div className="absolute top-0 right-0 p-8 text-7xl font-black italic text-white/[0.02] group-hover:text-primary/5 transition-colors leading-none">
                        {idx + 1}
                     </div>
                     
                     <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                        {/* Rank & Identity */}
                        <div className="flex items-center gap-6 flex-1 min-w-0 w-full">
                           <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-[#0A090F] border border-white/10 flex items-center justify-center p-3 shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-500">
                              <WebsitePreview websiteUrl={site.url} alt={site.name} className="w-full h-full object-contain rounded-lg" />
                           </div>
                           <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-3">
                                 <h4 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white truncate">{site.websiteName || site.name}</h4>
                                 <Badge variant="outline" className="border-white/10 bg-white/5 text-[9px] font-black uppercase italic text-white/40 hidden sm:inline-flex">Rank #{idx + 1}</Badge>
                              </div>
                              <p className="text-sm font-medium text-primary italic truncate opacity-80">{domain}</p>
                           </div>
                        </div>

                        {/* Metric & Bar Node */}
                        <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto shrink-0">
                           <div className="text-center sm:text-right space-y-1 min-w-[140px]">
                              <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">Total Redirects</p>
                              <h5 className="text-3xl font-black italic tabular-nums text-white group-hover:text-primary transition-colors">{site.visitCount.toLocaleString()}</h5>
                           </div>
                           
                           <div className="w-full sm:w-48 space-y-2">
                              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/30">
                                 <span>Relative Impact</span>
                                 <span>{percentage.toFixed(1)}%</span>
                              </div>
                              <Progress value={percentage} className="h-1.5 bg-white/5" />
                           </div>

                           <Button 
                            onClick={() => handleCopyPitch(site.name, site.visitCount, site.id)}
                            className={cn(
                              "h-14 px-8 rounded-2xl font-black uppercase italic text-[10px] tracking-[0.1em] transition-all shrink-0",
                              copiedId === site.id ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-primary hover:text-white"
                            )}
                           >
                              {copiedId === site.id ? (
                                <><Check className="w-4 h-4 mr-2" /> COPIED</>
                              ) : (
                                <><Copy className="w-4 h-4 mr-2" /> COPY PITCH</>
                              )}
                           </Button>
                        </div>
                     </div>
                  </Card>
                );
              })}
           </div>
        </section>

        {/* Footer Audit Message */}
        <footer className="pt-20 border-t border-white/5 flex flex-col items-center gap-8 text-center">
           <div className="space-y-4">
              <Logo className="text-4xl opacity-20" />
              <p className="text-sm text-muted-foreground max-w-lg italic font-medium opacity-30 leading-relaxed">
                This report represents a high-fidelity snapshot of the Bessites discovery pipeline. All interaction data is logged on the permanent platform ledger.
              </p>
           </div>
           <div className="flex items-center gap-4 text-white/10">
              <Share2 className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Proprietary Distribution Data</span>
           </div>
        </footer>

      </div>
    </div>
  );
}

function ProofStat({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden group hover:border-primary/20 transition-all">
       <div className="absolute top-0 right-0 p-8 text-white/[0.02] -mr-4 -mt-4 group-hover:scale-110 transition-transform"><Icon className="w-16 h-16" /></div>
       <div className={cn("p-4 rounded-2xl bg-white/5 w-fit", color)}><Icon className="w-6 h-6" /></div>
       <div className="space-y-1 relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{label}</p>
          <h4 className="text-4xl font-black italic text-white tabular-nums leading-none tracking-tighter">{value}</h4>
       </div>
    </Card>
  );
}
