
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
  
  const [currentImage, setCurrentImage] = useState(fallbackUrl);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (statsLoading || !db || !websiteId) return;

    const cachedUrl = mode === 'logo' ? stats?.logoUrl : stats?.previewUrl;

    if (cachedUrl) {
      setCurrentImage(cachedUrl);
    } else {
      const fetchAndCache = async () => {
        setIsUpdating(true);
        try {
          const result = await getWebsitePreview({ url: websiteUrl });
          if (result) {
            await setDoc(doc(db, "websiteStats", websiteId), {
              previewUrl: result.imageUrl,
              logoUrl: result.logoUrl,
              lastPreviewUpdate: serverTimestamp()
            }, { merge: true });
            
            setCurrentImage(mode === 'logo' ? result.logoUrl : result.imageUrl);
          }
        } catch (e) {
          console.error("Failed to update website assets", e);
        } finally {
          setIsUpdating(false);
        }
      };
      
      fetchAndCache();
    }
  }, [stats, statsLoading, db, websiteId, websiteUrl, mode]);

  const isScreenshot = currentImage.includes('s0.wp.com') || currentImage.includes('favicons');

  return (
    <div className={cn("relative overflow-hidden bg-muted flex items-center justify-center", className)}>
      {currentImage ? (
        <Image 
          src={currentImage} 
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={cn(
            "transition-all duration-700",
            mode === 'logo' ? "object-contain p-2" : "object-cover",
            isUpdating ? "scale-105 blur-sm opacity-50" : "scale-100 blur-0 opacity-100"
          )}
          unoptimized={isScreenshot}
        />
      ) : (
        <Globe className="w-8 h-8 text-muted-foreground opacity-20" />
      )}
      
      {isUpdating && !currentImage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
