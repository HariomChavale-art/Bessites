
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
  ChevronDown,
  Code,
  Smartphone,
  Video,
  DollarSign,
  Plane,
  Star,
  Shield,
  Rocket,
  Cloud,
  Brain,
  PartyPopper,
  Paintbrush,
  Mic,
  Newspaper,
  Hammer,
  BarChart3,
  Lightbulb,
  List,
  Home,
  FlaskConical,
  Atom,
  Calculator,
  Film,
  Tv,
  Dumbbell,
  Leaf,
  Info,
  History,
  Layers,
  Headphones,
  Dna,
  Binoculars,
  Building2,
  Car,
  Bike,
  Fish,
  Footprints,
  Mountain,
  Waves,
  Bird,
  PawPrint,
  Coffee,
  Scissors,
  Printer,
  Satellite,
  Gem,
  Dices,
  Sword,
  Wand2,
  Watch,
  Gift,
  Languages,
  Download,
  Terminal,
  MessagesSquare,
  Sparkle,
  Moon,
  Trophy,
  KeyRound,
  Share2,
  Orbit,
  School,
  Hotel,
  Train,
  Pen,
  FileUser,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { MOCK_WEBSITES } from "@/lib/mock-data";

/**
 * High-quality category definitions matching the Explore page.
 */
const STATIC_CATEGORIES = [
  { name: "AI", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" },
  { name: "Gaming", icon: Gamepad2, color: "text-red-400", bg: "bg-red-500/10" },
  { name: "Entertainment", icon: PlayIcon, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { name: "Anime", icon: Sparkle, color: "text-pink-400", bg: "bg-pink-500/10" },
  { name: "Android", icon: Smartphone, color: "text-green-400", bg: "bg-green-500/10" },
  { name: "Coding", icon: Code, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "Design", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10" },
  { name: "Shopping", icon: ShoppingBag, color: "text-amber-400", bg: "bg-amber-500/10" },
  { name: "Photography", icon: Camera, color: "text-blue-300", bg: "bg-blue-500/10" },
  { name: "Video", icon: Video, color: "text-red-400", bg: "bg-red-500/10" },
  { name: "Music", icon: Music, color: "text-blue-300", bg: "bg-blue-500/10" },
  { name: "Utilities", icon: Hammer, color: "text-stone-400", bg: "bg-stone-500/10" },
  { name: "Education", icon: BookOpenIcon, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { name: "Jobs", icon: Briefcase, color: "text-teal-400", bg: "bg-teal-500/10" },
  { name: "Finance", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Travel", icon: Plane, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { name: "Food", icon: Utensils, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Health", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Sports", icon: Star, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Cybersecurity", icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
  { name: "Space", icon: Rocket, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { name: "Earth & Weather", icon: Cloud, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { name: "Brain Games", icon: Brain, color: "text-amber-400", bg: "bg-amber-500/10" },
  { name: "Geography", icon: Map, color: "text-green-400", bg: "bg-green-500/10" },
  { name: "Fun", icon: PartyPopper, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { name: "OSINT", icon: Search, color: "text-slate-400", bg: "bg-slate-500/10" },
  { name: "Creative", icon: Paintbrush, color: "text-rose-400", bg: "bg-rose-500/10" },
  { name: "Voice", icon: Mic, color: "text-violet-400", bg: "bg-violet-500/10" },
  { name: "Reading", icon: BookOpenIcon, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { name: "News", icon: Newspaper, color: "text-orange-400", bg: "bg-orange-500/10" },
  { name: "Internet", icon: Globe, color: "text-sky-400", bg: "bg-sky-500/10" },
  { name: "SEO", icon: BarChart3, color: "text-lime-400", bg: "bg-lime-500/10" },
  { name: "Startups", icon: Rocket, color: "text-red-300", bg: "bg-red-500/10" },
  { name: "Ideas", icon: Lightbulb, color: "text-yellow-300", bg: "bg-yellow-500/10" },
  { name: "Freelancing", icon: Briefcase, color: "text-teal-400", bg: "bg-teal-500/10" },
  { name: "AI Directories", icon: List, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
  { name: "Home", icon: Home, color: "text-orange-300", bg: "bg-orange-500/10" },
  { name: "Science", icon: FlaskConical, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Physics", icon: Atom, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Math", icon: Calculator, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Movies", icon: Film, color: "text-red-500", bg: "bg-red-500/10" },
  { name: "TV Shows", icon: Tv, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Fitness", icon: Dumbbell, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Nature", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Interesting", icon: Info, color: "text-zinc-400", bg: "bg-zinc-500/10" },
  { name: "PDF", icon: FileText, color: "text-red-300", bg: "bg-red-500/10" },
  { name: "Productivity", icon: LaptopIcon, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { name: "History", icon: History, color: "text-amber-600", bg: "bg-amber-500/10" },
  { name: "Browser Extensions", icon: Layers, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "Podcasts", icon: Headphones, color: "text-pink-400", bg: "bg-pink-500/10" },
  { name: "Domain Names", icon: Globe, color: "text-green-400", bg: "bg-green-500/10" },
  { name: "Infographics", icon: BarChart3, color: "text-orange-400", bg: "bg-orange-500/10" },
  { name: "DNA & Genetics", icon: Dna, color: "text-purple-400", bg: "bg-purple-500/10" },
  { name: "Telescopes", icon: Binoculars, color: "text-slate-400", bg: "bg-slate-500/10" },
  { name: "Rocketry", icon: Rocket, color: "text-red-400", bg: "bg-red-500/10" },
  { name: "Architecture", icon: Building2, color: "text-stone-400", bg: "bg-stone-500/10" },
  { name: "Cars", icon: Car, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Motorcycles", icon: Bike, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Cycling", icon: Bike, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Fishing", icon: Fish, color: "text-blue-300", bg: "bg-blue-500/10" },
  { name: "Hiking", icon: Footprints, color: "text-amber-600", bg: "bg-amber-500/10" },
  { name: "Volcanoes", icon: Mountain, color: "text-red-600", bg: "bg-red-500/10" },
  { name: "Oceans", icon: Waves, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { name: "Birds", icon: Bird, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Pets", icon: PawPrint, color: "text-orange-400", bg: "bg-orange-500/10" },
  { name: "Cooking", icon: Utensils, color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Coffee", icon: Coffee, color: "text-amber-800", bg: "bg-amber-900/10" },
  { name: "Sewing", icon: Scissors, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Woodworking", icon: Hammer, color: "text-stone-500", bg: "bg-stone-500/10" },
  { name: "3D Printing", icon: Printer, color: "text-blue-600", bg: "bg-blue-500/10" },
  { name: "Satellite Images", icon: Satellite, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Gemstones", icon: Gem, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { name: "Board Games", icon: Dices, color: "text-amber-400", bg: "bg-amber-500/10" },
  { name: "Tabletop RPG", icon: Sword, color: "text-red-400", bg: "bg-red-500/10" },
  { name: "Magic Tricks", icon: Wand2, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Live Cameras", icon: Video, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Watches", icon: Watch, color: "text-slate-500", bg: "bg-slate-500/10" },
  { name: "Gifts", icon: Gift, color: "text-red-500", bg: "bg-red-500/10" },
  { name: "Languages", icon: Languages, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "Parenting", icon: Home, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { name: "Downloads", icon: Download, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Chat & Community", icon: MessagesSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { name: "Sleep", icon: Moon, color: "text-indigo-300", bg: "bg-indigo-500/10" },
  { name: "Investing", icon: BarChart3, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Competitions", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Password Managers", icon: KeyRound, color: "text-slate-400", bg: "bg-slate-500/10" },
  { name: "File Sharing", icon: Share2, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Astronomy", icon: Orbit, color: "text-purple-400", bg: "bg-purple-500/10" },
  { name: "School", icon: School, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Hotels", icon: Hotel, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "Trains", icon: Train, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Blogging", icon: Pen, color: "text-teal-400", bg: "bg-teal-500/10" },
  { name: "Resume Builders", icon: FileUser, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Mockups", icon: Layout, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Scholarships", icon: GraduationCap, color: "text-yellow-600", bg: "bg-yellow-500/10" },
];

// Helper icons for dynamic components
function PlayIcon(props: any) { return <Film {...props} /> }
function BookOpenIcon(props: any) { return <Newspaper {...props} /> }
function LaptopIcon(props: any) { return <Cpu {...props} /> }

const TRENDING_CATEGORY_NAMES = [
  "AI", "Gaming", "Entertainment", "Anime", "Android", 
  "Coding", "Design", "Shopping", "Photography", "Video",
  "Music", "Utilities", "Education", "Jobs", "Finance",
  "Travel", "Food", "Health", "Sports", "Cybersecurity",
  "Investing", "Meditation", "Sleep", "Science", "PC Software"
];

/**
 * Derives and sorts all unique categories from the registry.
 * Prioritizes trending names at the top.
 */
const DERIVED_INTERESTS = (() => {
  const registryCats = Array.from(new Set(MOCK_WEBSITES.flatMap(w => w.categories)));
  
  const items = registryCats.map(name => {
    const staticDef = STATIC_CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (staticDef) return { ...staticDef, id: name, label: name };
    
    return {
      id: name,
      label: name,
      icon: Tag,
      color: "text-primary/60",
      bg: "bg-white/5"
    };
  });

  // Sort: Trending first, then alphabetical
  return items.sort((a, b) => {
    const aTrending = TRENDING_CATEGORY_NAMES.includes(a.label);
    const bTrending = TRENDING_CATEGORY_NAMES.includes(b.label);
    if (aTrending && !bTrending) return -1;
    if (!aTrending && bTrending) return 1;
    return a.label.localeCompare(b.label);
  });
})();

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
    if (!searchQuery.trim()) return DERIVED_INTERESTS;
    return DERIVED_INTERESTS.filter(i => 
      i.label.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search every interest..." 
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

