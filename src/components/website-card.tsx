"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { Heart, Tag, Star, Eye, TrendingUp, Share2, Bookmark } from "lucide-react";
import { WebsitePreview } from "./website-preview";
import { useMemo } from "react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, deleteDoc, increment } from "firebase/firestore";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WebsiteCardProps {
  website: Website;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  // Save logic (Bookmark) - Profile Collection
  const saveDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid, "likedWebsites", website.id);
  }, [user, db, website.id]);

  const { data: saveData } = useDoc(saveDocRef);
  const isSaved = !!saveData;

  // Like logic (Heart) - Global Popularity Toggle
  const likeDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid, "userLikes", website.id);
  }, [user, db, website.id]);

  const { data: likeData } = useDoc(likeDocRef);
  const isLiked = !!likeData;

  const statsRef = useMemo(() => {
    if (!db) return null;
    return doc(db, "websiteStats", website.id);
  }, [db, website.id]);

  const { data: stats } = useDoc(statsRef);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !db) {
      toast({ title: "Bessites Access", description: "Please sign in to like projects." });
      return;
    }
    
    const globalStatsRef = doc(db, "websiteStats", website.id);
    const userLikeRef = doc(db, "users", user.uid, "userLikes", website.id);

    if (isLiked) {
      deleteDoc(userLikeRef);
      setDoc(globalStatsRef, { likeCount: increment(-1) }, { merge: true });
      toast({ title: "Unliked", description: "Vote removed." });
    } else {
      setDoc(userLikeRef, { likedAt: new Date().toISOString() });
      setDoc(globalStatsRef, { likeCount: increment(1) }, { merge: true });
      toast({ title: "Liked!", description: "Community popularity increased." });
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !db) {
      toast({ title: "Bessites Access", description: "Please sign in to save projects." });
      return;
    }
    
    const saveRef = doc(db, "users", user.uid, "likedWebsites", website.id);
    if (isSaved) {
      deleteDoc(saveRef);
      toast({ title: "Removed", description: "Project removed from your profile." });
    } else {
      setDoc(saveRef, { id: website.id, timestamp: new Date().toISOString() });
      toast({ title: "Saved!", description: "Added to your collection." });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!db) return;
    const globalStatsRef = doc(db, "websiteStats", website.id);
    setDoc(globalStatsRef, { shareCount: increment(1) }, { merge: true });
    
    navigator.clipboard.writeText(`${window.location.origin}/website/${website.id}`);
    toast({ title: "Copied!", description: "Share link ready." });
  };

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case "Paid": return "bg-black text-white border-white/20";
      case "Free": return "bg-white text-black border-none";
      case "Freemium":
      default: return "bg-secondary text-secondary-foreground border-white/10";
    }
  };

  const currentRating = stats?.ratingCount > 0 
    ? (stats.ratingSum / stats.ratingCount).toFixed(1) 
    : "0.0";

  const totalLikes = stats?.likeCount || 0;
  const totalVisits = stats?.visitCount || 0;
  const totalShares = stats?.shareCount || 0;

  const isTrending = totalVisits > 50 || totalLikes > 10;

  return (
    <div className="block break-inside-avoid mb-4 sm:mb-6 group">
      <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-card/40 border border-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:bg-card/60 shadow-xl">
        
        <Link href={`/website/${website.id}`} className="relative aspect-square overflow-hidden flex items-center justify-center bg-[#1A1A1A]">
          <WebsitePreview 
            websiteId={website.id}
            websiteUrl={website.url}
            fallbackUrl={stats?.logoUrl || website.imageUrl}
            alt={website.name}
            width={400}
            height={400}
            className="w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
          
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 items-start">
            <div className={cn(
              "flex items-center gap-1 backdrop-blur-xl px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full border shadow-lg",
              getPricingStyle(website.pricing)
            )}>
              <Tag className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider">{website.pricing}</span>
            </div>
            {isTrending && (
              <div className="flex items-center gap-1 bg-primary text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter italic shadow-lg">
                <TrendingUp className="w-2.5 h-2.5" /> Community Pick
              </div>
            )}
          </div>

          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-col gap-2">
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSave}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 transition-all hover:bg-black/60",
                  isSaved ? "text-primary border-primary/40" : "text-white"
                )}
             >
                <Bookmark className={cn("w-4 h-4 sm:w-5 sm:h-5", isSaved && "fill-current")} />
             </Button>
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShare}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-black/60"
             >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
             </Button>
          </div>
        </Link>

        <div className="p-3 sm:p-6 pt-1 sm:pt-2 space-y-1 sm:space-y-3">
          <Link href={`/website/${website.id}`} className="text-center block">
            <h3 className="font-headline font-bold text-sm sm:text-lg text-white group-hover:text-primary transition-colors truncate">
              {website.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground/60 font-medium truncate mt-0.5">
              {website.url.replace('https://', '').replace('www.', '').split('/')[0]}
            </p>
          </Link>
          
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 border-t border-white/5 mt-2">
             <div className="flex flex-col items-center gap-0.5 min-w-[35px]">
                <div className="flex items-center gap-0.5 text-white font-black text-[10px]">
                  {currentRating}
                  <Star className={cn("w-2.5 h-2.5", currentRating !== "0.0" ? "text-amber-500 fill-amber-500" : "text-white/20")} />
                </div>
                <span className="text-[7px] text-muted-foreground uppercase font-black tracking-widest">Rate</span>
             </div>
             <div className="h-4 w-[1px] bg-white/10 shrink-0" />
             <button onClick={handleLike} className="flex flex-col items-center gap-0.5 min-w-[35px] hover:scale-110 transition-transform">
                <div className="flex items-center gap-0.5 text-white font-black text-[10px]">
                  {totalLikes}
                  <Heart className={cn("w-2.5 h-2.5 text-pink-500", isLiked && "fill-current")} />
                </div>
                <span className="text-[7px] text-muted-foreground uppercase font-black tracking-widest">Likes</span>
             </button>
             <div className="h-4 w-[1px] bg-white/10 shrink-0" />
             <div className="flex flex-col items-center gap-0.5 min-w-[35px]">
                <div className="flex items-center gap-0.5 text-white font-black text-[10px]">
                  {totalVisits > 1000 ? `${(totalVisits/1000).toFixed(1)}k` : totalVisits}
                  <Eye className="w-2.5 h-2.5 text-blue-400" />
                </div>
                <span className="text-[7px] text-muted-foreground uppercase font-black tracking-widest">Views</span>
             </div>
             <div className="h-4 w-[1px] bg-white/10 shrink-0" />
             <div className="flex flex-col items-center gap-0.5 min-w-[35px]">
                <div className="flex items-center gap-0.5 text-white font-black text-[10px]">
                  {totalShares}
                  <Share2 className="w-2.5 h-2.5 text-green-400" />
                </div>
                <span className="text-[7px] text-muted-foreground uppercase font-black tracking-widest">Shares</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
