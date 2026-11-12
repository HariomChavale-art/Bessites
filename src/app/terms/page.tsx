
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-8">Terms of Service</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed font-medium">
          <p>Welcome to Bessites. By using our platform, you agree to the following terms.</p>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Service Usage</h2>
            <p>Bessites provides a curated directory of web resources. You agree to use the service only for lawful discovery purposes.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Memberships</h2>
            <p>Subscriptions are billed annually. You may cancel your subscription at any time via your dashboard or by contacting support.</p>
          </section>
          <p className="pt-10 text-xs">Last updated: October 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
