'use client';

import { useState, useRef, useEffect } from 'react';
import { askOuneo } from '@/ai/flows/ouneo-flow';
import type { OuneoOutput } from '@/ai/schemas';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  ExternalLink, 
  X,
  Globe,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  result?: OuneoOutput;
}

export function OuneoAssistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, loading]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    const currentQuery = query;
    setQuery('');
    setLoading(true);
    setError(null);

    const currentHistory = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, { role: 'user', content: currentQuery }]);

    try {
      const discoveryData = await askOuneo({ 
        message: currentQuery, 
        history: currentHistory 
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: discoveryData.response,
        result: discoveryData 
      }]);
    } catch (err) {
      setError("The discovery node is temporarily recalibrating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Interaction Area */}
      <div className={cn(
        "space-y-8 transition-all duration-700",
        messages.length > 0 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      )}>
        {messages.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
            msg.role === 'user' ? "items-end" : "items-start"
          )}>
            {msg.role === 'user' ? (
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                <p className="text-sm font-bold text-white">{msg.content}</p>
              </div>
            ) : (
              <div className="flex gap-4 w-full">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 shadow-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="bg-[#121117] border border-white/5 p-6 rounded-[2rem] rounded-tl-none shadow-2xl">
                    <p className="text-base text-zinc-300 font-medium italic leading-relaxed">
                      {msg.content}
                    </p>
                  </div>

                  {msg.result?.matches && msg.result.matches.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {msg.result.matches.map((site, sIdx) => (
                        <Card 
                          key={sIdx} 
                          className="bg-[#121117] border-white/5 hover:border-primary/40 transition-all p-6 rounded-[2rem] group cursor-pointer shadow-xl relative overflow-hidden"
                          onClick={() => window.open(site.url, '_blank')}
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-primary" />
                          </div>
                          <div className="space-y-3">
                            <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase italic">
                              {site.category}
                            </Badge>
                            <h4 className="text-lg font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
                              {site.name}
                            </h4>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed italic line-clamp-2">
                              {site.reason}
                            </p>
                            <div className="pt-3 flex items-center gap-2 text-[8px] font-black uppercase text-white/20 tracking-widest border-t border-white/5">
                              <Globe className="w-2.5 h-2.5" />
                              {site.url.replace('https://', '').split('/')[0]}
                            </div>
                          </div>
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
          <div className="flex gap-4 items-center animate-pulse">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <div className="h-10 bg-white/5 rounded-2xl w-48 border border-white/5" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Module */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[3rem] blur-2xl opacity-20 group-focus-within:opacity-100 transition-opacity duration-1000" />
        <form 
          onSubmit={handleSearch} 
          className="relative flex items-center bg-[#121117] border border-white/10 rounded-[3rem] p-3 pl-8 shadow-2xl transition-all group-focus-within:border-primary/50"
        >
          <Sparkles className={cn(
            "w-6 h-6 transition-all duration-700",
            loading ? "text-primary animate-pulse scale-125" : "text-white/20 group-hover:text-primary"
          )} />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Ouneo about 405 verified websites..."
            className="flex-1 bg-transparent border-none text-lg font-bold text-white placeholder:text-white/10 focus-visible:ring-0 h-14"
          />
          <Button 
            disabled={loading || !query.trim()}
            type="submit"
            className="rounded-full w-14 h-14 bg-white text-black hover:bg-primary hover:text-white transition-all shadow-xl p-0"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
          </Button>
        </form>
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {["Best AI Tools", "Productivity Apps", "Cool Browser Games"].map(hint => (
            <button 
              key={hint}
              onClick={() => setQuery(hint)}
              className="px-5 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase text-white/40 hover:text-white hover:bg-white/10 transition-all tracking-widest"
            >
              {hint}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
