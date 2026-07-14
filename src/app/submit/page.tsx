
"use client"

import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Check, Plus, X, Sparkles, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { intelligentCategoryTagging } from "@/ai/flows/intelligent-category-tagging";
import { supabase } from "@/lib/supabase";

export default function SubmitWebsite() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Login Required",
        description: "Please sign in to submit projects to the community.",
      });
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
    const cleanTag = tagInput.trim();
    if (tags.includes(cleanTag)) {
      setTagInput("");
      return;
    }
    setTags([...tags, cleanTag]);
    setTagInput("");
  };

  const handleSuggestTags = async () => {
    if (!url || !url.startsWith('http')) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL first.",
      });
      return;
    }
    setSuggesting(true);
    try {
      const result = await intelligentCategoryTagging({ url });
      if (result && result.categories) {
        setTags(prev => Array.from(new Set([...prev, ...result.categories])));
        toast({
          title: "Tags suggested!",
          description: `Added ${result.categories.length} new categories via AI.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not automatically categorize this site.",
      });
    } finally {
      setSuggesting(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleFinalSubmit = async () => {
    if (!db || !url || tags.length === 0 || !user) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a URL, at least one category tag, and ensure you are logged in.",
      });
      return;
    }
    
    setSubmitting(true);
    try {
      let publicLogoUrl = "";
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const path = `logos/${user.uid}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('Website-images')
          .upload(path, logoFile);
        
        if (uploadError) throw uploadError;
        publicLogoUrl = supabase.storage.from('Website-images').getPublicUrl(path).data.publicUrl;
      }

      const submissionRef = await addDoc(collection(db, "submissions"), {
        url,
        categories: tags,
        logoUrl: publicLogoUrl,
        userId: user.uid,
        userEmail: user.email,
        status: "pending",
        timestamp: serverTimestamp()
      });

      // Create initial stats entry
      const statsRef = doc(db, "websiteStats", submissionRef.id);
      await setDoc(statsRef, {
        logoUrl: publicLogoUrl,
        visitCount: 0,
        likeCount: 0,
        shareCount: 0,
        ratingSum: 0,
        ratingCount: 0,
        lastPreviewUpdate: serverTimestamp()
      }, { merge: true });
      
      setSubmitted(true);
      toast({
        title: "Submission Received!",
        description: "Our curators will review your site shortly.",
      });
      
      setTimeout(() => router.push("/profile"), 2000);
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "An unexpected error occurred during submission.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20">
              <Check className="w-12 h-12 text-white" strokeWidth={4} />
            </div>
            <h2 className="text-4xl font-extrabold text-white">Submitted!</h2>
            <p className="text-muted-foreground text-lg">Redirecting you to your profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-2xl">
          <Card className="bg-card border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-4xl font-headline font-extrabold text-white tracking-tighter">
                Add to the <span className="text-primary italic">Flow</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Submit a website and categorize it for the community.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                   <Label className="text-white text-lg font-bold ml-1">Logo / Branding</Label>
                   <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative w-full h-40 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/40 bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all"
                   >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-bold text-muted-foreground mt-2">Upload Tool Logo</span>
                      </>
                    )}
                   </div>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="url" className="text-white text-lg font-bold ml-1">Website URL</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={handleSuggestTags}
                      disabled={suggesting || !url}
                      className="text-primary hover:text-primary hover:bg-primary/10 font-bold h-8 text-xs"
                    >
                      {suggesting ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
                      Magic Categorize
                    </Button>
                  </div>
                  <Input 
                    id="url"
                    type="url"
                    placeholder="https://awesome-web-app.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 rounded-2xl h-14 text-lg focus:ring-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tags" className="text-white text-lg font-bold ml-1">Categories / Tags</Label>
                  <div className="flex gap-3">
                    <Input 
                      id="tags"
                      placeholder="e.g. AI, Gaming, Tools"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      className="bg-white/5 border-white/10 rounded-2xl h-14 text-lg focus:ring-primary"
                    />
                    <Button 
                      type="button" 
                      onClick={() => handleAddTag()}
                      variant="outline"
                      className="rounded-2xl h-14 px-6 shrink-0 font-bold border-white/10 hover:bg-white/5"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
                    {tags.map((tag, idx) => (
                      <Badge key={idx} className="bg-primary/10 text-primary border-none py-2 px-4 rounded-full text-sm font-bold flex items-center gap-2">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-4 border-t border-white/5 bg-white/[0.02]">
              <Button 
                onClick={handleFinalSubmit}
                disabled={tags.length === 0 || submitting || !url} 
                className="w-full h-16 rounded-2xl bg-white text-background hover:bg-white/90 text-xl font-black shadow-xl disabled:opacity-30 transition-all active:scale-95"
              >
                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5 mr-3" />}
                Confirm Submission
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
