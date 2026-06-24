
"use client"

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Check, Plus, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { intelligentCategoryTagging } from "@/ai/flows/intelligent-category-tagging";

export default function SubmitWebsite() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleAutoTag = async () => {
    if (!url) return;
    setAnalyzing(true);
    try {
      const result = await intelligentCategoryTagging({ url });
      setTags(Array.from(new Set([...tags, ...result.categories])));
      toast({ title: "Tags generated!", description: "AI has suggested categories based on the URL." });
    } catch (e) {
      toast({ variant: "destructive", title: "AI Tagging failed", description: "Could not auto-generate tags." });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) {
      setTagInput("");
      return;
    }
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleFinalSubmit = async () => {
    if (!db || !url || tags.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a URL and at least one category tag.",
      });
      return;
    }
    
    setSubmitting(true);
    try {
      await addDoc(collection(db, "submissions"), {
        url,
        categories: tags,
        userId: user?.uid || "guest",
        userEmail: user?.email || "anonymous",
        status: "pending",
        timestamp: serverTimestamp()
      });
      
      setSubmitted(true);
      toast({
        title: "Submission Received!",
        description: "Our curators will review your site shortly.",
      });
      
      setTimeout(() => router.push("/profile"), 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

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
                  <div className="flex justify-between items-end">
                    <Label htmlFor="url" className="text-white text-lg font-bold ml-1">Website URL</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleAutoTag}
                      disabled={!url || analyzing}
                      className="text-primary font-bold gap-2 hover:bg-primary/10"
                    >
                      {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      AI Suggest Tags
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
                  <form onSubmit={handleAddTag} className="flex gap-3">
                    <Input 
                      id="tags"
                      placeholder="e.g. AI, Gaming, Tools"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="bg-white/5 border-white/10 rounded-2xl h-14 text-lg focus:ring-primary"
                    />
                    <Button 
                      type="submit" 
                      variant="outline"
                      className="rounded-2xl h-14 px-6 shrink-0 font-bold border-white/10 hover:bg-white/5"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add
                    </Button>
                  </form>
                  
                  <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
                    {tags.map((tag, idx) => (
                      <Badge key={idx} className="bg-primary/10 text-primary border-none py-2 px-4 rounded-full text-sm font-bold flex items-center gap-2">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {tags.length === 0 && (
                      <span className="text-muted-foreground text-sm italic py-2">Add at least one tag...</span>
                    )}
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
          
          <p className="text-center mt-8 text-sm text-muted-foreground px-12 leading-relaxed opacity-60">
            By submitting, you agree to our curator guidelines. Our team will review your project for quality and relevance to the community.
          </p>
        </div>
      </main>
    </div>
  );
}
