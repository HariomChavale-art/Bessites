"use client"

import { useParams, useRouter } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WebsiteCard } from "@/components/website-card";
import { WebsitePreview } from "@/components/website-preview";
import { useDoc, useUser, useFirestore } from "@/firebase";
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc } from "firebase/firestore";
import { 
  Star, 
  ArrowLeft, 
  Globe, 
  ShieldCheck, 
  Bookmark,
  Lock,
  MoreVertical,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function WebsiteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  
  const website = MOCK_WEBSITES.find(w => w.id === id);
  const [ratingLoading, setRatingLoading] = useState(false);

  // Stats Reference from Firestore
  const statsRef = useMemo(() => {
    if (!db || !id) return null;
    return doc(db, "websiteStats", id as string);
  }, [db, id]);

  const { data: stats, loading: statsLoading } = useDoc(statsRef);

  if (!website) return <div className="p-8 text-center text-white">Website not found</div>;

  // Actual Average Rating Calculation
  const currentRating = stats?.ratingCount > 0 
    ? (stats.ratingSum / stats.ratingCount).toFixed(1) 
    : "0.0";
  
  const visitCount = stats?.visitCount || 0;
  const totalReviews = stats?.ratingCount || 0;

  // Track visit when clicking the external link
  const handleVisitClick = () => {
    if (!db || !id) return;
    const ref = doc(db, "websiteStats", id as string);
    setDoc(ref, { visitCount: increment(1) }, { merge: true });
  };

  // Submit Rating Logic
  const submitRating = async (value: number) => {
    if (!db || !id || !user) return;
    setRatingLoading(true);
    
    const userRatingRef = doc(db, "websiteStats", id as string, "userRatings", user.uid);
    const globalStatsRef = doc(db, "websiteStats", id as string);

    try {
      const existingDoc = await getDoc(userRatingRef);
      
      if (existingDoc.exists()) {
        const oldRating = existingDoc.data().rating;
        // Correctly update total sum by the difference
        updateDoc(userRatingRef, { rating: value, timestamp: serverTimestamp() });
        updateDoc(globalStatsRef, {
          ratingSum: increment(value - oldRating)
        });
      } else {
        // New rating for this user
        setDoc(userRatingRef, {
          userId: user.uid,
          rating: value,
          timestamp: serverTimestamp()
        });
        setDoc(globalStatsRef, {
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
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              {website.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[#8ab4f8] font-semibold text-base">
              {website.url.replace('https://', '')}
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
            <p className="text-muted-foreground text-sm font-medium mt-2">
              {website.categories.join(' • ')}
            </p>
          </div>
        </div>

        {/* Real Stats Bar */}
        <div className="flex items-start justify-between px-2 mb-10 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-white font-bold text-lg">
              {currentRating} <Star className="w-4 h-4 fill-white" />
            </div>
            <span className="text-muted-foreground text-[10px] mt-1 uppercase tracking-wider font-bold">
              {totalReviews} Ratings
            </span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center flex-1">
            <div className="text-white font-bold text-lg">
              {visitCount.toLocaleString()}
            </div>
            <span className="text-muted-foreground text-[10px] mt-1 uppercase tracking-wider font-bold">
              Visits
            </span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center flex-1">
            <div className="text-white font-bold text-lg">98%</div>
            <span className="text-muted-foreground text-[10px] mt-1 uppercase tracking-wider font-bold">Trust</span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 self-center" />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1.5 text-green-500 font-bold text-lg">
              <ShieldCheck className="w-4 h-4" /> 100%
            </div>
            <span className="text-muted-foreground text-[10px] mt-1 uppercase tracking-wider font-bold">Uptime</span>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Button asChild onClick={handleVisitClick} className="flex-[2] bg-white text-background hover:bg-white/90 font-bold rounded-2xl h-14 gap-2 text-lg shadow-xl">
            <a href={website.url} target="_blank" rel="noopener noreferrer">
              <Globe className="w-5 h-5" /> Visit Website
            </a>
          </Button>
          <Button variant="outline" className="flex-1 border-white/10 bg-white/5 rounded-2xl h-14 font-semibold text-white gap-2">
            <Bookmark className="w-5 h-5" /> Save
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-12 text-[11px] font-medium text-muted-foreground">
          <Lock className="w-3 h-3 text-green-500" />
          Verified Secure connection
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Preview</h2>
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">About</h2>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed font-medium">
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

        {/* Real Community Ratings Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Community</h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 font-bold rounded-full px-6 h-10 transition-all active:scale-95">
                  {ratingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 mr-2" />}
                  Give Rating
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white rounded-[2.5rem] sm:max-w-md p-8">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-center">Rate {website.name}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center gap-4 py-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => submitRating(star)}
                      className="group transition-transform hover:scale-125 active:scale-90"
                    >
                      <Star className="w-12 h-12 text-primary hover:fill-primary transition-colors" />
                    </button>
                  ))}
                </div>
                <p className="text-center text-muted-foreground text-sm font-medium">
                  {user ? "Your rating will contribute to the global average." : "Please sign in to rate websites."}
                </p>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-12">
            <div className="text-center">
              <div className="text-7xl font-bold text-white mb-2 tracking-tighter">{currentRating}</div>
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.floor(Number(currentRating)) ? 'text-primary fill-primary' : 'text-white/10'}`} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{totalReviews} NetFlow Ratings</div>
            </div>
            
            <div className="flex-1 w-full space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-2 font-bold">{rating}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${rating === 5 ? 85 : rating === 4 ? 12 : 3}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator className="bg-white/5 mb-12" />

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Similar Flows</h2>
            <Button variant="link" className="text-primary font-bold p-0">See all</Button>
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
