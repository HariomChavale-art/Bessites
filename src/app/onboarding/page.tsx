
"use client"

import { useState, useEffect, useMemo } from "react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Check, 
  Sparkles, 
  Gamepad2, 
  Wrench, 
  GraduationCap, 
  Palette, 
  Cpu, 
  HeartPulse, 
  Utensils, 
  Map, 
  ShoppingBag, 
  Music, 
  Loader2, 
  Zap, 
  Briefcase, 
  Layout, 
  Globe, 
  Camera, 
  Search, 
  X, 
  ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { MOCK_WEBSITES } from "@/lib/mock-data";

/**
 * Derives all unique categories from the massive mock-data registry.
 * Provides an exhaustive list of interests for onboarding.
 */
const DERIVED_CATEGORIES = Array.from(new Set(MOCK_WEBSITES.flatMap(w => w.categories))).sort();

const getIconForCategory = (cat: string) => {
  const lower = cat.toLowerCase();
  if (lower.includes('ai')) return Sparkles;
  if (lower.includes('game') || lower.includes('gaming')) return Gamepad2;
  if (lower.includes('tool') || lower.includes('utility') || lower.includes('utilities')) return Wrench;
  if (lower.includes('dev') || lower.includes('code') || lower.includes('software') || lower.includes('api') || lower.includes('infrastructure')) return Cpu;
  if (lower.includes('design') || lower.includes('art') || lower.includes('creative') || lower.includes('branding')) return Palette;
  if (lower.includes('edu') || lower.includes('learn') || lower.includes('study') || lower.includes('roadmap') || lower.includes('language')) return GraduationCap;
  if (lower.includes('health') || lower.includes('pulse')) return HeartPulse;
  if (lower.includes('food') || lower.includes('cook') || lower.includes('recipe') || lower.includes('culinary')) return Utensils;
  if (lower.includes('map') || lower.includes('travel') || lower.includes('astronomy') || lower.includes('location') || lower.includes('geography')) return Map;
  if (lower.includes('shop') || lower.includes('commerce') || lower.includes('pay')) return ShoppingBag;
  if (lower.includes('music') || lower.includes('audio') || lower.includes('voice') || lower.includes('sound')) return Music;
  if (lower.includes('productivity') || lower.includes('work') || lower.includes('job') || lower.includes('management')) return Briefcase;
  if (lower.includes('photo') || lower.includes('video') || lower.includes('camera') || lower.includes('motion')) return Camera;
  if (lower.includes('security') || lower.includes('privacy') || lower.includes('web') || lower.includes('osint')) return Globe;
  if (lower.includes('3d') || lower.includes('vr') || lower.includes('automotive') || lower.includes('cad')) return Layout;
  return Zap; 
};

const getStylesForCategory = (cat: string) => {
  const colors = [
    "text-purple-400 bg-purple-500/10",
    "text-red-400 bg-red-500/10",
    "text-blue-400 bg-blue-500/10",
    "text-green-400 bg-green-500/10",
    "text-pink-400 bg-pink-500/10",
    "text-orange-400 bg-orange-500/10",
    "text-rose-400 bg-rose-500/10",
    "text-amber-400 bg-amber-500/10",
    "text-indigo-400 bg-indigo-500/10",
    "text-cyan-400 bg-cyan-500/10",
    "text-emerald-400 bg-emerald-500/10",
    "text-yellow-400 bg-yellow-500/10",
  ];
  let hash = 0;
  for (let i = 0; i < cat.length; i++) {
    hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  }
  const style = colors[Math.abs(hash) % colors.length];
  const [color, bg] = style.split(' ');
  return { color, bg };
};

const ALL_INTERESTS = DERIVED_CATEGORIES.map(name => {
  const { color, bg } = getStylesForCategory(name);
  return {
    id: name,
    label: name,
    icon: getIconForCategory(name),
    color,
    bg
  };
});

export default function OnboardingPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userDocRef);
  const isExistingUser = profile?.onboardingComplete === true;

  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (profile?.interests) {
      setSelected(profile.interests);
    }
  }, [profile]);

  const filteredInterests = useMemo(() => {
    if (!searchQuery.trim()) return ALL_INTERESTS;
    return ALL_INTERESTS.filter(i => 
      i.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const displayedInterests = useMemo(() => {
    if (searchQuery.trim()) return filteredInterests;
    return filteredInterests.slice(0, visibleCount);
  }, [filteredInterests, visibleCount, searchQuery]);

  const toggleInterest = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    if (!user || !db || selected.length < 3) return;
    
    setSaving(true);
    const userRef = doc(db, "users", user.uid);
    const updateData = {
      interests: selected,
      onboardingComplete: true
    };

    updateDoc(userRef, updateData)
      .then(() => {
        toast({
          title: isExistingUser ? "Preferences updated!" : "Profile setup!",
          description: isExistingUser 
            ? "Your discovery feed has been refreshed." 
            : "Welcome to Bessites. We've personalized your feed.",
        });
        router.push("/");
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updateData
        }));
        setSaving(false);
      });
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl w-full space-y-12 text-center relative z-10">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            {isExistingUser ? "Discovery" : "Welcome to"} <span className="text-primary">{isExistingUser ? "Preferences" : "Bessites"}</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
            Pick at least <span className="text-white font-bold underline decoration-primary underline-offset-4">3 categories</span> to personalize your discovery feed.
          </p>
        </div>

        <div className="relative max-w-md mx-auto group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search all interests..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(10);
            }}
            className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-lg font-bold focus:ring-primary shadow-xl"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="relative pb-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {displayedInterests.length > 0 ? displayedInterests.map((interest) => {
              const isSelected = selected.includes(interest.id);
              const Icon = interest.icon;
              
              return (
                <Card 
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={cn(
                    "relative group cursor-pointer border-2 p-6 sm:p-8 transition-all duration-500 rounded-[2rem] sm:rounded-[3rem] overflow-hidden flex flex-col items-center gap-4 sm:gap-6 shadow-xl active:scale-95 animate-in fade-in slide-in-from-bottom-2",
                    isSelected 
                      ? "border-primary bg-primary/20 scale-[1.02]" 
                      : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
                  )}
                >
                  <div className={cn(
                    "p-4 sm:p-6 rounded-full transition-all duration-500",
                    interest.bg,
                    interest.color,
                    isSelected && "scale-110 rotate-6"
                  )}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <span className="font-bold text-white text-[10px] sm:text-xs uppercase tracking-widest text-center leading-tight">{interest.label}</span>
                  
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-primary rounded-full p-1.5 shadow-xl animate-in zoom-in spin-in-12 duration-500">
                      <Check className="w-4 h-4 text-white" strokeWidth={5} />
                    </div>
                  )}
                </Card>
              );
            }) : (
              <div className="col-span-full py-12 text-center text-muted-foreground italic font-medium opacity-40">
                No categories match your search.
              </div>
            )}
          </div>

          {!searchQuery && visibleCount < filteredInterests.length && (
            <div className="absolute bottom-[-40px] left-0 right-0 flex flex-col items-center pointer-events-none z-20">
               <div className="w-full h-32 bg-gradient-to-t from-background via-background/80 to-transparent mb-4" />
               <button 
                 onClick={loadMore}
                 className="group pointer-events-auto flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-90"
               >
                 <div className="p-4 rounded-full bg-[#121117] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                   <ChevronDown className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" strokeWidth={3} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-60 group-hover:opacity-100 transition-opacity">Reveal More Interests</span>
               </button>
            </div>
          )}
        </div>

        <div className="pt-24 pb-16 w-full flex justify-center">
          <Button 
            onClick={handleComplete}
            disabled={selected.length < 3 || saving}
            className={cn(
              "rounded-full px-12 sm:px-20 py-8 text-xl font-black shadow-2xl transition-all h-auto min-w-[300px] uppercase tracking-widest italic",
              selected.length >= 3 
                ? "bg-primary hover:bg-primary/90 text-white glow-primary scale-110" 
                : "bg-white/10 text-muted-foreground opacity-50"
            )}
          >
            {saving ? <Loader2 className="w-8 h-8 animate-spin" /> : selected.length < 3 ? `Pick ${3 - selected.length} more` : isExistingUser ? "Save Changes" : "Enter Bessites"}
          </Button>
        </div>
      </div>
    </div>
  );
}
