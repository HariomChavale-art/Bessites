'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Permanently redirecting the legacy dashboard to the new My Websites hub
    router.replace("/my-websites");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">Synchronizing Creator Hub...</p>
      </div>
    </div>
  );
}
