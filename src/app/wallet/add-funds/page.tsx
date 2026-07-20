
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useUser, useDoc } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { 
  ChevronLeft, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Check, 
  Loader2, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const PRESET_AMOUNTS = [10, 25, 50, 100];

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI Instant', icon: Smartphone, desc: 'GPay, PhonePe, Paytm', regions: ['IN'], category: 'upi' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay', regions: ['ALL'], category: 'card' },
  { id: 'apple', name: 'Apple Pay', icon: Globe2, desc: 'Express Checkout', regions: ['US', 'EU', 'GB'], category: 'wallet' },
  { id: 'paypal', name: 'PayPal', icon: Wallet, desc: 'International Balance', regions: ['ALL'], category: 'wallet' },
];

export default function AddFundsPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<string>("50");
  const [method, setMethod] = useState(PAYMENT_METHODS[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userCountry, setUserCountry] = useState('US');

  useEffect(() => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale.includes('IN')) setUserCountry('IN');
  }, []);

  const filteredMethods = useMemo(() => {
    return PAYMENT_METHODS.filter(m => m.regions.includes('ALL') || m.regions.includes(userCountry));
  }, [userCountry]);

  const handleDeposit = async () => {
    if (!db || !user || !amount) return;
    setIsProcessing(true);

    const depositAmount = parseFloat(amount);
    const orderId = `DEP-${Date.now().toString().slice(-8)}`;

    const transactionData = {
      userId: user.uid,
      type: 'deposit',
      amount: depositAmount,
      currency: userCountry === 'IN' ? 'INR' : 'USD',
      description: `Wallet Deposit via ${method.name}`,
      status: 'completed',
      method: method.id,
      orderId,
      timestamp: serverTimestamp()
    };

    // Simulate Payment Gateway delay
    setTimeout(() => {
      const userRef = doc(db, "users", user.uid);
      const transRef = collection(db, "users", user.uid, "transactions");

      updateDoc(userRef, {
        walletBalance: increment(depositAmount)
      }).then(() => {
        addDoc(transRef, transactionData).then(() => {
          setIsProcessing(false);
          setStep(3);
          toast({ title: "Funds Added!", description: `Successully added ${amount} to your wallet.` });
        });
      }).catch(async (e) => {
          setIsProcessing(false);
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { walletBalance: increment(depositAmount) }
          }));
      });
    }, 2000);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white p-4 sm:p-8 md:p-12 font-body selection:bg-primary/30 antialiased">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="flex items-center justify-between">
           <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-white gap-2 font-bold transition-all hover:-translate-x-1">
             <ChevronLeft className="w-5 h-5" /> Back to Wallet
           </Button>
           <div className="flex items-center gap-3">
              {[1, 2, 3].map(s => (
                <div key={s} className={cn("w-12 h-1.5 rounded-full transition-all duration-500", s <= step ? "bg-primary shadow-[0_0_10px_rgba(123,51,255,0.5)]" : "bg-white/5")} />
              ))}
           </div>
        </header>

        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter">Enter <span className="text-primary">Amount</span></h1>
                <p className="text-muted-foreground font-medium">Select a preset or enter a custom deposit value.</p>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {PRESET_AMOUNTS.map(a => (
                  <button key={a} onClick={() => setAmount(a.toString())} className={cn("h-20 rounded-[2rem] font-black text-xl border-2 transition-all active:scale-95", amount === a.toString() ? "border-primary bg-primary/10 text-white" : "border-white/5 bg-white/5 text-muted-foreground/60 hover:border-white/20")}>
                    ${a}
                  </button>
                ))}
             </div>

             <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-primary/40 group-focus-within:text-primary transition-colors">$</div>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-24 pl-12 bg-white/[0.02] border-white/5 rounded-[2.5rem] text-4xl font-black text-white focus:ring-primary focus:border-primary transition-all"
                  placeholder="0.00"
                />
             </div>

             <Button onClick={() => setStep(2)} disabled={!amount || parseFloat(amount) <= 0} className="w-full h-20 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl shadow-primary/20 group">
                CONTINUE TO PAYMENT <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
             </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter">Payment <span className="text-primary">Method</span></h1>
                <p className="text-muted-foreground font-medium">Securely fund your creator wallet for global discovery.</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMethods.map(m => (
                  <Card key={m.id} onClick={() => setMethod(m)} className={cn("p-8 rounded-[3rem] border-2 cursor-pointer transition-all flex items-center gap-6 group relative overflow-hidden", method.id === m.id ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" : "border-white/5 bg-white/[0.02] hover:bg-white/5")}>
                    <div className={cn("p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform", method.id === m.id ? "text-primary" : "text-muted-foreground/40")}>
                      <m.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className={cn("text-xs font-black uppercase tracking-widest", method.id === m.id ? "text-white" : "text-muted-foreground/60")}>{m.name}</h4>
                       <p className="text-[10px] text-muted-foreground/40 font-bold italic mt-0.5">{m.desc}</p>
                    </div>
                    {method.id === m.id && <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={4} /></div>}
                  </Card>
                ))}
             </div>

             <Card className="bg-[#121117] border-white/5 p-10 rounded-[3.5rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
                <div className="flex justify-between items-center">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Total Deposit Amount</span>
                      <p className="text-4xl font-black italic text-white">${parseFloat(amount).toFixed(2)}</p>
                   </div>
                   <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">PCI Secure</span>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                   {method.category === 'card' && (
                     <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                        <Input placeholder="CARDHOLDER NAME" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-xs uppercase" />
                        <div className="grid grid-cols-2 gap-4">
                           <Input placeholder="CARD NUMBER" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-xs" />
                           <div className="grid grid-cols-2 gap-4">
                              <Input placeholder="MM/YY" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-xs" />
                              <Input placeholder="CVC" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-xs" />
                           </div>
                        </div>
                     </div>
                   )}
                   {method.category === 'upi' && (
                     <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                        <Input placeholder="username@okaxis" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-xs" />
                        <p className="text-[9px] font-black uppercase text-muted-foreground/40 text-center italic">Payment request will be sent to your UPI app.</p>
                     </div>
                   )}
                   {method.category === 'wallet' && (
                     <div className="py-8 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                        <p className="text-xs font-bold text-muted-foreground italic">Secure redirect to {method.name}...</p>
                     </div>
                   )}
                </div>

                <Button onClick={handleDeposit} disabled={isProcessing} className="w-full h-20 rounded-[2.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-2xl shadow-emerald-500/10 active:scale-95 transition-all">
                  {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : "SECURE PAYMENT"}
                </Button>
             </Card>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-10 animate-in zoom-in-95 duration-700">
             <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center ring-[20px] ring-emerald-500/5">
                <Check className="w-16 h-16 text-emerald-400" strokeWidth={5} />
             </div>
             <div className="text-center space-y-2">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">Funds Added!</h1>
                <p className="text-muted-foreground font-medium text-lg italic">Your balance is now synchronized across the platform.</p>
             </div>
             <Card className="bg-[#121117] border-white/5 p-10 rounded-[3.5rem] w-full max-w-md space-y-6">
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-muted-foreground uppercase opacity-40">Amount Credited</span>
                   <span className="text-primary font-black">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-muted-foreground uppercase opacity-40">Source</span>
                   <span className="text-white font-black uppercase">{method.name}</span>
                </div>
                <div className="h-px bg-white/5" />
                <Button onClick={() => router.push('/wallet')} className="w-full h-16 rounded-3xl bg-white text-black font-black uppercase text-xs">GO TO WALLET</Button>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}
