/**
 * @fileOverview Official Bessites Master Tools Registry.
 * High-fidelity data for Ouneo AI Discovery.
 */

export interface ToolEntry {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string[];
  keywords: string[];
  pricing: "Free" | "Paid" | "Freemium";
  rating: number;
}

export const TOOLS_DATABASE: ToolEntry[] = [
  // --- AI & PRODUCTIVITY ---
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chatgpt.com",
    category: "AI Chat",
    description: "The world's leading conversational AI by OpenAI.",
    longDescription: "ChatGPT is a powerful AI chatbot that can help with writing, coding, translation, and general productivity using the latest GPT models.",
    tags: ["ai chat", "chatbot", "gpt4", "writing assistant"],
    keywords: ["chat", "gpt", "openai", "ask assistant", "ai helper"],
    pricing: "Freemium",
    rating: 5.0
  },
  {
    id: "perplexity",
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    category: "AI Search",
    description: "AI search engine that provides cited, real-time answers.",
    longDescription: "Perplexity is a conversational search engine that delivers accurate, cited answers to complex questions using the latest LLMs and live web indexing.",
    tags: ["ai search", "research", "search engine", "information"],
    keywords: ["search", "perplexity", "ask ai", "research tool", "real time search"],
    pricing: "Freemium",
    rating: 4.8
  },
  {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai",
    category: "AI Chat",
    description: "Advanced AI assistant with high-fidelity writing and coding.",
    longDescription: "Claude by Anthropic is known for its nuanced reasoning, safety-first design, and large context windows for analyzing massive documents.",
    tags: ["ai chat", "anthropic", "coding helper", "writing"],
    keywords: ["claude", "ai assistant", "coding ai", "anthropic"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "grammarly",
    name: "Grammarly",
    url: "https://www.grammarly.com",
    category: "Writing",
    description: "AI writing assistant for grammar, tone, and clarity.",
    longDescription: "Grammarly makes your communication clear and effective by checking spelling, grammar, and tone across all your web apps and desktop tools.",
    tags: ["writing", "grammar", "editing", "assistant"],
    keywords: ["write", "grammarly", "fix grammar", "spell check", "ai editor"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    url: "https://www.notion.so",
    category: "Productivity",
    description: "Integrated AI for notes, docs, and task management.",
    longDescription: "Notion AI helps you write, summarize, and organize your work inside your connected workspace, turning messy notes into polished documents.",
    tags: ["notes", "productivity", "docs", "workspace"],
    keywords: ["notion", "organize", "notes ai", "task management"],
    pricing: "Paid",
    rating: 4.8
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    url: "https://www.copy.ai",
    category: "Writing",
    description: "AI copywriter for marketing, ads, and social content.",
    longDescription: "Copy.ai helps teams generate high-converting copy for emails, blogs, and social media ads in seconds using generative AI.",
    tags: ["writing", "copywriting", "marketing", "ads"],
    keywords: ["write", "copy", "ai writer", "marketing tool"],
    pricing: "Freemium",
    rating: 4.5
  },

  // --- DESIGN & CREATIVE ---
  {
    id: "canva",
    name: "Canva",
    url: "https://www.canva.com",
    category: "Design",
    description: "All-in-one AI design tool for logos, posters, and resumes.",
    longDescription: "Canva is the world's most popular design platform. Use it to make logos, social media posts, presentations, and posters with drag-and-drop ease and AI assistance.",
    tags: ["logo maker", "poster maker", "resume builder", "graphic design", "social media"],
    keywords: ["logo", "canva", "design", "poster", "graphics", "make logo", "free logo"],
    pricing: "Freemium",
    rating: 4.8
  },
  {
    id: "midjourney",
    name: "Midjourney",
    url: "https://www.midjourney.com",
    category: "Design",
    description: "The most advanced AI image generation engine.",
    longDescription: "Midjourney generates stunning, artistic images from simple text prompts using proprietary models accessible via Discord.",
    tags: ["image generation", "ai art", "visuals", "concept art"],
    keywords: ["midjourney", "ai image", "art generator", "mj", "generative art"],
    pricing: "Paid",
    rating: 5.0
  },
  {
    id: "looka",
    name: "Looka",
    url: "https://looka.com",
    category: "Design",
    description: "AI logo maker and complete brand identity platform.",
    longDescription: "Looka uses AI to design a custom logo and build a professional brand identity you love instantly.",
    tags: ["logo maker", "branding", "ai design", "logo builder"],
    keywords: ["logo", "brand", "make logo", "branding ai"],
    pricing: "Paid",
    rating: 4.7
  },
  {
    id: "leonardo-ai",
    name: "Leonardo AI",
    url: "https://leonardo.ai",
    category: "Design",
    description: "Creative AI for production-quality images and textures.",
    longDescription: "Leonardo provides advanced generative tools to create consistent, stunning visuals and 3D textures for game assets and marketing.",
    tags: ["image generation", "ai art", "game assets", "3d textures"],
    keywords: ["leonardo", "ai image", "art", "generative graphics"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "photopea",
    name: "Photopea",
    url: "https://www.photopea.com",
    category: "Photo Editing",
    description: "Free online image editor that works like Photoshop.",
    longDescription: "Professional web-based photo editor supporting PSD, Sketch, and XCF formats with all essential layer-based editing tools.",
    tags: ["photo editor", "photoshop online", "free psd", "image editor"],
    keywords: ["edit photo", "photopea", "photoshop", "online editor"],
    pricing: "Free",
    rating: 4.7
  },
  {
    id: "remove-bg",
    name: "Remove.bg",
    url: "https://www.remove.bg",
    category: "Photo Editing",
    description: "Remove image backgrounds automatically in 5 seconds.",
    longDescription: "Remove.bg uses AI to strip backgrounds from any photo instantly. Perfect for product shots and profile pictures.",
    tags: ["background remover", "remove bg", "transparent background", "image editor"],
    keywords: ["remove background", "bg remover", "transparent", "remove.bg", "erase bg"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "spline",
    name: "Spline",
    url: "https://spline.design",
    category: "Design",
    description: "Collaborative 3D design software for the web.",
    longDescription: "Build interactive 3D experiences directly in the browser with real-time lighting, physics, and export options for React.",
    tags: ["3d design", "webgl", "interactive", "animation"],
    keywords: ["3d", "spline", "web design", "3d model"],
    pricing: "Freemium",
    rating: 4.8
  },
  {
    id: "godly",
    name: "Godly",
    url: "https://godly.website",
    category: "Design",
    description: "Curated gallery of the world's best web design.",
    longDescription: "A strictly curated design gallery that showcases the top 1% of web design projects worldwide for layout and interaction inspiration.",
    tags: ["design inspiration", "web design", "curation", "layout"],
    keywords: ["inspiration", "gallery", "web design", "godly"],
    pricing: "Free",
    rating: 4.9
  },
  {
    id: "storyset",
    name: "Storyset",
    url: "https://storyset.com",
    category: "Design",
    description: "Customizable vector illustrations for your projects.",
    longDescription: "A massive repository of high-quality vector illustrations that can be customized and animated directly in the browser.",
    tags: ["illustration", "vectors", "svg", "graphics"],
    keywords: ["illustrations", "vectors", "storyset", "freepik"],
    pricing: "Free",
    rating: 4.7
  },
  {
    id: "coolors",
    name: "Coolors",
    url: "https://coolors.co",
    category: "Design",
    description: "The super fast color palettes generator.",
    longDescription: "Generate perfect color schemes for your projects instantly. Includes color blind simulations and export tools.",
    tags: ["colors", "palette", "branding", "generator"],
    keywords: ["color palette", "colors", "scheme", "coolors"],
    pricing: "Free",
    rating: 4.8
  },

  // --- DEVELOPMENT ---
  {
    id: "cursor",
    name: "Cursor",
    url: "https://cursor.sh",
    category: "Development",
    description: "The AI-native code editor built for high-velocity teams.",
    longDescription: "Cursor is a fork of VS Code with AI deeply integrated. It helps you write, refactor, and understand code 10x faster using LLMs.",
    tags: ["code editor", "ai coding", "ide", "development"],
    keywords: ["coding", "programming", "cursor", "ai code", "vs code ai"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "v0",
    name: "v0 by Vercel",
    url: "https://v0.dev",
    category: "Development",
    description: "Generative UI system for React and Tailwind.",
    longDescription: "Turn natural language prompts into production-ready React components using Tailwind CSS and Shadcn UI.",
    tags: ["generative ui", "react", "tailwind", "nextjs"],
    keywords: ["v0", "vercel", "ui generator", "code generator"],
    pricing: "Freemium",
    rating: 4.8
  },
  {
    id: "supabase",
    name: "Supabase",
    url: "https://supabase.com",
    category: "Development",
    description: "Open source Firebase alternative with PostgreSQL.",
    longDescription: "The open source Firebase alternative. Build your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.",
    tags: ["backend", "database", "auth", "postgres"],
    keywords: ["supabase", "backend as a service", "firebase alternative", "postgres"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "vercel",
    name: "Vercel",
    url: "https://vercel.com",
    category: "Development",
    description: "Frontend cloud platform for Next.js and more.",
    longDescription: "Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.",
    tags: ["hosting", "nextjs", "deployment", "serverless"],
    keywords: ["vercel", "hosting", "deploy", "nextjs"],
    pricing: "Freemium",
    rating: 5.0
  },
  {
    id: "resend",
    name: "Resend",
    url: "https://resend.com",
    category: "Development",
    description: "Modern email API for developers.",
    longDescription: "Email for developers who love React. High deliverability, clean API, and best-in-class developer experience.",
    tags: ["email", "api", "smtp", "transactional"],
    keywords: ["resend", "email api", "react email"],
    pricing: "Freemium",
    rating: 4.8
  },
  {
    id: "posthog",
    name: "PostHog",
    url: "https://posthog.com",
    category: "Development",
    description: "All-in-one product analytics and session recording.",
    longDescription: "The open source Product OS. Everything you need to build a successful product: analytics, feature flags, session recording, and A/B testing.",
    tags: ["analytics", "product", "features", "heatmaps"],
    keywords: ["posthog", "product analytics", "session replay"],
    pricing: "Freemium",
    rating: 4.7
  },
  {
    id: "lovable",
    name: "Lovable",
    url: "https://lovable.dev",
    category: "Development",
    description: "AI software engineer that builds full-stack apps.",
    longDescription: "An autonomous AI software engineer that builds, tests, and deploys complete full-stack web applications from plain English descriptions.",
    tags: ["ai engineer", "no-code", "app builder", "full-stack"],
    keywords: ["lovable", "ai app builder", "software engineer ai"],
    pricing: "Paid",
    rating: 4.6
  },
  {
    id: "regex101",
    name: "Regex101",
    url: "https://regex101.com",
    category: "Development",
    description: "Regular expression debugger and educational tool.",
    longDescription: "The definitive tool for writing, testing, and debugging regular expressions with real-time explanations.",
    tags: ["regex", "coding", "debugger", "utility"],
    keywords: ["regex", "regular expression", "tester"],
    pricing: "Free",
    rating: 4.9
  },

  // --- VIDEO & AUDIO ---
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    url: "https://elevenlabs.io",
    category: "Audio",
    description: "Hyper-realistic AI voice generation and cloning.",
    longDescription: "The industry-leading generative voice AI platform capable of producing high-fidelity speech and voice clones for any project.",
    tags: ["voice ai", "tts", "cloning", "audio"],
    keywords: ["elevenlabs", "voice generator", "text to speech"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "capcut",
    name: "CapCut",
    url: "https://www.capcut.com",
    category: "Video",
    description: "Easy-to-use AI video editor for social media.",
    longDescription: "CapCut offers AI templates, captions, and professional effects for TikTok, Reels, and YouTube creators.",
    tags: ["video editor", "tiktok", "reels", "shorts"],
    keywords: ["video", "edit video", "capcut", "tiktok editor"],
    pricing: "Free",
    rating: 4.8
  },
  {
    id: "invideo",
    name: "InVideo AI",
    url: "https://invideo.io",
    category: "Video",
    description: "Turn text prompts into high-quality AI videos.",
    longDescription: "InVideo AI generates scripts, voiceovers, and footage to create complete videos from your ideas instantly.",
    tags: ["video generator", "text to video", "ai video", "social media"],
    keywords: ["video", "make video", "ai video editor"],
    pricing: "Freemium",
    rating: 4.7
  },
  {
    id: "descript",
    name: "Descript",
    url: "https://www.descript.com",
    category: "Audio",
    description: "Edit audio and video by editing text transcripts.",
    longDescription: "A revolutionary multimedia editing platform where users edit media by editing a text transcript. Includes AI voice cloning.",
    tags: ["podcast editor", "video editor", "transcription", "cloning"],
    keywords: ["descript", "transcribe", "edit podcast"],
    pricing: "Freemium",
    rating: 4.8
  },
  {
    id: "radio-garden",
    name: "Radio Garden",
    url: "https://radio.garden",
    category: "Audio",
    description: "Interactive 3D globe to explore live radio stations.",
    longDescription: "An interactive 3D globe that allows users to explore and tune into live radio stations from every corner of the planet.",
    tags: ["radio", "global", "music discovery", "interactive"],
    keywords: ["radio garden", "live radio", "world music"],
    pricing: "Free",
    rating: 4.9
  },
  {
    id: "vocal-remover",
    name: "Vocal Remover",
    url: "https://vocalremover.org",
    category: "Audio",
    description: "Split audio into separate vocal and instrumental tracks.",
    longDescription: "A straightforward AI tool that splits any audio file into separate vocal and instrumental tracks for karaoke or remixing.",
    tags: ["karaoke", "stems", "ai audio", "music"],
    keywords: ["remove vocals", "instrumental maker", "karaoke"],
    pricing: "Free",
    rating: 4.8
  },

  // --- GAMING & FUN ---
  {
    id: "lichess",
    name: "Lichess",
    url: "https://lichess.org",
    category: "Gaming",
    description: "Free, open-source online chess platform.",
    longDescription: "A completely free, open-source online chess platform supported by donations. Unlimited professional analysis and play.",
    tags: ["chess", "grandmaster", "multiplayer", "puzzle"],
    keywords: ["chess", "lichess", "play chess"],
    pricing: "Free",
    rating: 5.0
  },
  {
    id: "slow-roads",
    name: "Slow Roads",
    url: "https://slowroads.io",
    category: "Gaming",
    description: "Procedural browser driving simulator.",
    longDescription: "A zen-like driving experience with endless road trips across procedurally generated terrain in the browser.",
    tags: ["driving", "simulator", "zen", "webgl"],
    keywords: ["car game", "slow roads", "browser sim"],
    pricing: "Free",
    rating: 4.8
  },
  {
    id: "neal-fun",
    name: "Neal.fun",
    url: "https://neal.fun",
    category: "Gaming",
    description: "Collection of creative interactive web experiments.",
    longDescription: "High-concept interactive web toys like Infinite Craft and The Deep Sea that celebrate internet curiosity.",
    tags: ["experiments", "fun", "interactive", "games"],
    keywords: ["neal fun", "internet art", "quicky games"],
    pricing: "Free",
    rating: 4.9
  },
  {
    id: "itch-io",
    name: "Itch.io",
    url: "https://itch.io",
    category: "Gaming",
    description: "Premier independent game marketplace.",
    longDescription: "The central hub for indie developers to host, sell, and share experimental titles and game assets.",
    tags: ["indie games", "marketplace", "assets", "game jam"],
    keywords: ["itchio", "indie games", "free games"],
    pricing: "Free",
    rating: 4.8
  },

  // --- SECURITY & UTILITIES ---
  {
    id: "shodan",
    name: "Shodan",
    url: "https://www.shodan.io",
    category: "Security",
    description: "Search engine for Internet-connected devices.",
    longDescription: "The search engine for everything connected to the internet: servers, industrial controls, and IoT cameras.",
    tags: ["cybersecurity", "iot", "scanning", "research"],
    keywords: ["shodan", "hacker search", "internet of things"],
    pricing: "Freemium",
    rating: 4.7
  },
  {
    id: "have-i-been-pwned",
    name: "Have I Been Pwned",
    url: "https://haveibeenpwned.com",
    category: "Security",
    description: "Check if your credentials were exposed in data breaches.",
    longDescription: "Security verification service that indexes billions of compromised account records from public leaks.",
    tags: ["privacy", "leaks", "security", "identity"],
    keywords: ["hibp", "data breach", "pwned"],
    pricing: "Free",
    rating: 4.9
  },
  {
    id: "virus-total",
    name: "VirusTotal",
    url: "https://www.virustotal.com",
    category: "Security",
    description: "Multi-engine malware analysis for files and URLs.",
    longDescription: "Inspect suspicious files, domains, and IP addresses using dozens of antivirus engines and thread intelligence feeds.",
    tags: ["antivirus", "malware", "scanning", "urls"],
    keywords: ["virustotal", "scan file", "safe url"],
    pricing: "Free",
    rating: 4.8
  },
  {
    id: "cyberchef",
    name: "CyberChef",
    url: "https://gchq.github.io/CyberChef",
    category: "Security",
    description: "Swiss Army Knife for complex data operations.",
    longDescription: "In-browser tool for encoding, decoding, compression, and analysis of data. Developed by GCHQ.",
    tags: ["data utility", "encoding", "crypto", "hex"],
    keywords: ["cyberchef", "base64", "decode"],
    pricing: "Free",
    rating: 5.0
  },
  {
    id: "tinywow",
    name: "TinyWow",
    url: "https://tinywow.com",
    category: "Utilities",
    description: "Huge collection of free single-purpose file utilities.",
    longDescription: "No-signup tools for everything: PDF editing, video downloading, image conversion, and AI writing.",
    tags: ["pdf tools", "converters", "video downloader", "ai"],
    keywords: ["tinywow", "pdf editor", "download video"],
    pricing: "Free",
    rating: 4.8
  },
  {
    id: "privnote",
    name: "Privnote",
    url: "https://privnote.com",
    category: "Productivity",
    description: "Send notes that self-destruct after being read.",
    longDescription: "Secure service for sending confidential information via links that cannot be accessed twice.",
    tags: ["privacy", "notes", "secure", "self-destruct"],
    keywords: ["private note", "secure link", "confidential"],
    pricing: "Free",
    rating: 4.7
  },

  // --- LEARNING & FINANCE ---
  {
    id: "roadmap-sh",
    name: "Roadmap.sh",
    url: "https://roadmap.sh",
    category: "Education",
    description: "Visual learning paths for software engineering.",
    longDescription: "Interactive step-by-step guides on mastering technologies required for modern developer roles.",
    tags: ["learning", "careers", "web dev", "devops"],
    keywords: ["roadmaps", "developer guide", "learn to code"],
    pricing: "Free",
    rating: 4.9
  },
  {
    id: "exercism",
    name: "Exercism",
    url: "https://exercism.org",
    category: "Education",
    description: "Language-specific coding exercises with mentorship.",
    longDescription: "Free coding platform offering 4,000+ exercises across 67 languages with human mentorship.",
    tags: ["coding", "practice", "languages", "mentorship"],
    keywords: ["exercism", "code practice", "learn python"],
    pricing: "Free",
    rating: 4.8
  },
  {
    id: "tradingview",
    name: "TradingView",
    url: "https://www.tradingview.com",
    category: "Finance",
    description: "Industry-standard cloud charting for financial markets.",
    longDescription: "Real-time access to global equity exchanges and commodities with advanced technical analysis tools.",
    tags: ["stocks", "crypto", "charts", "investing"],
    keywords: ["tradingview", "stock charts", "crypto tracker"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "defillama",
    name: "DefiLlama",
    url: "https://defillama.com",
    category: "Finance",
    description: "Largest open data aggregator for DeFi analytics.",
    longDescription: "Verified, un-manipulated on-chain analytics for decentralized finance protocols and yields.",
    tags: ["defi", "crypto", "data", "blockchain"],
    keywords: ["defillama", "crypto data", "tvl"],
    pricing: "Free",
    rating: 4.8
  },
  {
    id: "coingecko",
    name: "CoinGecko",
    url: "https://www.coingecko.com",
    category: "Finance",
    description: "Independent cryptocurrency data and price tracking.",
    longDescription: "Transparent market intelligence across thousands of digital assets, volumes, and market caps.",
    tags: ["crypto", "prices", "bitcoin", "market cap"],
    keywords: ["coingecko", "crypto prices", "altcoins"],
    pricing: "Free",
    rating: 4.7
  }
];
