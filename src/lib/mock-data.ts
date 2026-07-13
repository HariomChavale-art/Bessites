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
  
  // Gaming
  { name: "Game Jolt", url: "https://gamejolt.com", cat: ["Gaming"], desc: "Social platform for gamers and creators." },
  { name: "ModDB", url: "https://moddb.com", cat: ["Gaming"], desc: "The definitive library for game mods." },
  { name: "My Abandonware", url: "https://myabandonware.com", cat: ["Gaming"], desc: "Old games for free download." },
  { name: "RAWG", url: "https://rawg.io", cat: ["Gaming"], desc: "Largest video game database and discovery." },
  { name: "Backloggd", url: "https://backloggd.com", cat: ["Gaming"], desc: "Track and rank your game backlog." },
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming"], desc: "Premier community for game modifications." },
  { name: "GameBanana", url: "https://gamebanana.com", cat: ["Gaming"], desc: "The game modding community site." },
  { name: "RetroAchievements", url: "https://retroachievements.org", cat: ["Gaming"], desc: "Achievements for your favorite retro games." },
  { name: "Playhop", url: "https://playhop.com", cat: ["Gaming"], desc: "Play free browser games instantly." },
  
  // Coding
  { name: "CodeSandbox", url: "https://codesandbox.io", cat: ["Coding"], desc: "Instant cloud development environment." },
  { name: "Glitch", url: "https://glitch.com", cat: ["Coding"], desc: "Build and deploy web apps together." },
  { name: "DevDocs", url: "https://devdocs.io", cat: ["Coding"], desc: "Fast, offline search for all documentation." },
  { name: "Hoppscotch", url: "https://hoppscotch.io", cat: ["Coding"], desc: "Open-source API development tool." },
  { name: "Carbon", url: "https://carbon.now.sh", cat: ["Coding"], desc: "Create beautiful images of your code." },
  { name: "Ray.so", url: "https://ray.so", cat: ["Coding"], desc: "Turn your code into beautiful screenshots." },
  { name: "JSON Crack", url: "https://jsoncrack.com", cat: ["Coding"], desc: "Visualize JSON data in 2D/3D." },
  { name: "Regex101", url: "https://regex101.com", cat: ["Coding"], desc: "Online regex tester and debugger." },
  { name: "Roadmap.sh", url: "https://roadmap.sh", cat: ["Coding"], desc: "Visual guides for developer paths." },
  
  // Design
  { name: "Haikei", url: "https://haikei.app", cat: ["Design"], desc: "Generate unique SVG shapes and waves." },
  { name: "SVG Repo", url: "https://svgrepo.com", cat: ["Design"], desc: "Free SVG vectors and icons library." },
  { name: "PatternPad", url: "https://patternpad.com", cat: ["Design"], desc: "Create beautiful pattern designs." },
  { name: "Blobmaker", url: "https://blobmaker.app", cat: ["Design"], desc: "Generate organic SVG shapes." },
  { name: "ColorSpace", url: "https://mycolor.space", cat: ["Design"], desc: "Generate beautiful color palettes." },
  { name: "Happy Hues", url: "https://happyhues.co", cat: ["Design"], desc: "Real-world color palette inspiration." },
  { name: "Fontshare", url: "https://fontshare.com", cat: ["Design"], desc: "Free professional typography library." },
  
  // Image Tools
  { name: "Cleanup.pictures", url: "https://cleanup.pictures", cat: ["Image Tools"], desc: "Remove unwanted objects from photos." },
  { name: "Upscale.media", url: "https://upscale.media", cat: ["Image Tools"], desc: "Enhance image resolution with AI." },
  { name: "TinyPNG", url: "https://tinypng.com", cat: ["Image Tools"], desc: "Smart PNG and JPEG compression." },
  { name: "Pixelcut", url: "https://pixelcut.ai", cat: ["Image Tools"], desc: "AI-powered product photography tools." },
  
  // Learning
  { name: "Class Central", url: "https://classcentral.com", cat: ["Learning"], desc: "Catalog of free online courses." },
  { name: "OpenStax", url: "https://openstax.org", cat: ["Learning"], desc: "Free, peer-reviewed open textbooks." },
  { name: "Saylor Academy", url: "https://saylor.org", cat: ["Learning"], desc: "Free college-level courses for credit." },
  { name: "Ncase", url: "https://ncase.me", cat: ["Learning"], desc: "Explorable explanations through play." },
  
  // PDF
  { name: "PDF24", url: "https://tools.pdf24.org", cat: ["PDF"], desc: "Free and easy PDF solutions." },
  { name: "TinyWow", url: "https://tinywow.com", cat: ["PDF"], desc: "Free tools for PDF and files." },
  { name: "Sejda", url: "https://sejda.com", cat: ["PDF"], desc: "Help with your PDF tasks." },
  
  // Writing
  { name: "Hemingway Editor", url: "https://hemingwayapp.com", cat: ["Writing"], desc: "Make your writing bold and clear." },
  { name: "DeepL Write", url: "https://deepl.com/write", cat: ["Writing"], desc: "AI writing assistant for clear text." },
  { name: "Goblin Tools", url: "https://goblin.tools", cat: ["Writing"], desc: "AI tools for neurodivergent tasks." },
  
  // Cybersecurity
  { name: "Have I Been Pwned", url: "https://haveibeenpwned.com", cat: ["Cybersecurity"], desc: "Check if your email is in a breach." },
  { name: "VirusTotal", url: "https://virustotal.com", cat: ["Cybersecurity"], desc: "Analyze suspicious files and URLs." },
  { name: "DNSChecker", url: "https://dnschecker.org", cat: ["Cybersecurity"], desc: "Global DNS propagation checker." },
  
  // Cool Websites
  { name: "WindowSwap", url: "https://window-swap.com", cat: ["Cool Websites"], desc: "Look out of someone else's window." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Cool Websites"], desc: "Listen to live radio across the globe." },
  { name: "Neal.fun", url: "https://neal.fun", cat: ["Cool Websites"], desc: "Collection of weird web experiments." },
  { name: "FutureMe", url: "https://futureme.org", cat: ["Cool Websites"], desc: "Write letters to your future self." },
  
  // Developer
  { name: "Railway", url: "https://railway.app", cat: ["Developer"], desc: "Easiest way to deploy your apps." },
  { name: "Render", url: "https://render.com", cat: ["Developer"], desc: "Unified cloud to build and run apps." },
  { name: "Supabase", url: "https://supabase.com", cat: ["Developer"], desc: "The open source Firebase alternative." },
  
  // Website Discovery
  { name: "Product Hunt", url: "https://producthunt.com", cat: ["Website Discovery"], desc: "Discover the best new products daily." },
  { name: "AlternativeTo", url: "https://alternativeto.net", cat: ["Website Discovery"], desc: "Find alternatives to any software." },
  { name: "Futurepedia", url: "https://futurepedia.io", cat: ["Website Discovery"], desc: "Largest AI tools directory." }
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
