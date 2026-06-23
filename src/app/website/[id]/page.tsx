
"use client"

import { useParams } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDoc, useUser, useFirestore, useCollection } from "@/firebase";
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc, deleteDoc, collection, query, orderBy, limit } from "firebase/firestore";
import { 
  Globe, 
  MoreVertical,
  Loader2,
  MessageSquare,
  Star,
  Share2,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  Zap,
  ShieldCheck,
  Info,
  Smartphone
} from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { WebsitePreview } from "@/components/website-preview";
import Link from "next/link";

export default function WebsiteDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const db = useFirestore();
  
  const website = MOCK_WEBSITES.find(w => w.id === id);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [ratingValue, setRatingValue] = useState(0);

  const statsRef = useMemo(() => {
    if (!db || !id) return null;
    return doc(db, "websiteStats", id as string);
  }, [db, id]);

  const { data: stats } = useDoc(statsRef);

  const ratingsQuery = useMemo(() => {
    if (!db || !id) return null;
    return query(
      collection(db, "websiteStats", id as string, "userRatings"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
  }, [db, id]);

  const { data: recentRatings } = useCollection(ratingsQuery);

  const similarWebsites = useMemo(() => {
    if (!website) return [];
    return MOCK_WEBSITES.filter(w => 
      w.id !== website.id && 
      w.categories.some(cat => website.categories.includes(cat))
    ).slice(0, 8);
  }, [website]);

  if (!website) return <div className="p-8 text-center text-white">Website not found</div>;

  const currentRating = stats?.ratingCount > 0 
    ? (stats.ratingSum / stats.ratingCount).toFixed(1) 
    : "0.0";
  
  const visitCount = stats?.visitCount || 0;
  const totalReviews = stats?.ratingCount || 0;

  const handleVisitClick = () => {
    if (!db || !id) return;
    const ref = doc(db, "websiteStats", id as string);
    setDoc(ref, { visitCount: increment(1) }, { merge: true });
  };

  const handleLike = async () => {
    if (!user || !db || !id) return;
    
    const likeRef = doc(db, "users", user.uid, "likedWebsites", id as string);
    const globalStatsRef = doc(db, "websiteStats", id as string);

    if (liked) {
      deleteDoc(likeRef);
      setDoc(globalStatsRef, { ratingSum: increment(-1), ratingCount: increment(-1) }, { merge: true });
    } else {
      setDoc(likeRef, { id, timestamp: new Date().toISOString() });
      setDoc(globalStatsRef, { ratingSum: increment(5), ratingCount: increment(1) }, { merge: true });
    }
    setLiked(!liked);
  };

  const submitRating = async () => {
    if (!db || !id || !user || ratingValue === 0) return;
    setRatingLoading(true);
    
    const userRatingRef = doc(db, "websiteStats", id as string, "userRatings", user.uid);
    const globalStatsRef = doc(db, "websiteStats", id as string);

    try {
      const existingDoc = await getDoc(userRatingRef);
      const ratingData = {
        userId: user.uid,
        userDisplayName: user.displayName || "Anonymous",
        userPhotoURL: user.photoURL || "",
        rating: ratingValue,
        comment: comment,
        timestamp: serverTimestamp()
      };

      if (existingDoc.exists()) {
        const oldRating = existingDoc.data().rating;
        updateDoc(userRatingRef, ratingData);
        updateDoc(globalStatsRef, { ratingSum: increment(ratingValue - oldRating) });
      } else {
        setDoc(userRatingRef, ratingData);
        setDoc(globalStatsRef, { ratingSum: increment(ratingValue), ratingCount: increment(1) }, { merge: true });
      }
      setComment("");
      setRatingValue(0);
    } catch (e) {
      console.error(e);
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8 pb-32">
        <div className="flex gap-6 items-start mb-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] overflow-hidden bg-card border border-white/10 shrink-0">
            <WebsitePreview 
              websiteId={website.id}
              websiteUrl={website.url}
              fallbackUrl={website.imageUrl}
              alt={website.name}
              width={256}
              height={256}
              mode="logo"
              className="w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight truncate">{website.name}</h1>
            <p className="text-primary font-medium text-lg truncate">{website.url.replace('https://', '')}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {website.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="bg-white/10 text-white border-none uppercase text-[10px] font-black tracking-widest px-3 py-1">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          <button className="p-2 text-muted-foreground hover:text-white shrink-0">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-10 pb-8 border-b border-white/5">
          <div className="text-center space-y-1 border-r border-white/5">
            <div className="flex items-center justify-center gap-1">
              <span className="text-white font-black text-xl">{currentRating}</span>
              <Star className="w-4 h-4 fill-primary text-primary" />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Rating</p>
          </div>
          <div className="text-center space-y-1 border-r border-white/5">
            <span className="text-white font-black text-xl">{totalReviews}</span>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Reviews</p>
          </div>
          <div className="text-center space-y-1 border-r border-white/5">
            <span className="text-white font-black text-xl">{visitCount}</span>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Visits</p>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-green-500">
               <CheckCircle2 className="w-4 h-4" />
               <span className="font-black text-xl">100%</span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Uptime</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button 
            onClick={handleVisitClick} 
            asChild 
            className="flex-[3] bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 text-xl font-black gap-3 shadow-xl glow-primary"
          >
            <a href={website.url} target="_blank" rel="noopener noreferrer">
              <Globe className="w-6 h-6" /> Visit Website
            </a>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLike}
            className={cn(
              "flex-1 rounded-2xl border-white/10 bg-white/5 h-16 font-black gap-3 text-lg",
              liked && "text-primary border-primary/20"
            )}
          >
            <Bookmark className={cn("w-6 h-6", liked && "fill-current")} /> {liked ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" className="flex-1 rounded-2xl border-white/10 bg-white/5 h-16 font-black gap-3 text-lg">
            <Share2 className="w-6 h-6" /> Share
          </Button>
        </div>

        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-black text-white tracking-tight">About {website.name}</h2>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            {website.longDescription}
          </p>
          <div className="flex flex-wrap gap-3">
            {website.categories.map(cat => (
              <Badge key={cat} className="bg-white/5 hover:bg-white/10 text-white border-white/5 py-2.5 px-6 rounded-full text-sm font-bold">
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        <section className="space-y-8 mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5 mb-4">
            <div className="flex items-center gap-4 border-r border-white/5 pr-4 last:border-none">
              <div className="bg-green-500/10 p-2.5 rounded-xl">
                <Zap className="w-6 h-6 text-green-500" fill="currentColor" />
              </div>
              <div>
                <div className="text-xl font-black text-white">0.9s</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                  Load Speed <Info className="w-3 h-3" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-r border-white/5 pr-4 last:border-none">
              <div className="bg-green-500/10 p-2.5 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-xl font-black text-white">SSL</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                  Secured <Info className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-r border-white/5 pr-4 last:border-none">
              <div className="bg-blue-500/10 p-2.5 rounded-xl">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-xl font-black text-white">190+</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                  Countries <Info className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/10 p-2.5 rounded-xl">
                <Smartphone className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-xl font-black text-white">98/100</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                  Mobile Friendly <Info className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white tracking-tight">Community reviews</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10">
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white rounded-[2.5rem] sm:max-w-md p-8">
                <DialogHeader><DialogTitle className="text-2xl font-bold text-center">Share your experience</DialogTitle></DialogHeader>
                <div className="space-y-6">
                  <div className="flex justify-center gap-4 py-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRatingValue(s)} className="hover:scale-125 transition-transform">
                        <Star className={`w-10 h-10 ${s <= ratingValue ? 'text-primary fill-primary' : 'text-white/10'}`} />
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="What do you think of this site? (Optional)" 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-2xl min-h-[100px] text-white"
                    />
                  </div>
                  <Button 
                    onClick={submitRating} 
                    disabled={ratingLoading || ratingValue === 0}
                    className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-2xl font-bold"
                  >
                    {ratingLoading ? <Loader2 className="animate-spin" /> : "Post Review"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {recentRatings && recentRatings.length > 0 ? (
              recentRatings.map((rating: any) => (
                <div key={rating.id} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={rating.userPhotoURL} />
                        <AvatarFallback className="bg-muted text-sm">{rating.userDisplayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-bold text-white block">{rating.userDisplayName}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn("w-3 h-3", s <= rating.rating ? "text-primary fill-primary" : "text-white/5")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {rating.timestamp ? formatDistanceToNow(rating.timestamp.toDate(), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-muted-foreground italic leading-relaxed font-medium">
                      "{rating.comment}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[2rem] text-center opacity-40">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                <p className="font-bold">No community reviews yet for {website.name}.</p>
              </div>
            )}
          </div>
        </section>

        {similarWebsites.length > 0 && (
          <section className="space-y-6 pt-12 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tight">Similar to {website.name}</h2>
              <Link href="/explore" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                Explore more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similarWebsites.map((sub) => (
                <Link key={sub.id} href={`/website/${sub.id}`}>
                  <div className="flex items-center gap-4 p-0 overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/20 transition-all group">
                    <div className="w-20 h-20 overflow-hidden bg-card border-r border-white/10 shrink-0">
                      <WebsitePreview 
                        websiteId={sub.id}
                        websiteUrl={sub.url}
                        fallbackUrl={sub.imageUrl}
                        alt={sub.name}
                        width={80}
                        height={80}
                        mode="logo"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                      <h3 className="font-bold text-white truncate group-hover:text-primary transition-colors">{sub.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{sub.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
