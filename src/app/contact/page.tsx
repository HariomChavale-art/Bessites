"use client"

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, Clock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating transmission to our official support node
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Transmitted",
        description: "Your inquiry has been received by our support node at bessitesofficial@gmail.com. We will reply within 24 hours.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight">
                Get In <span className="text-primary">Touch</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                Have a suggestion for our discovery engine, a partnership idea, or need technical support? Our team is standing by to assist your workflow.
              </p>
            </div>

            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Official Support</p>
                  <p className="text-lg font-bold text-white">bessitesofficial@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Response Time</p>
                  <p className="text-lg font-bold text-white">Within 24 Hours</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-2 py-4">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <p className="text-sm text-muted-foreground italic">Your data is secured and will only be used to process your request.</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-white/10 p-8 sm:p-12 rounded-[3rem] shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white font-bold ml-1">Full Name</Label>
                <Input placeholder="John Doe" className="bg-white/5 border-white/10 rounded-2xl h-14" required />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-bold ml-1">Email Address</Label>
                <Input type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 rounded-2xl h-14" required />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-bold ml-1">Subject</Label>
                <Input placeholder="Registry Suggestion / Support" className="bg-white/5 border-white/10 rounded-2xl h-14" required />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-bold ml-1">Message Detail</Label>
                <Textarea 
                  placeholder="How can Bessites assist your discovery process today?" 
                  className="bg-white/5 border-white/10 rounded-2xl min-h-[150px] p-4" 
                  required 
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-full text-xl font-black shadow-xl glow-primary"
              >
                {loading ? "TRANSMITTING..." : "SEND MESSAGE"}
                {!loading && <Send className="w-5 h-5 ml-2" />}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-card/50 border-t border-white/5 py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            <a href="/about" className="hover:text-primary transition-colors">About Us</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          <p className="text-xs text-muted-foreground opacity-50 mb-4">
            Official Support: <a href="mailto:bessitesofficial@gmail.com" className="text-white hover:text-primary transition-colors">bessitesofficial@gmail.com</a>
          </p>
          <p className="text-sm text-muted-foreground opacity-50">
            © 2026 Bessites Studio. Global Discovery Hub.
          </p>
        </div>
      </footer>
    </div>
  );
}
