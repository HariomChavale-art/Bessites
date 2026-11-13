'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Check, 
  ShieldCheck, 
  Mail, 
  XCircle, 
  Loader2,
  Lock
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { ProCTA } from '@/components/ProCTA';

export default function UnlockAccessPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [activating, setActivating] = useState(false);

  const userRef = useMemo(() => 
    user && db ? doc(db, 'users', user.uid) : null, 
    [user?.uid, !!db]
  );
  const { data: userDoc, loading: docLoading } = useDoc<any>(userRef);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
    if (user?.email) {
      setPurchaseEmail(user.email);
    }
  }, [user, authLoading, router]);

  const handleActivate = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!purchaseEmail.trim()) {
      toast({ variant: "destructive", title: "Input Required", description: "Please enter your purchase email." });
      return;
    }

    setActivating(true);
    try {
      const response = await fetch('/api/verify-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: purchaseEmail.trim() })
      });

      const data = await response.json();

      if (data.ok) {
        toast({ title: "Access Unlocked", description: "Welcome. You have full access." });
        router.push('/');
      } else {
        toast({ variant: "destructive", title: "Activation Failed", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not connect to verification node." });
    } finally {
      setActivating(false);
    }
  };

  if (authLoading || docLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const isPro = userDoc?.membershipActive === true || userDoc?.isPro === true || userDoc?.hasPaidAccess === true;

  return (
    <div className="min-h-screen bg-black text-[#f8f5ff] flex flex-col font-body selection:bg-purple-600 selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#020105]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-gradient-to-b from-purple-900/5 to-transparent blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-20">
        <div className="mb-12">
          <Logo className="text-4xl" />
        </div>

        {isPro ? (
          <Card className="w-full max-w-md bg-[#0d0c12] border border-emerald-500/20 rounded-[2.5rem] p-12 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-emerald-500" strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">You have full access</h2>
              <p className="text-zinc-400 font-medium italic">Your professional curator membership is active.</p>
            </div>
            <Button 
              onClick={() => router.push('/')}
              className="w-full h-14 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all"
            >
              Enter Registry
            </Button>
          </Card>
        ) : (
          <div className="w-full max-w-2xl space-y-20">
            <div className="flex justify-center">
              <Card className="w-full max-w-md bg-[#0d0c12] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50">
                <div className="p-10 sm:p-12 space-y-10">
                  <header className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter">Unlock Access</h2>
                    <p className="text-sm text-zinc-400 font-medium">Everything in Bessites, for a full year.</p>
                  </header>

                  <div className="text-center space-y-1">
                    <div className="text-5xl font-bold text-white tracking-tight">$99<span className="text-2xl text-zinc-500">/year</span></div>
                    <p className="text-xs text-zinc-500 font-medium italic opacity-60">That's about $8/month</p>
                  </div>

                  <ul className="space-y-4">
                    <FeatureItem text="Full access to every website and tool in the directory" />
                    <FeatureItem text="Browse and filter by your interests" />
                    <FeatureItem text="All new listings added during your year" />
                    <FeatureItem text="Cancel anytime" />
                  </ul>

                  <div className="space-y-4">
                    <ProCTA />
                    <p className="text-[10px] text-center text-zinc-500 leading-relaxed px-4 italic">
                      Cancel anytime. Manage or cancel from the link in your Gumroad receipt email.
                    </p>
                  </div>

                  {/* Email Activation Section */}
                  <div className="pt-10 border-t border-white/5 space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Already purchased?</h3>
                      <p className="text-xs text-zinc-500 font-medium italic opacity-60">Activate your membership using your email.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-zinc-600 ml-1">Gumroad purchase email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={purchaseEmail}
                          onChange={(e) => setPurchaseEmail(e.target.value)}
                          placeholder="The email you used at checkout"
                          className="bg-white/5 border-white/10 h-14 rounded-xl text-base focus:ring-primary/40 text-white font-bold"
                        />
                        <p className="text-[10px] text-zinc-600 font-medium italic ml-1">Use the email from your Gumroad receipt.</p>
                      </div>
                      <Button 
                        onClick={handleActivate}
                        disabled={activating}
                        variant="outline"
                        className="w-full h-14 rounded-xl border-white/10 hover:bg-white/5 text-white font-bold"
                      >
                        {activating ? <Loader2 className="animate-spin w-5 h-5" /> : "Activate membership"}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <TrustLine icon={ShieldCheck} text="Secure checkout by Gumroad" />
                    <TrustLine icon={XCircle} text="Cancel anytime" />
                    <a href="mailto:bessitesofficial@gmail.com" className="flex items-center gap-3 text-zinc-500 hover:text-primary transition-colors text-xs font-medium px-1">
                      <Mail className="w-4 h-4" />
                      Questions? bessitesofficial@gmail.com
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            <section className="space-y-8 max-w-xl mx-auto">
              <h3 className="text-2xl font-bold text-white text-center italic uppercase tracking-tighter">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full space-y-3">
                <FAQItem 
                  value="cancel"
                  question="How do I cancel?" 
                  answer="Open the link in your Gumroad receipt email and choose Cancel membership. You keep access until the end of the period you paid for. You can also email bessitesofficial@gmail.com and we will help." 
                />
                <FAQItem 
                  value="methods"
                  question="What payment methods are accepted?" 
                  answer="Payments are processed securely by Gumroad. Available methods are shown at checkout." 
                />
                <FAQItem 
                  value="access"
                  question="When do I get access?" 
                  answer="Right after payment, using the same account you signed up with." 
                />
                <FAQItem 
                  value="support"
                  question="I have a question or an issue." 
                  answer="Email bessitesofficial@gmail.com and we will reply as soon as possible." 
                />
              </Accordion>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium leading-relaxed italic">
      <div className="mt-1 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <Check className="w-2.5 h-2.5 text-primary" strokeWidth={4} />
      </div>
      {text}
    </li>
  );
}

function TrustLine({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-3 text-zinc-500 text-xs font-medium px-1 italic">
      <Icon className="w-4 h-4 opacity-50" />
      {text}
    </div>
  );
}

function FAQItem({ value, question, answer }: { value: string, question: string, answer: string }) {
  return (
    <AccordionItem value={value} className="border-white/5 bg-[#0d0c12] px-6 rounded-2xl border">
      <AccordionTrigger className="text-sm font-bold text-zinc-200 hover:no-underline py-4 text-left italic">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-zinc-500 font-medium leading-relaxed pb-4 italic">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}