
"use client"

import { useState, useEffect } from "react";
import { useDoc, useFirestore } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getWebsitePreview } from "@/ai/flows/get-website-preview";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface WebsitePreviewProps {
  websiteId: string;
  websiteUrl: string;
  fallbackUrl: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function WebsitePreview({ 
  websiteId, 
  websiteUrl, 
  fallbackUrl, 
  alt, 
  className,
  width = 600,
  height = 400,
  priority = false
}: WebsitePreviewProps) {
  const db = useFirestore();
  const statsRef = websiteId && db ? doc(db, "websiteStats", websiteId) : null;
  const { data: stats, loading: statsLoading } = useDoc(statsRef);
  
  const [currentImage, setCurrentImage] = useState(fallbackUrl);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (statsLoading || !db || !websiteId) return;

    if (stats?.previewUrl) {
      setCurrentImage(stats.previewUrl);
    } else {
      // If no preview cached, fetch it once
      const fetchAndCache = async () => {
        setIsUpdating(true);
        try {
          const result = await getWebsitePreview({ url: websiteUrl });
          if (result?.imageUrl) {
            await setDoc(doc(db, "websiteStats", websiteId), {
              previewUrl: result.imageUrl,
              lastPreviewUpdate: serverTimestamp()
            }, { merge: true });
            setCurrentImage(result.imageUrl);
          }
        } catch (e) {
          console.error("Failed to update website preview", e);
        } finally {
          setIsUpdating(false);
        }
      };
      
      fetchAndCache();
    }
  }, [stats, statsLoading, db, websiteId, websiteUrl]);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image 
        src={currentImage} 
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          "w-full h-auto object-cover transition-all duration-700",
          isUpdating ? "scale-105 blur-sm opacity-50" : "scale-100 blur-0 opacity-100"
        )}
        unoptimized={currentImage.includes('s0.wp.com')} // Don't optimize remote screenshot URLs
      />
      
      {isUpdating && !stats?.previewUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
