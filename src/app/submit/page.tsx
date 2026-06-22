
"use client"

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { intelligentCategoryTagging } from "@/ai/flows/intelligent-category-tagging";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Send, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SubmitWebsite() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleCategorize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const result = await intelligentCategoryTagging({ url });
      setTags(result.categories);
      toast({
        title: "AI Analysis Complete",
        description: `Successfully analyzed content and generated tags.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not fetch content. Please try another URL.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!db || !url || tags.length === 0) return;
    
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
                Submit a website and let our AI handle the categorization.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <form onSubmit={handleCategorize} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="url" className="text-white text-lg font-bold ml-1">Website URL</Label>
                  <div className="flex gap-3">
                    <Input 
                      id="url"
                      type="url"
                      placeholder="https://awesome-web-app.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 rounded-2xl h-14 text-lg focus:ring-primary"
                    />
                    <Button 
                      type="submit" 
                      disabled={loading || !url}
                      className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 px-8 glow-primary shrink-0 font-bold"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                      AI Analysis
                    </Button>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Label className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Suggested Tags
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                        <Badge key={idx} className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none py-2.5 px-5 rounded-full text-sm font-bold">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="p-8 pt-4 border-t border-white/5 bg-white/[0.02]">
              <Button 
                onClick={handleFinalSubmit}
                disabled={tags.length === 0 || submitting} 
                className="w-full h-16 rounded-2xl bg-white text-background hover:bg-white/90 text-xl font-black shadow-xl disabled:opacity-30 transition-all active:scale-95"
              >
                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5 mr-3" />}
                Confirm Submission
              </Button>
            </CardFooter>
          </Card>
          
          <p className="text-center mt-8 text-sm text-muted-foreground px-12 leading-relaxed opacity-60">
            By submitting, you agree to our curator guidelines. Our AI analyzes metadata and content snippets to ensure relevance and safety for the community.
          </p>
        </div>
      </main>
    </div>
  );
}
