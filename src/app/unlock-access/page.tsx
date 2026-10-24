'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Flame, ExternalLink } from 'lucide-react';
import Script from 'next/script';

export default function UnlockAccessPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const [billingState, setBillingState] = useState<any>(null);

  // Use the useDoc hook to get real-time user status
  const userRef = user ? doc(db!, 'users', user.uid) : null;
  const { data: userDoc } = useDoc<any>(userRef);

  // Effect to handle redirect when payment is verified
  useEffect(() => {
    if (userDoc?.hasPaidAccess) {
      router.push('/');
    }
  }, [userDoc, router]);

  // Fetch billing count for scarcity/pricing
  useEffect(() => {
    if (!db) return;
    const fetchBilling = async () => {
      const snap = await doc(db, 'system', 'billingState');
      // In a real app, use onSnapshot for this too
      setBillingState({ paidUserCount: 12 }); // Mock for UI
    };
    fetchBilling();
  }, [db]);

  if (userLoading || !user) {
    return <div className="min-h-screen bg-[#070709] flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
  }

  const isLifetime = (billingState?.paidUserCount || 0) < 100;
  const productId = isLifetime 
    ? process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_PRODUCT_ID 
    : process.env.NEXT_PUBLIC_GUMROAD_ANNUAL_PRODUCT_ID;

  return (
    <main className="min-h-screen w-full bg-[#070709] text-white flex flex-col items-center p-4 py-12">
      <Script src="https://gumroad.com/js/gumroad-embed.js" strategy="lazyOnload" />

      <div className="max-w-4xl w-full space-y-12">
        {/* Scarcity Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <ShieldCheck className="text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Signed In As</p>
              <p className="text-sm font-bold">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-tighter">
                {isLifetime ? `HALLOWEEN LIFETIME PASS: $19.99` : 'ANNUAL PRO MEMBERSHIP: $19.99'}
              </span>
            </div>
            <p className="text-[9px] font-bold text-white/20 uppercase">
              {isLifetime ? `Spot #${(billingState?.paidUserCount || 0) + 1} of 100 Available` : 'Secure Annual Access'}
            </p>
          </div>
        </div>

        {/* Gumroad Embed Container */}
        <Card className="bg-[#12111A] border border-orange-500/20 rounded-[3rem] p-1 overflow-hidden shadow-2xl">
          <div className="bg-[#070709] rounded-[2.8rem] min-h-[600px] relative">
            <div 
              className="gumroad-product-embed" 
              data-gumroad-product-id={productId}
              data-outbound-embed="true"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] animate-pulse">
                  Synchronizing Checkout Node...
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Fallback & Footer */}
        <div className="text-center space-y-6">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
            Account will unlock automatically the millisecond payment is verified.<br />
            No refresh required. System listening for handshake...
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={`https://gumroad.com/l/${productId}?email=${encodeURIComponent(user.email)}`} 
              target="_blank" 
              className="text-[10px] font-black text-orange-500 hover:text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-orange-500/20 pb-1 transition-all"
            >
              POPUP BLOCKED? OPEN FULL CHECKOUT <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
