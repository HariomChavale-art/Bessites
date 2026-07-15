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
  { name: "Krea AI", url: "https://krea.ai", cat: ["AI"], desc: "Real-time AI image generation and enhancement." },
  { name: "Napkin AI", url: "https://napkin.ai", cat: ["AI"], desc: "Transform ideas into visual diagrams instantly." },
  { name: "OpenRouter", url: "https://openrouter.ai", cat: ["AI"], desc: "Unified interface for all major LLMs." },
  { name: "Jan", url: "https://jan.ai", cat: ["AI"], desc: "Open-source local AI assistant." },
  { name: "LM Studio", url: "https://lmstudio.ai", cat: ["AI"], desc: "Run local LLMs on your own machine." },
  { name: "FlowGPT", url: "https://flowgpt.com", cat: ["AI"], desc: "Largest library of curated AI prompts." },
  { name: "Hugging Face Spaces", url: "https://huggingface.co/spaces", cat: ["AI"], desc: "Discover thousands of AI community apps." },
  { name: "Mage Space", url: "https://mage.space", cat: ["AI"], desc: "Professional stable diffusion generation." },
  { name: "Playground AI", url: "https://playgroundai.com", cat: ["AI"], desc: "Easy to use AI art creator." },
  { name: "Ideogram", url: "https://ideogram.ai", cat: ["AI"], desc: "AI focused on typography and design." },
  { name: "Emergent AI", url: "https://emergent.ai", cat: ["AI", "Tech"], desc: "Exploration and development of emergent artificial intelligence behaviors." },
  
  // Gaming
  { name: "Game Jolt", url: "https://gamejolt.com", cat: ["Gaming"], desc: "Social platform for gamers and creators." },
  { name: "ModDB", url: "https://moddb.com", cat: ["Gaming"], desc: "The definitive library for game mods." },
  { name: "My Abandonware", url: "https://myabandonware.com", cat: ["Gaming"], desc: "Old games for free download." },
  { name: "RAWG", url: "https://rawg.io", cat: ["Gaming"], desc: "Largest video game database and discovery." },
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming"], desc: "Premier community for game modifications." },
  { name: "GG.deals", url: "https://gg.deals", cat: ["Gaming", "Game Deals"], desc: "Track PC game prices across all stores." },
  { name: "IsThereAnyDeal", url: "https://isthereanydeal.com", cat: ["Gaming", "Game Deals"], desc: "Comprehensive price comparison for digital games." },
  { name: "CheapShark", url: "https://cheapshark.com", cat: ["Gaming", "Game Deals"], desc: "Find the best deals on digital game downloads." },
  
  // Entertainment
  { name: "Reelgood", url: "https://reelgood.com", cat: ["Entertainment", "TV Shows", "Movies"], desc: "Unified streaming guide for all your services." },
  { name: "Simkl", url: "https://simkl.com", cat: ["Entertainment", "TV Shows", "Movies", "Anime"], desc: "Track all your movies, TV shows and anime." },
  { name: "Trakt", url: "https://trakt.tv", cat: ["Entertainment", "TV Shows", "Movies"], desc: "Automatically track what you're watching." },
  { name: "JustWatch", url: "https://justwatch.com", cat: ["Entertainment", "TV Shows", "Movies"], desc: "Find where to stream any movie or show." },
  { name: "TV Time", url: "https://tvtime.com", cat: ["Entertainment", "TV Shows"], desc: "The number one tool for TV show enthusiasts." },
  { name: "Know Your Meme", url: "https://knowyourmeme.com", cat: ["Entertainment", "Memes"], desc: "The encyclopedia of internet memes." },
  
  // Tools & Productivity
  { name: "TinyWow", url: "https://tinywow.com", cat: ["Utilities", "Online Tools", "PDF"], desc: "Comprehensive suite of free online PDF and media tools." },
  { name: "Convertio", url: "https://convertio.co", cat: ["Utilities", "Online Tools"], desc: "Easy tool to convert files online." },
  { name: "SwissTransfer", url: "https://swisstransfer.com", cat: ["Utilities", "File Sharing"], desc: "Secure and free file transfer up to 50GB." },
  { name: "Bitwarden", url: "https://bitwarden.com", cat: ["Cybersecurity", "Password Managers"], desc: "Open-source password management for all devices." },
  { name: "Obsidian", url: "https://obsidian.md", cat: ["Productivity", "Notes"], desc: "A powerful knowledge base on top of local Markdown files." },
  
  // Finance & Investing
  { name: "TradingView", url: "https://tradingview.com", cat: ["Finance", "Investing"], desc: "Advanced charts and social network for traders." },
  { name: "NerdWallet", url: "https://nerdwallet.com", cat: ["Finance", "Banking"], desc: "Compare credit cards, loans, and more." },
  { name: "CoinGecko", url: "https://coingecko.com", cat: ["Finance", "Cryptocurrency"], desc: "Largest independent crypto data aggregator." },
  { name: "YNAB", url: "https://ynab.com", cat: ["Finance"], desc: "Personal budgeting software for better money habits." },

  // Health & Wellness
  { name: "MuscleWiki", url: "https://musclewiki.com", cat: ["Health", "Gym"], desc: "Simplified exercise database for every muscle." },
  { name: "Medito", url: "https://meditofoundation.org", cat: ["Health", "Meditation"], desc: "Free-forever meditation app for a better mind." },
  { name: "Insight Timer", url: "https://insighttimer.com", cat: ["Health", "Meditation"], desc: "Largest library of free guided meditations." },
  { name: "Sleep Cycle", url: "https://sleepcycle.com", cat: ["Health", "Sleep"], desc: "Intelligent alarm clock that tracks your sleep." },

  // Learning & Education
  { name: "Class Central", url: "https://classcentral.com", cat: ["Education", "Learning"], desc: "Search thousands of free online courses." },
  { name: "OpenStax", url: "https://openstax.org", cat: ["Education", "Learning"], desc: "Free, peer-reviewed, openly licensed textbooks." },
  { name: "Wolfram Demonstrations", url: "https://demonstrations.wolfram.com", cat: ["Education", "Science", "Math"], desc: "Interactive visualizations for science and math." },
  
  // Science & Space
  { name: "NASA Eyes", url: "https://eyes.nasa.gov", cat: ["Space", "Science"], desc: "NASA's 3D explorer for planets and spacecraft." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space", "Astronomy"], desc: "Track satellites and ISS passes in real-time." },
  { name: "BioNumbers", url: "https://bionumbers.hms.harvard.edu", cat: ["Science", "Biology"], desc: "Database of key numbers in molecular biology." },
  
  // Cool & Fun
  { name: "Neal.fun", url: "https://neal.fun", cat: ["Fun", "Cool Websites"], desc: "A collection of quirky and fun web experiments." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Fun", "Music", "Internet"], desc: "Listen to live radio stations across the globe." },
  { name: "WindowSwap", url: "https://window-swap.com", cat: ["Fun", "Travel", "Cool Websites"], desc: "Look out of someone else's window somewhere in the world." },
  
  // Specialized Tools
  { name: "Monkeytype", url: "https://monkeytype.com", cat: ["Keyboard", "Utilities"], desc: "A customizable typing test with many modes." },
  { name: "Reactive Resume", url: "https://rxresume.com", cat: ["Utilities", "Resume Builders"], desc: "A free and open-source resume builder." },
  { name: "Wormhole", url: "https://wormhole.app", cat: ["Utilities", "File Sharing"], desc: "Simple, private file sharing with end-to-end encryption." }
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
      rating: 0,
      reviewCount: 0,
      categories: site.cat,
      imageUrl: "", 
      screenshots: [],
      url: site.url,
      size: "N/A",
      version: "1.0",
      updatedAt: "2024",
      pricing: pricing
    };
  });
