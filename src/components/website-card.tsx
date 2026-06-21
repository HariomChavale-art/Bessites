
"use client"

import { Website } from "@/lib/mock-data";
import Link from "next/link";
import { Heart, Tag } from "lucide-react";
import { WebsitePreview } from "./website-preview";
import { useState } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, deleteDoc, increment } from "firebase/firestore";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface WebsiteCardProps {
  website: Website;
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const { user } = useUser();
  const db = useFirestore();
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    
    const likeRef = doc(db, "users", user.uid, "likedWebsites", website.id);
    const statsRef = doc(db, "websiteStats", website.id);

    if (liked) {
      deleteDoc(likeRef);
      setDoc(statsRef, { ratingSum: increment(-1), ratingCount: increment(-1) }, { merge: true });
    } else {
      setDoc(likeRef, { id: website.id, timestamp: new Date().toISOString() });
      setDoc(statsRef, { ratingSum: increment(5), ratingCount: increment(1) }, { merge: true });
    }
    setLiked(!liked);
  };

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case "Paid":
        return "bg-black text-white border-white/20";
      case "Free":
        return "bg-white text-black border-none";
      case "Freemium":
      default:
        return "bg-secondary text-secondary-foreground border-white/10";
    }
  };

  return (
    <Link href={`/website/${website.id}`} className="block break-inside-avoid mb-4 sm:mb-6 group">
      <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-card/40 border border-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_rgba(123,51,255,0.15)] group-hover:bg-card/60">
        
        <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
          <WebsitePreview 
            websiteId={website.id}
            websiteUrl={website.url}
            fallbackUrl={website.imageUrl}
            alt={website.name}
            width={400}
            height={400}
            mode="logo"
            className="w-2/3 h-2/3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-transform duration-700 group-hover:scale-110"
          />
          
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
            <div className={cn(
              "flex items-center gap-1 backdrop-blur-xl px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full border shadow-lg transition-colors",
              getPricingStyle(website.pricing)
            )}>
              <Tag className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider">{website.pricing}</span>
            </div>
          </div>

          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLike}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 transition-all hover:bg-black/60 ${liked ? "text-primary" : "text-white"}`}
             >
                <Heart className={liked ? "fill-current w-4 h-4 sm:w-5 sm:h-5" : "w-4 h-4 sm:w-5 sm:h-5"} />
             </Button>
          </div>
        </div>

        <div className="p-3 sm:p-6 pt-1 sm:pt-2 space-y-1.5 sm:space-y-3">
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

          <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-4">
            {website.categories.slice(0, 2).map((cat) => (
              <span key={cat} className="text-[7px] sm:text-[9px] font-bold text-primary/60 uppercase tracking-widest bg-primary/5 px-1.5 sm:px-2 py-0.5 rounded-md border border-primary/10">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
