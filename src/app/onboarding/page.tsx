"use client"

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils, Camera, Map, ShoppingBag, Music, Loader2, Zap, Briefcase, Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ONBOARDING_INTERESTS = [
  { id: "Gaming", label: "Gaming", icon: Gamepad2, color: "text-red-400", bg: "bg-red-500/10" },
  { id: "AI", label: "AI & Tech", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "Tools", label: "Tools", icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "Education", label: "Education", icon: GraduationCap, color: "text-green-400", bg: "bg-green-500/10" },
  { id: "Design", label: "Design", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10" },
  { id: "Developer", label: "Developer", icon: Cpu, color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "Health", label: "Health", icon: HeartPulse, color: "text-rose-400", bg: "bg-rose-500/10" },
  { id: "Food", label: "Food", icon: Utensils, color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "Productivity", label: "Productivity", icon: Briefcase, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { id: "Travel", label: "Travel", icon: Map, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "Shopping", label: "Shopping", icon: ShoppingBag, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "Audio", label: "Music & Audio", icon: Music, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { id: "Fun", label: "Fun", icon: Zap, iconLabel: "Zap", color: "text-blue-300", bg: "bg-blue-300/10" },
  { id: "3D", label: "3D & VR", icon: Layout, color: "text-violet-400", bg: "bg-violet-400/10" },
];

export default function OnboardingPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  const toggleInterest = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    if (!user || !db || selected.length < 3) return;
    
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        interests: selected,
        onboardingComplete: true
      });
      
      toast({
        title: "Profile setup!",
        description: "Welcome to Webdock. We've personalized your feed.",
      });
      
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
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
      
      <div className="max-w-4xl w-full space-y-12 text-center relative z-10">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            Welcome to <span className="text-primary">Webdock</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
            Pick at least <span className="text-white font-bold underline decoration-primary underline-offset-4">3 categories</span> to personalize your discovery feed.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {ONBOARDING_INTERESTS.map((interest) => {
            const isSelected = selected.includes(interest.id);
            const Icon = interest.icon;
            
            return (
              <Card 
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                  "relative group cursor-pointer border-2 p-6 sm:p-8 transition-all duration-500 rounded-[2rem] sm:rounded-[3rem] overflow-hidden flex flex-col items-center gap-4 sm:gap-6 shadow-xl active:scale-95",
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
                <span className="font-bold text-white text-xs sm:text-sm tracking-tight">{interest.label}</span>
                
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-primary rounded-full p-1.5 shadow-xl animate-in zoom-in spin-in-12 duration-500">
                    <Check className="w-4 h-4 text-white" strokeWidth={5} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="sticky bottom-10 z-50 py-8 w-full flex justify-center">
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
            {saving ? <Loader2 className="w-8 h-8 animate-spin" /> : selected.length < 3 ? `Pick ${3 - selected.length} more` : "Enter Webdock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
