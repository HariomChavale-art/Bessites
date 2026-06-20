"use client"

import { useParams, useRouter } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WebsiteCard } from "@/components/website-card";
import { useDoc, useUser, useFirestore } from "@/firebase";
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc } from "firebase/firestore";
import { 
  Star, 
  ArrowLeft, 
  Globe, 
  Info, 
  ShieldCheck, 
  Share2,
  ChevronRight,
  Bookmark,
  Lock,
  Zap,
  Smartphone,
  MoreVertical,
  Loader2,
  MousePointer2
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function WebsiteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  
  const website = MOCK_WEBSITES.find(w => w.id === id);
  const [ratingLoading, setRatingLoading] = useState(false);

  const statsRef = useMemo(() => {
    if (!db || !id) return null;
    return doc(db, "websiteStats", id as string);
  }, [db, id]);

  const { data: stats, loading: statsLoading } = useDoc(statsRef);

  if (!website) return <div className="p-8 text-center text-white">Website not found</div>;

  const currentRating = stats?.ratingCount > 0 
    ? (stats.ratingSum / stats.ratingCount).toFixed(1) 
    : "0.0";
  
  const visitCount = stats?.visitCount || 0;
  const totalReviews = stats?.ratingCount || 0;

  const handleVisitClick = async () => {
    if (!db || !id) return;
    const ref = doc(db, "websiteStats", id as string);
    try {
      await setDoc(ref, { visitCount: increment(1) }, { merge: true });
    } catch (e) {
      console.error("Failed to track visit", e);
    }
  };

  const submitRating = async (value: number) => {
    if (!db || !id || !user) return;
    setRatingLoading(true);
    
    const userRatingRef = doc(db, "websiteStats", id as string, "userRatings", user.uid);
    const globalStatsRef = doc(db, "websiteStats", id as string);

    try {
      const existingDoc = await getDoc(userRatingRef);
      
      if (existingDoc.exists()) {
        const oldRating = existingDoc.data().rating;
        await updateDoc(userRatingRef, { rating: value, timestamp: serverTimestamp() });
        await updateDoc(globalStatsRef, {
          ratingSum: increment(value - oldRating)
        });
      } else {
        await setDoc(userRatingRef, {
          userId: user.uid,
          rating: value,
          timestamp: serverTimestamp()
        });
        await setDoc(globalStatsRef, {
          ratingSum: increment(value),
          ratingCount: increment(1)
        }, { merge: true });
      }
    } catch (e) {
      console.error("Failed to submit rating", e);
    } finally {
      setRatingLoading(false);
    }
  };

  const similarWebsites = MOCK_WEBSITES.filter(w => w.id !== id && w.categories.some(cat => website.categories.includes(cat))).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-6 pb-24">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-white/5 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Hero Section - App Icon & Title */}
        <div className="flex gap-6 mb-8">
          <div className="relative w-28 h-28 shrink-0 rounded-[1.8rem] overflow-hidden shadow-2xl border border-white/10">
            <Image 
              src={website.imageUrl} 
              alt={website.name} 
              fill 
              className="object-cover"
              data-ai-hint="app logo"
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-white mb-1 leading-tight tracking-tight">
              {website.name}
            </h1>
            <p className="text-[#8ab4f8] font-semibold text-base mb-1">
              {website.url.replace('https://', '')}
            </p>
            <p className="text-muted-foreground text-sm font-medium">
              {website.categories.join(' & ')}
            </p>
          </div>
        </div>

        {/* High-level Stats Row */}
        <div className="flex items-start justify-between px-2 mb-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-white font-bold text-base">
              {currentRating} <Star className="w-4 h-4 fill-white" />
            </div>
            <span className="text-muted-foreground text-[11px] mt-1 whitespace-nowrap">
              {totalReviews.toLocaleString()} NetFlow ratings <Info className="w-3 h-3 inline ml-0.5 opacity-50" />
            </span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center">
            <div className="text-white font-bold text-base">
              {visitCount.toLocaleString()}
            </div>
            <span className="text-muted-foreground text-[11px] mt-1 whitespace-nowrap">
              NetFlow visits <MousePointer2 className="w-3 h-3 inline ml-0.5 opacity-50" />
            </span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center">
            <div className="text-white font-bold text-base">98%</div>
            <span className="text-muted-foreground text-[11px] mt-1 whitespace-nowrap">User Trust <Info className="w-3 h-3 inline ml-0.5 opacity-50" /></span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-green-500 font-bold text-base">
              <ShieldCheck className="w-4 h-4" /> 100%
            </div>
            <span className="text-muted-foreground text-[11px] mt-1 whitespace-nowrap">Uptime <Info className="w-3 h-3 inline ml-0.5 opacity-50" /></span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex gap-3 mb-4">
          <Button asChild onClick={handleVisitClick} className="flex-[2] bg-[#8ab4f8] hover:bg-[#8ab4f8]/90 text-background font-bold rounded-xl h-12 gap-2">
            <a href={website.url} target="_blank" rel="noopener noreferrer">
              <Globe className="w-5 h-5" /> Visit Website
            </a>
          </Button>
          <Button variant="outline" className="flex-1 border-white/10 bg-white/5 rounded-xl h-12 font-semibold text-white gap-2">
            <Bookmark className="w-5 h-5" /> Save
          </Button>
          <Button variant="outline" className="flex-1 border-white/10 bg-white/5 rounded-xl h-12 font-semibold text-white gap-2">
            <Share2 className="w-5 h-5" /> Share
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-8 text-[11px] font-medium text-muted-foreground">
          <Lock className="w-3 h-3 text-green-500" />
          Secure connection <span className="mx-1 opacity-30">•</span> {website.url}
        </div>

        {/* About Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 group cursor-pointer">
            <h2 className="text-xl font-bold text-white tracking-tight">About this website</h2>
            <div className="bg-white/5 p-2 rounded-full group-hover:bg-white/10 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            {website.longDescription}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {website.categories.map(cat => (
              <Badge key={cat} variant="outline" className="border-white/10 text-muted-foreground bg-white/5 py-1.5 px-4 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors">
                {cat}
              </Badge>
            ))}
          </div>
        </section>

        {/* Ratings & reviews Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 group cursor-pointer">
            <h2 className="text-xl font-bold text-white tracking-tight">Community Ratings</h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 font-bold rounded-full px-4">
                  {ratingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 mr-2" />}
                  Give Rating
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white rounded-3xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Rate {website.name}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center gap-4 py-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => submitRating(star)}
                      className="group transition-transform hover:scale-125"
                    >
                      <Star className="w-12 h-12 text-[#8ab4f8] hover:fill-[#8ab4f8] transition-colors" />
                    </button>
                  ))}
                </div>
                <p className="text-center text-muted-foreground text-sm">
                  {user ? "Your rating will be updated instantly." : "Please sign in to rate websites."}
                </p>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-start gap-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2 tracking-tighter">{currentRating}</div>
              <div className="flex justify-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(Number(currentRating)) ? 'text-[#8ab4f8] fill-[#8ab4f8]' : 'text-white/20'}`} />
                ))}
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">{totalReviews.toLocaleString()} ratings on NetFlow</div>
            </div>
            
            <div className="flex-1 space-y-2 pt-2">
              <div className="text-xs text-muted-foreground mb-4">
                Ratings are collected from real NetFlow curators who have visited this site.
              </div>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground w-2 font-bold">{rating}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#8ab4f8]" 
                      style={{ width: `${rating === 5 ? 85 : rating === 4 ? 12 : 3}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator className="bg-white/5 mb-12" />

        {/* Similar Websites - Pinterest Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Similar websites</h2>
            <Button variant="link" className="text-[#8ab4f8] font-bold p-0">See all</Button>
          </div>
          
          <div className="columns-2 gap-4">
            {similarWebsites.map((site) => (
              <WebsiteCard key={site.id} website={site} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}