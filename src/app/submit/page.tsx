"use client"

import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Check, Plus, X, Sparkles, Image as ImageIcon, Globe, Type, FileText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useStorage } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { intelligentCategoryTagging } from "@/ai/flows/intelligent-category-tagging";
import { enrichWebsiteMetadata } from "@/ai/flows/website-enrichment-flow";
import { verifyWebsite } from "@/ai/flows/verify-website-flow";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PRIMARY_CATEGORIES = ["AI", "Gaming", "Design", "Developer", "Tools", "Finance", "Education", "Lifestyle", "Fun"];

export default function SubmitWebsite() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [url, setUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedUrl, setVerifiedUrl] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [pricing, setPricing] = useState<"Free" | "Paid" | "Freemium">("Free");
  
  const [submitting, setSubmitting] = useState(false);
  const [enrichingTitle, setEnrichingTitle] = useState(false);
  const [enrichingDesc, setEnrichingDesc] = useState(false);
  const [suggestingTags, setSuggestingTags] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Login Required", description: "Please sign in to submit projects." });
      router.push("/login");
    }
  }, [user, authLoading, router, toast]);

  // Reset verification if URL changes
  useEffect(() => {
    if (url !== verifiedUrl) {
      setIsVerified(false);
    }
  }, [url, verifiedUrl]);

  const handleVerify = async () => {
    if (!url) return toast({ variant: "destructive", title: "URL Required", description: "Please enter a website URL." });
    
    setVerifying(true);
    try {
      const result = await verifyWebsite({ url });
      if (result.reachable) {
        setIsVerified(true);
        setVerifiedUrl(url);
        toast({
          title: "Website Verified Successfully!",
          description: "Analysis tools are now active.",
          className: "bg-emerald-600 text-white border-none",
        });
      } else {
        setIsVerified(false);
        toast({
          variant: "destructive",
          title: "Website not found.",
          description: "Please check the URL and try again.",
        });
      }
    } catch (e) {
      setIsVerified(false);
      toast({
        variant: "destructive",
        title: "Verification failed.",
        description: "An unexpected error occurred during verification.",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMagicTitle = async () => {
    if (!isVerified) return;
    setEnrichingTitle(true);
    try {
      const res = await enrichWebsiteMetadata({ url, mode: 'title' });
      if (res.title) {
        setName(res.title);
        toast({ title: "Title Generated", description: "SEO-friendly name ready." });
      } else {
        throw new Error("Empty response");
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Could not generate Title.", description: "AI analysis encountered an issue." });
    } finally {
      setEnrichingTitle(false);
    }
  };

  const handleMagicDescription = async () => {
    if (!isVerified) return;
    setEnrichingDesc(true);
    try {
      const res = await enrichWebsiteMetadata({ url, mode: 'description' });
      if (res.description) {
        setDescription(res.description);
        toast({ title: "Description Generated", description: "Professional summary ready." });
      } else {
        throw new Error("Empty response");
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Could not generate Description.", description: "AI analysis encountered an issue." });
    } finally {
      setEnrichingDesc(false);
    }
  };

  const handleSuggestTags = async () => {
    if (!isVerified) return;
    setSuggestingTags(true);
    try {
      const result = await intelligentCategoryTagging({ url });
      if (result?.categories && result.categories.length > 0) {
        setTags(prev => Array.from(new Set([...prev, ...result.categories])));
        toast({ title: "Tags Generated", description: "Relevant discovery tags injected." });
      } else {
        throw new Error("No tags returned");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Could not generate Tags.", description: "AI analysis encountered an issue." });
    } finally {
      setSuggestingTags(false);
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

  const handleFinalSubmit = async () => {
    if (!db || !url || !name || !description || !user || !storage) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please fill all required fields." });
      return;
    }
    
    setSubmitting(true);
    try {
      let publicLogoUrl = "";
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const storageRef = ref(storage, `logos/${user.uid}/${Date.now()}.${fileExt}`);
        await uploadBytes(storageRef, logoFile);
        publicLogoUrl = await getDownloadURL(storageRef);
      }

      const submissionData = {
        url,
        name,
        description,
        longDescription: description,
        categories: [category, ...tags].filter(Boolean),
        logoUrl: publicLogoUrl,
        pricing,
        userId: user.uid,
        userEmail: user.email,
        status: "pending",
        timestamp: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "submissions"), submissionData);
      
      await setDoc(doc(db, "websiteStats", docRef.id), {
        logoUrl: publicLogoUrl,
        visitCount: 0,
        likeCount: 0,
        shareCount: 0,
        ratingSum: 0,
        ratingCount: 0,
        lastPreviewUpdate: serverTimestamp()
      });

      setSubmitted(true);
      toast({ title: "Submission Received!", description: "Reviewing your project now." });
      setTimeout(() => router.push("/profile"), 2000);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Failed", description: error.message });
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

  if (submitted) return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20"><Check className="w-12 h-12 text-white" strokeWidth={4} /></div>
          <h2 className="text-4xl font-extrabold text-white">Project Lodged</h2>
          <p className="text-muted-foreground text-lg">Astra is reviewing your submission...</p>
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
              <CardDescription className="text-lg font-medium opacity-60">Onboard your digital property to the discovery engine.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-10 pt-0 space-y-10">
              {/* URL & Verification */}
              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Live URL</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Globe className={cn("absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors", isVerified ? "text-emerald-400" : "text-primary opacity-50")} />
                    <Input 
                      placeholder="https://your-project.com" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)} 
                      className={cn(
                        "pl-14 h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-bold transition-all",
                        isVerified && "border-emerald-500/50 focus:ring-emerald-500"
                      )} 
                    />
                  </div>
                  <Button 
                    onClick={handleVerify} 
                    disabled={verifying || !url} 
                    className={cn(
                      "h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 transition-all",
                      isVerified ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-white text-black hover:bg-white/90"
                    )}
                  >
                    {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : isVerified ? <Check className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                    {isVerified ? "VERIFIED" : "VERIFY WEBSITE"}
                  </Button>
                </div>
                {!isVerified && url && (
                  <p className="text-[10px] font-black uppercase text-amber-500 italic ml-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Please verify the website to enable AI analysis tools.
                  </p>
                )}
              </div>

              {/* Branding */}
              <div className="space-y-4">
                 <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Branding & Logo</Label>
                 <div onClick={() => fileInputRef.current?.click()} className="group relative w-full h-48 rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-primary/40 bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-500">
                  {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" /> : <><ImageIcon className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" /><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-3 italic">Upload Property Mark</span></>}
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              {/* Title */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Website Title</Label>
                  <Button 
                    variant="ghost" 
                    onClick={handleMagicTitle} 
                    disabled={enrichingTitle || !isVerified} 
                    className={cn(
                      "h-8 px-4 bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-black uppercase italic rounded-full gap-2 transition-all",
                      !isVerified && "opacity-20 cursor-not-allowed grayscale"
                    )}
                  >
                    {enrichingTitle ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} ✨ Magic Title
                  </Button>
                </div>
                <div className="relative">
                   <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-30" />
                   <Input placeholder="What is it called?" value={name} onChange={(e) => setName(e.target.value)} className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-bold" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Description</Label>
                  <Button 
                    variant="ghost" 
                    onClick={handleMagicDescription} 
                    disabled={enrichingDesc || !isVerified} 
                    className={cn(
                      "h-8 px-4 bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-black uppercase italic rounded-full gap-2 transition-all",
                      !isVerified && "opacity-20 cursor-not-allowed grayscale"
                    )}
                  >
                    {enrichingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} ✨ Magic Description
                  </Button>
                </div>
                <div className="relative">
                  <FileText className="absolute left-5 top-6 w-5 h-5 text-muted-foreground opacity-30" />
                  <Textarea placeholder="Explain what the website does..." value={description} onChange={(e) => setDescription(e.target.value)} className="pl-14 min-h-[150px] bg-white/5 border-white/10 rounded-[2rem] text-sm font-medium pt-5" />
                </div>
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Primary Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                       <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-2xl font-bold">
                          <SelectValue placeholder="Select Sector" />
                       </SelectTrigger>
                       <SelectContent className="bg-[#121117] border-white/10 text-white rounded-xl">
                          {PRIMARY_CATEGORIES.map(c => <SelectItem key={c} value={c} className="font-bold">{c}</SelectItem>)}
                       </SelectContent>
                    </Select>
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
                <div className="flex items-center justify-between">
                   <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Discovery Tags</Label>
                   <Button 
                    variant="ghost" 
                    onClick={handleSuggestTags} 
                    disabled={suggestingTags || !isVerified} 
                    className={cn(
                      "h-8 px-4 text-primary hover:bg-primary/10 text-[10px] font-black uppercase italic rounded-full gap-2 transition-all",
                      !isVerified && "opacity-20 cursor-not-allowed grayscale"
                    )}
                   >
                      {suggestingTags ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Magic Tags
                   </Button>
                </div>
                <div className="flex gap-4">
                  <Input placeholder="e.g. OSINT, Minimalist, Indie" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} className="flex-1 h-14 bg-white/5 border-white/10 rounded-2xl text-sm font-bold" />
                  <Button onClick={() => handleAddTag()} variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 font-black uppercase text-xs">Inject</Button>
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
              <Button onClick={handleFinalSubmit} disabled={submitting || !isVerified || !name || !description} className="w-full h-20 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-2xl font-black italic shadow-2xl transition-all active:scale-95 group">
                {submitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Send className="w-6 h-6 mr-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> LODGE IN REGISTRY</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
