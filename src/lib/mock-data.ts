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
  // AI
  { name: "Krea AI", url: "https://krea.ai", cat: ["AI", "Creative", "Design"], desc: "Real-time AI image generation and enhancement." },
  { name: "Napkin AI", url: "https://napkin.ai", cat: ["AI", "Productivity", "Ideas"], desc: "Transform ideas into visual diagrams instantly." },
  { name: "OpenRouter", url: "https://openrouter.ai", cat: ["AI", "Coding", "Developer"], desc: "Unified interface for all major LLMs." },
  { name: "Jan", url: "https://jan.ai", cat: ["AI", "Privacy", "Utilities"], desc: "Open-source local AI assistant." },
  { name: "LM Studio", url: "https://lmstudio.ai", cat: ["AI", "Developer", "PC Software"], desc: "Run local LLMs on your own machine." },
  { name: "FlowGPT", url: "https://flowgpt.com", cat: ["AI", "AI Directories", "Creative"], desc: "Largest library of curated AI prompts." },
  { name: "Hugging Face Spaces", url: "https://huggingface.co/spaces", cat: ["AI", "Developer", "Coding"], desc: "Discover thousands of AI community apps." },
  { name: "Ideogram", url: "https://ideogram.ai", cat: ["AI", "Design", "Creative"], desc: "AI focused on typography and design." },
  
  // Gaming
  { name: "Game Jolt", url: "https://gamejolt.com", cat: ["Gaming", "Entertainment", "Fun"], desc: "Social platform for gamers and creators." },
  { name: "ModDB", url: "https://moddb.com", cat: ["Gaming", "PC Software", "Utilities"], desc: "The definitive library for game mods." },
  { name: "My Abandonware", url: "https://myabandonware.com", cat: ["Gaming", "History", "Fun"], desc: "Old games for free download." },
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming", "PC Software", "Downloads"], desc: "Premier community for game modifications." },
  { name: "GG.deals", url: "https://gg.deals", cat: ["Gaming", "Deals", "Shopping"], desc: "Track PC game prices across all stores." },
  { name: "Chess.com", url: "https://chess.com", cat: ["Gaming", "Brain Games", "Education"], desc: "The #1 platform for playing and learning chess." },
  
  // Education & Science
  { name: "Wolfram Alpha", url: "https://wolframalpha.com", cat: ["Science", "Math", "Physics", "Education"], desc: "Computational intelligence engine for all knowledge." },
  { name: "PhET Simulations", url: "https://phet.colorado.edu", cat: ["Science", "Physics", "Education", "Fun"], desc: "Interactive simulations for science and math." },
  { name: "NASA Eyes", url: "https://eyes.nasa.gov", cat: ["Space", "Science", "Education", "Astronomy"], desc: "NASA's 3D explorer for planets and spacecraft." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space", "Astronomy", "Interesting"], desc: "Track satellites and ISS passes in real-time." },
  { name: "Khan Academy", url: "https://khanacademy.org", cat: ["Education", "School", "Math"], desc: "Free, world-class education for anyone, anywhere." },
  { name: "Duolingo", url: "https://duolingo.com", cat: ["Education", "Languages", "Fun"], desc: "Learn a new language in just 10 minutes a day." },
  
  // Tools & Utilities
  { name: "TinyWow", url: "https://tinywow.com", cat: ["Utilities", "PDF", "Video", "Photography"], desc: "Comprehensive suite of free online PDF and media tools." },
  { name: "Convertio", url: "https://convertio.co", cat: ["Utilities", "Productivity", "Downloads"], desc: "Easy tool to convert files online." },
  { name: "Bitwarden", url: "https://bitwarden.com", cat: ["Cybersecurity", "Password Managers", "Privacy"], desc: "Open-source password management for all devices." },
  { name: "Monkeytype", url: "https://monkeytype.com", cat: ["Keyboard", "Utilities", "Fun"], desc: "A customizable typing test with many modes." },
  { name: "Reactive Resume", url: "https://rxresume.com", cat: ["Utilities", "Resume Builders", "Jobs"], desc: "A free and open-source resume builder." },
  
  // Lifestyle & Travel
  { name: "Skyscanner", url: "https://skyscanner.com", cat: ["Travel", "Hotels", "Trains"], desc: "Compare cheap flights, hotels and car hire." },
  { name: "AllRecipes", url: "https://allrecipes.com", cat: ["Food", "Cooking", "Home"], desc: "Find and share everyday cooking inspiration." },
  { name: "MuscleWiki", url: "https://musclewiki.com", cat: ["Health", "Fitness", "Education"], desc: "Simplified exercise database for every muscle." },
  { name: "Medito", url: "https://meditofoundation.org", cat: ["Health", "Meditation", "Sleep"], desc: "Free-forever meditation app for a better mind." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Fun", "Music", "Internet", "Geography"], desc: "Listen to live radio stations across the globe." },
  { name: "WindowSwap", url: "https://window-swap.com", cat: ["Fun", "Travel", "Interesting"], desc: "Look out of someone else's window somewhere in the world." },
  
  // Finance
  { name: "TradingView", url: "https://tradingview.com", cat: ["Finance", "Investing", "Startups"], desc: "Advanced charts and social network for traders." },
  { name: "CoinGecko", url: "https://coingecko.com", cat: ["Finance", "Investing", "Internet"], desc: "Largest independent crypto data aggregator." },
  { name: "YNAB", url: "https://ynab.com", cat: ["Finance", "Productivity", "Home"], desc: "Personal budgeting software for better money habits." }
];

export const MOCK_WEBSITES: Website[] = Array.from(new Set(RAW_SITES.map(s => s.url)))
  .map((url, index) => {
    const site = RAW_SITES.find(s => s.url === url)!;
    const pricingOptions: ("Paid" | "Freemium" | "Free")[] = ["Paid", "Freemium", "Free"];
    const pricing = pricingOptions[index % pricingOptions.length];

    return {
      id: `site-${index}`,
      name: site.name,
      developer: "Bessites Curator",
      description: site.desc,
      longDescription: `${site.name} is a leading platform for ${site.cat.join(" and ")}. It provides high-quality resources and tools for the niche community.`,
      rating: 4.5,
      reviewCount: 12,
      categories: site.cat,
      imageUrl: "", 
      screenshots: [],
      url: site.url,
      size: "N/A",
      version: "1.0",
      updatedAt: "2024",
      pricing: pricing,
    };
  });
