"use client"

import { useParams } from "next/navigation";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useDoc, useUser, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { 
  Globe, 
  Loader2,
  Share2,
  Bookmark,
  Heart,
  Eye,
  Star,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WebsitePreview } from "@/components/website-preview";
import { WebsiteCard } from "@/components/website-card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function WebsiteDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [dynamicWebsite, setDynamicWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submittedReview, setSubmittedReview] = useState<any>(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      if (!id) return;
      
      const registryMatch = MOCK_WEBSITES.find(w => w.id === id);
      if (registryMatch) {
        setDynamicWebsite(registryMatch);
        setLoading(false);
        return;
      }

      if (db) {
        try {
          const docRef = doc(db, "submissions", id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDynamicWebsite({ id: docSnap.id, ...docSnap.data() });
          }
        } catch (e) {
          console.error("List Sync Failure:", e);
        } finally {
          setLoading(false);
        }
      } else {
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

  const handleVisitClick = async () => {
    if (!dynamicWebsite) return;
    window.open(dynamicWebsite.url, '_blank');
  };

  const submitReview = async () => {
    if (!reviewText.trim()) return;
    setSubmittedReview({
      text: reviewText,
      rating: rating,
      timestamp: new Date(),
      userName: user?.displayName || "Visitor"
    });
    setReviewText("");
    toast({ title: "Review Shared", description: "Your feedback has been added." });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!dynamicWebsite) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4 font-body">
      <h2 className="text-4xl font-black italic uppercase text-white mb-6">Website Not Found</h2>
      <p className="text-muted-foreground mb-8 italic">This website is not part of our current list.</p>
      <Link href="/"><Button className="bg-primary text-white rounded-full px-8">Return Home</Button></Link>
    </div>
  );

  const brandName = dynamicWebsite.websiteName || dynamicWebsite.name;
  const fullName = dynamicWebsite.name || brandName;
  const description = dynamicWebsite.description || dynamicWebsite.longDescription || "A high quality project from our list.";

  const displayVisits = (dynamicWebsite.baseVisits || 0) + (stats?.visitCount || 0);
  const displayLikes = (dynamicWebsite.baseLikes || 0) + (stats?.likeCount || 0);
  const displaySaves = (dynamicWebsite.baseSaves || 0) + (stats?.saveCount || 0);
  const displayShares = (dynamicWebsite.baseShares || 0);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-32 website-detail-container">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 sm:py-12 space-y-16">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-start">
          <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-[2rem] bg-[#1a1a24] border border-white/10 overflow-hidden shrink-0 shadow-2xl flex items-center justify-center p-4">
            <WebsitePreview 
              websiteUrl={dynamicWebsite.url}
              fallbackUrl={dynamicWebsite.logoUrl || dynamicWebsite.imageUrl}
              alt={brandName}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-6xl font-bold text-white tracking-tighter uppercase leading-tight">
                {fullName}
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-[10px] sm:text-sm text-primary font-black uppercase tracking-[0.3em] italic px-3 py-1 bg-primary/10 rounded-md">Verified Site</span>
                <span className={cn("text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md border italic", 
                  dynamicWebsite.pricing === 'Paid' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20")}>
                  {dynamicWebsite.pricing}
                </span>
              </div>
            </div>
            <p className="text-zinc-400 font-bold text-sm sm:text-lg flex items-center gap-2 italic">
              <Globe className="w-4 h-4" /> {dynamicWebsite.url.replace('https://', '').replace('www.', '').split('/')[0]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            <Card className="bg-[#121117] border-white/5 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
              <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] border-b border-white/5 pb-4">Info & Details</h2>
              <p className="text-lg sm:text-2xl text-white font-medium leading-relaxed italic tracking-tight">
                {description}
              </p>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricBox label="Visits" value={displayVisits} icon={Eye} color="text-blue-500" />
              <MetricBox label="Likes" value={displayLikes} icon={Heart} color="text-rose-500" />
              <MetricBox label="Saved" value={displaySaves} icon={Bookmark} color="text-amber-500" />
              <MetricBox label="Shared" value={displayShares} icon={Share2} color="text-emerald-500" />
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleVisitClick} className="w-full h-24 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-2xl font-black italic gap-4 shadow-2xl">
              <Globe className="w-8 h-8" /> VISIT SITE
            </Button>
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="h-20 rounded-[2rem] bg-white/5 border-white/5"><Heart className="w-6 h-6" /></Button>
              <Button variant="outline" className="h-20 rounded-[2rem] bg-white/5 border-white/5"><Bookmark className="w-6 h-6" /></Button>
              <Button variant="outline" className="h-20 rounded-[2rem] bg-white/5 border-white/5"><Share2 className="w-6 h-6" /></Button>
            </div>
          </div>
        </div>

        <section className="space-y-8">
           <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                 <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Community Reviews</h2>
           </div>

           <Card className="bg-[#121117] border-white/5 p-8 rounded-[3rem] space-y-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setRating(s)}>
                         <Star className={cn("w-6 h-6 sm:w-8 sm:h-8 transition-colors", rating >= s ? "text-amber-400 fill-amber-400" : "text-white/10")} />
                      </button>
                    ))}
                    <span className="ml-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Rate your experience</span>
                 </div>
                 <Textarea 
                   value={reviewText}
                   onChange={(e) => setReviewText(e.target.value)}
                   placeholder="Share what you think about this site..." 
                   className="bg-white/[0.03] border-white/10 rounded-2xl min-h-[120px] p-6 text-sm font-medium italic"
                 />
                 <Button onClick={submitReview} disabled={!reviewText.trim()} className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black italic uppercase">
                    Add My Review
                 </Button>

                 {submittedReview && (
                   <div className="mt-8 pt-8 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase text-primary italic">Latest activity</span>
                         <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{submittedReview.timestamp.toLocaleDateString()}</span>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3">
                         <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={cn("w-4 h-4", submittedReview.rating >= s ? "text-amber-400 fill-amber-400" : "text-white/5")} />
                            ))}
                         </div>
                         <p className="text-white font-medium italic text-sm">"{submittedReview.text}"</p>
                         <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">— {submittedReview.userName}</p>
                      </div>
                   </div>
                 )}
              </div>
           </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function MetricBox({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] text-center space-y-1 relative overflow-hidden group">
      <Icon className={cn("w-12 h-12 absolute -right-2 -bottom-2 opacity-5 rotate-12 transition-transform group-hover:scale-125", color)} />
      <p className="text-[9px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">{label}</p>
      <h4 className={cn("text-3xl font-bold italic tracking-tighter", color)}>
        {(value || 0).toLocaleString()}
      </h4>
    </div>
  );
}
