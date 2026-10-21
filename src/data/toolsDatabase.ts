
/**
 * @fileOverview Official Bessites Master Tools Registry.
 * High-fidelity data for Ouneo AI Discovery.
 * Contains verified websites strictly from the user provided seed data.
 */

import { MOCK_WEBSITES } from "@/lib/mock-data";

export interface ToolEntry {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  keywords: string[];
  pricing: "Free" | "Paid" | "Freemium";
  rating: number;
}

export const TOOLS_DATABASE: ToolEntry[] = MOCK_WEBSITES.map(site => ({
  id: site.id,
  name: site.websiteName || site.name,
  url: site.url,
  category: site.categories[0] || "Interesting & Random",
  description: site.description,
  longDescription: site.longDescription,
  tags: site.categories,
  keywords: [site.name.toLowerCase(), site.url.replace('https://', '')],
  pricing: site.pricing as any,
  rating: site.rating
}));
