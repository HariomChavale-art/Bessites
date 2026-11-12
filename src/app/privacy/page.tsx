
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed font-medium">
          <p>Your privacy is fundamental to our discovery engine.</p>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Data Collection</h2>
            <p>We only collect essential account information such as your email and name to provide access to our registry and personalized feed.</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">Security</h2>
            <p>Your account information is secured with industry-standard encryption. We do not sell user data to third parties.</p>
          </section>
          <p className="pt-10 text-xs">Last updated: October 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
