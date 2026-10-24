'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface GumroadOverlayButtonProps {
  email: string;
  uid: string;
  className?: string;
}

const PRIMARY_URL = "https://bessites2.gumroad.com/l/Payment";
const FALLBACK_URLS = [
  "https://gumroad.com/l/Payment",
  "https://app.gumroad.com/l/Payment"
];

export function GumroadOverlayButton({ email, uid, className }: GumroadOverlayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [productUrl, setProductUrl] = useState(PRIMARY_URL);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // 1. Probe reachability of primary subdomain (CORS-friendly check)
    const checkReachability = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        await fetch(PRIMARY_URL, { mode: 'no-cors', signal: controller.signal });
        clearTimeout(timeoutId);
      } catch (err) {
        console.warn("[Gumroad] Primary DNS node unreachable, switching to fallback.");
        setProductUrl(FALLBACK_URLS[0]);
      }
    };

    checkReachability();

    // 2. Listen for Gumroad Sale Completion postMessage
    const handleSaleMessage = (event: MessageEvent) => {
      // Security: Validate origin if necessary, though Gumroad docs specify Sale event name
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.post_message_name === "sale" || data.sale_id) {
          console.log("[Gumroad] Sale detected via postMessage node");
          router.push('/founding-success');
        }
      } catch (e) {
        // Not a JSON message or unrelated
      }
    };

    window.addEventListener("message", handleSaleMessage);
    return () => window.removeEventListener("message", handleSaleMessage);
  }, [router]);

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const checkoutUrl = `${productUrl}?wanted=true&email=${encodeURIComponent(email)}&custom_fields[uid]=${uid}`;

    // Attempt to use native script trigger
    const gumroad = (window as any).GumroadOverlay;
    
    if (gumroad) {
      setIsLoading(false);
      gumroad.open(checkoutUrl);
    } else {
      // Manual backup trigger if script is delayed
      console.warn("[Gumroad] Overlay API not ready, attempting manual trigger.");
      const link = document.createElement('a');
      link.href = checkoutUrl;
      link.classList.add('gumroad-button'); // Script identifies this
      link.setAttribute('data-gumroad-overlay-checkout', 'true');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <ShieldCheck className="w-5 h-5 mr-3 text-orange-400" />}
      Claim Founding Spot — $19.99
      <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
}
