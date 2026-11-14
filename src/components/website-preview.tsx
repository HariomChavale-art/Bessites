"use client"

import { useEffect, useMemo, useState } from "react";
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
      // No wrong-site logo: an invalid URL falls through to the letter tile.
      return "";
    }
  }, [websiteUrl]);

  const initial = (domain || alt || "?").charAt(0).toUpperCase();

  const imageSrc = useMemo(() => {
    if (fallbackUrl) return fallbackUrl;
    return domain
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
      : "";
  }, [domain, fallbackUrl]);

  // Try again if the image source changes.
  useEffect(() => {
    setError(false);
  }, [imageSrc]);

  if (error || !imageSrc) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-xl bg-[#381149] font-headline text-2xl font-bold text-[#D0BCFC]",
          className
        )}
      >
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
