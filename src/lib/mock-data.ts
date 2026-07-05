export interface Website {
  id: string;
  name: string;
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
  pricing: "Free" | "Paid" | "Freemium";
}

const RAW_SITES = [
  // Master Index Additions
  { name: "Bookshop.org", url: "https://bookshop.org", cat: ["Online Store"], desc: "Support local bookstores online." },
  { name: "Wolf & Badger", url: "https://wolfandbadger.com", cat: ["Online Store"], desc: "Independent ethical fashion and home." },
  { name: "Pitch", url: "https://pitch.com", cat: ["Business"], desc: "Collaborative presentation software for teams." },
  { name: "Tally", url: "https://tally.so", cat: ["Business"], desc: "Simplest way to create forms for free." },
  { name: "Phind", url: "https://phind.com", cat: ["AI Startup"], desc: "AI search engine for developers." },
  { name: "v0.dev", url: "https://v0.dev", cat: ["AI Startup", "Developer"], desc: "Generative UI for React and Tailwind." },
  { name: "Readymag", url: "https://readymag.com", cat: ["Portfolio"], desc: "Design tool for websites and portfolios." },
  { name: "Contra", url: "https://contra.com", cat: ["Portfolio", "Business"], desc: "Professional network for independent work." },
  { name: "Ghost", url: "https://ghost.org", cat: ["Blog"], desc: "Modern publishing platform for creators." },
  { name: "Bear Blog", url: "https://bearblog.dev", cat: ["Blog"], desc: "Fast, minimal, and privacy-focused blog." },
  { name: "Darebee", url: "https://darebee.com", cat: ["Gym", "Health"], desc: "Visual fitness resource for everyone." },
  { name: "ExRx.net", url: "https://exrx.net", cat: ["Gym"], desc: "Comprehensive exercise prescription library." },
  { name: "ArchDaily", url: "https://archdaily.com", cat: ["Real Estate", "Design"], desc: "The world's most visited architecture site." },
  { name: "Short Story Project", url: "https://shortstoryproject.com", cat: ["Education"], desc: "Curation of the world's best short stories." },
  { name: "Itch.io", url: "https://itch.io", cat: ["Gaming"], desc: "Open marketplace for independent creators." },
  { name: "Unscreen", url: "https://unscreen.com", cat: ["Creator"], desc: "Remove video backgrounds automatically." },
  { name: "Acquire.com", url: "https://acquire.com", cat: ["Finance", "Business"], desc: "Marketplace for buying and selling startups." },
  { name: "BioDigital Human", url: "https://biodigital.com", cat: ["Healthcare"], desc: "Interactive 3D cloud-based human body." },
  { name: "Bring a Trailer", url: "https://bringatrailer.com", cat: ["Automotive"], desc: "Auction platform for vintage and classic cars." },
  { name: "Atlas Obscura", url: "https://atlasobscura.com", cat: ["Travel"], desc: "Guide to the world's hidden wonders." },
  { name: "Seat61", url: "https://seat61.com", cat: ["Travel"], desc: "The man in seat sixty-one - train travel guide." },
  
  // Existing & Miscellaneous
  { name: "Lovart", url: "https://lovart.ai", cat: ["AI", "Design"], desc: "AI-driven art generation platform." },
  { name: "Code Banana", url: "https://codebanana.com", cat: ["Developer", "Tools"], desc: "Streamlined code snippets." },
  { name: "Pippit", url: "https://pippit.ai", cat: ["AI", "Social"], desc: "Intelligent social discovery engine." },
  { name: "Have I Been Pwned", url: "https://haveibeenpwned.com", cat: ["Security"], desc: "Check data breach exposure." },
  { name: "Atom Animation", url: "https://atomanimation.com", cat: ["Design", "3D"], desc: "Web animation toolkit." },
  { name: "Class Central", url: "https://classcentral.com", cat: ["Education"], desc: "Free online course search engine." },
  { name: "Eat This Much", url: "https://eatthismuch.com", cat: ["Food", "Health"], desc: "Automatic meal planner." },
  { name: "SuperCook", url: "https://supercook.com", cat: ["Food"], desc: "Recipe search by ingredients." },
  { name: "Sporcle", url: "https://sporcle.com", cat: ["Fun", "Education"], desc: "Trivia and quiz platform." },
  { name: "Ankool", url: "https://ankool.com", cat: ["Shopping", "Tools"], desc: "Smart shopping assistant." },
  { name: "Meow Camera", url: "https://meow.camera", cat: ["Photography", "Fun"], desc: "Quirky filters for everyone." },
  { name: "Rainy Mood", url: "https://rainymood.com", cat: ["Health", "Audio"], desc: "Internet's popular rain sounds." },
  { name: "edX", url: "https://edx.org", cat: ["Education"], desc: "Online courses from universities." },
  { name: "Bore Button", url: "https://borebutton.com", cat: ["Fun"], desc: "Find something new instantly." },
  { name: "Patatap", url: "https://patatap.com", cat: ["Fun", "Audio"], desc: "Visual and sound board." },
  { name: "Napkin AI", url: "https://napkin.ai", cat: ["AI", "Design"], desc: "Transform ideas into diagrams." },
  { name: "TinyWow", url: "https://tinywow.com", cat: ["Tools"], desc: "Free PDF, video, and image tools." },
  { name: "Replit", url: "https://replit.com", cat: ["Developer"], desc: "Collaborative browser-based IDE." },
  { name: "Suno", url: "https://suno.com", cat: ["AI", "Audio"], desc: "AI-powered music generation." },
  { name: "Ventusky", url: "https://ventusky.com", cat: ["Travel", "Tools"], desc: "3D weather and wind maps." },
  { name: "Kimi", url: "https://kimi.com", cat: ["AI", "Productivity"], desc: "Long-form content AI assistant." },
  { name: "PairDrop", url: "https://pairdrop.net", cat: ["Tools"], desc: "Local file sharing via browser." },
  { name: "VirusTotal", url: "https://virustotal.com", cat: ["Security"], desc: "Analyze files and URLs." },
  { name: "Loot Drop", url: "https://lootdrop.io", cat: ["Gaming"], desc: "Discover rare loot and rewards." }
];

export const MOCK_WEBSITES: Website[] = Array.from(new Set(RAW_SITES.map(s => s.url)))
  .map((url, index) => {
    const site = RAW_SITES.find(s => s.url === url)!;
    return {
      id: `site-${index}`,
      name: site.name,
      developer: "Bessites Curator",
      description: site.desc,
      longDescription: `${site.name} is a leading platform for ${site.cat.join(" and ")}. It provides high-quality resources and tools for the niche community.`,
      rating: 0,
      reviewCount: 0,
      categories: site.cat,
      imageUrl: "", 
      screenshots: [],
      url: site.url,
      size: "N/A",
      version: "1.0",
      updatedAt: "2024",
      pricing: Math.random() > 0.8 ? "Paid" : (Math.random() > 0.4 ? "Freemium" : "Free")
    };
  });
