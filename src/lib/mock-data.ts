
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
}

/**
 * High-fidelity registry mapper.
 * Transforms the master allSites.json into the interactive Website objects used by the UI.
 */
export const MOCK_WEBSITES: Website[] = allSites.map((site, index) => {
  return {
    id: `site-${index}`,
    name: site.title,
    websiteName: site.title,
    developer: "Bessites Curation",
    description: site.description.split('.')[0] + '.', // Use first sentence for short desc
    longDescription: site.description, // Use full text for detail view
    rating: 4.5 + (Math.random() * 0.5),
    reviewCount: 15 + Math.floor(Math.random() * 200),
    categories: [site.category],
    imageUrl: "", 
    screenshots: [],
    url: site.url,
    size: "N/A",
    version: "2024",
    updatedAt: "2024",
    pricing: "Freemium", // Defaulting to Freemium for safety, can be refined in JSON
    pros: ["Hand-picked quality", "Verified URL", "Highly functional"],
    cons: ["May require account", "Limited free tier"],
    bestFor: "Professional digital creators and builders."
  };
});
