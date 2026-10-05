'use client';

import { useState, useRef, useEffect } from 'react';
import { askOuneo, OuneoOutput } from '@/ai/flows/ouneo-flow';
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
  Zap,
  Globe,
  User as UserIcon,
  MessageSquare
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
    scrollToBottom();
  }, [messages, loading]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    const currentQuery = query;
    setQuery('');
    setLoading(true);
    setError(null);

    // Add user message to UI
    const newMessages = [...messages, { role: 'user' as const, content: currentQuery }];
    setMessages(newMessages);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const data = await askOuneo({ message: currentQuery, history });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        result: data 
      }]);
    } catch (err) {
      setError("I'm having trouble connecting to the network. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setQuery('');
  };

  return (
    <section className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
      
      {/* Chat History Area */}
      {messages.length > 0 && (
        <div className="space-y-8 mb-10 min-h-[100px] max-h-[600px] overflow-y-auto no-scrollbar p-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn(
              "flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
              msg.role === 'user' ? "items-end" : "items-start"
            )}>
              {/* User Bubble */}
              {msg.role === 'user' && (
                <div className="flex items-center gap-3">
                   <div className="bg-primary/20 text-primary p-3 rounded-2xl border border-primary/20">
                      <p className="text-sm font-bold">{msg.content}</p>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4 text-white/40" />
                   </div>
                </div>
              )}

              {/* Assistant Response */}
              {msg.role === 'assistant' && (
                <div className="flex gap-4 w-full">
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                   </div>
                   <div className="flex-1 space-y-6">
                      <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem] relative overflow-hidden max-w-[90%]">
                         <p className="text-base text-white/90 font-medium italic leading-relaxed">
                            {msg.content}
                         </p>
                      </div>

                      {msg.result && msg.result.matches.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                           {msg.result.matches.map((tool, tIdx) => (
                             <Card 
                               key={tIdx} 
                               className="bg-[#121117] border-white/5 hover:border-primary/40 transition-all p-5 rounded-[1.5rem] flex flex-col justify-between group shadow-xl hover:shadow-primary/5 cursor-pointer relative overflow-hidden"
                               onClick={() => window.open(tool.url, '_blank')}
                             >
                               <div className="space-y-3">
                                 <div className="flex justify-between items-start">
                                    <Badge className="bg-primary/10 text-primary border-none text-[7px] font-black uppercase italic">{tool.category}</Badge>
                                    <ExternalLink className="w-3.5 h-3.5 text-white/10 group-hover:text-primary transition-colors" />
                                 </div>
                                 <div>
                                   <h4 className="text-base font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{tool.name}</h4>
                                   <p className="text-[10px] text-muted-foreground font-medium mt-1.5 leading-relaxed italic line-clamp-2">
                                     {tool.reason}
                                   </p>
                                 </div>
                               </div>
                               <div className="pt-4 flex items-center gap-2 text-[7px] font-black uppercase text-white/20 tracking-widest border-t border-white/5 mt-4">
                                 <Globe className="w-2.5 h-2.5" />
                                 {tool.url.replace('https://', '').split('/')[0]}
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
            <div className="flex gap-4 w-full animate-pulse">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
               </div>
               <div className="h-14 bg-white/5 border border-white/5 rounded-2xl w-32" />
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-30 group-focus-within:opacity-100 transition-opacity duration-700" />
        
        <form onSubmit={handleSearch} className="relative flex items-center bg-[#121117] border border-white/10 rounded-[2.5rem] p-2 pr-4 shadow-2xl transition-all group-focus-within:border-primary/50">
          <div className="p-4 pl-6">
            <Sparkles className={cn("w-6 h-6 transition-all duration-700", loading ? "text-primary animate-pulse scale-125" : "text-primary/40 group-hover:text-primary")} />
          </div>
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={messages.length === 0 ? "Ask Ouneo... (e.g. 'I need to make a logo')" : "Reply to Ouneo..."}
            className="flex-1 bg-transparent border-none text-base sm:text-lg font-bold text-white placeholder:text-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 h-16"
          />
          {messages.length > 0 && !loading && (
            <button type="button" onClick={clearChat} className="p-2 mr-2 text-white/20 hover:text-white transition-colors" title="Clear Chat">
              <X className="w-5 h-5" />
            </button>
          )}
          <Button 
            disabled={loading || !query.trim()}
            type="submit"
            className="rounded-full w-12 h-12 bg-white text-black hover:bg-primary hover:text-white transition-all shadow-lg shadow-white/5 p-0"
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

      {messages.length === 0 && (
        <div className="flex justify-center gap-2 pt-4">
           <button onClick={() => setQuery("How can you help me?")} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase text-white/40 hover:text-white hover:bg-white/10 transition-all">How can you help me?</button>
           <button onClick={() => setQuery("Show me the best AI tools")} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase text-white/40 hover:text-white hover:bg-white/10 transition-all">Best AI Tools</button>
        </div>
      )}
    </section>
  );
}
