'use client';

import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Sparkles, Search, ArrowRight, Bot, User, Globe, Info } from "lucide-react";
import { askDiscoveryAssistant, DiscoveryOutput } from "@/ai/flows/discovery-assistant-flow";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: DiscoveryOutput['recommendations'];
}

const SUGGESTIONS = [
  "I need websites for video editing",
  "Free Canva alternatives",
  "Tools for studying coding",
  "Music production hidden gems"
];

export default function AIAssistantPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I am Astra. I can help you discover the most useful websites in the Bessites registry. What are you looking for today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const result = await askDiscoveryAssistant({ message: text, history });
      
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: result.response,
        recommendations: result.recommendations 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I encountered a synchronization error. Please try again in a moment." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8 flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-160px)]">
        
        <header className="flex items-center justify-between mb-8 shrink-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              Astra <span className="text-primary">Discovery</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 italic">AI Powered Registry Search</p>
          </div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest px-3 py-1">Online</Badge>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 mb-6 pr-2" ref={scrollRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn(
                "max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-xl",
                m.role === 'user' 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-white/5 border border-white/5 text-white rounded-tl-none"
              )}>
                <div className="flex items-center gap-2 mb-2 opacity-40">
                  {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  <span className="text-[8px] font-black uppercase tracking-widest">{m.role === 'user' ? 'You' : 'Astra'}</span>
                </div>
                {m.content}
              </div>

              {m.recommendations && m.recommendations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {m.recommendations.map((rec) => (
                    <Card key={rec.id} className="bg-[#121117] border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between hover:border-primary/20 transition-all group">
                       <div className="space-y-4">
                          <div className="flex justify-between items-start">
                             <h4 className="text-lg font-black italic uppercase text-white leading-none group-hover:text-primary transition-colors">{rec.name}</h4>
                             <Link href={`/website/${rec.id}`} target="_blank"><Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/5"><ArrowRight className="w-3.5 h-3.5" /></Button></Link>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-medium italic">"{rec.reason}"</p>
                          
                          <div className="space-y-3 pt-2">
                             {rec.pros && rec.pros.length > 0 && (
                               <div className="space-y-1">
                                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Advantages</p>
                                  <ul className="text-[10px] text-white/40 space-y-0.5">
                                     {rec.pros.slice(0, 2).map((p, i) => <li key={i} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400/40" /> {p}</li>)}
                                  </ul>
                               </div>
                             )}
                          </div>
                       </div>
                       <div className="pt-6 flex gap-2">
                          <Link href={rec.url} target="_blank" className="flex-1"><Button variant="outline" className="w-full h-10 rounded-xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest italic hover:bg-white/10 gap-2"><Globe className="w-3 h-3" /> Visit</Button></Link>
                          <Link href={`/website/${rec.id}`} className="flex-1"><Button className="w-full h-10 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-primary/10 gap-2"><Info className="w-3 h-3" /> Details</Button></Link>
                       </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 text-muted-foreground italic animate-pulse p-4">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs font-black uppercase tracking-widest">Astra is indexing registry...</span>
            </div>
          )}
        </div>

        <div className="space-y-4 shrink-0">
          {!loading && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
               {SUGGESTIONS.map(s => (
                 <button key={s} onClick={() => handleSend(s)} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white hover:bg-white/10 hover:border-primary/20 transition-all uppercase italic">
                   {s}
                 </button>
               ))}
            </div>
          )}

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl focus-within:border-primary/40 transition-all">
              <Search className="absolute left-6 w-5 h-5 text-muted-foreground opacity-30" />
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe what you need (e.g. 'design tools for beginners')..." 
                className="flex-1 bg-transparent border-none h-14 pl-14 text-base font-bold focus-visible:ring-0"
                disabled={loading}
              />
              <Button 
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl glow-primary shrink-0 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
