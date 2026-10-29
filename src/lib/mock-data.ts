import allSites from '@/data/allSites.json';

export interface Website {
  id: string;
  name: string;
  websiteName?: string;
  developer: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  imageUrl: string;
  screenshots: string[];
  url: string;
  size: string;
  version: string;
  updatedAt: string;
  pricing: "Free" | "Paid" | "Freemium" | "Unknown";
  pros?: string[];
  cons?: string[];
  bestFor?: string;
  // Synthetic interaction metrics for discovery logic
  baseVisits: number;
  baseLikes: number;
  baseSaves: number;
  baseShares: number;
}

/**
 * Weighted Random Generator
 * Logic: Uses Math.pow(Math.random(), factor) to create a distribution where 
 * lower numbers are common and higher numbers are rare.
 */
const getWeightedRandom = (min: number, max: number, factor: number = 3) => {
  return Math.floor(Math.pow(Math.random(), factor) * (max - min + 1)) + min;
};

/**
 * High-fidelity registry mapper.
 * Transforms the master allSites.json into the interactive Website objects.
 * Fixes: Pricing tags distribution and ensures descriptions are never empty.
 */
export const MOCK_WEBSITES: Website[] = allSites.map((site, index) => {
  // Balanced pricing distribution: 40% Free, 40% Freemium, 20% Paid
  const pricingSeed = index % 10;
  let pricing: "Free" | "Paid" | "Freemium" = "Free";
  if (pricingSeed >= 4 && pricingSeed < 8) pricing = "Freemium";
  if (pricingSeed >= 8) pricing = "Paid";

  // Robust Description Logic: Prevents empty descriptions
  const rawDesc = site.description || '';
  const cleanDesc = rawDesc.length > 10 
    ? rawDesc 
    : `A high-fidelity ${site.category} tool curated for the Bessites professional registry. Verified for zero padding and immediate utility.`;

  return {
    id: `site-${index}`,
    name: site.title,
    websiteName: site.title,
    developer: "Bessites Curation",
    description: cleanDesc.split('.')[0] + '.', 
    longDescription: cleanDesc, 
    rating: 4.2 + (Math.random() * 0.8),
    reviewCount: 5 + Math.floor(Math.random() * 150),
    categories: [site.category],
    imageUrl: "", 
    screenshots: [],
    url: site.url,
    size: "N/A",
    version: "2024",
    updatedAt: "2024",
    pricing: pricing,
    pros: ["Verified Utility", "High-Fidelity Assets", "Professional Curation"],
    cons: ["May require registration", "Internet connection required"],
    bestFor: `Digital builders seeking elite ${site.category} resources.`,
    // Weighted Stats Implementation
    baseVisits: getWeightedRandom(5, 100, 4), // 100 is rare
    baseLikes: getWeightedRandom(1, 30, 3),   // 30 is rare
    baseSaves: getWeightedRandom(2, 45, 3.5), // 45 is rare
    baseShares: getWeightedRandom(0, 20, 2)
  };
});
