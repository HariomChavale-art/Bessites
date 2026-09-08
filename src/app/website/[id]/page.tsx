
"use client"

import { useParams } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDoc, useUser, useFirestore, useCollection } from "@/firebase";
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc, deleteDoc, collection, query, where, limit } from "firebase/firestore";
import { 
  Globe, 
  Loader2,
  Share2,
  Bookmark,
  Heart,
  Eye,
  Star,
  MessageSquare,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WebsitePreview } from "@/components/website-preview";
import { WebsiteCard } from "@/components/website-card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function WebsiteDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [dynamicWebsite, setDynamicWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  
  // Stable random baselines: Visits (100-200), Others (10-50)
  const [baseStats, setBaseStats] = useState({
    visits: 0,
    likes: 0,
    saves: 0,
    shares: 0
  });

  useEffect(() => {
    setBaseStats({
      visits: Math.floor(Math.random() * 101) + 100,
      likes: Math.floor(Math.random() * 41) + 10,
      saves: Math.floor(Math.random() * 41) + 10,
      shares: Math.floor(Math.random() * 41) + 10
    });

    const fetchWebsite = async () => {
      if (!id || !db) return;
      
      const mockSite = MOCK_WEBSITES.find(w => w.id === id);
      if (mockSite) {
        setDynamicWebsite(mockSite);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "submissions", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDynamicWebsite({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (e) {
        console.error("Error fetching website:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [id, db]);

  const statsRef = useMemo(() => {
    if (!db || !id) return null;
    return doc(db, "websiteStats", id as string);
  }, [db, id]);
  const { data: stats } = useDoc(statsRef);

  const saveDocRef = useMemo(() => {
    if (!user || !db || !id) return null;
    return doc(db, "users", user.uid, "likedWebsites", id as string);
  }, [user, db, id]);
  const { data: saveData } = useDoc(saveDocRef);
  const isSaved = !!saveData;

  const likeDocRef = useMemo(() => {
    if (!user || !db || !id) return null;
    return doc(db, "users", user.uid, "userLikes", id as string);
  }, [user, db, id]);
  const { data: likeData } = useDoc(likeDocRef);
  const isLiked = !!likeData;

  const visitDocRef = useMemo(() => {
    if (!user || !db || !id) return null;
    return doc(db, "users", user.uid, "userVisits", id as string);
  }, [user, db, id]);
  const { data: visitData } = useDoc(visitDocRef);
  const isVisited = !!visitData;

  const shareDocRef = useMemo(() => {
    if (!user || !db || !id) return null;
    return doc(db, "users", user.uid, "userShares", id as string);
  }, [user, db, id]);
  const { data: shareData } = useDoc(shareDocRef);
  const isShared = !!shareData;

  // Similar Websites Logic
  const similarWebsites = useMemo(() => {
    if (!dynamicWebsite) return [];
    return MOCK_WEBSITES.filter(w => 
      w.id !== id && 
      w.categories.some(cat => dynamicWebsite.categories?.includes(cat))
    ).slice(0, 4);
  }, [dynamicWebsite, id]);

  const handleVisitClick = async () => {
    if (!user || !db || !id) {
      window.open(dynamicWebsite.url, '_blank');
      return;
    }
    const globalStatsRef = doc(db, "websiteStats", id as string);
    try {
      if (!isVisited) {
        await setDoc(visitDocRef!, { visitedAt: serverTimestamp() });
        await setDoc(globalStatsRef, { visitCount: increment(1) }, { merge: true });
      }
      window.open(dynamicWebsite.url, '_blank');
    } catch (e) { console.error(e); }
  };

  const handleLike = async () => {
    if (!user || !db || !id) return;
    const globalStatsRef = doc(db, "websiteStats", id as string);
    try {
      if (isLiked) {
        await deleteDoc(likeDocRef!);
        await updateDoc(globalStatsRef, { likeCount: increment(-1) });
      } else {
        await setDoc(likeDocRef!, { likedAt: serverTimestamp() });
        await updateDoc(globalStatsRef, { likeCount: increment(1) });
      }
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!user || !db || !id) return;
    const globalStatsRef = doc(db, "websiteStats", id as string);
    try {
      if (isSaved) {
        await deleteDoc(saveDocRef!);
        await updateDoc(globalStatsRef, { saveCount: increment(-1) });
      } else {
        await setDoc(saveDocRef!, { id, timestamp: serverTimestamp() });
        await updateDoc(globalStatsRef, { saveCount: increment(1) });
      }
    } catch (e) { console.error(e); }
  };

  const handleShare = async () => {
    if (!user || !db || !id) return;
    const globalStatsRef = doc(db, "websiteStats", id as string);
    try {
      if (isShared) {
        await deleteDoc(shareDocRef!);
        await updateDoc(globalStatsRef, { shareCount: increment(-1) });
      } else {
        await setDoc(shareDocRef!, { sharedAt: serverTimestamp() });
        await updateDoc(globalStatsRef, { shareCount: increment(1) });
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Copied!", description: "Link copied to clipboard." });
      }
    } catch (e) { console.error(e); }
  };

  const submitReview = async () => {
    if (!user || !db || !id || !reviewText.trim()) return;
    toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
    setReviewText("");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!dynamicWebsite) return <div className="min-h-screen flex items-center justify-center bg-background text-white font-black italic uppercase">Not Found</div>;

  const displayVisits = baseStats.visits + (stats?.visitCount || 0);
  const displayLikes = baseStats.likes + (isLiked ? 1 : 0);
  const displaySaves = baseStats.saves + (isSaved ? 1 : 0);
  const displayShares = baseStats.shares + (isShared ? 1 : 0);

  const brandName = dynamicWebsite.websiteName || dynamicWebsite.name;
  const rawExplainingTitle = dynamicWebsite.websiteName ? dynamicWebsite.name : (dynamicWebsite.description?.split('.')[0] || "Modern Discovery");
  const explainer = rawExplainingTitle.includes('|') 
    ? rawExplainingTitle.split('|')[1].trim() 
    : rawExplainingTitle.replace(brandName, '').replace(/^[\s\-|]+/, '').trim() || "Web Resource";
  
  const displayTitle = `${brandName} | ${explainer.slice(0, 35)}${explainer.length > 35 ? '...' : ''}`;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-12 space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="w-full md:w-56 aspect-square rounded-[2rem] bg-white/[0.03] border border-white/10 overflow-hidden shrink-0 shadow-2xl flex items-center justify-center p-4">
            <WebsitePreview 
              websiteUrl={dynamicWebsite.url}
              fallbackUrl={dynamicWebsite.logoUrl || dynamicWebsite.imageUrl}
              alt={brandName}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl font-headline font-bold italic text-white tracking-tighter uppercase leading-tight">
                {displayTitle}
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm sm:text-base text-primary font-black uppercase tracking-[0.3em] italic">Official Registry</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-zinc-400 font-bold text-lg flex items-center gap-2 italic">
                <Globe className="w-4 h-4" /> {dynamicWebsite.url.replace('https://', '').replace('www.', '').split('/')[0]}
              </p>
              <Badge variant="outline" className="border-white/10 bg-white/5 text-[10px] font-black uppercase italic">{dynamicWebsite.pricing || 'Free'}</Badge>
            </div>
          </div>
        </div>

        {/* Content & Actions Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter border-b border-white/5 pb-4">Discovery / Insight</h2>
              <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed italic tracking-tight">
                {dynamicWebsite.description || dynamicWebsite.longDescription}
              </p>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricBox label="Visits" value={displayVisits} icon={Eye} color="text-blue-500" />
              <MetricBox label="Likes" value={displayLikes} icon={Heart} color="text-rose-500" />
              <MetricBox label="Saves" value={displaySaves} icon={Bookmark} color="text-amber-500" />
              <MetricBox label="Shared" value={displayShares} icon={Share2} color="text-emerald-500" />
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleVisitClick} className="w-full h-24 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-2xl font-black italic gap-4 shadow-2xl">
              <Globe className="w-8 h-8" /> VISIT WEBSITE
            </Button>
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" onClick={handleLike} className={cn("h-20 rounded-[2rem] bg-white/5 border-white/5", isLiked && "text-rose-500")}><Heart className={cn("w-6 h-6", isLiked && "fill-current")} /></Button>
              <Button variant="outline" onClick={handleSave} className={cn("h-20 rounded-[2rem] bg-white/5 border-white/5", isSaved && "text-amber-500")}><Bookmark className={cn("w-6 h-6", isSaved && "fill-current")} /></Button>
              <Button variant="outline" onClick={handleShare} className={cn("h-20 rounded-[2rem] bg-white/5 border-white/5", isShared && "text-emerald-500")}><Share2 className={cn("w-6 h-6", isShared && "fill-current")} /></Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="space-y-8">
           <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                 <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Community Reviews</h2>
           </div>

           <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] space-y-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setRating(s)}>
                         <Star className={cn("w-8 h-8 transition-colors", rating >= s ? "text-amber-400 fill-amber-400" : "text-white/10")} />
                      </button>
                    ))}
                    <span className="ml-4 text-xs font-black uppercase tracking-widest text-muted-foreground opacity-40">Identify your experience</span>
                 </div>
                 <Textarea 
                   value={reviewText}
                   onChange={(e) => setReviewText(e.target.value)}
                   placeholder="Share your discovery insight with the community..." 
                   className="bg-white/5 border-white/10 rounded-2xl min-h-[120px] p-6 text-sm font-medium italic"
                 />
                 <Button onClick={submitReview} disabled={!reviewText.trim()} className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black italic uppercase">
                    Publish Review
                 </Button>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                 {/* Mock existing reviews for UI completeness */}
                 <div className="space-y-4">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                       <div className="space-y-1">
                          <p className="text-sm font-black italic text-white uppercase">Curator_Alpha</p>
                          <div className="flex items-center gap-1 mb-2">
                             {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed italic">"An absolute essential for my workflow. The UI is incredibly polished and the features are production-ready."</p>
                       </div>
                    </div>
                 </div>
              </div>
           </Card>
        </section>

        {/* Similar Websites Section */}
        <section className="space-y-10">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Similar Discovery</h2>
              </div>
              <Link href="/explore">
                 <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 gap-2 italic">
                    Explore Node <ArrowRight className="w-3.5 h-3.5" />
                 </Button>
              </Link>
           </div>

           <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
              {similarWebsites.map((site) => (
                <WebsiteCard key={site.id} website={site} />
              ))}
              {similarWebsites.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
                   <p className="text-muted-foreground italic font-medium opacity-20 uppercase tracking-widest">No similar assets found in this node.</p>
                </div>
              )}
           </div>
        </section>
      </main>
    </div>
  );
}

function MetricBox({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center space-y-1 relative overflow-hidden group">
      <Icon className={cn("w-12 h-12 absolute -right-2 -bottom-2 opacity-5 rotate-12 transition-transform group-hover:scale-125", color)} />
      <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest">{label}</p>
      <h4 className={cn("text-3xl font-black italic tracking-tighter", color)}>{value.toLocaleString()}</h4>
    </div>
  );
}
