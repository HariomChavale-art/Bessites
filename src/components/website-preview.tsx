
"use client"

import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface WebsitePreviewProps {
  websiteId?: string;
  websiteUrl: string;
  fallbackUrl: string; 
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * WebsitePreview component for displaying site logos or previews.
 * Rule: All logos must fill their container entirely, touching borders with zero internal padding.
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
  
  const imageSrc = useMemo(() => {
    // Prioritize manual Supabase uploads (fallbackUrl is the stored public URL)
    if (fallbackUrl && fallbackUrl.startsWith('http')) return fallbackUrl;
    
    // Fallback to domain-based favicon for non-uploaded assets (Zero cost)
    try {
      const url = new URL(websiteUrl);
      const domain = url.hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
    } catch (e) {
      return null;
    }
  }, [websiteUrl, fallbackUrl]);

  return (
    <div className={cn("relative bg-[#1A1A1A] flex items-center justify-center w-full h-full overflow-hidden", className)}>
      {imageSrc ? (
        <Image 
          src={imageSrc} 
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={cn(
            "w-full h-full transition-opacity duration-700 opacity-100",
            // logos touch the borders with zero internal padding using object-cover
            "object-cover"
          )}
          unoptimized={true}
        />
      ) : (
        <Globe className="w-8 h-8 text-muted-foreground opacity-20" />
      )}
    </div>
  );
}
