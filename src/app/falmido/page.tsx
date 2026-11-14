'use client';

import { Navigation } from "@/components/navigation";
import { FalmidoAssistant } from "@/components/falmido-assistant";
import { Footer } from "@/components/footer";

/**
 * @fileOverview Falmido Discovery Hub.
 * Dedicated conversational discovery page.
 */
export default function FalmidoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center pt-16 sm:pt-24 px-4">
        <div className="w-full mb-32">
          <FalmidoAssistant />
        </div>
      </main>

      <Footer />
    </div>
  );
}
