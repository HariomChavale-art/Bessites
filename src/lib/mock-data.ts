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
  pricing: "Free" | "Paid" | "Freemium";
}

const RAW_SITES = [
  // --- AI & MACHINE LEARNING ---
  { name: "Krea AI", url: "https://krea.ai", cat: ["AI", "Creative", "Design"], desc: "Real-time AI art generation with live canvas enhancements." },
  { name: "Napkin AI", url: "https://napkin.ai", cat: ["AI", "Productivity", "Ideas"], desc: "Transform text-based ideas into professional diagrams and charts." },
  { name: "OpenRouter", url: "https://openrouter.ai", cat: ["AI", "Coding", "Developer"], desc: "Unified API access for major LLMs including GPT-4 and Claude." },
  { name: "Jan", url: "https://jan.ai", cat: ["AI", "Privacy", "Utilities"], desc: "Open-source local AI assistant that stays on your hardware." },
  { name: "LM Studio", url: "https://lmstudio.ai", cat: ["AI", "Developer", "PC Software"], desc: "Discover, download, and run local open-source LLMs." },
  { name: "FlowGPT", url: "https://flowgpt.com", cat: ["AI", "AI Directories", "Creative"], desc: "Massive community library for optimized AI prompt engineering." },
  { name: "Hugging Face", url: "https://huggingface.co", cat: ["AI", "Developer", "Coding"], desc: "The central hub for AI model and dataset sharing." },
  { name: "Ideogram", url: "https://ideogram.ai", cat: ["AI", "Design", "Creative"], desc: "Advanced AI art generation focusing on typography and text." },
  { name: "Perplexity", url: "https://perplexity.ai", cat: ["AI", "Search", "Internet"], desc: "AI research assistant providing direct answers with citations." },
  { name: "Poe", url: "https://poe.com", cat: ["AI", "Chat & Community", "Fun"], desc: "Multi-model AI chat interface and custom bot builder." },
  { name: "Runway", url: "https://runwayml.com", cat: ["AI", "Video", "Creative"], desc: "Professional-grade AI tools for cinematic video generation." },
  { name: "Leonardo AI", url: "https://leonardo.ai", cat: ["AI", "Design", "Creative"], desc: "Generative AI suite for game assets and brand design." },
  { name: "Gamma", url: "https://gamma.app", cat: ["AI", "Design", "Productivity"], desc: "AI-powered presentation and document generation." },
  { name: "Phind", url: "https://phind.com", cat: ["AI", "Coding", "Developer"], desc: "Intelligent search engine optimized for developer queries." },
  { name: "Suno", url: "https://suno.com", cat: ["AI", "Music", "Creative"], desc: "Complete AI musical track generation with instruments and vocals." },
  { name: "ElevenLabs", url: "https://elevenlabs.io", cat: ["AI", "Voice", "Creative"], desc: "Industry-leading AI speech synthesis and voice cloning." },
  { name: "Mistral AI", url: "https://mistral.ai", cat: ["AI", "Developer"], desc: "High-performance efficient open-weight AI models." },
  { name: "Groq", url: "https://groq.com", cat: ["AI", "Developer"], desc: "Ultra-fast AI inference powered by specialized hardware." },
  { name: "DeepL", url: "https://deepl.com", cat: ["AI", "Education", "Languages"], desc: "Natural and context-aware AI translation services." },
  { name: "Synthesia", url: "https://synthesia.io", cat: ["AI", "Video"], desc: "Create training videos using realistic AI avatars." },
  { name: "Midjourney", url: "https://midjourney.com", cat: ["AI", "Design", "Creative"], desc: "Elite artistic image generation through Discord community." },
  
  // --- GAMING & ENTERTAINMENT ---
  { name: "Game Jolt", url: "https://gamejolt.com", cat: ["Gaming", "Entertainment", "Fun"], desc: "Social playground for indie games and creator communities." },
  { name: "ModDB", url: "https://moddb.com", cat: ["Gaming", "PC Software", "Utilities"], desc: "The largest global database for classic game modifications." },
  { name: "My Abandonware", url: "https://myabandonware.com", cat: ["Gaming", "History", "Fun"], desc: "Rediscover thousands of classic, discontinued computer games." },
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming", "PC Software", "Downloads"], desc: "The premier hub for RPG and modern game enhancements." },
  { name: "GG.deals", url: "https://gg.deals", cat: ["Gaming", "Deals", "Shopping"], desc: "Price tracking across major digital stores for PC gaming." },
  { name: "Chess.com", url: "https://chess.com", cat: ["Gaming", "Brain Games", "Education"], desc: "The world's leading platform for playing and learning chess." },
  { name: "Itch.io", url: "https://itch.io", cat: ["Gaming", "Creative", "Startups"], desc: "Independent marketplace for creative and experimental game projects." },
  { name: "Board Game Arena", url: "https://boardgamearena.com", cat: ["Gaming", "Fun", "Brain Games"], desc: "Play hundreds of board games directly in your browser." },
  { name: "Lichess", url: "https://lichess.org", cat: ["Gaming", "Brain Games", "Education"], desc: "Free, open-source chess platform with professional features." },
  { name: "Speedrun.com", url: "https://speedrun.com", cat: ["Gaming", "Entertainment", "Interesting"], desc: "Global database for gaming world records and strategies." },
  { name: "SteamDB", url: "https://steamdb.info", cat: ["Gaming", "Deals", "Data"], desc: "Deep analytics and price history for the Steam ecosystem." },
  { name: "Hollow Knight Map", url: "https://hollowknightmap.com", cat: ["Gaming", "Interesting"], desc: "Complete secret guide for the Hallownest kingdom." },
  { name: "Vim Adventures", url: "https://vim-adventures.com", cat: ["Gaming", "Coding", "Education"], desc: "Learn Vim keyboard shortcuts through an RPG quest." },
  { name: "Infinite Craft", url: "https://neal.fun/infinite-craft/", cat: ["Gaming", "Fun", "AI"], desc: "Combine basic elements into everything using AI logic." },
  
  // --- EDUCATION & SCIENCE ---
  { name: "Wolfram Alpha", url: "https://wolframalpha.com", cat: ["Science", "Math", "Physics", "Education"], desc: "Computational knowledge engine for math and science." },
  { name: "PhET Simulations", url: "https://phet.colorado.edu", cat: ["Science", "Physics", "Education", "Fun"], desc: "Interactive game-like simulations for science education." },
  { name: "NASA Eyes", url: "https://eyes.nasa.gov", cat: ["Space", "Science", "Education", "Astronomy"], desc: "Explore the solar system through real-time 3D data." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space", "Astronomy", "Interesting"], desc: "Precise predictions for satellites and orbital constellations." },
  { name: "Khan Academy", url: "https://khanacademy.org", cat: ["Education", "School", "Math"], desc: "Free world-class lessons in math, science, and history." },
  { name: "Duolingo", url: "https://duolingo.com", cat: ["Education", "Languages", "Fun"], desc: "Gamified language learning across 40+ global languages." },
  { name: "Brilliant", url: "https://brilliant.org", cat: ["Education", "Science", "Math"], desc: "Master STEM concepts through interactive problem solving." },
  { name: "Codecademy", url: "https://codecademy.com", cat: ["Education", "Coding", "Developer"], desc: "Interactive browser-based coding lessons for beginners." },
  { name: "freeCodeCamp", url: "https://freecodecamp.org", cat: ["Education", "Coding", "Developer"], desc: "Earn certifications through real-world software projects." },
  { name: "Project Gutenberg", url: "https://gutenberg.org", cat: ["Reading", "History", "Education"], desc: "Archive of over 70,000 free public domain eBooks." },
  { name: "arXiv", url: "https://arxiv.org", cat: ["Science", "Education", "Physics"], desc: "Open-access archive for advanced scientific research papers." },
  { name: "World History Encyclopedia", url: "https://worldhistory.org", cat: ["History", "Education", "Interesting"], desc: "Deeply researched encyclopedia of human history." },
  { name: "LibriVox", url: "https://librivox.org", cat: ["Reading", "Audio", "Education"], desc: "Free volunteer-read audiobooks of public domain works." },
  { name: "Z-Library", url: "https://z-lib.org", cat: ["Reading", "Education"], desc: "Digital archive for millions of books and research papers." },
  { name: "Wait But Why", url: "https://waitbutwhy.com", cat: ["Education", "Interesting", "Ideas"], desc: "Deep-dive explanations of complex topics with humor." },
  
  // --- DESIGN & CREATIVE ---
  { name: "Figma", url: "https://figma.com", cat: ["Design", "Creative", "Productivity"], desc: "Collaborative design and prototyping for digital teams." },
  { name: "Canva", url: "https://canva.com", cat: ["Design", "Creative", "Marketing"], desc: "Drag-and-drop graphic design for non-designers." },
  { name: "Coolors", url: "https://coolors.co", cat: ["Design", "Creative", "Utilities"], desc: "Ultra-fast palette generator for visual design projects." },
  { name: "Dribbble", url: "https://dribbble.com", cat: ["Design", "Creative", "Photography"], desc: "Portfolio showcase and trend discovery for designers." },
  { name: "Behance", url: "https://behance.net", cat: ["Design", "Creative", "Portfolio"], desc: "Adobe's massive showcase for professional creative work." },
  { name: "Framer", url: "https://framer.com", cat: ["Design", "Startups", "Developer"], desc: "Visual website design with cinematic animations." },
  { name: "Webflow", url: "https://webflow.com", cat: ["Design", "Developer", "Startups"], desc: "Build production-ready custom websites without code." },
  { name: "Unsplash", url: "https://unsplash.com", cat: ["Design", "Photography", "Creative"], desc: "Free high-resolution images for any project." },
  { name: "Pexels", url: "https://pexels.com", cat: ["Design", "Photography", "Video"], desc: "Free stock photo and video assets for creators." },
  { name: "Iconfinder", url: "https://iconfinder.com", cat: ["Design", "Creative", "Utilities"], desc: "Millions of professional SVG icons for app designers." },
  { name: "Fontjoy", url: "https://fontjoy.com", cat: ["Design", "Creative", "AI"], desc: "Deep learning based balanced font pairing tool." },
  { name: "Khroma", url: "https://khroma.co", cat: ["Design", "AI", "Creative"], desc: "Personalized AI color tool trained on your preferences." },
  { name: "Lapa Ninja", url: "https://lapa.ninja", cat: ["Design", "Creative"], desc: "Curated inspiration library for landing page design." },
];

export const MOCK_WEBSITES: Website[] = Array.from(new Set(RAW_SITES.map(s => s.url)))
  .map((url, index) => {
    const site = RAW_SITES.find(s => s.url === url)!;
    const pricingOptions: ("Paid" | "Freemium" | "Free")[] = ["Paid", "Freemium", "Free"];
    const pricing = pricingOptions[index % pricingOptions.length];

    return {
      id: `site-${index}`,
      name: site.name,
      websiteName: site.name,
      developer: "Bessites Curator",
      description: site.desc,
      longDescription: site.desc,
      rating: 4.5 + (Math.random() * 0.5),
      reviewCount: 12 + Math.floor(Math.random() * 100),
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
