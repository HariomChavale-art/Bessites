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
import { supabase, getSupabaseConfigStatus } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { INTERESTS, BROAD_CATEGORIES } from "@/lib/category-mapping";

export default function SubmitWebsite() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [url, setUrl] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [name, setName] = useState(""); 
  const [description, setDescription] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
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

  const handleFinalSubmit = async () => {
    if (!db) return;
    const configStatus = getSupabaseConfigStatus();
    if (!supabase || !configStatus.isConfigured) return;

    if (!url || !websiteName || !name || !description || !selectedInterest) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please fill all required fields." });
      return;
    }

    if (!logoFile) {
      toast({ variant: "destructive", title: "Logo Required", description: "Please add a brand mark." });
      return;
    }
    
    setSubmitting(true);
    let uploadedFilePath = "";

    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      uploadedFilePath = `logos/${user!.uid}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('Website-images')
        .upload(uploadedFilePath, logoFile);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from('Website-images')
        .getPublicUrl(uploadedFilePath);
      
      const finalTags = Array.from(new Set([selectedInterest, ...tags].filter(Boolean)));

      const submissionRef = await addDoc(collection(db, "submissions"), {
        url,
        websiteName, 
        name, 
        description,
        categories: finalTags,
        logoUrl: publicUrl,
        pricing,
        userId: user!.uid,
        userEmail: user!.email,
        status: "pending",
        timestamp: serverTimestamp()
      });

      await setDoc(doc(db, "websiteStats", submissionRef.id), {
        logoUrl: publicUrl,
        visitCount: 0,
        likeCount: 0,
        saveCount: 0,
        shareCount: 0,
        ratingSum: 0,
        ratingCount: 0,
        lastPreviewUpdate: serverTimestamp()
      });

      setSubmitted(true);
      toast({ title: "Submission Received!", description: "Reviewing your project." });
      
    } catch (error: any) {
      if (uploadedFilePath) await supabase.storage.from('Website-images').remove([uploadedFilePath]);
      toast({ variant: "destructive", title: "Submission Failed", description: error.message });
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
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5 shadow-2xl">
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </div>
          <h2 className="text-4xl font-headline font-black text-white italic uppercase tracking-tighter">Website Submitted!</h2>
          <Button onClick={() => router.push("/profile")} className="rounded-full px-10 h-14 bg-white/5 border border-white/10 text-white font-bold">Return to Profile</Button>
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
            <CardHeader className="p-10 pb-6 text-center">
              <CardTitle className="text-5xl font-headline font-black text-white tracking-tighter italic uppercase">Registry <span className="text-primary">Submission</span></CardTitle>
              <CardDescription className="text-lg font-medium opacity-60">Upload your digital property to the discovery pipeline.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-10 pt-0 space-y-10">
              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Live Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />
                  <Input placeholder="https://your-brand.com" value={url} onChange={(e) => setUrl(e.target.value)} className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-bold" />
                </div>
              </div>

              <div className="space-y-4">
                 <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Brand Mark</Label>
                 <div onClick={() => fileInputRef.current?.click()} className={cn("group relative w-full h-48 rounded-[2.5rem] border-2 border-dashed bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-500", logoPreview ? "border-emerald-500/20" : "border-white/10 hover:border-primary/40")}>
                  {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-4" /> : <ImageIcon className="w-12 h-12 text-muted-foreground group-hover:text-primary" />}
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Primary Interest</Label>
                   <Select value={selectedInterest} onValueChange={setSelectedInterest}>
                      <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-2xl font-bold">
                         <SelectValue placeholder="Select Interest" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121117] border-white/10 text-white rounded-xl max-h-[400px]">
                         {INTERESTS.map(interest => (
                           <SelectItem key={interest.name} value={interest.name} className="font-bold">
                             {interest.name}
                           </SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-4">
                   <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Access Model</Label>
                   <Select value={pricing} onValueChange={(v: any) => setPricing(v)}>
                      <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-2xl font-bold">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121117] border-white/10 text-white rounded-xl">
                         <SelectItem value="Free" className="font-bold">Free</SelectItem>
                         <SelectItem value="Freemium" className="font-bold">Freemium</SelectItem>
                         <SelectItem value="Paid" className="font-bold">Paid</SelectItem>
                      </SelectContent>
                   </Select>
                 </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Website Name</Label>
                <Input placeholder="e.g. Figma" value={websiteName} onChange={(e) => setWebsiteName(e.target.value)} className="h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-bold" />
              </div>

              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Detailed Tags (Metadata)</Label>
                <div className="flex gap-2">
                   <Input placeholder="Press enter to add (e.g. UI/UX, Vector)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} className="h-14 bg-white/5 border-white/10 rounded-xl text-sm" />
                   <Button onClick={() => handleAddTag()} variant="outline" className="h-14 w-14 rounded-xl border-white/10 bg-white/5"><Plus className="w-5 h-5" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                   {tags.map(t => <Badge key={t} className="bg-primary/20 text-primary border-none px-3 py-1.5 rounded-lg flex items-center gap-2">{t}<X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(t)} /></Badge>)}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Discovery Description</Label>
                <Textarea placeholder="Explain what the website does..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[150px] bg-white/5 border-white/10 rounded-[2rem] text-sm p-6" />
              </div>
            </CardContent>
            
            <CardFooter className="p-10 pt-0">
              <Button onClick={handleFinalSubmit} disabled={submitting} className="w-full h-20 rounded-[2.5rem] bg-white text-black hover:bg-white/90 text-2xl font-headline font-black italic shadow-2xl transition-all group">
                {submitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Send className="w-6 h-6 mr-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> PUBLISH PROJECT</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
