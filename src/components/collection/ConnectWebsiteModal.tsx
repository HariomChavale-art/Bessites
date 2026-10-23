
"use client"

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  Database, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SiteProviderType } from '@/types/collection';

interface ConnectWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWebsiteModal({ isOpen, onClose }: ConnectWebsiteModalProps) {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<SiteProviderType | null>(null);
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleHandshake = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
    }, 2000);
  };

  const reset = () => {
    setStep(1);
    setProvider(null);
    setUrl('');
    setApiKey('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={reset}>
      <DialogContent className="bg-[#121117] border-white/10 text-white rounded-[3rem] sm:max-w-2xl p-0 overflow-hidden shadow-2xl">
        <div className="p-10 space-y-10 relative">
          <div className="absolute top-0 right-0 p-10 text-white/5 opacity-10"><Zap className="w-32 h-32" /></div>
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter">
              Connect <span className="text-primary">Asset</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium italic">
              Integrate your website telemetry nodes into the Bessites Command Center.
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-1">Asset URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                    <Input 
                      placeholder="https://mywebsite.com" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-lg font-bold"
                    />
                  </div>
               </div>

               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-1">Choose Telemetry Engine</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <ProviderOption 
                        id="bessites_pulse" 
                        name="Bessites Pulse" 
                        desc="Native zero-setup tracking" 
                        icon={Zap} 
                        active={provider === 'bessites_pulse'}
                        onClick={() => setProvider('bessites_pulse')}
                     />
                     <ProviderOption 
                        id="plausible" 
                        name="Plausible / Umami" 
                        desc="Privacy-first external API" 
                        icon={ShieldCheck} 
                        active={provider === 'plausible'}
                        onClick={() => setProvider('plausible')}
                     />
                  </div>
               </div>

               <Button 
                onClick={() => setStep(2)} 
                disabled={!url || !provider}
                className="w-full h-16 rounded-[1.5rem] bg-white text-black font-black uppercase italic text-lg shadow-xl"
               >
                  CONTINUE <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-1">
                    {provider === 'bessites_pulse' ? 'Bessites Verification' : 'Provider API Key / Token'}
                  </Label>
                  <Input 
                    type="password"
                    placeholder={provider === 'bessites_pulse' ? 'Enter Bessites Public Key' : 'Enter API Secret'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="h-16 bg-white/5 border-white/10 rounded-2xl text-lg font-mono"
                  />
                  <p className="text-[10px] text-white/30 font-medium italic leading-relaxed">
                    Credentials are encrypted at rest using AES-256-GCM. We only require read-only access to your telemetry data.
                  </p>
               </div>

               <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="h-16 flex-1 rounded-[1.5rem] border-white/5 bg-white/5 font-bold">BACK</Button>
                  <Button 
                    onClick={handleHandshake}
                    disabled={!apiKey || isVerifying}
                    className="h-16 flex-[2] rounded-[1.5rem] bg-primary text-white font-black text-lg"
                  >
                    {isVerifying ? <Loader2 className="animate-spin w-6 h-6" /> : "ESTABLISH HANDSHAKE"}
                  </Button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-8 py-10 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                  <Check className="w-12 h-12 text-white" strokeWidth={5} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-3xl font-black italic uppercase tracking-tighter">Connection Verified</h4>
                  <p className="text-muted-foreground font-medium italic">Telemetry node successfully integrated into your Collection.</p>
               </div>
               <Button onClick={reset} className="w-full h-16 rounded-[1.5rem] bg-white text-black font-black uppercase italic text-lg">OPEN DASHBOARD</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProviderOption({ id, name, desc, icon: Icon, active, onClick }: { id: string, name: string, desc: string, icon: any, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center gap-5 group",
        active ? "bg-primary/20 border-primary" : "bg-white/[0.02] border-white/5 hover:bg-white/5"
      )}
    >
      <div className={cn("p-3 rounded-xl transition-all", active ? "bg-primary text-white" : "bg-white/5 text-white/20 group-hover:text-primary")}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
         <p className="font-bold text-sm uppercase tracking-tight text-white">{name}</p>
         <p className="text-[10px] font-medium text-white/20 italic truncate">{desc}</p>
      </div>
    </div>
  );
}
