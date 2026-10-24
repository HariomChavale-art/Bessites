
'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { StackDocument, StackItemDocument } from '@/types/stacks';
import { 
  Loader2, 
  ChevronLeft, 
  Zap, 
  ShieldCheck, 
  Unlock, 
  ExternalLink, 
  Rocket, 
  Layers,
  Heart,
  Bookmark,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DEFAULT_SEED_STACKS, SEED_STACK_ITEMS } from '@/data/seedStacks';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function StackDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();

  // 1. Fetch Stack Main Document
  const seedStack = useMemo(() => DEFAULT_SEED_STACKS.find(s => s.slug === slug), [slug]);
  const stackRef = useMemo(() => seedStack ? null : doc(db!, 'stacks', slug as string), [db, seedStack, slug]);
  const { data: dbStack, loading: stackLoading } = useDoc<StackDocument>(stackRef);
  
  const stack = seedStack || dbStack;

  // 2. Fetch Stack Items
  const seedItems = useMemo(() => seedStack ? SEED_STACK_ITEMS[seedStack.id] || [] : [], [seedStack]);
  const itemsRef = useMemo(() => seedStack ? null : query(collection(db!, `stacks/${slug}/items`), orderBy('orderIndex', 'asc')), [db, seedStack, slug]);
  const { data: dbItems, loading: itemsLoading } = useCollection<StackItemDocument>(itemsRef);

  const items = seedStack ? seedItems : (dbItems || []);

  const handleOpenAll = () => {
    items.forEach(item => window.open(item.websiteUrl, '_blank'));
    toast({ title: "Surge Initiated", description: "Opening all verified websites in background tabs." });
  };

  if (stackLoading && !seedStack) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="animate-spin text-primary" /></div>;
  if (!stack) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F] font-black italic uppercase">Stack Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white">
      <Navigation />
      
      <main className="container mx-auto max-w-6xl px-4 py-12 pb-32 space-y-16">
        <header className="space-y-8">
           <Button variant="ghost" onClick={() => router.back()} className="text-white/40 hover:text-white -ml-4 gap-2 font-bold group">
             <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Registry
           </Button>

           <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-4">
                    <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black uppercase italic tracking-widest px-4 py-1">{stack.category}</Badge>
                    {stack.isStaffPick && <Badge className="bg-amber-500/20 text-amber-400 border-none text-[10px] font-black uppercase italic gap-1"><Zap className="w-3 h-3 fill-current" /> Staff Pick</Badge>}
                 </div>
                 <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter leading-none">{stack.title}</h1>
                 <p className="text-xl text-muted-foreground font-medium italic leading-relaxed max-w-3xl border-l-4 border-primary pl-8">{stack.description}</p>
                 
                 <div className="flex items-center gap-4 pt-4">
                    <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                       <AvatarImage src={stack.creatorSnapshot.avatarUrl} />
                       <AvatarFallback>{stack.creatorSnapshot.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                       <p className="text-sm font-black italic uppercase tracking-tight">{stack.creatorSnapshot.displayName}</p>
                       <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Founding Member #{stack.creatorSnapshot.founderNumber}</p>
                    </div>
                 </div>
              </div>

              <div className="w-full lg:w-80 space-y-4">
                 <Button onClick={handleOpenAll} className="w-full h-20 rounded-[2rem] bg-white text-black hover:bg-white/90 font-black text-xl italic shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                    OPEN ALL IN TABS <Rocket className="w-6 h-6 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </Button>
                 <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-16 rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 font-bold uppercase text-[10px] gap-2"><Layers className="w-4 h-4 text-primary" /> FORK STACK</Button>
                    <Button variant="outline" className="h-16 rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 font-bold uppercase text-[10px] gap-2"><Share2 className="w-4 h-4" /> SHARE</Button>
                 </div>
              </div>
           </div>
        </header>

        <section className="space-y-8">
           <div className="flex items-center gap-4 text-white/20">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">System Audit</span>
              <div className="h-px flex-1 bg-white/5" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AuditCard label="Cost Node" value={stack.badges.isFullyFree ? '100% Free' : 'Mixed Access'} icon={Zap} color="text-emerald-400" />
              <AuditCard label="Ad Presence" value={stack.badges.isAdFree ? 'Zero Ads' : 'Minimal Ads'} icon={ShieldCheck} color="text-blue-400" />
              <AuditCard label="Authentication" value={stack.badges.isNoSignup ? 'No Signup Required' : 'Varies'} icon={Unlock} color="text-amber-400" />
           </div>
        </section>

        <section className="grid grid-cols-1 gap-6">
           {items.map((item, idx) => (
             <Card key={item.id} className="bg-[#12111A] border-white/5 p-8 rounded-[3rem] hover:border-primary/20 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 text-6xl font-black italic text-white/[0.02] group-hover:text-primary/5 transition-colors">0{idx + 1}</div>
                <div className="flex flex-col md:flex-row gap-10 relative z-10">
                   <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0A0910] border border-white/10 flex items-center justify-center p-5 shrink-0 group-hover:scale-105 transition-transform shadow-2xl">
                      <img src={item.faviconUrl} alt={item.title} className="w-full h-full object-contain" />
                   </div>
                   <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                         <div className="flex items-center gap-4">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{item.title}</h3>
                            <span className="text-[10px] font-mono text-white/20">{item.normalizedDomain}</span>
                         </div>
                         <p className="text-lg text-white/90 font-medium italic leading-relaxed max-w-2xl">{item.curatorNote}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {item.isFree && <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] font-black uppercase italic">Free</Badge>}
                         {!item.hasAds && <Badge className="bg-blue-500/10 text-blue-400 border-none text-[8px] font-black uppercase italic">Zero Ads</Badge>}
                         {!item.requiresLogin && <Badge className="bg-amber-500/10 text-amber-400 border-none text-[8px] font-black uppercase italic">No Signup</Badge>}
                      </div>
                   </div>
                   <div className="flex items-center">
                      <Button onClick={() => window.open(item.websiteUrl, '_blank')} className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase italic hover:bg-primary hover:border-primary hover:text-white transition-all gap-3 shadow-xl">
                         VISIT SITE <ExternalLink className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
             </Card>
           ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function AuditCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <Card className="bg-white/[0.02] border-white/5 p-6 rounded-[2rem] flex items-center gap-6">
       <div className={cn("p-4 rounded-2xl bg-white/5", color)}><Icon className="w-6 h-6" /></div>
       <div>
          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">{label}</p>
          <h4 className="text-lg font-black italic uppercase text-white">{value}</h4>
       </div>
    </Card>
  );
}
