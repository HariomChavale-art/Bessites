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
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming"], desc: "Premier community for game modifications." },
  { name: "GameBanana", url: "https://gamebanana.com", cat: ["Gaming"], desc: "The game modding community site." },
  { name: "Playhop", url: "https://playhop.com", cat: ["Gaming"], desc: "Play free browser games instantly." },

  // Coding
  { name: "CodeSandbox", url: "https://codesandbox.io", cat: ["Coding"], desc: "Instant cloud development environment." },
  { name: "Glitch", url: "https://glitch.com", cat: ["Coding"], desc: "Build and deploy web apps together." },
  { name: "DevDocs", url: "https://devdocs.io", cat: ["Coding"], desc: "Fast, offline search for all documentation." },
  { name: "Hoppscotch", url: "https://hoppscotch.io", cat: ["Coding"], desc: "Open-source API development tool." },
  { name: "Roadmap.sh", url: "https://roadmap.sh", cat: ["Coding"], desc: "Visual guides for developer paths." },

  // Space
  { name: "Eyes on the Solar System", url: "https://eyes.nasa.gov", cat: ["Space"], desc: "NASA's 3D explorer for planets and spacecraft." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space"], desc: "Track satellites and ISS passes in real-time." },
  { name: "Satellite Map", url: "https://platform.leolabs.space/visualizations/leo", cat: ["Space"], desc: "Interactive visualization of objects in low Earth orbit." },
  { name: "APOD", url: "https://apod.nasa.gov", cat: ["Space"], desc: "Astronomy Picture of the Day." },

  // Earth & Weather
  { name: "Earth Nullschool", url: "https://earth.nullschool.net", cat: ["Earth & Weather"], desc: "Global map of wind, weather, and ocean conditions." },
  { name: "Ventusky", url: "https://ventusky.com", cat: ["Earth & Weather"], desc: "Live weather forecast and meteorological data maps." },
  { name: "Zoom Earth", url: "https://zoom.earth", cat: ["Earth & Weather"], desc: "Real-time satellite images and storm tracker." },
  { name: "Windy", url: "https://windy.com", cat: ["Earth & Weather"], desc: "Professional weather visualization for everyone." },

  // OSINT
  { name: "Have I Been Pwned", url: "https://haveibeenpwned.com", cat: ["OSINT", "Cybersecurity"], desc: "Check if your email or phone is in a data breach." },
  { name: "Hunter.io", url: "https://hunter.io", cat: ["OSINT"], desc: "Find and verify professional email addresses." },
  { name: "URLScan", url: "https://urlscan.io", cat: ["OSINT"], desc: "A sandbox for analyzing suspicious websites." },

  // Fun & Interesting
  { name: "Neal.fun", url: "https://neal.fun", cat: ["Fun", "Interesting"], desc: "Addictive and quirky web experiments." },
  { name: "WindowSwap", url: "https://window-swap.com", cat: ["Fun", "Interesting"], desc: "Gaze out of someone else's window globally." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Fun", "Music"], desc: "Explore live radio by rotating the globe." },
  { name: "Pointer Pointer", url: "https://pointerpointer.com", cat: ["Fun"], desc: "A website that finds where your cursor is pointing." },
  { name: "The Useless Web", url: "https://theuselessweb.com", cat: ["Fun"], desc: "Takes you to a random useless website." },

  // Creative
  { name: "AutoDraw", url: "https://autodraw.com", cat: ["Creative", "AI"], desc: "AI-powered tool that pairs machine learning with art." },
  { name: "Silk", url: "http://weavesilk.com", cat: ["Creative"], desc: "Create beautiful generative silk art." },
  { name: "Pixilart", url: "https://pixilart.com", cat: ["Creative"], desc: "Online social platform for pixel artists." },

  // Brain Games
  { name: "Human Benchmark", url: "https://humanbenchmark.com", cat: ["Brain Games"], desc: "Test your cognitive abilities and reaction time." },
  { name: "A Soft Murmur", url: "https://asoftmurmur.com", cat: ["Brain Games", "Utilities"], desc: "Ambient sounds to help you focus and relax." },
  { name: "BrainBashers", url: "https://brainbashers.com", cat: ["Brain Games"], desc: "Puzzles, riddles, and daily brain games." },

  // Geography
  { name: "GeoGuessr", url: "https://geoguessr.com", cat: ["Geography", "Gaming"], desc: "The world-famous geography discovery game." },
  { name: "Worldle", url: "https://worldle.teuteuf.fr", cat: ["Geography"], desc: "Guess the country based on its shape." },
  { name: "Seterra", url: "https://seterra.com", cat: ["Geography", "Learning"], desc: "Comprehensive geography quiz platform." },

  // Voice & Audio
  { name: "ElevenLabs", url: "https://elevenlabs.io", cat: ["Voice", "AI"], desc: "The most realistic AI voice generator." },
  { name: "TTSMaker", url: "https://ttsmaker.com", cat: ["Voice"], desc: "Free text-to-speech tool for high-quality audio." },
  { name: "MyNoise", url: "https://mynoise.net", cat: ["Audio"], desc: "Professional background noise generators." },

  // Reading & News
  { name: "Open Library", url: "https://openlibrary.org", cat: ["Reading"], desc: "One page for every book ever published." },
  { name: "Standard Ebooks", url: "https://standardebooks.org", cat: ["Reading"], desc: "Free, high-quality public domain ebooks." },
  { name: "Ground News", url: "https://ground.news", cat: ["News"], desc: "Compare news coverage from across the political spectrum." },
  { name: "Hacker News", url: "https://news.ycombinator.com", cat: ["News", "Coding"], desc: "The premier tech and startup news feed." },

  // Utilities & Internet
  { name: "TinyWow", url: "https://tinywow.com", cat: ["Utilities"], desc: "Comprehensive suite of free file conversion tools." },
  { name: "10 Minute Mail", url: "https://10minutemail.com", cat: ["Utilities", "Internet"], desc: "Secure, temporary disposable email address." },
  { name: "Internet Archive", url: "https://archive.org", cat: ["Internet"], desc: "Digital library of the internet and human history." },
  { name: "Wayback Machine", url: "https://web.archive.org", cat: ["Internet"], desc: "Explore the web's past through saved snapshots." },

  // SEO & Startups
  { name: "Ubersuggest", url: "https://neilpatel.com/ubersuggest", cat: ["SEO"], desc: "Free keyword research and SEO audit tool." },
  { name: "Product Hunt", url: "https://producthunt.com", cat: ["Startups", "Website Discovery"], desc: "Discover the next big thing in tech daily." },
  { name: "BetaList", url: "https://betalist.com", cat: ["Startups"], desc: "Discover the newest startups before they launch." },

  // Science & Math
  { name: "Wolfram Demonstrations", url: "https://demonstrations.wolfram.com", cat: ["Science"], desc: "Interactive visualizations for science and math." },
  { name: "PhET Simulations", url: "https://phet.colorado.edu", cat: ["Science"], desc: "Free interactive science and math simulations." },
  { name: "Desmos", url: "https://desmos.com", cat: ["Math"], desc: "The most powerful online graphing calculator." },
  { name: "Symbolab", url: "https://symbolab.com", cat: ["Math"], desc: "Step-by-step math solver for all levels." },

  // Movies & TV
  { name: "JustWatch", url: "https://justwatch.com", cat: ["Movies", "TV"], desc: "Find where to stream any movie or show." },
  { name: "Letterboxd", url: "https://letterboxd.com", cat: ["Movies"], desc: "Social network for film lovers." },
  { name: "TV Time", url: "https://tvtime.com", cat: ["TV"], desc: "Track your shows and discover what to watch next." },

  // Travel, Food & Fitness
  { name: "Atlas Obscura", url: "https://atlasobscura.com", cat: ["Travel", "Interesting"], desc: "Discover the world's most curious and hidden places." },
  { name: "Rome2Rio", url: "https://rome2rio.com", cat: ["Travel"], desc: "Search any city or address to find travel options." },
  { name: "SuperCook", url: "https://supercook.com", cat: ["Food"], desc: "Recipe search engine based on your ingredients." },
  { name: "MuscleWiki", url: "https://musclewiki.com", cat: ["Fitness"], desc: "Simplify your workout with clear exercise guides." }
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
