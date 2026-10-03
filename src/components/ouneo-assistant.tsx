'use client';

import { useState, useRef, useEffect } from 'react';
import { askOuneo, OuneoOutput } from '@/ai/flows/ouneo-flow';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Search, 
  Loader2, 
  ArrowRight, 
  ExternalLink, 
  X,
  Zap,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function OuneoAssistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OuneoOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await askOuneo({ message: query });
      setResult(data);
      // Scroll to results on mobile
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError("Ouneo is recalibrating. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setQuery('');
  };

  return (
    <section className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="relative group">
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity duration-700" />
        
        <form onSubmit={handleSearch} className="relative flex items-center bg-[#121117] border border-white/10 rounded-[2.5rem] p-2 pr-4 shadow-2xl transition-all group-focus-within:border-primary/50">
          <div className="p-4 pl-6">
            <Sparkles className={cn("w-6 h-6 transition-all duration-700", loading ? "text-primary animate-pulse scale-125" : "text-primary/40 group-hover:text-primary")} />
          </div>
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Ouneo... (e.g. 'I need to remove background from image')"
            className="flex-1 bg-transparent border-none text-lg sm:text-xl font-bold text-white placeholder:text-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 h-16"
          />
          {query && !loading && (
            <button type="button" onClick={clearResults} className="p-2 mr-2 text-white/20 hover:text-white transition-colors">
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

      <div ref={resultsRef} className="space-y-6">
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
             <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Synchronizing Discovery Node...</p>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles className="w-24 h-24 text-primary" /></div>
               <p className="text-lg text-white/90 font-medium italic leading-relaxed relative z-10">
                 "{result.response}"
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.matches.map((tool, idx) => (
                <Card 
                  key={idx} 
                  className="bg-[#121117] border-white/5 hover:border-primary/40 transition-all p-6 rounded-[2rem] flex flex-col justify-between group shadow-xl hover:shadow-primary/5 cursor-pointer relative overflow-hidden"
                  onClick={() => window.open(tool.url, '_blank')}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                       <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase italic">{tool.category}</Badge>
                       <ExternalLink className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{tool.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed italic">
                        {tool.reason}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 flex items-center gap-2 text-[8px] font-black uppercase text-white/20 tracking-widest border-t border-white/5 mt-6">
                    <Globe className="w-3 h-3" />
                    {tool.url.replace('https://', '').split('/')[0]}
                  </div>
                </Card>
              ))}
            </div>

            {result.matches.length === 0 && !loading && (
              <div className="py-20 text-center bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                <Zap className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                <p className="text-xl font-black italic uppercase tracking-tighter text-white/40">Zero Matches Found</p>
                <p className="text-sm text-muted-foreground mt-2">Try broader terms like "Image Generator" or "Code Editor"</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center italic">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
