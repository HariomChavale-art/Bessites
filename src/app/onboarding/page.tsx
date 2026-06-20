
"use client"

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Gamepad2, Wrench, GraduationCap, Palette, Cpu, HeartPulse, Utensils, Camera, Map, ShoppingBag, Music } from "lucide-react";
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
  { id: "Photography", label: "Photography", icon: Camera, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { id: "Travel", label: "Travel", icon: Map, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "Shopping", label: "Shopping", icon: ShoppingBag, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "Audio", label: "Music & Audio", icon: Music, color: "text-yellow-400", bg: "bg-yellow-500/10" },
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
        description: "Welcome to NetFlow. We're personalizing your feed.",
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white">
            Welcome to <span className="text-primary italic">NetFlow</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Pick at least 3 categories to personalize your discovery feed.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ONBOARDING_INTERESTS.map((interest) => {
            const isSelected = selected.includes(interest.id);
            const Icon = interest.icon;
            
            return (
              <Card 
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                  "relative group cursor-pointer border-2 p-6 transition-all duration-300 rounded-[2rem] overflow-hidden flex flex-col items-center gap-4",
                  isSelected 
                    ? "border-primary bg-primary/10" 
                    : "border-white/5 bg-white/5 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "p-4 rounded-full transition-transform group-hover:scale-110",
                  interest.bg,
                  interest.color
                )}>
                  <Icon className="w-8 h-8" />
                </div>
                <span className="font-bold text-white text-sm">{interest.label}</span>
                
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-primary rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="sticky bottom-8 z-50 flex flex-col items-center gap-4">
          <Button 
            onClick={handleComplete}
            disabled={selected.length < 3 || saving}
            className={cn(
              "rounded-full px-12 py-6 text-lg font-bold shadow-2xl transition-all h-auto",
              selected.length >= 3 ? "bg-primary hover:bg-primary/90 glow-primary" : "bg-muted text-muted-foreground"
            )}
          >
            {saving ? "Personalizing..." : selected.length < 3 ? `Pick ${3 - selected.length} more` : "Start Exploring"}
          </Button>
          <p className="text-xs text-muted-foreground">
            You can always change your interests in profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
