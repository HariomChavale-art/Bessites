
"use client"

import { useParams, useRouter } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WebsitePreview } from "@/components/website-preview";
import { useDoc, useUser, useFirestore, useCollection } from "@/firebase";
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc, deleteDoc, collection, query, orderBy, limit } from "firebase/firestore";
import { 
  Star, 
  ArrowLeft, 
  Globe, 
  ShieldCheck, 
  Bookmark,
  Lock,
  MoreVertical,
  Loader2,
  ExternalLink,
  Heart,
  MessageSquare,
  Tag
} from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default function WebsiteDetail() {
  const { id } = useParams();
  const router = useRouter();
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
      limit(5)
    );
  }, [db, id]);

  const { data: recentRatings } = useCollection(ratingsQuery);

  if (!website) return <div className="p-8 text-center text-white">Website not found</div>;

  const currentRating = stats?.ratingCount > 0 
    ? (stats.ratingSum / stats.ratingCount).toFixed(1) 
    : website.rating.toFixed(1);
  
  const visitCount = stats?.visitCount || 0;
  const totalReviews = (stats?.ratingCount || 0); // We only count real database reviews now

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
      
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="p-2 text-white hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="p-2 text-white hover:bg-white/5 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <div className="relative w-32 h-32 rounded-[2.5rem] overflow-hidden bg-white/5 p-4 shadow-2xl border border-white/10">
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
          
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-white tracking-tight">{website.name}</h1>
            <div className="flex items-center justify-center gap-2 text-[#8ab4f8] font-semibold text-base">
              {website.url.replace('https://', '')}
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between px-2 mb-10 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-white font-bold text-lg">
              {currentRating} <Star className="w-4 h-4 fill-white" />
            </div>
            <span className="text-muted-foreground text-[10px] mt-1 uppercase tracking-wider font-bold">Community Rating</span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center flex-1">
            <div className="text-white font-bold text-lg flex items-center gap-2">
               <Tag className="w-4 h-4 text-primary" />
               {website.pricing}
            </div>
            <span className="text-muted-foreground text-[10px] mt-1 uppercase tracking-wider font-bold">Pricing Model</span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center flex-1">
            <div className="text-white font-bold text-lg">{visitCount.toLocaleString()}</div>
            <span className="text-muted-foreground text-[10px] mt-1 uppercase tracking-wider font-bold">Visits</span>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Button asChild onClick={handleVisitClick} className="flex-[2] bg-white text-background hover:bg-white/90 font-bold rounded-2xl h-14 gap-2 text-lg shadow-xl">
            <a href={website.url} target="_blank" rel="noopener noreferrer">
              <Globe className="w-5 h-5" /> Visit Site
            </a>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLike}
            className={`flex-1 border-white/10 bg-white/5 rounded-2xl h-14 font-semibold gap-2 ${liked ? "text-primary border-primary/40" : "text-white"}`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} /> 
            {liked ? "Liked" : "Like"}
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-12 text-[11px] font-medium text-muted-foreground">
          <Lock className="w-3 h-3 text-green-500" /> Verified Connection
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Preview</h2>
          <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-card">
            <WebsitePreview 
              websiteId={website.id}
              websiteUrl={website.url}
              fallbackUrl={website.imageUrl}
              alt={website.name}
              width={1200}
              height={800}
              className="w-full aspect-video"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Community Feed</h2>
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">{currentRating}</div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{totalReviews.toLocaleString()} Real Reviews</div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="mt-6 bg-primary/20 text-primary hover:bg-primary/30 font-bold rounded-full px-6">
                      Rate Now
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
              <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map((r) => (
                  <div key={r} className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground w-2 font-bold">{r}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${r === 5 ? 80 : r === 4 ? 15 : 5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {recentRatings && recentRatings.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentRatings.map((rating: any) => (
                    <div key={rating.id} className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex gap-4">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={rating.userPhotoURL} />
                        <AvatarFallback className="bg-muted text-xs">{rating.userDisplayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{rating.userDisplayName}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {rating.timestamp ? formatDistanceToNow(rating.timestamp.toDate(), { addSuffix: true }) : 'Just now'}
                          </span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= rating.rating ? 'text-primary fill-primary' : 'text-white/5'}`} />
                          ))}
                        </div>
                        {rating.comment && (
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">
                            "{rating.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
