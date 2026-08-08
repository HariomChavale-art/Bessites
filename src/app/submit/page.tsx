
"use client"

import { useState, useRef, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Check, Plus, X, Image as ImageIcon, Globe, Type, FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore } from "@/firebase";
import { collection, serverTimestamp, addDoc, doc, setDoc } from "firebase/firestore";
import { supabase } from "@/lib/supabase";
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
  const [name, setName] = useState("");
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

    if (!supabase) {
      toast({ variant: "destructive", title: "Storage Error", description: "Supabase Storage is not configured correctly. Check environment variables." });
      return;
    }

    if (!url || !name || !description || !category) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please fill all required fields." });
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

    try {
      let publicLogoUrl = "";
      
      // 1. Upload Logo to Supabase Storage Bucket 'Website-images'
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        // Path structure: logos/{userId}/{unique-name}
        // This structure is critical for the RLS policy (storage.foldername(name))[2]
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

        console.log("[Bessites Debug] Supabase Upload Success:", uploadData);

        const { data: { publicUrl } } = supabase.storage
          .from('Website-images')
          .getPublicUrl(uploadedFilePath);
        
        publicLogoUrl = publicUrl;
        console.log("[Bessites Debug] Public URL retrieved:", publicLogoUrl);
      }

      // 2. Submit Project to Firestore
      try {
        const submissionRef = await addDoc(collection(db, "submissions"), {
          url,
          name,
          description,
          longDescription: description,
          categories: [category, ...tags].filter(Boolean),
          logoUrl: publicLogoUrl,
          pricing,
          userId: user!.uid,
          userEmail: user!.email,
          status: "pending",
          timestamp: serverTimestamp()
        });

        // 3. Create Stats placeholder
        await setDoc(doc(db, "websiteStats", submissionRef.id), {
          logoUrl: publicLogoUrl,
          visitCount: 0,
          likeCount: 0,
          shareCount: 0,
          ratingSum: 0,
          ratingCount: 0,
          lastPreviewUpdate: serverTimestamp()
        });

        setSubmitted(true);
        toast({ title: "Submission Received!", description: "Your project is now under review." });
      } catch (dbError: any) {
        console.error("[Bessites Error] Firestore Save Failed:", dbError);
        // CLEANUP: If DB save fails, remove the orphaned file from Supabase
        if (uploadedFilePath) {
          console.log("[Bessites Debug] Cleaning up orphaned Supabase file...");
          await supabase.storage.from('Website-images').remove([uploadedFilePath]);
        }
        throw dbError;
      }
      
    } catch (error: any) {
      console.error("[Bessites Error] Complete Submission Flow Failure:", error);
      toast({ 
        variant: "destructive", 
        title: "Submission Failed", 
        description: error.message || "An unexpected error occurred. Please try again." 
      });
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
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Your website is successfully</h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Wait for the admins approval to get you website live
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
              <CardDescription className="text-lg font-medium opacity-60">Manual onboard for your digital property.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-10 pt-0 space-y-10">
              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Live URL</Label>
                <div className="relative">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                  <Input 
                    placeholder="https://your-project.com" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                 <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Branding & Logo (Supabase Storage)</Label>
                 <div onClick={() => fileInputRef.current?.click()} className="group relative w-full h-48 rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-primary/40 bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-500">
                  {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" /> : <><ImageIcon className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" /><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-3 italic">Upload Property Mark</span></>}
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Website Title</Label>
                <div className="relative">
                   <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-30" />
                   <Input placeholder="Enter professional name" value={name} onChange={(e) => setName(e.target.value)} className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-bold" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Description</Label>
                <div className="relative">
                  <FileText className="absolute left-5 top-6 w-5 h-5 text-muted-foreground opacity-30" />
                  <Textarea placeholder="Explain what the website does and why users should visit..." value={description} onChange={(e) => setDescription(e.target.value)} className="pl-14 min-h-[150px] bg-white/5 border-white/10 rounded-[2rem] text-sm font-medium pt-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Primary Category</Label>
                    <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full h-16 bg-white/5 border-white/10 rounded-2xl font-bold justify-between px-6"
                        >
                          <span className={cn(category ? "text-white" : "text-muted-foreground")}>
                            {category || "Select Sector"}
                          </span>
                          <Search className="w-4 h-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] bg-[#121117] border-white/10 text-white rounded-2xl p-0 overflow-hidden shadow-2xl" align="start">
                        <div className="p-4 border-b border-white/5">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              placeholder="Search or add category..." 
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
                          ) : categorySearch.trim() ? (
                            <button 
                              onClick={() => {
                                setCategory(categorySearch.trim());
                                setIsCategoryPopoverOpen(false);
                                setCategorySearch("");
                              }}
                              className="w-full px-5 py-4 text-left text-sm font-black text-primary hover:bg-white/5 flex items-center gap-3 italic"
                            >
                              <Plus className="w-4 h-4" /> Add "{categorySearch}" as new category
                            </button>
                          ) : (
                            <div className="px-5 py-4 text-xs italic text-muted-foreground opacity-40">Start typing to find or add...</div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                 </div>
                 <div className="space-y-4">
                    <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Business Model</Label>
                    <Select value={pricing} onValueChange={(v: any) => setPricing(v)}>
                       <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-2xl font-bold">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="bg-[#121117] border-white/10 text-white rounded-xl">
                          <SelectItem value="Free" className="font-bold">100% Free</SelectItem>
                          <SelectItem value="Freemium" className="font-bold">Freemium</SelectItem>
                          <SelectItem value="Paid" className="font-bold">Premium / Paid</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Discovery Tags</Label>
                <div className="flex gap-4">
                  <Input placeholder="e.g. OSINT, Minimalist, Indie" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} className="flex-1 h-14 bg-white/5 border-white/10 rounded-2xl text-sm font-bold" />
                  <Button onClick={() => handleAddTag()} variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 font-black uppercase text-xs">Add Tag</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag, idx) => (
                    <Badge key={idx} className="bg-primary/20 text-primary border-none py-2 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group">
                      {tag} <X className="w-3 h-3 cursor-pointer group-hover:scale-125 transition-transform" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-10 pt-0">
              <Button onClick={handleFinalSubmit} disabled={submitting || !url || !name || !description || !category} className="w-full h-20 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-2xl font-black italic shadow-2xl transition-all active:scale-95 group">
                {submitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Send className="w-6 h-6 mr-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> SUBMIT WEBSITE</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
