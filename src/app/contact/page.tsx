
"use client"

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you shortly.",
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
                Have a suggestion, a partnership idea, or found a bug? We're all ears.
              </p>
            </div>

            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Email Us</p>
                  <p className="text-lg font-bold text-white">contact@bessites.store</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Support</p>
                  <p className="text-lg font-bold text-white">24/7 Response Time</p>
                </div>
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
                <Label className="text-white font-bold ml-1">Your Message</Label>
                <Textarea 
                  placeholder="How can we help you?" 
                  className="bg-white/5 border-white/10 rounded-2xl min-h-[150px] p-4" 
                  required 
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-full text-xl font-black shadow-xl glow-primary"
              >
                {loading ? "Sending..." : "SEND MESSAGE"}
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
          <p className="text-sm text-muted-foreground opacity-50">
            © 2024 Bessites. Professional Discovery.
          </p>
        </div>
      </footer>
    </div>
  );
}
