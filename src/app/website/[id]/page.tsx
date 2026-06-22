"use client"

import { useParams, useRouter } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Star,
  Share2,
  Bookmark,
  Zap,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { WebsitePreview } from "@/components/website-preview";
import { Progress } from "@/components/ui/progress";

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
  
  const visitCount = stats?.visitCount || (website.reviewCount * 12);
  const totalReviews = (stats?.ratingCount || 0) + (website.reviewCount / 100);

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
        {/* Header Section */}
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
          <div className="flex-1 space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{website.name}</h1>
            <p className="text-primary font-medium text-lg">{website.url.replace('https://', '')}</p>
            <p className="text-muted-foreground text-sm font-medium">{website.categories[0]} & Productivity</p>
          </div>
          <button className="p-2 text-muted-foreground hover:text-white">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-10 pb-8 border-b border-white/5">
          <div className="text-center space-y-1 border-r border-white/5">
            <div className="flex items-center justify-center gap-1">
              <span className="text-white font-black text-xl">{currentRating}</span>
              <Star className="w-4 h-4 fill-primary text-primary" />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Rating</p>
          </div>
          <div className="text-center space-y-1 border-r border-white/5">
            <span className="text-white font-black text-xl">{Math.floor(totalReviews)}K+</span>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Reviews</p>
          </div>
          <div className="text-center space-y-1 border-r border-white/5">
            <span className="text-white font-black text-xl">{Math.floor(visitCount / 1000).toLocaleString()}K</span>
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

        {/* Action Buttons */}
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

        {/* Security Banner */}
        <div className="flex items-center gap-2 text-green-500/80 text-sm font-bold mb-12 px-2">
           <Lock className="w-4 h-4" /> Secure connection • {website.url}
        </div>

        {/* About Section */}
        <div className="space-y-6 mb-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white tracking-tight">About this website</h2>
            <ArrowLeft className="w-6 h-6 text-white rotate-180" />
          </div>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
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

        {/* Tech Details Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5 fill-current" />
              <span className="font-black text-white text-lg">0.9s</span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Load Speed</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-black text-white text-lg">SSL Secured</span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Safety</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400">
              <Globe className="w-5 h-5" />
              <span className="font-black text-white text-lg">190+</span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Countries</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400">
              <Smartphone className="w-5 h-5" />
              <span className="font-black text-white text-lg">98/100</span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Mobile Friendly</p>
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white tracking-tight">Ratings & reviews</h2>
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

          <div className="flex gap-12 items-start">
            <div className="space-y-1">
              <div className="text-7xl font-black text-white">{currentRating}</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={cn("w-4 h-4", s <= Math.round(Number(currentRating)) ? "fill-primary text-primary" : "text-white/10")} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest pt-2">
                {Math.floor(totalReviews * 1000).toLocaleString()} reviews
              </p>
            </div>
            
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-2">{rating}</span>
                  <Progress value={rating === 5 ? 85 : rating === 4 ? 40 : rating === 3 ? 15 : 5} className="h-2 bg-white/5" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-8">
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
                <p className="font-bold">Be the first to share your thoughts on {website.name}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
