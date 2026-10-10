import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Submit Your Website to Google - Step by Step Guide | Bessites",
  description: "The definitive guide to indexing your website on Google Search in 2026. Use Search Console and the Indexing API for absolute visibility.",
  keywords: ["submit website to google", "google search console guide", "website indexing", "Bessites manual", "get on google search"],
};

export default function GoogleSubmitGuide() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <Navigation />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-20">
        <Link href="/guide" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white mb-12 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Manual Hub
        </Link>

        <article className="space-y-16">
          <header className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-0.5 text-[10px] font-black uppercase italic">Module 03: Technical SEO</Badge>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
              How to Submit Your Website to <span className="text-primary">Google</span> - 2026 Manual
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium italic leading-relaxed border-l-4 border-primary pl-8 py-2">
              Waiting for Google to find your website naturally is an obsolete strategy in the high-velocity digital landscape of 2026. If you want your digital property to appear in search results within hours rather than weeks, you must take intentional control of the indexing process. This guide provides the technical steps to authenticate your ownership and push your site directly into the Google discovery node.
            </p>
          </header>

          <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Manual Index</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              <li><a href="#search-console" className="hover:text-primary">1. Search Console Setup</a></li>
              <li><a href="#verification" className="hover:text-primary">2. DNS Verification Node</a></li>
              <li><a href="#indexing-api" className="hover:text-primary">3. Using the Indexing API</a></li>
              <li><a href="#sitemap-submission" className="hover:text-primary">4. Dynamic Sitemaps</a></li>
              <li><a href="#faq" className="hover:text-primary">5. Frequently Asked Questions</a></li>
            </ul>
          </Card>

          <div className="space-y-24 text-zinc-300 leading-relaxed text-lg font-medium">
            <section id="search-console" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">01</span> Google Search Console Command Center
              </h2>
              <p>
                Google Search Console (GSC) is the definitive command center for indexing. It is a free tool provided by Google that allows you to monitor, maintain, and troubleshoot your site's presence in Google Search results. Without GSC, you are essentially flying blind in the discovery pipeline.
              </p>
              <p>
                The first step is to visit the Search Console website and sign in with your Google account. You will be prompted to add a 'Property'. For absolute discovery, we recommend using the 'Domain' property type, as it covers all subdomains and protocol variants (http vs https), providing a holistic view of your digital presence.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-primary mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Never use multiple accounts for one domain. Maintain a single 'Owner' account and use the 'Users and Permissions' section to grant access to team members. This protects your indexing authority.</p>
              </div>
            </section>

            <section id="verification" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">02</span> The DNS Verification Node
              </h2>
              <p>
                Before Google indexes your data, you must prove you own the domain. While there are multiple methods (HTML file upload, meta tags), DNS verification is the gold standard in 2026. It proves ownership at the infrastructure level, which Google considers the highest fidelity verification.
              </p>
              <p>
                Google will provide you with a TXT record. You must login to your domain registrar (e.g., Namecheap, Cloudflare, GoDaddy) and add this record to your DNS settings. Once added, return to GSC and click 'Verify'. It may take a few minutes for the record to propagate globally, but once verified, you have full control over the indexing node for that domain.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Ensure your TXT record is correctly formatted without extra spaces.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Use Cloudflare for DNS management if you want sub-minute propagation.</span></li>
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-primary shrink-0" /><span>Keep your verification record active; deleting it may lose your GSC access.</span></li>
              </ul>
            </section>

            <section id="indexing-api" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">03</span> Leveraging the Indexing API
              </h2>
              <p>
                For high-velocity sites that update frequently—such as directories, job boards, or news hubs—standard crawling is too slow. The Google Indexing API allows you to manually push new URLs to Google immediately. This is how sites like Bessites.store ensure new submissions are indexed in hours.
              </p>
              <p>
                To use the API, you must create a Service Account in the Google Cloud Console and grant it 'Owner' permissions in Search Console. Then, you can use a simple script or a plugin to send 'URL_UPDATED' notifications to Google. This bypasses the traditional wait times and forces Googlebot to prioritize your new content for crawling.
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl italic">
                <p className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">Pro Tip:</p>
                <p className="text-sm">Don't abuse the API for static pages. Use it for fresh, dynamic assets to maintain your 'Crawl Budget' authority with Googlebot.</p>
              </div>
            </section>

            <section id="sitemap-submission" className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                <span className="text-primary text-4xl">04</span> Dynamic XML Sitemaps
              </h2>
              <p>
                A sitemap is the technical map of your digital architecture. In 2026, Google expects clean, segmented sitemaps that prioritize high-value content and exclude 'padding' like login pages or private nodes. Your sitemap should be dynamic, updating automatically whenever you publish new content.
              </p>
              <p>
                Submit your sitemap URL (usually `domain.com/sitemap.xml`) in the 'Sitemaps' section of GSC. Google will read this file periodically to discover new URLs. Combined with the Indexing API, this creates a robust, two-layer discovery system that ensures no asset in your node is ever missed by the search crawler.
              </p>
            </section>

            <section className="space-y-6 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Conclusion</h2>
              <p>
                Indexing is the technical foundation of discovery. By setting up Google Search Console, verifying via DNS, and utilizing the Indexing API, you ensure that Google recognizes your website as a professional, high-fidelity asset. Don't leave your visibility to chance; take control of your indexing node and start appearing in results today. Once indexed, don't forget to list on Bessites.store for an additional authority boost.
              </p>
            </section>

            <section id="faq" className="space-y-10 pt-10 border-t border-white/5">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">How long does indexing take after submission?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">With manual submission via GSC, indexing can occur in 24-48 hours. Using the Indexing API can reduce this to less than 4 hours for qualified URLs.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Is Google Search Console free to use?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Yes, Google Search Console and all its indexing features are completely free. Avoid any service that asks for payment to 'register' you with Google.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white italic">Why is my site not showing up after verification?</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">Verification only proves ownership; it doesn't guarantee immediate ranking. Focus on 'Zero Padding' high-value content and building authority through registries like Bessites.store.</p>
                </div>
              </div>
            </section>
          </div>

          <footer className="pt-20 border-t border-white/5 flex justify-between items-center gap-8">
             <Link href="/guide/how-to-get-free-traffic">
                <Button variant="ghost" className="text-muted-foreground hover:text-white uppercase font-black tracking-widest text-[10px] italic">
                   <ChevronLeft className="w-4 h-4 mr-2" /> Previous Guide
                </Button>
             </Link>
             <Link href="/guide/how-to-make-website-faster">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white text-[9px] font-black uppercase italic shadow-xl">
                   Next Guide <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
             </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
