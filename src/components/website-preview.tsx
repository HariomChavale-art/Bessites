
"use client"

import { useState, useEffect } from "react";
import { useDoc, useFirestore } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getWebsitePreview } from "@/ai/flows/get-website-preview";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2, Globe } from "lucide-react";

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
  websiteId, 
  websiteUrl, 
  fallbackUrl, 
  alt, 
  className,
  width = 600,
  height = 400,
  priority = false,
  mode = 'preview'
}: WebsitePreviewProps) {
  const db = useFirestore();
  const statsRef = websiteId && db ? doc(db, "websiteStats", websiteId) : null;
  const { data: stats, loading: statsLoading } = useDoc(statsRef);
  
  const domain = new URL(websiteUrl).hostname;
  const officialFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (statsLoading) return;

    const cachedUrl = mode === 'logo' ? stats?.logoUrl : stats?.previewUrl;

    if (cachedUrl) {
      setCurrentImage(cachedUrl);
    } else {
      const fetchAndCache = async () => {
        setIsUpdating(true);
        try {
          const result = await getWebsitePreview({ url: websiteUrl }).catch(() => null);
          
          if (result) {
            const logo = mode === 'logo' ? result.logoUrl : result.imageUrl;
            setCurrentImage(logo || officialFavicon);

            if (db && websiteId) {
              setDoc(doc(db, "websiteStats", websiteId), {
                previewUrl: result.imageUrl,
                logoUrl: result.logoUrl,
                lastPreviewUpdate: serverTimestamp()
              }, { merge: true });
            }
          } else {
            setCurrentImage(officialFavicon);
          }
        } catch (e) {
          setCurrentImage(officialFavicon);
        } finally {
          setIsUpdating(false);
        }
      };
      
      fetchAndCache();
    }
  }, [stats, statsLoading, db, websiteId, websiteUrl, mode, officialFavicon]);

  const safeImageSrc = currentImage || officialFavicon;

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
            "w-full h-full object-cover transition-opacity duration-700",
            isUpdating ? "opacity-40" : "opacity-100"
          )}
          unoptimized={true}
        />
      ) : (
        <Globe className="w-8 h-8 text-muted-foreground opacity-20" />
      )}
      
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
