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
  { name: "Pinokio", url: "https://pinokio.computer", cat: ["AI"], desc: "Install and run AI apps locally with one click." },
  { name: "ComfyUI", url: "https://github.com/comfyanonymous/ComfyUI", cat: ["AI"], desc: "Powerful modular Stable Diffusion GUI." },
  { name: "LibreChat", url: "https://www.librechat.ai", cat: ["AI"], desc: "Enhanced open-source AI chat interface." },
  { name: "AnythingLLM", url: "https://useanything.com", cat: ["AI"], desc: "Private desktop AI for your documents." },
  
  // Gaming
  { name: "Game Jolt", url: "https://gamejolt.com", cat: ["Gaming"], desc: "Social platform for gamers and creators." },
  { name: "ModDB", url: "https://moddb.com", cat: ["Gaming"], desc: "The definitive library for game mods." },
  { name: "My Abandonware", url: "https://myabandonware.com", cat: ["Gaming"], desc: "Old games for free download." },
  { name: "RAWG", url: "https://rawg.io", cat: ["Gaming"], desc: "Largest video game database and discovery." },
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming"], desc: "Premier community for game modifications." },
  { name: "GameBanana", url: "https://gamebanana.com", cat: ["Gaming"], desc: "The game modding community site." },
  { name: "Playhop", url: "https://playhop.com", cat: ["Gaming"], desc: "Play free browser games instantly." },
  { name: "RetroAchievements", url: "https://retroachievements.org", cat: ["Gaming"], desc: "Add achievements to classic games." },

  // Coding
  { name: "CodeSandbox", url: "https://codesandbox.io", cat: ["Coding"], desc: "Instant cloud development environment." },
  { name: "Glitch", url: "https://glitch.com", cat: ["Coding"], desc: "Build and deploy web apps together." },
  { name: "DevDocs", url: "https://devdocs.io", cat: ["Coding"], desc: "Fast, offline search for all documentation." },
  { name: "Hoppscotch", url: "https://hoppscotch.io", cat: ["Coding"], desc: "Open-source API development tool." },
  { name: "Roadmap.sh", url: "https://roadmap.sh", cat: ["Coding"], desc: "Visual guides for developer paths." },
  { name: "Public APIs", url: "https://publicapis.io", cat: ["Coding"], desc: "A collective list of free APIs." },
  { name: "DevHints", url: "https://devhints.io", cat: ["Coding"], desc: "A ridiculous collection of cheat sheets." },

  // Space
  { name: "Eyes on the Solar System", url: "https://eyes.nasa.gov", cat: ["Space"], desc: "NASA's 3D explorer for planets and spacecraft." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space"], desc: "Track satellites and ISS passes in real-time." },
  { name: "Satellite Map", url: "https://platform.leolabs.space/visualizations/leo", cat: ["Space"], desc: "Interactive visualization of objects in low Earth orbit." },
  { name: "APOD", url: "https://apod.nasa.gov", cat: ["Space"], desc: "Astronomy Picture of the Day." },
  { name: "Stellarium Web", url: "https://stellarium-web.org", cat: ["Space"], desc: "A planetarium in your browser." },
  { name: "N2YO", url: "https://www.n2yo.com", cat: ["Space"], desc: "Live satellite tracking and predictions." },
  { name: "Eyes on Asteroids", url: "https://eyes.nasa.gov/apps/asteroids", cat: ["Space"], desc: "Visualize asteroids and comets in 3D." },

  // Earth & Weather & Nature
  { name: "Earth Nullschool", url: "https://earth.nullschool.net", cat: ["Earth & Weather"], desc: "Global map of wind, weather, and ocean conditions." },
  { name: "Ventusky", url: "https://ventusky.com", cat: ["Earth & Weather"], desc: "Live weather forecast and meteorological data maps." },
  { name: "Zoom Earth", url: "https://zoom.earth", cat: ["Earth & Weather"], desc: "Real-time satellite images and storm tracker." },
  { name: "Windy", url: "https://windy.com", cat: ["Earth & Weather"], desc: "Professional weather visualization for everyone." },
  { name: "PlantNet", url: "https://identify.plantnet.org", cat: ["Nature"], desc: "Identify plants with a simple photo." },
  { name: "iNaturalist", url: "https://www.inaturalist.org", cat: ["Nature"], desc: "A community for naturalists." },
  { name: "VolcanoDiscovery", url: "https://www.volcanodiscovery.com", cat: ["Nature"], desc: "Real-time volcano and earthquake info." },

  // History
  { name: "Ancient History Encyclopedia", url: "https://www.worldhistory.org", cat: ["History"], desc: "The world's most-read history encyclopedia." },
  { name: "History Hit", url: "https://www.historyhit.com", cat: ["History"], desc: "A new kind of history channel." },
  { name: "Old Maps Online", url: "https://www.oldmapsonline.org", cat: ["History"], desc: "The search engine for historical maps." },
  { name: "David Rumsey Map Collection", url: "https://www.davidrumsey.com", cat: ["History"], desc: "Over 100,000 historical maps online." },

  // Fun & Interesting
  { name: "Neal.fun", url: "https://neal.fun", cat: ["Fun", "Interesting"], desc: "Addictive and quirky web experiments." },
  { name: "WindowSwap", url: "https://window-swap.com", cat: ["Fun", "Interesting"], desc: "Gaze out of someone else's window globally." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Fun", "Music"], desc: "Explore live radio by rotating the globe." },
  { name: "Pointer Pointer", url: "https://pointerpointer.com", cat: ["Fun"], desc: "A website that finds where your cursor is pointing." },
  { name: "ZoomQuilt", url: "https://zoomquilt.org", cat: ["Fun"], desc: "Infinite zoom artwork experience." },
  { name: "Hacker Typer", url: "https://hackertyper.com", cat: ["Fun"], desc: "Pretend to be a master hacker." },

  // Design & Creative
  { name: "AutoDraw", url: "https://autodraw.com", cat: ["Creative", "AI"], desc: "AI-powered tool that pairs machine learning with art." },
  { name: "Silk", url: "http://weavesilk.com", cat: ["Creative"], desc: "Create beautiful generative silk art." },
  { name: "Fontshare", url: "https://www.fontshare.com", cat: ["Design"], desc: "Free, high-quality fonts for everyone." },
  { name: "ColorSpace", url: "https://mycolor.space", cat: ["Design"], desc: "Generate perfect color palettes." },
  { name: "Tabler Icons", url: "https://tabler-icons.io", cat: ["Design"], desc: "Over 5,000 free customizable icons." },
  { name: "DrawKit", url: "https://www.drawkit.com", cat: ["Design"], desc: "Free vector illustrations and icons." },

  // Brain Games
  { name: "Human Benchmark", url: "https://humanbenchmark.com", cat: ["Brain Games"], desc: "Test your cognitive abilities and reaction time." },
  { name: "BrainBashers", url: "https://brainbashers.com", cat: ["Brain Games"], desc: "Puzzles, riddles, and daily brain games." },
  { name: "Logic Masters", url: "https://logic-masters.de", cat: ["Brain Games"], desc: "Global community for logic puzzles." },

  // Utilities & Internet
  { name: "TinyWow", url: "https://tinywow.com", cat: ["Utilities"], desc: "Comprehensive suite of free file conversion tools." },
  { name: "10 Minute Mail", url: "https://10minutemail.com", cat: ["Utilities", "Internet"], desc: "Secure, temporary disposable email address." },
  { name: "DNS Checker", url: "https://dnschecker.org", cat: ["Utilities"], desc: "Check DNS propagation worldwide." },
  { name: "URLScan", url: "https://urlscan.io", cat: ["Utilities"], desc: "Sandbox for analyzing suspicious websites." },

  // Science
  { name: "BioNumbers", url: "https://bionumbers.hms.harvard.edu", cat: ["Science"], desc: "Database of useful biological numbers." },
  { name: "CERN Open Data", url: "https://opendata.cern.ch", cat: ["Science"], desc: "Free data from high-energy physics." },
  { name: "Our World in Data", url: "https://ourworldindata.org", cat: ["Science"], desc: "Research and data to make progress against the world's largest problems." },

  // Freelancing & Productivity
  { name: "FlexJobs", url: "https://www.flexjobs.com", cat: ["Freelancing"], desc: "Hand-screened remote and flexible jobs." },
  { name: "Himalayas", url: "https://himalayas.app", cat: ["Freelancing"], desc: "The best remote job board on the web." },
  { name: "NoDesk", url: "https://nodesk.co", cat: ["Freelancing"], desc: "Resources for digital nomads and remote workers." }
];

export const MOCK_WEBSITES: Website[] = Array.from(new Set(RAW_SITES.map(s => s.url)))
  .map((url, index) => {
    const site = RAW_SITES.find(s => s.url === url)!;
    
    // Assign deterministic pricing to avoid hydration mismatch
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
