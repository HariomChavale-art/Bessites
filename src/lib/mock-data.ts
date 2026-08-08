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
  { name: "Krea AI", url: "https://krea.ai", cat: ["AI", "Creative", "Design"], desc: "Want to see your creative ideas come to life instantly? Krea AI provides a real-time art generation canvas that enhances your sketches and prompts with high-fidelity AI in seconds." },
  { name: "Napkin AI", url: "https://napkin.ai", cat: ["AI", "Productivity", "Ideas"], desc: "Struggling to visualize complex ideas? Napkin AI transforms your text-based thoughts into professional diagrams and visuals, helping you communicate ideas more effectively." },
  { name: "OpenRouter", url: "https://openrouter.ai", cat: ["AI", "Coding", "Developer"], desc: "Need access to the latest AI models without managing multiple accounts? OpenRouter provides a unified API to connect with GPT-4, Claude, and Llama, letting you compare performance and costs in one place." },
  { name: "Jan", url: "https://jan.ai", cat: ["AI", "Privacy", "Utilities"], desc: "Looking for a private, offline AI assistant? Jan is an open-source alternative that runs entirely on your local hardware, ensuring your data and conversations never leave your device." },
  { name: "LM Studio", url: "https://lmstudio.ai", cat: ["AI", "Developer", "PC Software"], desc: "Want to explore open-source AI on your own computer? LM Studio lets you discover, download, and run local LLMs easily, giving you full control over your AI environment." },
  { name: "FlowGPT", url: "https://flowgpt.com", cat: ["AI", "AI Directories", "Creative"], desc: "Looking for the perfect prompt to get the most out of AI? FlowGPT is a massive community library where you can find and share optimized prompt engineering techniques for any use case." },
  { name: "Hugging Face", url: "https://huggingface.co", cat: ["AI", "Developer", "Coding"], desc: "Building the next generation of AI? Hugging Face is the central hub for the machine learning community, offering millions of open-source models, datasets, and demo apps to accelerate development." },
  { name: "Ideogram", url: "https://ideogram.ai", cat: ["AI", "Design", "Creative"], desc: "Need high-quality AI art with perfect text rendering? Ideogram specializes in generative design that integrates typography seamlessly into beautiful illustrations and brand assets." },
  { name: "Perplexity", url: "https://perplexity.ai", cat: ["AI", "Search", "Internet"], desc: "Tired of sorting through search results? Perplexity is an AI research assistant that gives you direct, cited answers to complex questions by scanning the live web in real-time." },
  { name: "Poe", url: "https://poe.com", cat: ["AI", "Chat & Community", "Fun"], desc: "Want to chat with all your favorite AI bots in one place? Poe provides a fast, clean interface to interact with models like GPT-4, Claude, and Gemini, while letting you build your own custom bots." },
  { name: "Runway", url: "https://runwayml.com", cat: ["AI", "Video", "Creative"], desc: "Ready to create cinematic visuals with AI? Runway offers a professional suite of creative tools for generating and editing videos, providing Hollywood-grade effects for filmmakers and creators." },
  { name: "Leonardo AI", url: "https://leonardo.ai", cat: ["AI", "Design", "Creative"], desc: "Designing game assets or unique brand visuals? Leonardo AI provides an advanced generative suite tailored for high-quality character design, textures, and architectural concepts." },
  { name: "Gamma", url: "https://gamma.app", cat: ["AI", "Design", "Productivity"], desc: "Need a professional presentation fast? Gamma uses AI to generate beautiful slide decks, documents, and web pages from a simple prompt, saving you hours of formatting work." },
  { name: "Phind", url: "https://phind.com", cat: ["AI", "Coding", "Developer"], desc: "Stuck on a difficult coding problem? Phind is an intelligent search engine optimized for developers, providing detailed answers and code snippets with references to documentation." },
  { name: "Suno", url: "https://suno.com", cat: ["AI", "Music", "Creative"], desc: "Dreaming of creating your own music? Suno lets you generate complete high-fidelity tracks with instruments and vocals in any style just by describing the vibe you want." },
  { name: "ElevenLabs", url: "https://elevenlabs.io", cat: ["AI", "Voice", "Creative"], desc: "Need realistic voiceovers for your projects? ElevenLabs offers industry-leading AI speech synthesis and voice cloning that captures human emotion and nuance with incredible accuracy." },
  { name: "Mistral AI", url: "https://mistral.ai", cat: ["AI", "Developer"], desc: "Looking for efficient, high-performance AI? Mistral AI develops powerful open-weight models that provide a balance of speed and intelligence for developers and enterprises." },
  { name: "Groq", url: "https://groq.com", cat: ["AI", "Developer"], desc: "Need AI responses at lightning speed? Groq uses specialized LPU hardware to provide ultra-fast inference for LLMs, making real-time AI applications smoother than ever before." },
  { name: "DeepL", url: "https://deepl.com", cat: ["AI", "Education", "Languages"], desc: "Want translations that actually sound natural? DeepL uses advanced neural networks to provide context-aware translations that outperform generic tools for professional and creative writing." },
  { name: "Synthesia", url: "https://synthesia.io", cat: ["AI", "Video"], desc: "Creating training or marketing videos? Synthesia lets you generate professional video content with realistic AI avatars that speak 120+ languages, removing the need for cameras or actors." },
  { name: "Midjourney", url: "https://midjourney.com", cat: ["AI", "Design", "Creative"], desc: "Looking for the highest tier of AI artistry? Midjourney is a premier generative tool famous for creating stunning, award-winning visuals through a vibrant community-driven interface." },
  
  // --- GAMING & ENTERTAINMENT ---
  { name: "Game Jolt", url: "https://gamejolt.com", cat: ["Gaming", "Entertainment", "Fun"], desc: "Looking for the next big indie hit? Game Jolt is a social playground where you can play thousands of unique games and join communities dedicated to your favorite creators." },
  { name: "ModDB", url: "https://moddb.com", cat: ["Gaming", "PC Software", "Utilities"], desc: "Want to breathe new life into your favorite classic games? ModDB is the world's largest repository for game modifications, providing thousands of community-made enhancements and total conversions." },
  { name: "My Abandonware", url: "https://myabandonware.com", cat: ["Gaming", "History", "Fun"], desc: "Feeling nostalgic for the games of your childhood? My Abandonware lets you rediscover and download thousands of classic, discontinued computer games from the 80s, 90s, and early 2000s." },
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming", "PC Software", "Downloads"], desc: "Ready to upgrade your RPG experience? Nexus Mods is the leading hub for high-quality game enhancements, supporting hundreds of titles with a focus on immersive improvements." },
  { name: "GG.deals", url: "https://gg.deals", cat: ["Gaming", "Deals", "Shopping"], desc: "Looking for the best price on your next game? GG.deals tracks prices across major digital stores, helping you find historical lows and active bundles to save money on gaming." },
  { name: "Chess.com", url: "https://chess.com", cat: ["Gaming", "Brain Games", "Education"], desc: "Want to master the game of kings? Chess.com is the ultimate platform for playing players of any level, learning with interactive lessons, and watching professional tournaments." },
  { name: "Itch.io", url: "https://itch.io", cat: ["Gaming", "Creative", "Startups"], desc: "Discovering experimental and independent art? Itch.io is a marketplace for creative game developers, offering a home for niche projects that you won't find anywhere else." },
  { name: "Board Game Arena", url: "https://boardgamearena.com", cat: ["Gaming", "Fun", "Brain Games"], desc: "Want to play classic tabletop games with friends online? Board Game Arena lets you play hundreds of officially licensed board games directly in your browser without any installation." },
  { name: "Lichess", url: "https://lichess.org", cat: ["Gaming", "Brain Games", "Education"], desc: "Looking for a fast, free, and open-source chess home? Lichess provides a professional experience with no ads, offering deep analysis tools and competitive tournaments for everyone." },
  { name: "Speedrun.com", url: "https://speedrun.com", cat: ["Gaming", "Entertainment", "Interesting"], desc: "Interested in the fastest way to beat a game? Speedrun.com is the global database for world records, providing strategies and leaderboards for thousands of titles across all platforms." },
  { name: "SteamDB", url: "https://steamdb.info", cat: ["Gaming", "Deals", "Data"], desc: "Want a deeper look into the Steam store? SteamDB provides advanced analytics, player counts, and price history tracking to help you understand market trends and find the best deals." },
  { name: "Hollow Knight Map", url: "https://hollowknightmap.com", cat: ["Gaming", "Interesting"], desc: "Lost in the depths of Hallownest? This interactive secret guide provides a complete map of Hollow Knight, helping you find every charm, boss, and hidden passage." },
  { name: "Vim Adventures", url: "https://vim-adventures.com", cat: ["Gaming", "Coding", "Education"], desc: "Struggling to learn Vim keyboard shortcuts? Vim Adventures turns learning the legendary text editor into a fun RPG quest, helping you build muscle memory through play." },
  { name: "Infinite Craft", url: "https://neal.fun/infinite-craft/", cat: ["Gaming", "Fun", "AI"], desc: "Curious about what happens when you combine Water and Fire? Infinite Craft is a minimalist web experiment that uses AI logic to let you discover everything from Dinosaurs to Batman." },
  
  // --- EDUCATION & SCIENCE ---
  { name: "Wolfram Alpha", url: "https://wolframalpha.com", cat: ["Science", "Math", "Physics", "Education"], desc: "Need an answer to a complex math or science problem? Wolfram Alpha is a computational knowledge engine that calculates answers and provides detailed step-by-step solutions for students and professionals." },
  { name: "PhET Simulations", url: "https://phet.colorado.edu", cat: ["Science", "Physics", "Education", "Fun"], desc: "Want to see how physics and chemistry actually work? PhET provides interactive, game-like simulations that let you experiment with science concepts in a safe, visual environment." },
  { name: "NASA Eyes", url: "https://eyes.nasa.gov", cat: ["Space", "Science", "Education", "Astronomy"], desc: "Ready to explore the universe from your desk? NASA Eyes uses real-time space mission data to let you fly alongside spacecraft and explore the planets and stars in immersive 3D." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space", "Astronomy", "Interesting"], desc: "Want to know when the International Space Station will fly over your house? Heavens Above provides precise satellite predictions and sky charts to help you track orbital objects from any location." },
  { name: "Khan Academy", url: "https://khanacademy.org", cat: ["Education", "School", "Math"], desc: "Looking for world-class education for free? Khan Academy offers thousands of interactive lessons in math, science, and history, helping students of all ages master new skills at their own pace." },
  { name: "Duolingo", url: "https://duolingo.com", cat: ["Education", "Languages", "Fun"], desc: "Want to learn a new language without it feeling like a chore? Duolingo uses bite-sized, gamified lessons to help you build vocabulary and grammar skills in 40+ global languages." },
  { name: "Brilliant", url: "https://brilliant.org", cat: ["Education", "Science", "Math"], desc: "Ready to improve your problem-solving skills? Brilliant teaches STEM concepts through interactive challenges, making it easier to master complex topics in math, science, and computer science." },
  { name: "Codecademy", url: "https://codecademy.com", cat: ["Education", "Coding", "Developer"], desc: "Want to start your career in tech? Codecademy provides interactive coding lessons in the browser, helping you learn languages like Python, JavaScript, and SQL through hands-on practice." },
  { name: "freeCodeCamp", url: "https://freecodecamp.org", cat: ["Education", "Coding", "Developer"], desc: "Looking for a way to learn code and help nonprofits? freeCodeCamp is a massive open-source community that provides thousands of hours of free lessons and certifications in web development." },
  { name: "Project Gutenberg", url: "https://gutenberg.org", cat: ["Reading", "History", "Education"], desc: "Searching for your next great read? Project Gutenberg is a digital library of over 70,000 free eBooks, focusing on older works for which U.S. copyright has expired." },
  { name: "arXiv", url: "https://arxiv.org", cat: ["Science", "Education", "Physics"], desc: "Need access to the latest scientific research? arXiv is an open-access archive for hundreds of thousands of scholarly articles in physics, mathematics, and computer science." },
  { name: "World History Encyclopedia", url: "https://worldhistory.org", cat: ["History", "Education", "Interesting"], desc: "Curious about the ancient world? World History Encyclopedia is a highly trusted resource that provides detailed articles, maps, and illustrations covering the entire timeline of human history." },
  { name: "LibriVox", url: "https://librivox.org", cat: ["Reading", "Audio", "Education"], desc: "Want to listen to classic literature for free? LibriVox provides thousands of free public domain audiobooks recorded by volunteers from around the world." },
  { name: "Z-Library", url: "https://z-lib.org", cat: ["Reading", "Education"], desc: "Looking for a specific book or research paper? Z-Library is one of the world's largest digital archives, providing access to millions of books and articles for students and researchers." },
  { name: "Wait But Why", url: "https://waitbutwhy.com", cat: ["Education", "Interesting", "Ideas"], desc: "Interested in deep dives on complex topics? Wait But Why uses humor and stick-figure illustrations to explain everything from Artificial Intelligence to the Fermi Paradox." },
  
  // --- DESIGN & CREATIVE ---
  { name: "Figma", url: "https://figma.com", cat: ["Design", "Creative", "Productivity"], desc: "Collaborating on a digital product? Figma is the industry-standard tool for design and prototyping, allowing teams to create, test, and ship beautiful interfaces together in real-time." },
  { name: "Canva", url: "https://canva.com", cat: ["Design", "Creative", "Marketing"], desc: "Need to create professional graphics without design experience? Canva offers a simple drag-and-drop editor with thousands of templates for social posts, presentations, videos, and more." },
  { name: "Coolors", url: "https://coolors.co", cat: ["Design", "Creative", "Utilities"], desc: "Looking for the perfect color scheme? Coolors is a super-fast palette generator that helps you create and browse beautiful color combinations for any design project in seconds." },
  { name: "Dribbble", url: "https://dribbble.com", cat: ["Design", "Creative", "Photography"], desc: "Searching for design inspiration? Dribbble is the leading social network for digital designers, offering a window into the latest trends in UI/UX, illustration, and branding." },
  { name: "Behance", url: "https://behance.net", cat: ["Design", "Creative", "Portfolio"], desc: "Want to showcase your creative work? Behance is a massive global platform by Adobe where professionals in every creative field share their portfolios and discover world-class projects." },
  { name: "Framer", url: "https://framer.com", cat: ["Design", "Startups", "Developer"], desc: "Building a high-performance website with cinematic feel? Framer combines professional design tools with powerful animations, letting you publish responsive sites directly from your canvas." },
  { name: "Webflow", url: "https://webflow.com", cat: ["Design", "Developer", "Startups"], desc: "Ready to build a custom website without writing code? Webflow gives you the power of HTML, CSS, and JavaScript in a visual interface, helping you create professional sites with full creative control." },
  { name: "Unsplash", url: "https://unsplash.com", cat: ["Design", "Photography", "Creative"], desc: "Need high-quality images for your project? Unsplash provides a massive library of beautiful, high-resolution photos contributed by a global community of photographers—all free to use." },
  { name: "Pexels", url: "https://pexels.com", cat: ["Design", "Photography", "Video"], desc: "Looking for free stock assets? Pexels offers thousands of high-quality photos and videos that you can use for any creative project without worrying about attribution." },
  { name: "Iconfinder", url: "https://iconfinder.com", cat: ["Design", "Creative", "Utilities"], desc: "Searching for the perfect SVG icon? Iconfinder provides millions of professional icons for app developers and web designers, supporting both free and premium creative work." },
  { name: "Fontjoy", url: "https://fontjoy.com", cat: ["Design", "Creative", "AI"], desc: "Struggling to find fonts that look good together? Fontjoy uses deep learning to generate balanced font pairings, helping you find the perfect typographic match for your brand." },
  { name: "Khroma", url: "https://khroma.co", cat: ["Design", "AI", "Creative"], desc: "Need a color palette tailored to your taste? Khroma is an AI tool that learns which colors you like and generates personalized combinations for you to use in your designs." },
  { name: "Lapa Ninja", url: "https://lapa.ninja", cat: ["Design", "Creative"], desc: "Designing a new landing page? Lapa Ninja is a curated library showcasing the best examples of landing page design from across the web to help you find creative inspiration." },
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
