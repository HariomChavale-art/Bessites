"use client"

import { useParams } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDoc, useUser, useFirestore, useCollection } from "@/firebase";
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc, deleteDoc, collection, query, orderBy, limit, where } from "firebase/firestore";
import { 
  Globe, 
  Loader2,
  MessageSquare,
  Star,
  Share2,
  Bookmark,
  Zap,
  ShieldCheck,
  Smartphone,
  Heart,
  Eye,
  TrendingUp,
  Sparkles,
  Flag,
  AlertTriangle,
  User as UserIcon,
  Clock
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { WebsitePreview } from "@/components/website-preview";
import { WebsiteCard } from "@/components/website-card";
import { useToast } from "@/hooks/use-toast";

export default function WebsiteDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [dynamicWebsite, setDynamicWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [ratingValue, setRatingValue] = useState(0);

  useEffect(() => {
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

  const ratingsQuery = useMemo(() => {
    if (!db || !id) return null;
    return query(
      collection(db, "websiteStats", id as string, "userRatings"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
  }, [db, id]);

  const { data: recentRatings } = useCollection(ratingsQuery);

  const relatedWebsites = useMemo(() => {
    if (!dynamicWebsite) return [];
    return MOCK_WEBSITES.filter(w => 
      w.id !== dynamicWebsite.id && 
      w.categories.some(cat => dynamicWebsite.categories?.includes(cat))
    ).slice(0, 4);
  }, [dynamicWebsite]);

  const currentRating = useMemo(() => {
    if (stats?.ratingCount && stats?.ratingCount > 0) {
      return (stats.ratingSum / stats.ratingCount).toFixed(1);
    }
    return "0.0";
  }, [stats]);

  const handleVisitClick = () => {
    if (!db || !id) return;
    const ref = doc(db, "websiteStats", id as string);
    updateDoc(ref, { visitCount: increment(1) }).catch(() => {
      setDoc(ref, { visitCount: 1 }, { merge: true });
    });
  };

  const handleLike = async () => {
    if (!user || !db || !id) {
      toast({ title: "Bessites Access", description: "Please sign in to like projects." });
      return;
    }
    
    const globalStatsRef = doc(db, "websiteStats", id as string);
    const userLikeRef = doc(db, "users", user.uid, "userLikes", id as string);

    if (isLiked) {
      await deleteDoc(userLikeRef);
      await updateDoc(globalStatsRef, { likeCount: increment(-1) });
    } else {
      await setDoc(userLikeRef, { likedAt: serverTimestamp() });
      await updateDoc(globalStatsRef, { likeCount: increment(1) });
      toast({ title: "Liked!", description: "Boosted discovery rank." });
    }
  };

  const handleSave = async () => {
    if (!user || !db || !id) {
      toast({ title: "Bessites Access", description: "Please sign in to save projects." });
      return;
    }
    
    const saveRef = doc(db, "users", user.uid, "likedWebsites", id as string);
    if (isSaved) {
      await deleteDoc(saveRef);
    } else {
      await setDoc(saveRef, { id, timestamp: serverTimestamp() });
      toast({ title: "Saved!", description: "Added to your collection." });
    }
  };

  const handleShare = async () => {
    if (!db || !id || !dynamicWebsite) return;
    const shareData = { title: `Bessites | ${dynamicWebsite.websiteName || dynamicWebsite.name}`, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Copied!", description: "Discovery link ready." });
      }
      await updateDoc(doc(db, "websiteStats", id as string), { shareCount: increment(1) });
    } catch (e) {}
  };

  const submitRating = async () => {
    if (!db || !id || !user || ratingValue === 0) return;
    setRatingLoading(true);
    try {
      const ratingRef = doc(db, "websiteStats", id as string, "userRatings", user.uid);
      const ratingData = {
        userId: user.uid,
        userDisplayName: user.displayName || "Curator",
        userPhotoURL: user.photoURL || "",
        rating: ratingValue,
        comment,
        timestamp: serverTimestamp()
      };
      await setDoc(ratingRef, ratingData);
      await updateDoc(doc(db, "websiteStats", id as string), { 
        ratingSum: increment(ratingValue), 
        ratingCount: increment(1) 
      });
      setComment("");
      setRatingValue(0);
      toast({ title: "Review Shared!", description: "Thanks for helping the community." });
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!dynamicWebsite) return <div className="min-h-screen flex items-center justify-center bg-background text-white font-black italic uppercase">Asset Not Found</div>;

  const visitCount = stats?.visitCount || 0;
  const likeCount = stats?.likeCount || 0;
  const isTrending = visitCount > 100 || likeCount > 20;

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col md:flex-row gap-10 items-start mb-12">
          <div className="w-full md:w-56 aspect-square rounded-[3rem] overflow-hidden bg-card border border-white/10 shrink-0 shadow-2xl relative group">
            <WebsitePreview 
              websiteUrl={dynamicWebsite.url}
              fallbackUrl={dynamicWebsite.logoUrl || dynamicWebsite.imageUrl}
              alt={dynamicWebsite.websiteName || dynamicWebsite.name}
              className="w-full h-full group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter italic uppercase leading-none truncate">
                {dynamicWebsite.websiteName || dynamicWebsite.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                 <p className="text-primary font-bold text-xl flex items-center gap-2 italic">
                   <Globe className="w-5 h-5" /> {dynamicWebsite.url.replace('https://', '').replace('www.', '').split('/')[0]}
                 </p>
                 <Badge variant="outline" className="border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest px-3 py-1 italic">{dynamicWebsite.pricing || 'Free'}</Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {dynamicWebsite.categories?.map((cat: string) => (
                <Badge key={cat} className="bg-primary/10 text-primary border-none uppercase text-[9px] font-black tracking-widest px-3 py-1.5 italic">
                  {cat}
                </Badge>
              ))}
              {isTrending && (
                <Badge className="border-none bg-primary text-white uppercase text-[9px] font-black tracking-widest px-4 py-1.5 italic animate-pulse">
                  <TrendingUp className="w-3.5 h-3.5 mr-2" /> Community Pick
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
               <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{dynamicWebsite.userEmail ? `LODGED BY ${dynamicWebsite.userEmail.split('@')[0]}` : 'CURATED BY BESSITES'}</span>
               </div>
               <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest italic">VERSION 1.0</span>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-16">
           <div className="xl:col-span-3 space-y-8">
              <div className="bg-[#121117] border border-white/5 p-10 rounded-[3.5rem] shadow-2xl space-y-6">
                 <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">About / Discovery</h2>
                 <p className="text-lg text-muted-foreground font-medium leading-relaxed italic">
                   {dynamicWebsite.description || dynamicWebsite.longDescription}
                 </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <MetricBox label="Rating" value={currentRating} sub="Avg Node" icon={Star} color="text-amber-500" />
                 <MetricBox label="Pulse" value={likeCount} sub="Total Likes" icon={Heart} color="text-pink-500" />
                 <MetricBox label="Volume" value={visitCount} sub="Views" icon={Eye} color="text-blue-500" />
                 <MetricBox label="Reach" value={stats?.shareCount || 0} sub="Shares" icon={Share2} color="text-emerald-500" />
              </div>
           </div>

           <div className="space-y-4">
              <Button onClick={handleVisitClick} asChild className="w-full h-24 bg-white text-black hover:bg-white/90 rounded-[2.5rem] text-2xl font-black italic gap-4 shadow-2xl hover:scale-[1.02] transition-all">
                <a href={dynamicWebsite.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-8 h-8" /> VISIT WEBSITE
                </a>
              </Button>
              <div className="grid grid-cols-3 gap-3">
                 <Button variant="outline" onClick={handleLike} className={cn("h-20 rounded-[2rem] border-white/5 bg-white/5 group", isLiked && "border-pink-500/20 bg-pink-500/5 text-pink-500")}>
                    <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
                 </Button>
                 <Button variant="outline" onClick={handleSave} className={cn("h-20 rounded-[2rem] border-white/5 bg-white/5 group", isSaved && "border-primary/20 bg-primary/5 text-primary")}>
                    <Bookmark className={cn("w-6 h-6", isSaved && "fill-current")} />
                 </Button>
                 <Button variant="outline" onClick={handleShare} className="h-20 rounded-[2rem] border-white/5 bg-white/5 group hover:text-emerald-400">
                    <Share2 className="w-6 h-6" />
                 </Button>
              </div>
              <Button variant="ghost" className="w-full h-14 rounded-2xl text-muted-foreground/30 hover:text-rose-500 hover:bg-rose-500/5 text-[10px] font-black uppercase tracking-[0.3em] gap-2">
                 <Flag className="w-3 h-3" /> Report Malicious Asset
              </Button>
           </div>
        </div>

        <section className="space-y-12 mb-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Review <span className="text-primary">Registry</span></h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black italic uppercase text-xs tracking-widest shadow-xl">WRITE EXPERIENCE</Button>
              </DialogTrigger>
              <DialogContent className="bg-[#121117] border-white/10 text-white rounded-[3rem] sm:max-w-md p-10">
                <DialogHeader className="space-y-2"><DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-center">Lodge <span className="text-primary">Insight</span></DialogTitle></DialogHeader>
                <div className="space-y-8 pt-6">
                  <div className="flex justify-center gap-5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRatingValue(s)} className="hover:scale-125 transition-transform">
                        <Star className={cn("w-10 h-10 transition-colors", s <= ratingValue ? 'text-primary fill-primary' : 'text-white/5')} />
                      </button>
                    ))}
                  </div>
                  <Textarea placeholder="How did this asset perform?" value={comment} onChange={(e) => setComment(e.target.value)} className="bg-white/5 border-white/10 rounded-[2rem] min-h-[120px] p-6 text-sm font-medium" />
                  <Button onClick={submitRating} disabled={ratingLoading || ratingValue === 0} className="w-full bg-primary hover:bg-primary/90 h-16 rounded-2xl font-black italic text-lg shadow-xl">
                    {ratingLoading ? <Loader2 className="animate-spin" /> : "POST TO REGISTRY"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentRatings && recentRatings.length > 0 ? (
              recentRatings.map((rating: any) => (
                <div key={rating.id} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-white/10 shadow-xl group-hover:scale-105 transition-transform">
                        <AvatarImage src={rating.userPhotoURL} className="object-cover" />
                        <AvatarFallback className="bg-muted text-xs font-black italic">{rating.userDisplayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-black text-white uppercase italic text-sm tracking-tight">{rating.userDisplayName}</span>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={cn("w-3 h-3", s <= rating.rating ? "text-primary fill-primary" : "text-white/5")} />))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground/30 italic">
                      {rating.timestamp ? formatDistanceToNow(rating.timestamp.toDate(), { addSuffix: true }) : 'SYNCING'}
                    </span>
                  </div>
                  {rating.comment && <p className="text-muted-foreground italic font-medium leading-relaxed">"{rating.comment}"</p>}
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white/[0.01] border border-dashed border-white/5 p-20 rounded-[3.5rem] text-center space-y-4">
                <MessageSquare className="w-16 h-16 text-muted-foreground/10 mx-auto" />
                <p className="font-black italic uppercase text-muted-foreground/20 tracking-[0.3em]">Registry Currently Silent</p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-24 space-y-8">
           <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Digital Benchmarks</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-10 rounded-[3rem] bg-[#121117] border border-white/5">
              <TechStat label="Load Time" value="0.8s" icon={Zap} color="text-emerald-400" />
              <TechStat label="SSL" value="Verified" icon={ShieldCheck} color="text-primary" />
              <TechStat label="Optimized" value="98%" icon={Smartphone} color="text-amber-400" />
              <TechStat label="Edge Node" value="Global" icon={Globe} color="text-blue-400" />
           </div>
        </section>

        {relatedWebsites.length > 0 && (
          <section className="space-y-10 pt-24 border-t border-white/5">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Related <span className="text-primary">Discovery</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedWebsites.map((site) => (<WebsiteCard key={site.id} website={site} />))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function MetricBox({ label, value, sub, icon: Icon, color }: { label: string, value: string | number, sub: string, icon: any, color: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] text-center space-y-1 relative overflow-hidden group">
       <Icon className={cn("w-12 h-12 absolute -right-2 -bottom-2 opacity-5 rotate-12 group-hover:scale-125 transition-transform", color)} />
       <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest">{label}</p>
       <h4 className={cn("text-3xl font-black italic tracking-tighter", color)}>{value}</h4>
       <p className="text-[8px] font-black uppercase text-muted-foreground/20">{sub}</p>
    </div>
  );
}

function TechStat({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="flex items-center gap-5 border-r border-white/5 last:border-none group">
       <div className={cn("p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform", color)}><Icon className="w-6 h-6" /></div>
       <div><p className="text-[9px] font-black uppercase text-muted-foreground/30 mb-0.5">{label}</p><h5 className="text-lg font-black italic text-white uppercase">{value}</h5></div>
    </div>
  );
}