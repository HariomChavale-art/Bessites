"use client"

import { useParams, useRouter } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { useDoc, useUser, useFirestore, useCollection } from "@/firebase";
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc, deleteDoc, collection, query, orderBy, limit } from "firebase/firestore";
import { 
  ArrowLeft, 
  Globe, 
  Lock,
  MoreVertical,
  Loader2,
  ExternalLink,
  Heart,
  MessageSquare,
  Tag,
  Info,
  User,
  History,
  ShieldCheck,
  Star
} from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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
  const totalReviews = (stats?.ratingCount || 0);

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

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case "Paid": return "bg-white text-black border-none";
      case "Free": return "bg-black text-white border-white/20";
      case "Freemium":
      default: return "bg-secondary text-secondary-foreground border-white/10";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8 pb-32">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Back to Feed</span>
          </button>
          <div className="flex items-center gap-3">
             <Button 
              variant="outline" 
              onClick={handleLike}
              className={cn(
                "rounded-full border-white/10 bg-white/5 font-bold gap-2 h-10 px-6",
                liked ? "text-primary border-primary/40" : "text-white"
              )}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} /> 
              {liked ? "Liked" : "Like"}
            </Button>
            <button className="p-2 text-white hover:bg-white/5 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">{website.name}</h1>
                  <p className="text-primary font-bold text-lg">{website.url.replace('https://', '')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary" />
                  About the Tool
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  {website.longDescription}
                </p>
              </div>
            </header>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                Technical Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Developer</p>
                    <p className="text-white font-bold">{website.developer}</p>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl">
                    <History className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Last Updated</p>
                    <p className="text-white font-bold">{website.updatedAt}</p>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Version</p>
                    <p className="text-white font-bold">{website.version}</p>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl">
                    <Star className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Category</p>
                    <p className="text-white font-bold">{website.categories[0]}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Community Activity
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10">
                      Add Review
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
                    <div key={rating.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex gap-6">
                      <Avatar className="w-12 h-12 border border-white/10">
                        <AvatarImage src={rating.userPhotoURL} />
                        <AvatarFallback className="bg-muted text-sm">{rating.userDisplayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-lg">{rating.userDisplayName}</span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {rating.timestamp ? formatDistanceToNow(rating.timestamp.toDate(), { addSuffix: true }) : 'Just now'}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn("w-3.5 h-3.5", s <= rating.rating ? "text-primary fill-primary" : "text-white/5")} />
                          ))}
                        </div>
                        {rating.comment && (
                          <p className="text-muted-foreground italic leading-relaxed">
                            "{rating.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/[0.02] border border-white/5 p-12 rounded-3xl text-center opacity-40">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-bold">Be the first to share your thoughts on {website.name}</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-8 sticky top-24">
              <div className="space-y-4">
                <div className={cn(
                  "w-full py-4 rounded-2xl border text-center font-black uppercase tracking-[0.2em] text-sm",
                  getPricingStyle(website.pricing)
                )}>
                  {website.pricing}
                </div>
                <Button asChild onClick={handleVisitClick} className="w-full bg-primary hover:bg-primary/90 text-white font-black rounded-2xl h-16 gap-3 text-xl shadow-2xl glow-primary">
                  <a href={website.url} target="_blank" rel="noopener noreferrer">
                    LAUNCH SITE <ExternalLink className="w-6 h-6" />
                  </a>
                </Button>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-bold text-sm">Review Rating</span>
                  <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-white font-black">{currentRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-bold text-sm">Global Visits</span>
                  <span className="text-white font-black">{visitCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-bold text-sm">Security Check</span>
                  <span className="text-green-500 font-bold flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> Verified
                  </span>
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                  Webdock verified partner<br />curated for performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
