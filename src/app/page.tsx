"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { collection, query, where } from "firebase/firestore";
import { useFirestore, useCollection } from "@/firebase";
import { MOCK_WEBSITES } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { WebsiteRow, type Site } from "@/components/website-row";

// Sites shown first, and added each time "Load more" is pressed.
const PAGE_SIZE = 30;

// The old homepage mixed ~110 built-in sample listings into the live list.
// Leave this false so only approved listings from Firestore are shown.
const SHOW_MOCK_LISTINGS = false;

function toSite(raw: any): Site | null {
  if (!raw?.id || !raw?.url) return null;

  let fallbackName = raw.url;
  try {
    fallbackName = new URL(raw.url).hostname.replace(/^www\./, "");
  } catch {}

  return {
    id: raw.id,
    name: raw.websiteName || raw.name || fallbackName,
    description: raw.description || "",
    url: raw.url,
    pricing: raw.pricing || "",
    logo: raw.logoUrl || raw.imageUrl || undefined,
  };
}

export default function Home() {
  const db = useFirestore();
  const [visible, setVisible] = useState(PAGE_SIZE);

  const submissionsRef = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "submissions"), where("status", "==", "approved"));
  }, [db]);

  const result = useCollection(submissionsRef) as any;
  const submitted: any[] | null | undefined = result?.data;
  const isLoading = !db || !!result?.loading;

  const sites = useMemo(() => {
    const pool: any[] = [
      ...(SHOW_MOCK_LISTINGS ? (MOCK_WEBSITES as any[]) : []),
      ...(submitted || []),
    ];
    const seen = new Set<string>();
    const out: Site[] = [];
    for (const raw of pool) {
      const site = toSite(raw);
      if (!site || seen.has(site.id)) continue;
      seen.add(site.id);
      out.push(site);
    }
    // Fixed A-Z order so the list never shifts around between visits.
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }, [submitted]);

  const shown = sites.slice(0, visible);
  const hasMore = visible < sites.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#130719] text-[#F5F0FA]">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-24 2xl:max-w-[1500px]">
          <h1 className="font-headline text-[2.5rem] font-bold leading-[1.1] tracking-tight sm:text-6xl 2xl:text-8xl">
            Find the right website.
            <span className="block text-[#A981FF]/55">
              Sorted by what you care about.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#D0BCFC]/80 2xl:max-w-2xl 2xl:text-xl">
            Thousands of websites and tools, organised by interest, so you can
            skip the searching and start using them.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="#sites"
              className="inline-flex items-center gap-2 rounded-full bg-[#F5F0FA] px-6 py-3 text-base font-medium text-[#130719] transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#980ED1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#130719]"
            >
              Browse websites
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              href="/falmido"
              className="text-base text-[#D0BCFC] underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
            >
              Or let Falmido pick for you
            </Link>
          </div>
        </section>

        {/* Websites */}
        <section
          id="sites"
          className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 sm:px-8 2xl:max-w-[1500px]"
        >
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-headline text-2xl font-semibold sm:text-3xl">
              All websites
            </h2>
            {sites.length > 0 && (
              <p className="text-base text-[#A981FF]">
                {sites.length.toLocaleString()} listed
              </p>
            )}
          </div>

          {isLoading && sites.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[7.5rem] rounded-3xl border border-[#381149] bg-[#250D30] sm:h-[9.5rem]"
                />
              ))}
            </div>
          ) : sites.length === 0 ? (
            <p className="rounded-3xl border border-[#381149] bg-[#250D30] p-8 text-center text-base text-[#D0BCFC]/80">
              No websites to show right now. Please check back soon.
            </p>
          ) : (
            <>
              {/* One column on phones, two on laptops and larger.
                  In two columns the left side has the logo on the left and the
                  right side mirrors it, so the rows alternate everywhere. */}
              <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
                {shown.map((site, i) => (
                  <WebsiteRow key={site.id} site={site} flip={i % 2 === 1} />
                ))}
              </div>

              <div className="mt-12 flex flex-col items-center gap-3">
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="rounded-full border border-[#501669] bg-[#250D30] px-8 py-3 text-base font-medium text-[#F5F0FA] transition-colors hover:border-[#980ED1] hover:bg-[#381149] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#980ED1]"
                  >
                    Load more websites
                  </button>
                )}
                <p className="text-sm text-[#A981FF]">
                  Showing {shown.length.toLocaleString()} of{" "}
                  {sites.length.toLocaleString()}
                </p>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
