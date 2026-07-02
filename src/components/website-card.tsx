
"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { Heart, Tag, Star, Eye, Trophy, TrendingUp, Sparkles } from "lucide-react";
import { WebsitePreview } from "./website-preview";
import { useMemo } from "react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, deleteDoc, increment } from "firebase/firestore";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface WebsiteCardProps {
  website: Website;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const { user } = useUser();
  const db = useFirestore();
  
  const likeDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid, "likedWebsites", website.id);
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
    if (!user || !db) return;
    
    const likeRef = doc(db, "users", user.uid, "likedWebsites", website.id);
    const globalStatsRef = doc(db, "websiteStats", website.id);

    if (isLiked) {
      deleteDoc(likeRef);
      setDoc(globalStatsRef, { likeCount: increment(-1) }, { merge: true });
    } else {
      setDoc(likeRef, { id: website.id, timestamp: new Date().toISOString() });
      setDoc(globalStatsRef, { likeCount: increment(1) }, { merge: true });
    }
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
    : null;

  const totalLikes = stats?.likeCount || 0;
  const totalVisits = stats?.visitCount || 0;

  // Dynamic status badges based on real stats
  const AchievementBadge = () => {
    if (totalLikes > 50) return (
      <div className="flex items-center gap-1 bg-amber-500/90 text-black px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter">
        <Trophy className="w-2.5 h-2.5" /> Most Liked
      </div>
    );
    if (totalVisits > 500) return (
      <div className="flex items-center gap-1 bg-primary/90 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter">
        <TrendingUp className="w-2.5 h-2.5" /> Trending
      </div>
    );
    if (currentRating && parseFloat(currentRating) >= 4.5) return (
      <div className="flex items-center gap-1 bg-green-500/90 text-black px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter">
        <Sparkles className="w-2.5 h-2.5" /> Community Pick
      </div>
    );
    return null;
  };

  return (
    <Link href={`/website/${website.id}`} className="block break-inside-avoid mb-4 sm:mb-6 group">
      <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-card/40 border border-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:bg-card/60">
        
        <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-[#1A1A1A]">
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
            <AchievementBadge />
          </div>

          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLike}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 transition-all hover:bg-black/60",
                  isLiked ? "text-primary border-primary/40" : "text-white"
                )}
             >
                <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5", isLiked && "fill-current")} />
             </Button>
          </div>
        </div>

        <div className="p-3 sm:p-6 pt-1 sm:pt-2 space-y-1 sm:space-y-3">
          <div className="text-center">
            <h3 className="font-headline font-bold text-sm sm:text-lg text-white group-hover:text-primary transition-colors truncate">
              {website.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground/60 font-medium truncate mt-0.5">
              {website.url.replace('https://', '').replace('www.', '').split('/')[0]}
            </p>
          </div>
          <p className="text-[10px] sm:text-[13px] text-muted-foreground/80 line-clamp-2 leading-relaxed text-center font-medium px-1 sm:px-2">
            {website.description}
          </p>
          
          {/* Horizontal Play Store Style Stats Row */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 py-2 mt-1 border-t border-white/5">
             <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/80">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{currentRating || "0.0"}</span>
             </div>
             <div className="h-3 w-[1px] bg-white/10" />
             <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/80">
                <Heart className="w-3 h-3 text-primary" />
                <span>{totalLikes}</span>
             </div>
             <div className="h-3 w-[1px] bg-white/10" />
             <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/80">
                <Eye className="w-3 h-3 text-blue-400" />
                <span>{totalVisits}</span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
