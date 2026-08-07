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
  // --- AI & MACHINE LEARNING ---
  { name: "Krea AI", url: "https://krea.ai", cat: ["AI", "Creative", "Design"], desc: "Real-time AI image generation and enhancement." },
  { name: "Napkin AI", url: "https://napkin.ai", cat: ["AI", "Productivity", "Ideas"], desc: "Transform ideas into visual diagrams instantly." },
  { name: "OpenRouter", url: "https://openrouter.ai", cat: ["AI", "Coding", "Developer"], desc: "Unified interface for all major LLMs." },
  { name: "Jan", url: "https://jan.ai", cat: ["AI", "Privacy", "Utilities"], desc: "Open-source local AI assistant." },
  { name: "LM Studio", url: "https://lmstudio.ai", cat: ["AI", "Developer", "PC Software"], desc: "Run local LLMs on your own machine." },
  { name: "FlowGPT", url: "https://flowgpt.com", cat: ["AI", "AI Directories", "Creative"], desc: "Largest library of curated AI prompts." },
  { name: "Hugging Face", url: "https://huggingface.co", cat: ["AI", "Developer", "Coding"], desc: "The platform where the community builds AI." },
  { name: "Ideogram", url: "https://ideogram.ai", cat: ["AI", "Design", "Creative"], desc: "AI focused on typography and design." },
  { name: "Perplexity", url: "https://perplexity.ai", cat: ["AI", "Search", "Internet"], desc: "AI-powered search engine for instant answers." },
  { name: "Poe", url: "https://poe.com", cat: ["AI", "Chat & Community", "Fun"], desc: "Fast, helpful AI chat with multiple models." },
  { name: "Runway", url: "https://runwayml.com", cat: ["AI", "Video", "Creative"], desc: "Next-generation creative tools powered by AI." },
  { name: "Leonardo AI", url: "https://leonardo.ai", cat: ["AI", "Design", "Creative"], desc: "Create production-quality assets for your projects." },
  { name: "Gamma", url: "https://gamma.app", cat: ["AI", "Design", "Productivity"], desc: "AI-powered presentations, docs, and webpages." },
  { name: "Phind", url: "https://phind.com", cat: ["AI", "Coding", "Developer"], desc: "The AI search engine for developers." },
  { name: "Suno", url: "https://suno.com", cat: ["AI", "Music", "Creative"], desc: "Generate full songs with vocals from a prompt." },
  { name: "ElevenLabs", url: "https://elevenlabs.io", cat: ["AI", "Voice", "Creative"], desc: "The most realistic AI speech software." },
  { name: "Mistral AI", url: "https://mistral.ai", cat: ["AI", "Developer"], desc: "Frontier AI models, efficient and open." },
  { name: "Groq", url: "https://groq.com", cat: ["AI", "Developer"], desc: "The LPU Inference Engine for ultra-fast AI." },
  { name: "DeepL", url: "https://deepl.com", cat: ["AI", "Education", "Languages"], desc: "World's most accurate online translator." },
  { name: "Synthesia", url: "https://synthesia.io", cat: ["AI", "Video"], desc: "AI video generation platform using avatars." },
  { name: "Midjourney", url: "https://midjourney.com", cat: ["AI", "Design", "Creative"], desc: "Leading AI art generation community." },
  
  // --- GAMING & ENTERTAINMENT ---
  { name: "Game Jolt", url: "https://gamejolt.com", cat: ["Gaming", "Entertainment", "Fun"], desc: "Social platform for gamers and creators." },
  { name: "ModDB", url: "https://moddb.com", cat: ["Gaming", "PC Software", "Utilities"], desc: "The definitive library for game mods." },
  { name: "My Abandonware", url: "https://myabandonware.com", cat: ["Gaming", "History", "Fun"], desc: "Old games for free download." },
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming", "PC Software", "Downloads"], desc: "Premier community for game modifications." },
  { name: "GG.deals", url: "https://gg.deals", cat: ["Gaming", "Deals", "Shopping"], desc: "Track PC game prices across all stores." },
  { name: "Chess.com", url: "https://chess.com", cat: ["Gaming", "Brain Games", "Education"], desc: "The #1 platform for playing and learning chess." },
  { name: "Itch.io", url: "https://itch.io", cat: ["Gaming", "Creative", "Startups"], desc: "The ultimate platform for indie game creators." },
  { name: "Board Game Arena", url: "https://boardgamearena.com", cat: ["Gaming", "Fun", "Brain Games"], desc: "Play board games online from your browser." },
  { name: "Lichess", url: "https://lichess.org", cat: ["Gaming", "Brain Games", "Education"], desc: "Free and open-source online chess server." },
  { name: "Speedrun.com", url: "https://speedrun.com", cat: ["Gaming", "Entertainment", "Interesting"], desc: "The global leader in speedrunning records." },
  { name: "SteamDB", url: "https://steamdb.info", cat: ["Gaming", "Deals", "Data"], desc: "Database for everything Steam related." },
  { name: "Hollow Knight Map", url: "https://hollowknightmap.com", cat: ["Gaming", "Interesting"], desc: "Detailed interactive maps for Hollow Knight." },
  { name: "Vim Adventures", url: "https://vim-adventures.com", cat: ["Gaming", "Coding", "Education"], desc: "Learn Vim by playing an adventure game." },
  { name: "Infinite Craft", url: "https://neal.fun/infinite-craft/", cat: ["Gaming", "Fun", "AI"], desc: "Combine elements to create anything." },
  
  // --- EDUCATION & SCIENCE ---
  { name: "Wolfram Alpha", url: "https://wolframalpha.com", cat: ["Science", "Math", "Physics", "Education"], desc: "Computational intelligence engine for all knowledge." },
  { name: "PhET Simulations", url: "https://phet.colorado.edu", cat: ["Science", "Physics", "Education", "Fun"], desc: "Interactive simulations for science and math." },
  { name: "NASA Eyes", url: "https://eyes.nasa.gov", cat: ["Space", "Science", "Education", "Astronomy"], desc: "NASA's 3D explorer for planets and spacecraft." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space", "Astronomy", "Interesting"], desc: "Track satellites and ISS passes in real-time." },
  { name: "Khan Academy", url: "https://khanacademy.org", cat: ["Education", "School", "Math"], desc: "Free, world-class education for anyone, anywhere." },
  { name: "Duolingo", url: "https://duolingo.com", cat: ["Education", "Languages", "Fun"], desc: "Learn a new language in just 10 minutes a day." },
  { name: "Brilliant", url: "https://brilliant.org", cat: ["Education", "Science", "Math"], desc: "Learn to think through interactive problems." },
  { name: "Codecademy", url: "https://codecademy.com", cat: ["Education", "Coding", "Developer"], desc: "The easiest way to learn to code." },
  { name: "freeCodeCamp", url: "https://freecodecamp.org", cat: ["Education", "Coding", "Developer"], desc: "Learn to code for free and build projects." },
  { name: "Project Gutenberg", url: "https://gutenberg.org", cat: ["Reading", "History", "Education"], desc: "Over 70,000 free eBooks available for download." },
  { name: "arXiv", url: "https://arxiv.org", cat: ["Science", "Education", "Physics"], desc: "Open-access archive for 2 million scholarly articles." },
  { name: "World History Encyclopedia", url: "https://worldhistory.org", cat: ["History", "Education", "Interesting"], desc: "The world's most-read history encyclopedia." },
  { name: "LibriVox", url: "https://librivox.org", cat: ["Reading", "Audio", "Education"], desc: "Free public domain audiobooks." },
  { name: "Z-Library", url: "https://z-lib.org", cat: ["Reading", "Education"], desc: "The world's largest ebook library." },
  { name: "Wait But Why", url: "https://waitbutwhy.com", cat: ["Education", "Interesting", "Ideas"], desc: "Deep dives on space, life, and everything else." },
  
  // --- DESIGN & CREATIVE ---
  { name: "Figma", url: "https://figma.com", cat: ["Design", "Creative", "Productivity"], desc: "The collaborative interface design tool." },
  { name: "Canva", url: "https://canva.com", cat: ["Design", "Creative", "Marketing"], desc: "Design anything from social media posts to docs." },
  { name: "Coolors", url: "https://coolors.co", cat: ["Design", "Creative", "Utilities"], desc: "The super fast color schemes generator." },
  { name: "Dribbble", url: "https://dribbble.com", cat: ["Design", "Creative", "Photography"], desc: "The world's leading community for creatives." },
  { name: "Behance", url: "https://behance.net", cat: ["Design", "Creative", "Portfolio"], desc: "Showcase online portfolios." },
  { name: "Framer", url: "https://framer.com", cat: ["Design", "Startups", "Developer"], desc: "Design and publish your dream site, fast." },
  { name: "Webflow", url: "https://webflow.com", cat: ["Design", "Developer", "Startups"], desc: "Build professional custom websites without code." },
  { name: "Unsplash", url: "https://unsplash.com", cat: ["Design", "Photography", "Creative"], desc: "Freely usable images." },
  { name: "Pexels", url: "https://pexels.com", cat: ["Design", "Photography", "Video"], desc: "Free stock photos & videos." },
  { name: "Iconfinder", url: "https://iconfinder.com", cat: ["Design", "Creative", "Utilities"], desc: "Millions of SVG and PNG icons." },
  { name: "Fontjoy", url: "https://fontjoy.com", cat: ["Design", "Creative", "AI"], desc: "Generate font pairings using AI." },
  { name: "Khroma", url: "https://khroma.co", cat: ["Design", "AI", "Creative"], desc: "The AI color tool for designers." },
  { name: "Lapa Ninja", url: "https://lapa.ninja", cat: ["Design", "Creative"], desc: "Best landing page design inspiration." },
  
  // --- TOOLS & UTILITIES ---
  { name: "TinyWow", url: "https://tinywow.com", cat: ["Utilities", "PDF", "Video", "Photography"], desc: "Comprehensive suite of free online tools." },
  { name: "Convertio", url: "https://convertio.co", cat: ["Utilities", "Productivity", "Downloads"], desc: "Easy tool to convert files online." },
  { name: "Bitwarden", url: "https://bitwarden.com", cat: ["Cybersecurity", "Password Managers", "Privacy"], desc: "Open-source password management." },
  { name: "Monkeytype", url: "https://monkeytype.com", cat: ["Keyboard", "Utilities", "Fun"], desc: "A customizable typing test." },
  { name: "Reactive Resume", url: "https://rxresume.com", cat: ["Utilities", "Resume Builders", "Jobs"], desc: "Free and open-source resume builder." },
  { name: "SmallPDF", url: "https://smallpdf.com", cat: ["Utilities", "PDF", "Productivity"], desc: "Edit and convert PDF files easily." },
  { name: "Speedtest", url: "https://speedtest.net", cat: ["Internet", "Utilities", "Interesting"], desc: "Test your internet speed instantly." },
  { name: "Wayback Machine", url: "https://archive.org/web/", cat: ["History", "Internet", "Utilities"], desc: "Explore 800 billion web pages saved over time." },
  { name: "Remove.bg", url: "https://remove.bg", cat: ["Photography", "Design", "AI"], desc: "Remove image backgrounds automatically." },
  { name: "TinyPNG", url: "https://tinypng.com", cat: ["Design", "Utilities", "Developer"], desc: "Smart PNG and JPEG compression." },
  { name: "10MinuteMail", url: "https://10minutemail.com", cat: ["Privacy", "Utilities", "Cybersecurity"], desc: "Free temporary email address." },
  { name: "Regex101", url: "https://regex101.com", cat: ["Developer", "Coding", "Utilities"], desc: "Regular expression debugger." },
  { name: "JSON Formatter", url: "https://jsonformatter.curiousconcept.com", cat: ["Developer", "Utilities"], desc: "Validate and format JSON strings." },
  { name: "CyberChef", url: "https://gchq.github.io/CyberChef/", cat: ["Cybersecurity", "Utilities"], desc: "The Swiss Army Knife for data processing." },
  
  // --- LIFESTYLE & TRAVEL ---
  { name: "Skyscanner", url: "https://skyscanner.com", cat: ["Travel", "Hotels", "Trains"], desc: "Compare cheap flights and car hire." },
  { name: "AllRecipes", url: "https://allrecipes.com", cat: ["Food", "Cooking", "Home"], desc: "Everyday cooking inspiration." },
  { name: "MuscleWiki", url: "https://musclewiki.com", cat: ["Health", "Fitness", "Education"], desc: "Simplified exercise database." },
  { name: "Medito", url: "https://meditofoundation.org", cat: ["Health", "Meditation", "Sleep"], desc: "Free-forever meditation app." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Fun", "Music", "Geography"], desc: "Listen to live radio stations globally." },
  { name: "WindowSwap", url: "https://window-swap.com", cat: ["Fun", "Travel", "Interesting"], desc: "Look out of someone else's window." },
  { name: "Neal.fun", url: "https://neal.fun", cat: ["Fun", "Interesting", "Internet"], desc: "Quirky and beautiful web experiments." },
  { name: "GeoGuessr", url: "https://geoguessr.com", cat: ["Fun", "Geography", "Gaming"], desc: "Geography game that drops you anywhere." },
  { name: "Airbnb", url: "https://airbnb.com", cat: ["Travel", "Hotels", "Interesting"], desc: "Find holiday rentals and cabins." },
  { name: "Yelp", url: "https://yelp.com", cat: ["Food", "Business", "Local"], desc: "Find best local businesses and restaurants." },
  { name: "TripAdvisor", url: "https://tripadvisor.com", cat: ["Travel", "Interesting", "Reviews"], desc: "Compare prices and read reviews." },
  { name: "MyFitnessPal", url: "https://myfitnesspal.com", cat: ["Health", "Fitness", "Food"], desc: "Track calories and activities." },
  { name: "Nomad List", url: "https://nomadlist.com", cat: ["Travel", "Jobs", "Startups"], desc: "Best places to live and work remotely." },
  
  // --- FINANCE & BUSINESS ---
  { name: "TradingView", url: "https://tradingview.com", cat: ["Finance", "Investing", "Startups"], desc: "Advanced charts and social network for traders." },
  { name: "CoinGecko", url: "https://coingecko.com", cat: ["Finance", "Investing", "Internet"], desc: "Largest crypto data aggregator." },
  { name: "YNAB", url: "https://ynab.com", cat: ["Finance", "Productivity", "Home"], desc: "Personal budgeting software." },
  { name: "Robinhood", url: "https://robinhood.com", cat: ["Finance", "Investing", "Startups"], desc: "Zero commission fee investing." },
  { name: "Crunchbase", url: "https://crunchbase.com", cat: ["Startups", "Business", "Data"], desc: "Business information about companies." },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com", cat: ["Finance", "News", "Investing"], desc: "Stock market quotes and news." },
  { name: "Investopedia", url: "https://investopedia.com", cat: ["Finance", "Education", "Business"], desc: "Leading source of financial content." },
  { name: "Stripe", url: "https://stripe.com", cat: ["Business", "Developer", "Finance"], desc: "Online payment processing." },
  { name: "Gumroad", url: "https://gumroad.com", cat: ["Creative", "Business", "Jobs"], desc: "Sell what you create directly." },
  { name: "Product Hunt", url: "https://producthunt.com", cat: ["Startups", "Internet", "AI Directories"], desc: "Discover your next favorite thing." },
  
  // --- CODING & DEVELOPER ---
  { name: "GitHub", url: "https://github.com", cat: ["Developer", "Coding", "Open Source"], desc: "Leading software development platform." },
  { name: "Stack Overflow", url: "https://stackoverflow.com", cat: ["Developer", "Coding", "Education"], desc: "Most trusted online community for developers." },
  { name: "CodePen", url: "https://codepen.io", cat: ["Developer", "Design", "Coding"], desc: "Build, test, and discover front-end code." },
  { name: "Replit", url: "https://replit.com", cat: ["Developer", "Coding", "Education"], desc: "Build software collaboratively." },
  { name: "Vercel", url: "https://vercel.com", cat: ["Developer", "Startups", "Internet"], desc: "Deploy your frontend instantly." },
  { name: "Netlify", url: "https://netlify.com", cat: ["Developer", "Startups", "Internet"], desc: "Develop and deploy your websites." },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org", cat: ["Developer", "Education", "Coding"], desc: "Resources for developers, by developers." },
  { name: "Glitch", url: "https://glitch.com", cat: ["Developer", "Coding", "Fun"], desc: "Simple tool for creating and sharing web apps." },
  { name: "Supabase", url: "https://supabase.com", cat: ["Developer", "Startups", "Data"], desc: "The open source Firebase alternative." },
  { name: "Roadmap.sh", url: "https://roadmap.sh", cat: ["Developer", "Education", "Jobs"], desc: "Step-by-step guides and paths to learn technologies." },
  { name: "Can I Use", url: "https://caniuse.com", cat: ["Developer", "Coding"], desc: "Browser support tables for modern web technologies." },
  
  // --- MISC & INTERESTING ---
  { name: "The Useless Web", url: "https://theuselessweb.com", cat: ["Fun", "Interesting", "Internet"], desc: "Take me to a useless website." },
  { name: "Little Alchemy 2", url: "https://littlealchemy2.com", cat: ["Fun", "Brain Games", "Science"], desc: "Combine elements to create the world." },
  { name: "Pointer Pointer", url: "https://pointerpointer.com", cat: ["Fun", "Interesting", "Internet"], desc: "Photos of people pointing at your cursor." },
  { name: "Radiooo", url: "https://radiooooo.com", cat: ["Music", "History", "Fun"], desc: "The musical time machine." },
  { name: "Bored Panda", url: "https://boredpanda.com", cat: ["Entertainment", "Interesting", "Art"], desc: "Lighthearted content about art and design." },
  { name: "Mental Floss", url: "https://mentalfloss.com", cat: ["Interesting", "Education", "History"], desc: "Amazing facts and fascinating stories." },
  { name: "Atlas Obscura", url: "https://atlasobscura.com", cat: ["Travel", "Interesting", "Geography"], desc: "Guide to the world's wondrous places." },
  { name: "Internet Live Stats", url: "https://internetlivestats.com", cat: ["Internet", "Data", "Interesting"], desc: "Real-time counters for web usage." },
  { name: "A Soft Murmur", url: "https://asoftmurmur.com", cat: ["Health", "Audio", "Productivity"], desc: "Ambient sounds to wash away distraction." },
  { name: "Online Clock", url: "https://onlineclock.net", cat: ["Utilities", "Home"], desc: "The original online alarm clock." },
  { name: "Ninite", url: "https://ninite.com", cat: ["Utilities", "PC Software", "Downloads"], desc: "Install and update all your programs at once." },
  { name: "Pexels", url: "https://pexels.com", cat: ["Design", "Photography", "Creative"], desc: "Free stock photos and videos shared by creators." },
  { name: "Pixabay", url: "https://pixabay.com", cat: ["Design", "Creative", "Photography"], desc: "Stunning free images and royalty free stock." },
  { name: "Flaticon", url: "https://flaticon.com", cat: ["Design", "Creative", "Utilities"], desc: "Access 14.8M+ vector icons and stickers." },
  { name: "Color Hunt", url: "https://colorhunt.co", cat: ["Design", "Creative", "Interesting"], desc: "Curated palettes for designers and artists." },
  { name: "Carrd", url: "https://carrd.co", cat: ["Design", "Startups", "Developer"], desc: "Simple, free, fully responsive one-page sites." },
  { name: "Linktree", url: "https://linktr.ee", cat: ["Marketing", "Startups", "Creative"], desc: "The only link you'll ever need." },
  { name: "Buffer", url: "https://buffer.com", cat: ["Marketing", "Productivity", "Startups"], desc: "Tame your social media with scheduling tools." },
  { name: "Notion", url: "https://notion.so", cat: ["Productivity", "Jobs", "Developer"], desc: "The all-in-one workspace for notes and tasks." },
  { name: "Trello", url: "https://trello.com", cat: ["Productivity", "Jobs", "Startups"], desc: "Collaborate and get more done with boards." },
  { name: "Slack", url: "https://slack.com", cat: ["Chat & Community", "Jobs", "Startups"], desc: "Where work happens and teams connect." },
  { name: "Discord", url: "https://discord.com", cat: ["Chat & Community", "Gaming", "Fun"], desc: "The best place to hang out with friends." },
  { name: "Medium", url: "https://medium.com", cat: ["Reading", "News", "Ideas"], desc: "The place where good ideas find a home." },
  { name: "Substack", url: "https://substack.com", cat: ["Reading", "News", "Startups"], desc: "The home for independent writing." },
  { name: "Coursera", url: "https://coursera.org", cat: ["Education", "School", "Jobs"], desc: "Learn from the world's best universities." },
  { name: "Udemy", url: "https://udemy.com", cat: ["Education", "Jobs", "Developer"], desc: "Master any skill with online video courses." },
  { name: "MasterClass", url: "https://masterclass.com", cat: ["Education", "Creative", "Interesting"], desc: "Learn from the best in the world." },
  { name: "Goodreads", url: "https://goodreads.com", cat: ["Reading", "Education", "Interesting"], desc: "Meet your next favorite book." },
  { name: "Letterboxd", url: "https://letterboxd.com", cat: ["Movies", "Entertainment", "Fun"], desc: "The social network for movie lovers." },
  { name: "IMDb", url: "https://imdb.com", cat: ["Movies", "TV Shows", "Entertainment"], desc: "The world's most popular source for movie content." },
  { name: "Rotten Tomatoes", url: "https://rottentomatoes.com", cat: ["Movies", "TV Shows", "Entertainment"], desc: "The most trusted measurement of quality for TV/Film." },
  { name: "Spotify", url: "https://spotify.com", cat: ["Music", "Audio", "Entertainment"], desc: "Millions of songs and podcasts on your browser." },
  { name: "SoundCloud", url: "https://soundcloud.com", cat: ["Music", "Audio", "Creative"], desc: "Discover and play over 300 million tracks." },
  { name: "Vimeo", url: "https://vimeo.com", cat: ["Video", "Creative", "Design"], desc: "The world's most innovative video creators." },
  { name: "Twitch", url: "https://twitch.tv", cat: ["Gaming", "Entertainment", "Live Cameras"], desc: "Live stream platform for gamers and creators." },
  { name: "Etsy", url: "https://etsy.com", cat: ["Shopping", "Creative", "Gifts"], desc: "Shop for handmade, vintage, and unique items." },
  { name: "Amazon", url: "https://amazon.com", cat: ["Shopping", "Home", "Internet"], desc: "Shop everything from A to Z." },
  { name: "eBay", url: "https://ebay.com", cat: ["Shopping", "Interesting", "History"], desc: "The world's marketplace for everything." },
  { name: "Wallhaven", url: "https://wallhaven.cc", cat: ["Design", "Creative", "Photography"], desc: "The best wallpapers on the net." },
  { name: "ArtStation", url: "https://artstation.com", cat: ["Design", "Creative", "Gaming"], desc: "Showcase for games, film, and media artists." },
  { name: "Sketchfab", url: "https://sketchfab.com", cat: ["3D", "Design", "Developer"], desc: "Publish, share, and discover 3D content." },
  { name: "Unity", url: "https://unity.com", cat: ["Gaming", "3D", "Developer"], desc: "Real-time 3D development platform." },
  { name: "Unreal Engine", url: "https://unrealengine.com", cat: ["Gaming", "3D", "Developer"], desc: "The world's most open and advanced 3D tool." },
  { name: "Blender", url: "https://blender.org", cat: ["3D", "Design", "Open Source"], desc: "Open source 3D creation suite." },
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
      longDescription: `${site.name} is a leading platform for ${site.cat.join(" and ")}. It provides high-quality resources and tools for the niche community. This project was hand-picked for its zero-padding utility and commitment to quality web standards.`,
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
