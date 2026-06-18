"use client"

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { intelligentCategoryTagging } from "@/ai/flows/intelligent-category-tagging";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SubmitWebsite() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCategorize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const result = await intelligentCategoryTagging({ url });
      setTags(result.categories);
      toast({
        title: "AI Analysis Complete",
        description: `Successfully analyzed content and generated ${result.categories.length} tags.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not fetch content from this URL. Please try another.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-2xl">
          <Card className="bg-card border-white/5 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-headline font-extrabold text-white">
                Add to the <span className="text-primary italic">Flow</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Submit a website and let our AI handle the categorization for the Pinterest-style feed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCategorize} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-white font-medium">Website URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="url"
                      type="url"
                      placeholder="https://awesome-web-app.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 rounded-xl focus:ring-primary h-12"
                    />
                    <Button 
                      type="submit" 
                      disabled={loading || !url}
                      className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-6 glow-primary shrink-0"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                      AI Tagging
                    </Button>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Label className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-primary" />
                      Suggested Categories
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                        <Badge key={idx} className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none py-2 px-4 rounded-full text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="pt-6 border-t border-white/5">
              <Button 
                disabled={tags.length === 0} 
                className="w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-30"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit for Curators Review
              </Button>
            </CardFooter>
          </Card>
          
          <p className="text-center mt-6 text-xs text-muted-foreground px-12">
            By submitting, you agree to our curator guidelines. Our AI analyzes metadata and content snippets to ensure relevance and safety.
          </p>
        </div>
      </main>
    </div>
  );
}