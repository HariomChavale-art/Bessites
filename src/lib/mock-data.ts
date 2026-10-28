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
 * Implements weighted stats: 
 * Visits (5-100, 100 is rare), Likes (1-30, 30 rare), Saves (2-45, 45 rare).
 */
export const MOCK_WEBSITES: Website[] = allSites.map((site, index) => {
  // Determine pricing based on random distribution if not specified
  const pricingOptions: ("Free" | "Paid" | "Freemium")[] = ["Free", "Freemium", "Paid"];
  const pricing = pricingOptions[index % 3];

  return {
    id: `site-${index}`,
    name: site.title,
    websiteName: site.title,
    developer: "Bessites Curation",
    description: site.description.split('.')[0] + '.', 
    longDescription: site.description, 
    rating: 4.0 + (Math.random() * 1.0),
    reviewCount: 5 + Math.floor(Math.random() * 50),
    categories: [site.category],
    imageUrl: "", 
    screenshots: [],
    url: site.url,
    size: "N/A",
    version: "2024",
    updatedAt: "2024",
    pricing: pricing,
    pros: ["Verified Utility", "High-Fidelity Assets", "Professional Curation"],
    cons: ["May require registration", "Limited offline access"],
    bestFor: "Professional digital creators and high-velocity builders.",
    // Weighted Stats Implementation
    baseVisits: getWeightedRandom(5, 100, 4), // 100 is rare (high factor)
    baseLikes: getWeightedRandom(1, 30, 3),   // 30 is rare
    baseSaves: getWeightedRandom(2, 45, 3.5), // 45 is rare
    baseShares: getWeightedRandom(0, 20, 2)   // Added share logic
  };
});
