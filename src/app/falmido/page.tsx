"use client"

import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, 
  ArrowRight, 
  RotateCcw, 
  Globe, 
  Sparkles,
  Loader2,
  User as UserIcon,
  ExternalLink
} from "lucide-react";
import { chatWithFalmido, type FalmidoOutput } from "@/ai/flows/falmido-flow";
import { cn } from "@/lib/utils";
import { WebsitePreview } from "@/components/website-preview";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  results?: any[];
}

export default function FalmidoPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi, I'm Falmido. Answer three quick questions and I'll find sites that fit you. What are you looking for today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await chatWithFalmido({ message: userMsg, history });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.response, 
        results: response.results 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I hit a technical snag. Let's try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setMessages([{ role: 'assistant', content: "Hi, I'm Falmido. Answer three quick questions and I'll find sites that fit you. What are you looking for today?" }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background text-white font-body flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-2xl px-6 py-12 sm:py-20 flex flex-col">
        
        {/* Chat History */}
        <div className="flex-1 space-y-8 mb-10 overflow-y-auto no-scrollbar pb-8">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn(
              "flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
              msg.role === 'user' ? "items-end" : "items-start"
            )}>
              {/* User Bubble */}
              {msg.role === 'user' && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 text-primary p-4 rounded-[1.5rem] border border-primary/20 max-w-[85%]">
                    <p className="text-sm font-bold">{msg.content}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4 text-white/40" />
                  </div>
                </div>
              )}

              {/* Falmido Bubble */}
              {msg.role === 'assistant' && (
                <div className="flex gap-4 w-full">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 shadow-2xl">
                    <Compass className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="bg-[#121117] border border-white/5 p-6 rounded-[2rem] max-w-[90%] shadow-xl">
                      <p className="text-base text-white/90 font-medium italic leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>

                    {/* Discovery Results */}
                    {msg.results && msg.results.length > 0 && (
                      <div className="grid grid-cols-1 gap-4 animate-in zoom-in-95 duration-700">
                        {msg.results.map((site) => (
                          <Card key={site.id} className="bg-[#0D0C12] border-white/5 p-6 rounded-[2.5rem] flex items-center gap-6 group hover:border-primary/40 transition-all shadow-2xl">
                            <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/5 p-2 shrink-0 group-hover:scale-105 transition-transform duration-500">
                              <WebsitePreview websiteUrl={site.url} fallbackUrl={site.logoUrl || site.imageUrl} alt={site.name} className="w-full h-full object-contain rounded-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-lg font-bold truncate group-hover:text-primary transition-colors">{site.websiteName || site.name}</h4>
                                <span className="text-[9px] font-black uppercase border border-primary/20 px-2 py-0.5 rounded-md text-primary/80 italic">{site.pricing}</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground font-medium italic line-clamp-1 opacity-60">{site.description}</p>
                            </div>
                            <button 
                              onClick={() => window.open(site.url, '_blank', 'noopener,noreferrer')}
                              className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all shrink-0 shadow-lg"
                            >
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 w-full animate-pulse">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
              <div className="h-16 bg-white/[0.02] border border-white/5 rounded-[2rem] w-48" />
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Interface */}
        <div className="sticky bottom-0 pb-10 pt-4 bg-background">
          <form onSubmit={handleSend} className="relative flex items-center bg-[#121117] border border-white/10 rounded-[2.5rem] p-2 pr-4 shadow-2xl transition-all group focus-within:border-primary/50">
            <div className="p-4 pl-6">
              <Compass className={cn("w-6 h-6 transition-all duration-700", loading ? "text-primary animate-spin" : "text-primary/40 group-hover:text-primary")} />
            </div>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell Falmido what you need..."
              className="flex-1 bg-transparent border-none text-base font-bold text-white placeholder:text-white/10 focus-visible:ring-0 h-16"
              disabled={loading}
            />
            <Button 
              disabled={loading || !input.trim()}
              type="submit"
              className="rounded-full w-12 h-12 bg-white text-black hover:bg-primary hover:text-white transition-all shadow-lg p-0"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
          </form>

          {/* Quick Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <button 
              onClick={restart} 
              className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3 h-3" /> Start Again
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
