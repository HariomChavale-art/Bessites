
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Legacy privacy route. Redirecting to official /privacy-policy.
 */
export default function PrivacyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/privacy-policy");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary w-10 h-10" />
    </div>
  );
}
