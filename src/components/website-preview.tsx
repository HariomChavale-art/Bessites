
"use client"

import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface WebsitePreviewProps {
  websiteId: string;
  websiteUrl: string;
  fallbackUrl: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  mode?: 'preview' | 'logo';
}

export function WebsitePreview({ 
  websiteUrl, 
  alt, 
  className,
  width = 600,
  height = 400,
  priority = false,
  mode = 'preview'
}: WebsitePreviewProps) {
  // Directly derive the favicon URL from the domain to avoid expensive AI/crawling calls
  const safeImageSrc = useMemo(() => {
    try {
      const url = new URL(websiteUrl);
      const domain = url.hostname;
      // Using Google's favicon service which is fast, free, and accurate
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
    } catch (e) {
      return null;
    }
  }, [websiteUrl]);

  return (
    <div className={cn("relative bg-[#1A1A1A] flex items-center justify-center w-full h-full", className)}>
      {safeImageSrc ? (
        <Image 
          src={safeImageSrc} 
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={cn(
            "w-full h-full transition-opacity duration-700 opacity-100",
            // For logo mode, we want a contained look, for preview we fill
            mode === 'logo' ? "object-contain p-4" : "object-cover"
          )}
          unoptimized={true}
        />
      ) : (
        <Globe className="w-8 h-8 text-muted-foreground opacity-20" />
      )}
    </div>
  );
}
