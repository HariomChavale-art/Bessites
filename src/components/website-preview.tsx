"use client"

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface WebsitePreviewProps {
  websiteUrl: string;
  fallbackUrl?: string; 
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function WebsitePreview({ 
  websiteUrl, 
  fallbackUrl,
  alt = "Website Preview", 
  className,
  width = 512,
  height = 512,
}: WebsitePreviewProps) {
  
  const [error, setError] = useState(false);

  const domain = useMemo(() => {
    try {
      return new URL(websiteUrl).hostname;
    } catch {
      return "webdock.app";
    }
  }, [websiteUrl]);

  const initial = domain.charAt(0).toUpperCase();

  const imageSrc = useMemo(() => {
    if (fallbackUrl) return fallbackUrl;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
  }, [domain, fallbackUrl]);

  if (error) {
    return (
      <div className={cn("w-full h-full bg-zinc-800 flex items-center justify-center font-mono font-bold text-zinc-500", className)}>
        {initial}
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
      <Image 
        src={imageSrc} 
        alt={alt}
        width={width}
        height={height}
        onError={() => setError(true)}
        className="w-full h-full object-contain"
        unoptimized={true}
      />
    </div>
  );
}