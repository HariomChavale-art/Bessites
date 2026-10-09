"use client"

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, Clock, ShieldCheck, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Transmitted",
        description: "Your inquiry has been received. We will reply within 24-48 hours.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight">
                Contact <span className="text-primary">Us</span>
              </h1>
              <div className="space-y-4 text-xl text-muted-foreground font-medium italic">
                <p>
                  Have a suggestion for our discovery engine, a partnership idea, or need technical support? Our team is standing by to assist your workflow.
                </p>
                <p>
                  We prioritize inquiries from verified creators and high-velocity teams who are looking to scale their digital properties within the Bessites ecosystem.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ContactBox icon={Mail} label="Email Support" value="support@bessites.store" />
              <ContactBox icon={MapPin} label="Location" value="India" />
              <ContactBox icon={Clock} label="Response Time" value="24-48 Hours" />
              <ContactBox icon={ShieldCheck} label="Verification" value="Secure Node" />
            </div>
          </div>

          <div className="bg-card border border-white/10 p-8 sm:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <Label className="text-white font-bold ml-1 text-xs uppercase tracking-widest opacity-40">Full Name</Label>
                <Input placeholder="John Doe" className="bg-white/5 border-white/10 rounded-2xl h-14" required />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-bold ml-1 text-xs uppercase tracking-widest opacity-40">Email Address</Label>
                <Input type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 rounded-2xl h-14" required />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-bold ml-1 text-xs uppercase tracking-widest opacity-40">Message Detail</Label>
                <Textarea 
                  placeholder="How can we assist your discovery process?" 
                  className="bg-white/5 border-white/10 rounded-2xl min-h-[180px] p-4 text-sm italic" 
                  required 
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-full text-xl font-black shadow-xl glow-primary italic"
              >
                {loading ? "TRANSMITTING..." : "SEND MESSAGE"}
                {!loading && <Send className="w-5 h-5 ml-2" />}
              </Button>
            </form>
          </div>
        </div>

        <section className="mt-32 max-w-3xl mx-auto space-y-12">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white text-center">Support FAQ</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-white/5 bg-white/[0.02] px-6 rounded-3xl">
              <AccordionTrigger className="text-white font-bold italic hover:no-underline uppercase text-sm tracking-widest">How do I report a website?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground italic">
                If you find a broken link or inappropriate content, please email us directly with the URL of the listing. Our moderation node will review it within 12 hours.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-white/5 bg-white/[0.02] px-6 rounded-3xl">
              <AccordionTrigger className="text-white font-bold italic hover:no-underline uppercase text-sm tracking-widest">How long to get a reply?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground italic">
                Our standard response time is 24-48 hours. Verified creators often receive faster priority responses.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-white/5 bg-white/[0.02] px-6 rounded-3xl">
              <AccordionTrigger className="text-white font-bold italic hover:no-underline uppercase text-sm tracking-widest">Can I delete my account?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground italic">
                Yes, you can manage your data and submissions from your Profile Hub. For full account deletion, contact support.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-white/5 bg-white/[0.02] px-6 rounded-3xl">
              <AccordionTrigger className="text-white font-bold italic hover:no-underline uppercase text-sm tracking-widest">How do I advertise?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground italic">
                You can fund your Wallet directly from the dashboard and launch self-serve promotions for any of your approved submissions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 italic">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>
          <p className="text-xs text-muted-foreground opacity-20 font-black uppercase tracking-widest">© 2024 Bessites Studio. Powered by Bessites.</p>
        </div>
      </footer>
    </div>
  );
}

function ContactBox({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
      <div className="flex items-center gap-3 text-primary">
        <Icon className="w-5 h-5" />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</span>
      </div>
      <p className="text-white font-bold italic text-lg">{value}</p>
    </div>
  )
}
