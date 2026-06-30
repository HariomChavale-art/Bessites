
"use client"

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface WebsitePreviewProps {
  websiteId?: string;
  websiteUrl: string;
  fallbackUrl?: string; 
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * WebsitePreview component with a self-healing fallback chain.
 * Tier 1: Manual Upload (Supabase/Firestore)
 * Tier 2: Clearbit (High-res Logo)
 * Tier 3: Google Favicon (256px)
 * Tier 4: Unavatar (Social Aggregator)
 * Tier 5: Identicon (Never blank)
 */
export function WebsitePreview({ 
  websiteUrl, 
  fallbackUrl,
  alt, 
  className,
  width = 512,
  height = 512,
  priority = false,
}: WebsitePreviewProps) {
  
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(false);

  // Extract domain once
  const domain = useMemo(() => {
    try {
      const url = new URL(websiteUrl);
      return url.hostname;
    } catch (e) {
      return "webdock.app";
    }
  }, [websiteUrl]);

  // The Fallback Chain
  const imageSrc = useMemo(() => {
    // If we have a manual upload, use it first
    if (fallbackUrl && fallbackUrl.startsWith('http') && retryCount === 0) {
      return fallbackUrl;
    }

    const tiers = [
      `https://logo.clearbit.com/${domain}`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
      `https://unavatar.io/${domain}?fallback=false`,
      `https://api.dicebear.com/7.x/initials/svg?seed=${domain}&backgroundColor=7B33FF&fontFamily=Arial&bold=true`
    ];

    // Select the current tier based on failures
    const index = fallbackUrl ? Math.max(0, retryCount - 1) : retryCount;
    return tiers[Math.min(index, tiers.length - 1)];
  }, [domain, fallbackUrl, retryCount]);

  const handleError = () => {
    if (retryCount < 4) {
      setRetryCount(prev => prev + 1);
    } else {
      setError(true);
    }
  };

  return (
    <div className={cn("relative bg-[#1A1A1A] flex items-center justify-center w-full h-full overflow-hidden", className)}>
      {!error ? (
        <Image 
          src={imageSrc} 
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          onError={handleError}
          className={cn(
            "w-full h-full transition-opacity duration-700 opacity-100",
            "object-cover"
          )}
          unoptimized={true}
        />
      ) : (
        <div className="w-full h-full bg-primary/20 flex items-center justify-center">
          <Globe className="w-1/2 h-1/2 text-primary opacity-50" />
        </div>
      )}
    </div>
  );
}
