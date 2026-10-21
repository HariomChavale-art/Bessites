
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

const RAW_SITES = [
  // DESIGN
  { name: "Aceternity UI", url: "https://ui.aceternity.com", cat: ["Design", "UI Kit"], desc: "Premium React and Tailwind CSS components for high-end landing pages.", pricing: "Free" },
  { name: "Spline", url: "https://spline.design", cat: ["Design", "3D Design"], desc: "Collaborative browser-based 3D design software.", pricing: "Freemium" },
  { name: "Godly", url: "https://godly.website", cat: ["Design", "Inspiration"], desc: "Curated design gallery showcasing the top 1% of web projects.", pricing: "Free" },
  { name: "Mobbin", url: "https://mobbin.com", cat: ["Design", "UX Design"], desc: "Definitive reference library for digital product designers.", pricing: "Freemium" },
  { name: "Picular", url: "https://picular.co", cat: ["Design", "Colors"], desc: "Lightning-fast color search engine based on keywords.", pricing: "Free" },
  { name: "Storyset", url: "https://storyset.com", cat: ["Design", "Illustration"], desc: "Massive repository of customizable animated vector illustrations.", pricing: "Free" },
  { name: "Coolors", url: "https://coolors.co", cat: ["Design", "Colors"], desc: "Rapid-fire color palette generator and adjustment tool.", pricing: "Free" },
  { name: "Fontjoy", url: "https://fontjoy.com", cat: ["Design", "Typography"], desc: "AI-powered typography tool for font pairings.", pricing: "Free" },
  { name: "Realtime Colors", url: "https://realtimecolors.com", cat: ["Design", "Colors"], desc: "Test color palettes on a live website preview in real-time.", pricing: "Free" },
  { name: "Haikei", url: "https://haikei.app", cat: ["Design", "SVG"], desc: "SVG generator for abstract blobs, waves, and backgrounds.", pricing: "Free" },
  { name: "Shots", url: "https://shots.so", cat: ["Design", "Mockups"], desc: "Minimalist mockup tool for professional presentation graphics.", pricing: "Free" },
  { name: "Squoosh", url: "https://squoosh.app", cat: ["Design", "Utility"], desc: "High-performance image compression with visual comparison.", pricing: "Free" },
  { name: "UI Colors", url: "https://uicolors.app", cat: ["Design", "Tailwind"], desc: "Generate Tailwind CSS color scales from a hex code.", pricing: "Free" },
  { name: "Open Doodles", url: "https://opendoodles.com", cat: ["Design", "Illustration"], desc: "Free, sketchy vector illustrations for commercial use.", pricing: "Free" },
  
  // DEVELOPMENT
  { name: "Cursor", url: "https://cursor.com", cat: ["Development", "AI Coding"], desc: "AI-native code editor built for high-velocity teams.", pricing: "Freemium" },
  { name: "Supabase", url: "https://supabase.com", cat: ["Development", "Backend"], desc: "Open-source Firebase alternative with PostgreSQL.", pricing: "Freemium" },
  { name: "Vercel", url: "https://vercel.com", cat: ["Development", "Hosting"], desc: "Frontend cloud platform optimized for Next.js.", pricing: "Freemium" },
  { name: "Resend", url: "https://resend.com", cat: ["Development", "Email"], desc: "Modern email API designed specifically for developers.", pricing: "Freemium" },
  { name: "PostHog", url: "https://posthog.com", cat: ["Development", "Analytics"], desc: "Open-source product analytics and session replays.", pricing: "Freemium" },
  { name: "v0", url: "https://v0.dev", cat: ["Development", "Generative UI"], desc: "Generative UI system by Vercel for React and Tailwind.", pricing: "Freemium" },
  { name: "Lovable", url: "https://lovable.dev", cat: ["Development", "AI Engineer"], desc: "Autonomous AI software engineer for full-stack apps.", pricing: "Paid" },
  { name: "Ray.so", url: "https://ray.so", cat: ["Development", "Utility"], desc: "Create beautiful code snippet screenshots.", pricing: "Free" },
  { name: "Carbon", url: "https://carbon.now.sh", cat: ["Development", "Utility"], desc: "The original tool for aesthetic source code images.", pricing: "Free" },
  { name: "Regex101", url: "https://regex101.com", cat: ["Development", "Coding"], desc: "Definitive regular expression debugger.", pricing: "Free" },
  { name: "Bundlephobia", url: "https://bundlephobia.com", cat: ["Development", "Performance"], desc: "Analyze bundle size impact of npm packages.", pricing: "Free" },
  { name: "JSON Crack", url: "https://jsoncrack.com", cat: ["Development", "Visualization"], desc: "Visual data structure explorer for JSON/YAML/XML.", pricing: "Freemium" },
  { name: "Transform Tools", url: "https://transform.tools", cat: ["Development", "Utility"], desc: "Polyglot code converter for dozens of formats.", pricing: "Free" },
  { name: "CSS Grid Generator", url: "https://cssgrid-generator.netlify.app", cat: ["Development", "Frontend"], desc: "Visual drag-and-drop tool for CSS Grid layouts.", pricing: "Free" },
  { name: "CodeSandbox", url: "https://codesandbox.io", cat: ["Development", "IDE"], desc: "Cloud-hosted web development environment.", pricing: "Freemium" },
  { name: "Biome", url: "https://biomejs.dev", cat: ["Development", "Linting"], desc: "High-performance toolchain for formatting and linting.", pricing: "Free" },
  { name: "Bun", url: "https://bun.sh", cat: ["Development", "Runtime"], desc: "Fast all-in-one JavaScript runtime and manager.", pricing: "Free" },
  { name: "Mintlify", url: "https://mintlify.com", cat: ["Development", "Docs"], desc: "Modern documentation engine for codebases.", pricing: "Freemium" },
  { name: "Prisma", url: "https://www.prisma.io", cat: ["Development", "Database"], desc: "Next-generation Node.js and TypeScript ORM.", pricing: "Free" },
  { name: "PlanetScale", url: "https://planetscale.com", cat: ["Development", "Database"], desc: "Serverless MySQL database platform.", pricing: "Paid" },
  { name: "Upstash", url: "https://upstash.com", cat: ["Development", "Database"], desc: "Serverless Redis, Kafka, and Vector databases.", pricing: "Freemium" },
  { name: "Clerk", url: "https://clerk.com", cat: ["Development", "Auth"], desc: "Complete user authentication for React and Next.js.", pricing: "Freemium" },
  
  // AUDIO
  { name: "ElevenLabs", url: "https://elevenlabs.io", cat: ["Audio", "Voice AI"], desc: "Hyper-realistic generative voice AI platform.", pricing: "Freemium" },
  { name: "Descript", url: "https://www.descript.com", cat: ["Audio", "Editing"], desc: "Multimedia editing platform driven by text transcripts.", pricing: "Freemium" },
  { name: "Moises.ai", url: "https://moises.ai", cat: ["Audio", "Production"], desc: "AI audio workstation that separates distinct stems.", pricing: "Freemium" },
  { name: "Soundraw", url: "https://soundraw.io", cat: ["Audio", "Generative AI"], desc: "Generative AI music composition tool.", pricing: "Paid" },
  { name: "Landr", url: "https://www.landr.com", cat: ["Audio", "Mastering"], desc: "Automated cloud-based mastering service.", pricing: "Paid" },
  { name: "BeepBox", url: "https://www.beepbox.co", cat: ["Audio", "Chiptune"], desc: "Minimalist sketchpad for chiptune and 8-bit loops.", pricing: "Free" },
  { name: "Audiotool", url: "https://www.audiotool.com", cat: ["Audio", "Production"], desc: "Collaborative modular music production suite.", pricing: "Free" },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Audio", "Discovery"], desc: "Explore live radio stations via an interactive 3D globe.", pricing: "Free" },
  { name: "MyNoise", url: "https://mynoise.net", cat: ["Audio", "Ambient"], desc: "Calibrated ambient background noise generator.", pricing: "Free" },
  { name: "Vocal Remover", url: "https://vocalremover.org", cat: ["Audio", "Utility"], desc: "Split any audio file into vocal and instrumental.", pricing: "Free" },
  { name: "Freesound", url: "https://freesound.org", cat: ["Audio", "SFX"], desc: "World's largest database of Creative Commons sound effects.", pricing: "Free" },
  { name: "Online Sequencer", url: "https://onlinesequencer.net", cat: ["Audio", "Sequencer"], desc: "Robust browser-based MIDI sequencer.", pricing: "Free" },
  { name: "Samplette", url: "https://samplette.io", cat: ["Audio", "Discovery"], desc: "Discover obscure music samples on YouTube.", pricing: "Free" },
  { name: "LALAL.AI", url: "https://lalal.ai", cat: ["Audio", "Utility"], desc: "High-precision stem separation service.", pricing: "Paid" },
  { name: "Soundtrap", url: "https://soundtrap.com", cat: ["Audio", "Production"], desc: "Collaborative cloud-based digital audio workstation.", pricing: "Freemium" },

  // GAMING
  { name: "Lichess", url: "https://lichess.org", cat: ["Gaming", "Chess"], desc: "Free, open-source online chess platform.", pricing: "Free" },
  { name: "BoardGameGeek", url: "https://boardgamegeek.com", cat: ["Gaming", "Tabletop"], desc: "Encyclopedia and community authority on tabletop games.", pricing: "Free" },
  { name: "Itch.io", url: "https://itch.io", cat: ["Gaming", "Indie"], desc: "Premier independent game marketplace for creators.", pricing: "Free" },
  { name: "Slow Roads", url: "https://slowroads.io", cat: ["Gaming", "Simulator"], desc: "Procedural browser driving simulator.", pricing: "Free" },
  { name: "Neal.fun", url: "https://neal.fun", cat: ["Gaming", "Experiments"], desc: "Collection of viral, high-concept interactive web experiments.", pricing: "Free" },
  { name: "PuzzGrid", url: "https://puzzgrid.com", cat: ["Gaming", "Puzzles"], desc: "Interactive puzzles inspired by 'Only Connect'.", pricing: "Free" },
  { name: "Playroom", url: "https://joinplayroom.com", cat: ["Gaming", "Multiplayer"], desc: "Turn smartphones into controllers for browser games.", pricing: "Free" },
  { name: "Piskel", url: "https://piskelapp.com", cat: ["Gaming", "Pixel Art"], desc: "Free online pixel art and animated sprite editor.", pricing: "Free" },
  { name: "Kenney", url: "https://kenney.nl", cat: ["Gaming", "Assets"], desc: "Repository of public-domain game assets (CC0).", pricing: "Free" },
  { name: "Lospec", url: "https://lospec.com", cat: ["Gaming", "Pixel Art"], desc: "Resource hub for retro game artists.", pricing: "Free" },
  { name: "Bfxr", url: "https://bfxr.net", cat: ["Gaming", "SFX"], desc: "Retro 8-bit sound effects synthesizer.", pricing: "Free" },
  { name: "Mixamo", url: "https://mixamo.com", cat: ["Gaming", "3D Animation"], desc: "Automated 3D character rigging and animation.", pricing: "Free" },
  { name: "GameMaker", url: "https://gamemaker.io", cat: ["Gaming", "Engine"], desc: "Powerful 2D game engine for visual and script coding.", pricing: "Freemium" },

  // PRODUCTIVITY
  { name: "Linear", url: "https://linear.app", cat: ["Productivity", "PM"], desc: "High-performance issue tracker for modern teams.", pricing: "Freemium" },
  { name: "Notion", url: "https://notion.so", cat: ["Productivity", "Notes"], desc: "All-in-one workspace for notes, databases, and wikis.", pricing: "Freemium" },
  { name: "Obsidian", url: "https://obsidian.md", cat: ["Productivity", "Notes"], desc: "Extensible private knowledge management app.", pricing: "Free" },
  { name: "Goblin.tools", url: "https://goblin.tools", cat: ["Productivity", "AI Productivity"], desc: "AI-assisted suite for neurodivergent individuals.", pricing: "Free" },
  { name: "TinyWow", url: "https://tinywow.com", cat: ["Productivity", "Utility"], desc: "Free, single-purpose file utilities (PDF, Image, Video).", pricing: "Free" },
  { name: "Loom", url: "https://loom.com", cat: ["Productivity", "Video"], desc: "Screen and camera recording for fast video messaging.", pricing: "Freemium" },
  { name: "10 Minute Mail", url: "https://10minutemail.com", cat: ["Productivity", "Email"], desc: "Disposable, self-destructing email service.", pricing: "Free" },
  { name: "Privnote", url: "https://privnote.com", cat: ["Productivity", "Privacy"], desc: "Send notes that self-destruct after being read.", pricing: "Free" },
  { name: "Excalidraw", url: "https://excalidraw.com", cat: ["Productivity", "Whiteboard"], desc: "Virtual whiteboard with a hand-drawn sketch aesthetic.", pricing: "Free" },
  { name: "Tldraw", url: "https://tldraw.com", cat: ["Productivity", "Whiteboard"], desc: "Minimalist, ultra-responsive digital canvas.", pricing: "Free" },
  { name: "Milanote", url: "https://milanote.com", cat: ["Productivity", "Creative"], desc: "Visual workspace designed for creative projects.", pricing: "Freemium" },
  { name: "Maildrop", url: "https://maildrop.cc", cat: ["Productivity", "Privacy"], desc: "High-performance disposable email address system.", pricing: "Free" },

  // HARDWARE
  { name: "McMaster-Carr", url: "https://www.mcmaster.com", cat: ["Hardware", "Industrial"], desc: "Industrial hardware directory for engineers.", pricing: "Paid" },
  { name: "OSH Park", url: "https://oshpark.com", cat: ["Hardware", "Manufacturing"], desc: "PCB fabrication service for electronics designers.", pricing: "Paid" },
  { name: "Hackaday", url: "https://hackaday.com", cat: ["Hardware", "Hacks"], desc: "Editorial journal for the global engineering community.", pricing: "Free" },
  { name: "Shapr3D", url: "https://www.shapr3d.com", cat: ["Hardware", "CAD"], desc: "High-performance CAD optimized for mobile devices.", pricing: "Paid" },
  { name: "Onshape", url: "https://www.onshape.com", cat: ["Hardware", "CAD"], desc: "Cloud-native professional 3D CAD platform.", pricing: "Freemium" },
  { name: "Wokwi", url: "https://wokwi.com", cat: ["Hardware", "Simulation"], desc: "Interactive online simulator for Arduino and ESP32.", pricing: "Free" },
  { name: "EasyEDA", url: "https://easyeda.com", cat: ["Hardware", "Design"], desc: "Cloud-based electronic design automation tool.", pricing: "Free" },
  { name: "LittleMachineShop", url: "https://littlemachineshop.com/reference", cat: ["Hardware", "Machining"], desc: "Technical reference portal for machinists.", pricing: "Free" },

  // OUTDOORS
  { name: "Caltopo", url: "https://caltopo.com", cat: ["Outdoors", "Mapping"], desc: "Backcountry mapping and planning tool.", pricing: "Freemium" },
  { name: "AllTrails", url: "https://www.alltrails.com", cat: ["Outdoors", "Hiking"], desc: "Comprehensive trail guide database for hiking.", pricing: "Freemium" },
  { name: "Mountain Project", url: "https://www.mountainproject.com", cat: ["Outdoors", "Climbing"], desc: "Definitive rock climbing guidebook for North America.", pricing: "Free" },
  { name: "Windy", url: "https://www.windy.com", cat: ["Outdoors", "Weather"], desc: "High-fidelity global weather visualization service.", pricing: "Free" },
  { name: "FlightAware", url: "https://flightaware.com", cat: ["Outdoors", "Aviation"], desc: "Global flight tracking and telemetry platform.", pricing: "Free" },
  { name: "MarineTraffic", url: "https://www.marinetraffic.com", cat: ["Outdoors", "Maritime"], desc: "Maritime surveillance system for global ships.", pricing: "Freemium" },
  { name: "PeakVisor", url: "https://peakvisor.com", cat: ["Outdoors", "Hiking"], desc: "AR-powered mountain identification tool.", pricing: "Freemium" },
  { name: "SkyVector", url: "https://skyvector.com", cat: ["Outdoors", "Aviation"], desc: "Interactive aeronautical chart browser.", pricing: "Free" },
  { name: "Navionics", url: "https://webapp.navionics.com", cat: ["Outdoors", "Maritime"], desc: "Specialized marine navigation chart viewer.", pricing: "Freemium" },

  // SECURITY
  { name: "Shodan", url: "https://www.shodan.io", cat: ["Security", "OSINT"], desc: "Search engine for Internet-connected devices.", pricing: "Freemium" },
  { name: "Have I Been Pwned", url: "https://haveibeenpwned.com", cat: ["Security", "Privacy"], desc: "Security verification for compromised accounts.", pricing: "Free" },
  { name: "VirusTotal", url: "https://www.virustotal.com", cat: ["Security", "Antivirus"], desc: "Multi-engine malware analysis for files and URLs.", pricing: "Free" },
  { name: "Exploit Database", url: "https://www.exploit-db.com", cat: ["Security", "Exploits"], desc: "CVE-compliant archive of public exploits.", pricing: "Free" },
  { name: "CyberChef", url: "https://gchq.github.io/CyberChef", cat: ["Security", "Utility"], desc: "Swiss Army Knife for complex data operations.", pricing: "Free" },
  { name: "ANY.RUN", url: "https://any.run", cat: ["Security", "Sandbox"], desc: "Interactive cloud sandbox for suspicious files.", pricing: "Freemium" },
  { name: "Bellingcat Toolkit", url: "https://bit.ly/bcat-tools", cat: ["Security", "OSINT"], desc: "Master registry of digital investigation tools.", pricing: "Free" },

  // EDUCATION
  { name: "Roadmap.sh", url: "https://roadmap.sh", cat: ["Education", "Careers"], desc: "Library of visual learning paths for software roles.", pricing: "Free" },
  { name: "Exercism", url: "https://exercism.org", cat: ["Education", "Coding"], desc: "Language-specific coding exercises with mentorship.", pricing: "Free" },
  { name: "Connected Papers", url: "https://www.connectedpapers.com", cat: ["Education", "Research"], desc: "Visual bibliographic tool for academic research.", pricing: "Freemium" },
  { name: "Consensus", url: "https://consensus.app", cat: ["Education", "AI Search"], desc: "AI-powered academic search engine.", pricing: "Freemium" },
  { name: "Brilliant", url: "https://brilliant.org", cat: ["Education", "Science"], desc: "Interactive STEM learning platform.", pricing: "Paid" },
  { name: "Khan Academy", url: "https://www.khanacademy.org", cat: ["Education", "School"], desc: "Global non-profit educational tutorials.", pricing: "Free" },
  { name: "Duolingo", url: "https://www.duolingo.com", cat: ["Education", "Languages"], desc: "Most popular gamified language learning app.", pricing: "Freemium" },
  { name: "Wolfram Alpha", url: "https://www.wolframalpha.com", cat: ["Education", "Math"], desc: "Computational knowledge engine.", pricing: "Freemium" },

  // FINANCE
  { name: "TradingView", url: "https://www.tradingview.com", cat: ["Finance", "Stocks"], desc: "Cloud charting for financial markets.", pricing: "Freemium" },
  { name: "Finviz", url: "https://finviz.com", cat: ["Finance", "Stocks"], desc: "Stock screening and market visualization.", pricing: "Freemium" },
  { name: "Koyfin", url: "https://www.koyfin.com", cat: ["Finance", "Investing"], desc: "Investment analytics platform alternative to Bloomberg.", pricing: "Freemium" },
  { name: "DefiLlama", url: "https://defillama.com", cat: ["Finance", "Crypto"], desc: "Open data aggregator for DeFi analytics.", pricing: "Free" },
  { name: "CoinGecko", url: "https://www.coingecko.com", cat: ["Finance", "Crypto"], desc: "Independent cryptocurrency data aggregator.", pricing: "Free" }
];

export const MOCK_WEBSITES: Website[] = Array.from(new Set(RAW_SITES.map(s => s.url)))
  .map((url, index) => {
    const site = RAW_SITES.find(s => s.url === url)!;
    const pricing = site.pricing || "Free";

    return {
      id: `site-${index}`,
      name: site.name, 
      websiteName: site.name, 
      developer: "Bessites Curation",
      description: site.desc, 
      longDescription: site.desc,
      rating: 4.5 + (Math.random() * 0.5),
      reviewCount: 12 + Math.floor(Math.random() * 100),
      categories: site.cat || [],
      imageUrl: "", 
      screenshots: [],
      url: site.url,
      size: "N/A",
      version: "1.0",
      updatedAt: "2024",
      pricing: pricing as any,
      pros: ["Hand-picked quality", "Verified URL", "Highly useful"],
      cons: ["May require account", "Limited free tier"],
      bestFor: "General users and digital creators."
    };
  });
