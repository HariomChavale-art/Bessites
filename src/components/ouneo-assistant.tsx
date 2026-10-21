
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useAuth } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
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
  User as UserIcon,
  Lock,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Fuse from 'fuse.js';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  matches?: any[];
}

export function OuneoAssistant() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch sites for Free local search
  const sitesRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), where("status", "==", "approved"));
  }, [db]);
  const { data: registry } = useCollection(sitesRef);

  // Initialize Fuse.js for local search
  const fuse = useMemo(() => {
    if (!registry) return null;
    return new Fuse(registry, {
      keys: ['websiteName', 'name', 'description', 'categories'],
      threshold: 0.4
    });
  }, [registry]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, loading]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || loading) return;

    if (searchCount >= 3 && !user?.isPro) {
      setShowPaywall(true);
      return;
    }

    const currentQuery = userInput;
    setUserInput('');
    setLoading(true);

    const newUserMessage: ChatMessage = { role: 'user', content: currentQuery };
    setMessages(prev => [...prev, newUserMessage]);

    // Check if user is Pro
    // Note: isPro check should ideally be from Firestore user doc, assuming user object has it or we fetch it.
    // For this prototype, we'll check a simulated isPro property.
    const isPro = (user as any)?.isPro === true;

    if (isPro) {
      // PRO: Server-side AI
      try {
        const idToken = await auth?.currentUser?.getIdToken();
        const res = await fetch('/api/ouneo', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            message: currentQuery,
            history: messages.map(m => ({ role: m.role, content: m.content }))
          })
        });
        
        const data = await res.json();
        if (data.error === 'PRO_ONLY') {
          setShowPaywall(true);
        } else {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.response,
            matches: data.matches 
          }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Something broke. Try again?" }]);
      }
    } else {
      // FREE: Local Search
      setSearchCount(prev => prev + 1);
      const results = fuse?.search(currentQuery).slice(0, 3) || [];
      const humanResults = results.map(r => ({
        name: r.item.websiteName || r.item.name,
        url: r.item.url,
        category: r.item.categories?.[0] || 'Web',
        reason: (r.item.description || '').slice(0, 50) + '...'
      }));

      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: results.length > 0 ? "Check these out. Anything else?" : "No site for that yet. What are you trying to do?",
          matches: humanResults
        }]);
        setLoading(false);
      }, 600);
      return;
    }

    setLoading(false);
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

                  {msg.matches && msg.matches.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-500">
                      {msg.matches.map((site, sIdx) => (
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
                            <p className="text-xs text-muted-foreground font-medium italic line-clamp-1">
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
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Search for a site..."
            className="flex-1 bg-transparent border-none text-base sm:text-lg font-bold text-white placeholder:text-white/10 focus-visible:ring-0 h-14"
          />
          <Button 
            disabled={loading || !userInput.trim()}
            type="submit"
            className="rounded-full w-12 h-12 bg-white text-black hover:bg-primary hover:text-white transition-all shadow-xl p-0"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
          </Button>
        </form>
      </div>

      {/* Free User Banner */}
      {!(user as any)?.isPro && (
        <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-white/5 p-6 rounded-[2rem] text-center space-y-4">
           <div className="flex items-center justify-center gap-3 text-primary">
              <Crown className="w-5 h-5" />
              <p className="text-xs font-black uppercase tracking-widest italic">Ouneo Intelligence Node</p>
           </div>
           <p className="text-sm text-zinc-300 font-medium">Want Ouneo to ask you questions and find the perfect site?</p>
           <Link href="/promotions">
             <Button className="h-10 px-8 rounded-full bg-primary text-white font-black text-xs uppercase italic mt-2">GO PRO $20</Button>
           </Link>
        </Card>
      )}

      {/* Paywall Popup */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <Card className="bg-[#121117] border-primary/30 p-10 rounded-[3rem] max-w-sm w-full text-center space-y-8 shadow-[0_0_50px_rgba(123,51,255,0.2)]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                 <Lock className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">AI Ouneo is Pro only</h3>
                 <p className="text-zinc-400 text-sm font-medium">Upgrade to access conversational discovery and clarifying questions.</p>
              </div>
              <div className="flex flex-col gap-3">
                 <Button onClick={() => window.location.href='/promotions'} className="h-14 rounded-2xl bg-primary text-white font-black italic uppercase shadow-xl">GO PRO NOW</Button>
                 <Button variant="ghost" onClick={() => setShowPaywall(false)} className="text-white/40 font-bold uppercase text-[10px]">Maybe later</Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';
