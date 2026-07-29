'use client';

import { 
  Info, 
  Mail, 
  FileText, 
  ShieldCheck, 
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Globe,
  BarChart3,
  Users,
  Flame,
  Wallet,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

export default function SupportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) { await signOut(auth); router.push("/"); }
  };

  const supportOptions = [
    { icon: Info, label: "About Us", description: "Our mission and story.", href: "/about" },
    { icon: Mail, label: "Contact Support", description: "Help and feedback.", href: "/contact" },
    { icon: FileText, label: "Privacy Policy", description: "Our data usage and privacy policies.", href: "/privacy" },
    { icon: ShieldCheck, label: "Terms of Service", description: "Usage terms.", href: "/terms" },
  ];

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

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
          <SidebarItem icon={SettingsIcon} label="Settings" active={pathname === '/settings'} onClick={() => router.push('/settings')} />
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
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Support Center</h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">Help & Legal Resources</p>
          </div>

          <div className="max-w-2xl space-y-4">
            {supportOptions.map((option, idx) => (
              <Card key={idx} onClick={() => router.push(option.href)} className="bg-[#121117] border-white/5 p-6 rounded-[2rem] hover:bg-white/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                    <option.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{option.label}</h3>
                    <p className="text-xs text-muted-foreground italic">{option.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-20 group-hover:opacity-100 transition-all" />
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-[#121117] border border-white/5 p-10 rounded-[3rem] text-center space-y-6">
             <MessageSquare className="w-12 h-12 text-primary mx-auto opacity-20" />
             <div className="space-y-2">
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Need more help?</h3>
                <p className="text-muted-foreground text-sm font-medium">Our team is available 24/7 to assist with your discovery experience.</p>
             </div>
             <Button onClick={() => router.push('/contact')} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase text-xs">Open a Ticket</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all group text-left", active ? "text-white bg-gradient-to-r from-primary/40 to-transparent shadow-lg" : "text-muted-foreground/60 hover:text-white hover:bg-white/5")}>
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "group-hover:text-white")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}
