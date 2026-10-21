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
      setError("Ouneo is taking a breath. Try again in a sec.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setQuery('');
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Interaction Area */}
      <div className={cn(
        "space-y-8 transition-all duration-700",
        messages.length > 0 ? "opacity-100 min-h-[100px]" : "opacity-0 h-0 overflow-hidden"
      )}>
        {messages.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
            msg.role === 'user' ? "items-end" : "items-start"
          )}>
            {msg.role === 'user' ? (
              <div className="bg-primary/20 border border-primary/30 p-4 rounded-2xl rounded-tr-none max-w-[85%]">
                <p className="text-sm font-bold text-white">{msg.content}</p>
              </div>
            ) : (
              <div className="flex gap-4 w-full">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="bg-[#16141F] border border-white/5 p-6 rounded-[2rem] rounded-tl-none shadow-2xl">
                    <p className="text-base text-zinc-200 font-medium italic leading-relaxed">
                      {msg.content}
                    </p>
                  </div>

                  {msg.result?.matches && msg.result.matches.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-500">
                      {msg.result.matches.map((site, sIdx) => (
                        <Card 
                          key={sIdx} 
                          className="bg-[#121117] border-white/5 hover:border-primary/40 transition-all p-5 rounded-[1.5rem] group cursor-pointer shadow-xl relative overflow-hidden"
                          onClick={() => window.open(site.url, '_blank')}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase italic">
                                {site.category}
                              </Badge>
                              <ExternalLink className="w-3.5 h-3.5 text-white/10 group-hover:text-primary transition-colors" />
                            </div>
                            <h4 className="text-lg font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
                              {site.name}
                            </h4>
                            <p className="text-xs text-muted-foreground font-medium italic line-clamp-2">
                              {site.reason}
                            </p>
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
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <div className="h-4 bg-white/5 rounded-full w-24 border border-white/5 animate-pulse" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Module */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[3rem] blur-2xl opacity-10 group-focus-within:opacity-100 transition-opacity duration-1000" />
        <form 
          onSubmit={handleSearch} 
          className="relative flex items-center bg-[#121117] border border-white/10 rounded-[3rem] p-2 pl-8 shadow-2xl transition-all group-focus-within:border-primary/50"
        >
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={messages.length === 0 ? "Ask for a site... (e.g. 'I need to make a logo')" : "Reply to Ouneo..."}
            className="flex-1 bg-transparent border-none text-base sm:text-lg font-bold text-white placeholder:text-white/10 focus-visible:ring-0 h-14"
          />
          {messages.length > 0 && !loading && (
            <button type="button" onClick={clearChat} className="p-3 text-white/20 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
          <Button 
            disabled={loading || !query.trim()}
            type="submit"
            className="rounded-full w-12 h-12 bg-white text-black hover:bg-primary hover:text-white transition-all shadow-xl p-0"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
          </Button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center italic">
          {error}
        </div>
      )}
    </div>
  );
}
