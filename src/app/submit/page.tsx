"use client"

import { useState, useRef, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Check, Plus, X, Image as ImageIcon, Globe, Type, FileText, Search, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore } from "@/firebase";
import { collection, serverTimestamp, addDoc, doc, setDoc } from "firebase/firestore";
import { supabase, getSupabaseConfigStatus } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES_LIST = [
  "AI", "Gaming", "Entertainment", "Anime", "Android", "Coding", "Design", "Shopping", "Photography", "Video",
  "Music", "Utilities", "Education", "Jobs", "Finance", "Travel", "Food", "Health", "Sports", "Cybersecurity",
  "Space", "Earth & Weather", "Brain Games", "Geography", "Fun", "OSINT", "Creative", "Voice", "Reading", "News",
  "Internet", "SEO", "Startups", "Ideas", "Freelancing", "AI Directories", "Home", "Science", "Physics", "Math",
  "Movies", "TV Shows", "Fitness", "Nature", "Interesting", "PDF", "Productivity", "History", "Browser Extensions",
  "Podcasts", "Domain Names", "Infographics", "DNA & Genetics", "Telescopes", "Rocketry", "Architecture", "Cars",
  "Motorcycles", "Cycling", "Fishing", "Hiking", "Volcanoes", "Oceans", "Birds", "Pets", "Cooking", "Coffee",
  "Sewing", "Woodworking", "3D Printing", "Satellite Images", "Gemstones", "Board Games", "Tabletop RPG", "Magic Tricks",
  "Live Cameras", "Watches", "Gifts", "Deals", "Languages", "Dating", "Parenting", "PC Software", "Downloads",
  "Chat & Community", "Sleep", "Meditation", "Investing", "Competitions", "Password Managers", "File Sharing",
  "Astronomy", "School", "Hotels", "Trains", "Blogging", "Resume Builders", "Mockups", "Scholarships", "Memes", "Keyboard"
];

export default function SubmitWebsite() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [url, setUrl] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [name, setName] = useState(""); // This is the "Title" field
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [pricing, setPricing] = useState<"Free" | "Paid" | "Freemium">("Free");
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Login Required", description: "Please sign in to submit projects." });
      router.push("/login");
    }
  }, [user, authLoading, router, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) return setTagInput("");
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => setTags(tags.filter(t => t !== tagToRemove));

  const filteredCategories = useMemo(() => {
    const search = categorySearch.toLowerCase().trim();
    if (!search) return ALL_CATEGORIES_LIST;
    return ALL_CATEGORIES_LIST.filter(c => c.toLowerCase().includes(search));
  }, [categorySearch]);

  const handleFinalSubmit = async () => {
    if (!db) {
      toast({ variant: "destructive", title: "Connection Error", description: "Database is not ready. Please refresh." });
      return;
    }

    const configStatus = getSupabaseConfigStatus();
    if (!supabase || !configStatus.isConfigured) {
      toast({ 
        variant: "destructive", 
        title: "Configuration Missing", 
        description: "Supabase configuration is not valid." 
      });
      return;
    }

    if (!url || !websiteName || !name || !description || !category) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please fill all required fields, including Website Name and Title." });
      return;
    }

    if (!logoFile) {
      toast({ variant: "destructive", title: "Logo Required", description: "Please add a logo before submitting your website." });
      return;
    }

    try {
      new URL(url);
    } catch (e) {
      toast({ variant: "destructive", title: "Invalid URL", description: "Please enter a valid website address." });
      return;
    }
    
    setSubmitting(true);
    let uploadedFilePath = "";

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("NETWORK_TIMEOUT")), 15000)
    );

    try {
      let publicLogoUrl = "";
      
      // 1. Upload Logo to Supabase
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      uploadedFilePath = `logos/${user!.uid}/${fileName}`;
      
      console.log(`[Bessites Debug] Starting upload to Supabase: ${uploadedFilePath}`);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('Website-images')
        .upload(uploadedFilePath, logoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("[Bessites Error] Supabase Upload Failed:", uploadError);
        throw new Error(`Logo upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('Website-images')
        .getPublicUrl(uploadedFilePath);
      
      publicLogoUrl = publicUrl;

      // 2. Submit Project to Firestore
      console.log("[Bessites Debug] Initiating Firestore save...");
      
      // Ensure unique categories for cleaner data
      const uniqueCategories = Array.from(new Set([category, ...tags].filter(Boolean)));

      const firestoreTask = async () => {
        const submissionRef = await addDoc(collection(db, "submissions"), {
          url,
          websiteName, // The Brand Name
          name, // The Discovery Title
          description,
          longDescription: description,
          categories: uniqueCategories,
          logoUrl: publicLogoUrl,
          pricing,
          userId: user!.uid,
          userEmail: user!.email,
          status: "pending",
          timestamp: serverTimestamp()
        });

        // Initialize global stats with the uploaded logo
        await setDoc(doc(db, "websiteStats", submissionRef.id), {
          logoUrl: publicLogoUrl,
          visitCount: 0,
          likeCount: 0,
          shareCount: 0,
          ratingSum: 0,
          ratingCount: 0,
          lastPreviewUpdate: serverTimestamp()
        });
      };

      await Promise.race([firestoreTask(), timeoutPromise]);

      setSubmitted(true);
      toast({ title: "Submission Received!", description: "Your project is now under review." });
      
    } catch (error: any) {
      console.error("[Bessites Error] Complete Submission Flow Failure:", error);
      
      if (uploadedFilePath) {
        await supabase.storage.from('Website-images').remove([uploadedFilePath]);
      }

      if (error.message === "NETWORK_TIMEOUT") {
        toast({ 
          variant: "destructive", 
          title: "Network Timeout", 
          description: "The database is taking too long to respond. Please check your internet and try again." 
        });
      } else {
        toast({ 
          variant: "destructive", 
          title: "Submission Failed", 
          description: error.message || "An unexpected error occurred. Please try again." 
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

  if (submitted) return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-700">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 ring-8 ring-emerald-500/5">
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Website Submitted!</h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Our admins will review your asset. Once approved, it will go live in the discovery pipeline.
            </p>
          </div>
          <div className="pt-6">
            <Button onClick={() => router.push("/profile")} className="rounded-full px-10 h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all">
              Return to Profile
            </Button>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12 flex justify-center pb-32">
        <div className="w-full max-w-3xl">
          <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 pb-6 text-center space-y-2">
              <CardTitle className="text-5xl font-black text-white tracking-tighter italic uppercase">Registry <span className="text-primary">Submission</span></CardTitle>
              <CardDescription className="text-lg font-medium opacity-60">Upload your digital property to the discovery pipeline.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-10 pt-0 space-y-10">
              {/* URL SECTION */}
              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Live Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                  <Input 
                    placeholder="https://your-brand.com" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-bold"
                  />
                </div>
              </div>

              {/* LOGO SECTION - REQUIRED */}
              <div className="space-y-4">
                 <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1 flex items-center justify-between">
                    Official Logo (Required)
                    {!logoFile && <span className="text-rose-500 text-[8px] font-black uppercase">* Mandatory</span>}
                 </Label>
                 <div onClick={() => fileInputRef.current?.click()} className={cn(
                   "group relative w-full h-48 rounded-[2.5rem] border-2 border-dashed bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-500",
                   logoPreview ? "border-emerald-500/20" : "border-white/10 hover:border-primary/40"
                 )}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-3 italic">Upload Property Brand Mark</span>
                    </>
                  )}
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              {/* WEBSITE NAME - BRAND */}
              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Website Name</Label>
                <div className="relative">
                   <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-30" />
                   <Input placeholder="The Brand Name (e.g. Canva, GitHub, Figma)" value={websiteName} onChange={(e) => setWebsiteName(e.target.value)} className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-bold" />
                </div>
              </div>

              {/* DISCOVERY TITLE */}
              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Discovery Title</Label>
                <div className="relative">
                   <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-30" />
                   <Input placeholder="Short descriptive title for search (e.g. Free Graphic Design Tool)" value={name} onChange={(e) => setName(e.target.value)} className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-bold" />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">About / Discovery Description</Label>
                <div className="relative">
                  <Textarea placeholder="Explain what the website does and why it's a hidden gem... This will appear in the 'About' section." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[150px] bg-white/5 border-white/10 rounded-[2rem] text-sm font-medium p-6" />
                </div>
              </div>

              {/* CATEGORY & PRICING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Primary Sector</Label>
                    <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full h-16 bg-white/5 border-white/10 rounded-2xl font-bold justify-between px-6"
                        >
                          <span className={cn(category ? "text-white" : "text-muted-foreground")}>
                            {category || "Select Category"}
                          </span>
                          <Search className="w-4 h-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] bg-[#121117] border-white/10 text-white rounded-2xl p-0 overflow-hidden shadow-2xl" align="start">
                        <DialogDescription className="sr-only">
                          Select the primary category for your website submission.
                        </DialogDescription>
                        <div className="p-4 border-b border-white/5">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              placeholder="Filter sectors..." 
                              value={categorySearch} 
                              onChange={(e) => setCategorySearch(e.target.value)}
                              className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl text-sm"
                            />
                          </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto no-scrollbar py-2">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map(c => (
                              <button 
                                key={c}
                                onClick={() => {
                                  setCategory(c);
                                  setIsCategoryPopoverOpen(false);
                                  setCategorySearch("");
                                }}
                                className="w-full px-5 py-3 text-left text-sm font-bold hover:bg-primary hover:text-white transition-colors"
                              >
                                {c}
                              </button>
                            ))
                          ) : (
                            <div className="px-5 py-4 text-xs italic text-muted-foreground opacity-40">No matches found.</div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                 </div>
                 <div className="space-y-4">
                    <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Access Model</Label>
                    <Select value={pricing} onValueChange={(v: any) => setPricing(v)}>
                       <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-2xl font-bold">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-[#121117] border-white/10 text-white rounded-xl">
                          <SelectItem value="Free" className="font-bold">Free to Use</SelectItem>
                          <SelectItem value="Freemium" className="font-bold">Freemium</SelectItem>
                          <SelectItem value="Paid" className="font-bold">Paid / Premium</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-10 pt-0">
              <Button onClick={handleFinalSubmit} disabled={submitting} className="w-full h-20 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-2xl font-black italic shadow-2xl transition-all active:scale-95 group">
                {submitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Send className="w-6 h-6 mr-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> PUBLISH TO REGISTRY</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
