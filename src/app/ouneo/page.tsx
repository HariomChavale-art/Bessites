'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Legacy Ouneo route. Redirecting to consolidated Falmido hub.
 */
export default function OuneoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/falmido");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary w-10 h-10" />
    </div>
  );
}
