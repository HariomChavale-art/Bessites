
'use client';

import { useMemo, useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useDoc, useAuth } from "@/firebase";
import { collection, query, orderBy, doc, limit } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  CreditCard, 
  Smartphone, 
  Globe, 
  Loader2, 
  ChevronRight, 
  Menu, 
  LogOut, 
  BarChart3, 
  Users, 
  Flame, 
  Settings, 
  HelpCircle,
  Download,
  ReceiptText
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const CURRENCIES = {
  US: { code: 'USD', symbol: '$' },
  IN: { code: 'INR', symbol: '₹' },
};

export default function WalletPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const userDocRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);
  const { data: profile } = useDoc(userDocRef);

  const transactionsRef = useMemo(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "transactions"), orderBy("timestamp", "desc"), limit(20));
  }, [user, db]);
  const { data: transactions, loading: transLoading } = useCollection(transactionsRef);

  const walletStats = useMemo(() => {
    if (!transactions) return { totalSpend: 0, totalDeposits: 0 };
    const spend = transactions.filter((t: any) => t.type === 'spend').reduce((acc: number, curr: any) => acc + curr.amount, 0);
    const deposits = transactions.filter((t: any) => t.type === 'deposit').reduce((acc: number, curr: any) => acc + curr.amount, 0);
    return { totalSpend: spend, totalDeposits: deposits };
  }, [transactions]);

  const handleLogout = async () => {
    if (auth) { await signOut(auth); router.push("/"); }
  };

  if (!isMounted || authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  const currencySymbol = profile?.currency === 'INR' ? '₹' : '$';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-10 px-2"><Link href="/" className="group block"><div className="flex flex-col items-start gap-1"><span className="text-2xl font-black italic uppercase tracking-tighter text-white">Bessites</span><span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">Creator Studio</span></div></Link></div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
        <SidebarItem icon={Globe} label="My Websites" active={pathname === '/my-websites'} onClick={() => router.push('/my-websites')} />
        <SidebarItem icon={BarChart3} label="Analytics" active={pathname === '/analytics'} onClick={() => router.push('/analytics')} />
        <SidebarItem icon={Users} label="Audience" active={pathname === '/audience'} onClick={() => router.push('/audience')} />
        <SidebarItem icon={Flame} label="Promotions" active={pathname === '/promotions'} onClick={() => router.push('/promotions')} />
        <SidebarItem icon={Wallet} label="Wallet" active={pathname === '/wallet'} onClick={() => router.push('/wallet')} />
        <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
          <SidebarItem icon={Settings} label="Settings" active={pathname === '/profile'} onClick={() => router.push('/profile')} />
          <SidebarItem icon={HelpCircle} label="Support" active={pathname === '/support'} onClick={() => router.push('/support')} />
        </div>
      </nav>
      <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all group">
         <LogOut className="w-5 h-5" /> <span className="text-sm font-bold">Logout</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white font-body antialiased flex flex-col lg:flex-row">
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 p-8 flex-col border-r border-white/5 bg-[#0D0C12] z-50"><SidebarContent /></aside>
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B0A0F]">
        <header className="lg:hidden flex items-center justify-between p-4 sticky top-0 bg-[#0B0A0F]/80 backdrop-blur-xl z-50 border-b border-white/5">
          <Link href="/" className="text-xl font-black italic uppercase tracking-tighter text-white">Bessites</Link>
          <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5"><Menu className="w-5 h-5" /></Button></SheetTrigger><SheetContent side="left" className="bg-[#0D0C12] p-6 w-80"><SidebarContent /></SheetContent></Sheet>
        </header>

        <div className="p-4 sm:p-8 md:p-12 space-y-12">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Bessites Wallet</h1>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">Financial Control Center</p>
            </div>
            <Link href="/wallet/add-funds" className="w-full sm:w-auto">
              <Button className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-2xl px-10 font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105">
                <Plus className="w-4 h-4 mr-2" /> Add Funds
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary to-[#5B13E6] border-none p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32" />
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10"><Wallet className="w-5 h-5 text-white" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Current Balance</span>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-5xl font-black italic tracking-tighter text-white">{currencySymbol}{(profile?.walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Available for promotions</p>
                  </div>
               </div>
            </Card>
            
            <WalletStat label="Total Promos Spend" value={`${currencySymbol}${walletStats.totalSpend.toLocaleString()}`} icon={ArrowUpRight} color="text-rose-400" />
            <WalletStat label="Total Deposits" value={`${currencySymbol}${walletStats.totalDeposits.toLocaleString()}`} icon={ArrowDownLeft} color="text-emerald-400" />
          </div>

          <div className="bg-[#121117] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl bg-primary/10 text-primary"><History className="w-5 h-5" /></div>
                   <h3 className="text-xl font-black italic uppercase tracking-tighter">Transaction History</h3>
                </div>
                <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-[9px] font-black uppercase gap-2"><Download className="w-3.5 h-3.5" /> Export Statement</Button>
             </div>
             
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[800px]">
                   <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                      <tr><th className="p-8">Description</th><th className="p-8">Type</th><th className="p-8">Method</th><th className="p-8">Date</th><th className="p-8">Amount</th><th className="p-8 text-center">Receipt</th></tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {transLoading ? (
                        <tr><td colSpan={6} className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
                      ) : transactions && transactions.length > 0 ? (
                        transactions.map(t => (
                          <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                             <td className="p-8">
                                <div className="flex flex-col gap-1">
                                   <span className="text-sm font-black italic text-white">{t.description}</span>
                                   <span className="text-[10px] text-muted-foreground/40 font-black uppercase">Ref: {t.orderId}</span>
                                </div>
                             </td>
                             <td className="p-8">
                                <Badge className={cn("uppercase text-[8px] font-black border-none px-3 py-1 rounded-full", 
                                  t.type === 'deposit' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                                  {t.type}
                                </Badge>
                             </td>
                             <td className="p-8"><span className="text-[10px] font-black uppercase text-white/40">{t.method}</span></td>
                             <td className="p-8"><span className="text-xs font-bold text-white/60">{t.timestamp ? new Date(t.timestamp.toDate()).toLocaleDateString() : 'Just now'}</span></td>
                             <td className="p-8"><span className={cn("text-sm font-black italic", t.type === 'deposit' ? "text-emerald-400" : "text-white")}>{t.type === 'deposit' ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}</span></td>
                             <td className="p-8 text-center"><button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground/40 hover:text-white transition-colors"><ReceiptText className="w-4 h-4" /></button></td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} className="p-32 text-center text-muted-foreground italic font-medium opacity-20">No transactions recorded in your ledger.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function WalletStat({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <Card className="bg-[#121117] border-white/5 p-8 rounded-[2.5rem] shadow-xl group hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between cursor-default">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] blur-3xl -mr-16 -mt-16" />
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={cn("p-4 rounded-2xl bg-white/5 transition-all group-hover:scale-110", color)}><Icon className="w-6 h-6" /></div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mb-1">{label}</p>
        <h4 className="text-3xl font-black italic tracking-tighter text-white tabular-nums leading-none">{value}</h4>
      </div>
    </Card>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all group text-left relative overflow-hidden", active ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" : "text-muted-foreground/60 hover:text-white hover:bg-white/5")}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(123,51,255,1)]" />}
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "group-hover:text-white")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}
