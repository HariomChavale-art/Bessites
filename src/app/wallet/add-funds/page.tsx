'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useUser, useDoc, useCollection, useStorage } from "@/firebase";
import { collection, doc, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  ChevronLeft, 
  Wallet, 
  Check, 
  Loader2, 
  Copy, 
  QrCode, 
  Info, 
  ArrowRight,
  ShieldCheck,
  History,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddFundsPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transId, setTransId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Real Profile & Transactions
  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);
  const { data: profile } = useDoc(userDocRef);

  const transactionsRef = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "transactions"), orderBy("timestamp", "desc"), limit(10));
  }, [user, db]);
  const { data: transactions, loading: transLoading } = useCollection(transactionsRef);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleManualSubmit = async () => {
    if (!db || !user || !transId || !amount) {
      toast({ 
        variant: "destructive", 
        title: "Missing Info", 
        description: "Amount and Transaction ID are required for verification." 
      });
      return;
    }

    setIsSubmitting(true);
    let screenshotUrl = "";

    try {
      // 1. Upload Screenshot if exists
      if (selectedFile && storage) {
        const fileRef = ref(storage, `screenshots/${user.uid}/${Date.now()}-${selectedFile.name}`);
        await uploadBytes(fileRef, selectedFile);
        screenshotUrl = await getDownloadURL(fileRef);
      }

      // 2. Create Pending Transaction
      const transactionData = {
        userId: user.uid,
        type: 'deposit',
        amount: parseFloat(amount),
        currency: 'INR',
        description: `Wallet Deposit (Manual)`,
        status: 'pending', // Verification needed
        method: 'UPI QR',
        orderId: transId,
        screenshotUrl,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, "users", user.uid, "transactions"), transactionData);

      setIsSubmitting(false);
      setIsModalOpen(false);
      setShowSuccess(true);
      setAmount("");
      setTransId("");
      setSelectedFile(null);
      
      // Auto-dismiss success after 8 seconds
      setTimeout(() => setShowSuccess(false), 8000);
    } catch (e) {
      setIsSubmitting(false);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'transactions',
        operation: 'create'
      }));
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white font-body antialiased p-4 sm:p-8 md:p-12 pb-32">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex items-center justify-between">
           <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-white gap-2 font-bold group">
             <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Studio
           </Button>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(123,51,255,1)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Secure Node Verified</span>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Balance & Promo */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Wallet Balance Card */}
            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary to-[#5B13E6] p-10 rounded-[3rem] shadow-2xl shadow-primary/20 group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
               <div className="relative z-10 flex justify-between items-start">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl w-fit px-4 py-2 rounded-2xl border border-white/10">
                      <Wallet className="w-5 h-5 text-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Available Balance</span>
                    </div>
                    <h2 className="text-6xl sm:text-7xl font-black italic tracking-tighter text-white tabular-nums leading-none">
                      ₹{(profile?.walletBalance || 0).toLocaleString()}
                    </h2>
                  </div>
                  <Sparkles className="w-10 h-10 text-white/20 animate-pulse" />
               </div>
            </Card>

            {/* Promotion Info Card */}
            <Card className="bg-[#121117] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
               <div className="flex items-start gap-6">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0 group-hover:scale-110 transition-transform">
                     <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-3">
                        <h4 className="text-lg font-black italic uppercase text-white">Featured Promotion</h4>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-0.5 text-[9px] font-black italic uppercase">Best Value</Badge>
                     </div>
                     <p className="text-sm font-medium text-muted-foreground/60 leading-relaxed">
                       <span className="text-white font-bold">₹100 = Top Position for 3 Days.</span> Reach up to 15k+ discovery intent users with our premium AI-driven placement engine. Boost your momentum instantly.
                     </p>
                  </div>
               </div>
            </Card>
          </div>

          {/* Right Column: Payment Method */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="bg-[#121117] border border-white/5 p-10 rounded-[3rem] space-y-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
               
               <div className="space-y-2 text-center">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Payment Method</h3>
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                     <ShieldCheck className="w-4 h-4" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em]">UPI QR Payment Enabled</span>
                  </div>
               </div>

               <div className="flex flex-col items-center gap-8">
                  <div className="relative group">
                     <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     <div className="relative w-56 h-56 bg-white rounded-3xl p-4 shadow-2xl overflow-hidden flex items-center justify-center">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=upi://pay?pa=hariomchavale@ybl&pn=Hariom%20Chavale&cu=INR`}
                          alt="UPI QR Code"
                          className="w-full h-full"
                          data-ai-hint="UPI QR Code"
                        />
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                           <QrCode className="w-8 h-8 text-black opacity-40" />
                        </div>
                     </div>
                  </div>

                  <div className="w-full">
                     <p className="text-[10px] text-center text-muted-foreground/40 font-bold italic">Scan the QR code above with any UPI app to pay.</p>
                  </div>
               </div>

               <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                     <Button className="w-full h-20 rounded-[2rem] bg-white text-black hover:bg-white/90 font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                        I'VE PAID <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#121117] border-white/10 text-white rounded-[2.5rem] sm:max-w-md p-0 overflow-hidden shadow-2xl">
                     <div className="p-10 space-y-8">
                        <div className="space-y-2">
                           <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Submit <span className="text-primary">Receipt</span></DialogTitle>
                           <p className="text-sm text-muted-foreground font-medium">Verify your transaction to credit your wallet.</p>
                        </div>

                        <div className="space-y-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Amount Paid (₹)</label>
                              <Input 
                                type="number"
                                placeholder="e.g. 500" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold"
                              />
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Transaction ID (Ref No.)</label>
                              <Input 
                                placeholder="e.g. 405612349876" 
                                value={transId}
                                onChange={(e) => setTransId(e.target.value)}
                                className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold"
                              />
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Payment Screenshot (Optional)</label>
                              <div 
                                onClick={() => document.getElementById('file-upload')?.click()}
                                className="h-32 rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-primary/20 transition-all group"
                              >
                                {selectedFile ? (
                                  <div className="flex items-center gap-3 text-emerald-400 font-bold">
                                    <CheckCircle2 className="w-5 h-5" /> {selectedFile.name.slice(0, 20)}...
                                  </div>
                                ) : (
                                  <>
                                    <ImageIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-xs font-bold text-muted-foreground/40 mt-2">Upload Receipt</span>
                                  </>
                                )}
                              </div>
                              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                           </div>
                        </div>

                        <Button 
                          onClick={handleManualSubmit}
                          disabled={!transId || !amount || isSubmitting}
                          className="w-full h-16 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black text-lg"
                        >
                           {isSubmitting ? <Loader2 className="animate-spin" /> : "CONFIRM SUBMISSION"}
                        </Button>
                     </div>
                  </DialogContent>
               </Dialog>
            </Card>
          </div>
        </div>

        {/* Success Feedback Section */}
        {showSuccess && (
          <div className="animate-in zoom-in slide-in-from-top-4 duration-700">
             <Card className="bg-emerald-500/10 border-emerald-500/20 p-10 rounded-[3rem] flex flex-col sm:flex-row items-center gap-8 shadow-2xl shadow-emerald-500/5">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-xl shadow-emerald-500/20 animate-bounce">
                   <Check className="w-10 h-10 text-white" strokeWidth={5} />
                </div>
                <div className="text-center sm:text-left space-y-2">
                   <h4 className="text-2xl font-black italic uppercase tracking-tighter text-emerald-400">Payment Submitted Successfully!</h4>
                   <p className="text-sm font-medium text-emerald-400/60 leading-relaxed">
                     Verification usually takes <span className="text-emerald-400 font-black">less than 6 hours</span>. You will receive an email and your balance will update automatically once approved by our finance nodes.
                   </p>
                </div>
             </Card>
          </div>
        )}

        {/* Recent Transactions Section */}
        <div className="space-y-8">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-white/5"><History className="w-5 h-5 text-muted-foreground/40" /></div>
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter">Recent Registry</h3>
              </div>
              <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 text-[9px] font-black uppercase gap-2"><ArrowRight className="w-3.5 h-3.5" /> View Ledger</Button>
           </div>

           <div className="bg-[#121117] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto no-scrollbar">
                 <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                       <tr><th className="p-8">Identification</th><th className="p-8">Gate</th><th className="p-8">Timeline</th><th className="p-8">Volume</th><th className="p-8 text-center">Status</th><th className="p-8 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {transLoading ? (
                         <tr><td colSpan={6} className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                       ) : transactions && transactions.length > 0 ? (
                         transactions.map(t => (
                           <tr key={t.id} className="group hover:bg-white/[0.02] transition-all duration-300">
                              <td className="p-8">
                                 <div className="flex flex-col gap-1">
                                    <span className="text-sm font-black italic text-white group-hover:text-primary transition-colors">Deposit Ref: {t.orderId}</span>
                                    <span className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-widest">Internal Node ID: {t.id?.slice(0, 8)}</span>
                                 </div>
                              </td>
                              <td className="p-8"><span className="text-[10px] font-black uppercase text-white/40">{t.method}</span></td>
                              <td className="p-8"><span className="text-xs font-bold text-white/40">{t.timestamp ? new Date(t.timestamp.toDate()).toLocaleDateString() : 'Syncing...'}</span></td>
                              <td className="p-8"><span className="text-sm font-black italic text-emerald-400">+₹{t.amount?.toLocaleString()}</span></td>
                              <td className="p-8 text-center">
                                 <Badge className={cn(
                                   "uppercase text-[8px] font-black border-none px-4 py-1.5 rounded-full transition-all",
                                   t.status === 'pending' ? "bg-amber-500/10 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]" : 
                                   t.status === 'completed' || t.status === 'approved' ? "bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : 
                                   "bg-red-500/10 text-red-500"
                                 )}>
                                   {t.status}
                                 </Badge>
                              </td>
                              <td className="p-8 text-right">
                                 <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground/40 hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                              </td>
                           </tr>
                         ))
                       ) : (
                         <tr><td colSpan={6} className="p-32 text-center text-muted-foreground italic font-medium opacity-20">The ledger is currently silent. Synchronize your first deposit.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
