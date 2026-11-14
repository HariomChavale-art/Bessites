"use client";

import Link from "next/link";
import { WebsitePreview } from "@/components/website-preview";
import { PricingTag } from "@/components/pricing-tag";
import { cn } from "@/lib/utils";

export interface Site {
  id: string;
  name: string;
  description: string;
  url: string;
  pricing: string;
  logo?: string;
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * One website, given its own space.
 * Normal: logo on the left, text on the right.
 * flip: logo on the right, text on the left (right-aligned).
 * The pricing tag always sits on the top-right corner of the logo.
 */
export function WebsiteRow({ site, flip = false }: { site: Site; flip?: boolean }) {
  return (
    <Link
      href={`/website/${site.id}`}
      className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#980ED1]"
    >
      <article
        className={cn(
          "flex items-center gap-4 rounded-3xl border border-[#381149] bg-[#250D30] p-4 transition-colors group-hover:border-[#980ED1] sm:gap-6 sm:p-6",
          flip && "flex-row-reverse text-right"
        )}
      >
        <div className="relative shrink-0">
          <div className="h-20 w-20 overflow-hidden rounded-2xl border border-[#501669] bg-[#130719] p-3 sm:h-24 sm:w-24 2xl:h-28 2xl:w-28">
            <WebsitePreview
              websiteUrl={site.url}
              fallbackUrl={site.logo}
              alt={site.name}
              className="h-full w-full"
            />
          </div>
          <PricingTag
            pricing={site.pricing}
            className="absolute -right-2 -top-2"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-headline text-lg font-semibold text-[#F5F0FA] sm:text-xl 2xl:text-2xl">
            {site.name}
          </h3>
          {site.description && (
            <p className="mt-1 line-clamp-2 text-base leading-snug text-[#D0BCFC]/80">
              {site.description}
            </p>
          )}
          <p className="mt-2 truncate text-sm text-[#A981FF]">{hostOf(site.url)}</p>
        </div>
      </article>
    </Link>
  );
}
