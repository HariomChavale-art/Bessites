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
  
  // --- DESIGN & CREATIVE ---
  { name: "Figma", url: "https://figma.com", cat: ["Design", "Creative", "Productivity"], desc: "The collaborative interface design tool." },
  { name: "Canva", url: "https://canva.com", cat: ["Design", "Creative", "Marketing"], desc: "Design anything from social media posts to docs." },
  { name: "Coolors", url: "https://coolors.co", cat: ["Design", "Creative", "Utilities"], desc: "The super fast color schemes generator." },
  { name: "Dribbble", url: "https://dribbble.com", cat: ["Design", "Creative", "Photography"], desc: "The world's leading community for creatives." },
  { name: "Behance", url: "https://behance.net", cat: ["Design", "Creative", "Portfolio"], desc: "Showcase and discover the latest work from top online portfolios." },
  { name: "Framer", url: "https://framer.com", cat: ["Design", "Startups", "Developer"], desc: "Design and publish your dream site, fast." },
  { name: "Webflow", url: "https://webflow.com", cat: ["Design", "Developer", "Startups"], desc: "Build professional custom websites without code." },
  { name: "Unsplash", url: "https://unsplash.com", cat: ["Design", "Photography", "Creative"], desc: "The internet's source for freely usable images." },
  { name: "Pexels", url: "https://pexels.com", cat: ["Design", "Photography", "Video"], desc: "Free stock photos & videos shared by talented creators." },
  { name: "Iconfinder", url: "https://iconfinder.com", cat: ["Design", "Creative", "Utilities"], desc: "Search through millions of SVG and PNG icons." },
  { name: "Fontjoy", url: "https://fontjoy.com", cat: ["Design", "Creative", "AI"], desc: "Generate font pairings using deep learning." },
  
  // --- TOOLS & UTILITIES ---
  { name: "TinyWow", url: "https://tinywow.com", cat: ["Utilities", "PDF", "Video", "Photography"], desc: "Comprehensive suite of free online PDF and media tools." },
  { name: "Convertio", url: "https://convertio.co", cat: ["Utilities", "Productivity", "Downloads"], desc: "Easy tool to convert files online." },
  { name: "Bitwarden", url: "https://bitwarden.com", cat: ["Cybersecurity", "Password Managers", "Privacy"], desc: "Open-source password management for all devices." },
  { name: "Monkeytype", url: "https://monkeytype.com", cat: ["Keyboard", "Utilities", "Fun"], desc: "A customizable typing test with many modes." },
  { name: "Reactive Resume", url: "https://rxresume.com", cat: ["Utilities", "Resume Builders", "Jobs"], desc: "A free and open-source resume builder." },
  { name: "SmallPDF", url: "https://smallpdf.com", cat: ["Utilities", "PDF", "Productivity"], desc: "The platform that makes it super easy to edit and convert PDF files." },
  { name: "Speedtest", url: "https://speedtest.net", cat: ["Internet", "Utilities", "Interesting"], desc: "Test your internet connection speed instantly." },
  { name: "Wayback Machine", url: "https://archive.org/web/", cat: ["History", "Internet", "Utilities"], desc: "Explore more than 800 billion web pages saved over time." },
  { name: "Remove.bg", url: "https://remove.bg", cat: ["Photography", "Design", "AI"], desc: "Remove image backgrounds automatically in 5 seconds." },
  { name: "TinyPNG", url: "https://tinypng.com", cat: ["Design", "Utilities", "Developer"], desc: "Smart PNG and JPEG compression." },
  { name: "10MinuteMail", url: "https://10minutemail.com", cat: ["Privacy", "Utilities", "Cybersecurity"], desc: "Free temporary email for a disposable address." },
  { name: "Regex101", url: "https://regex101.com", cat: ["Developer", "Coding", "Utilities"], desc: "Regular expression debugger with real-time explanation." },
  
  // --- LIFESTYLE & TRAVEL ---
  { name: "Skyscanner", url: "https://skyscanner.com", cat: ["Travel", "Hotels", "Trains"], desc: "Compare cheap flights, hotels and car hire." },
  { name: "AllRecipes", url: "https://allrecipes.com", cat: ["Food", "Cooking", "Home"], desc: "Find and share everyday cooking inspiration." },
  { name: "MuscleWiki", url: "https://musclewiki.com", cat: ["Health", "Fitness", "Education"], desc: "Simplified exercise database for every muscle." },
  { name: "Medito", url: "https://meditofoundation.org", cat: ["Health", "Meditation", "Sleep"], desc: "Free-forever meditation app for a better mind." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Fun", "Music", "Internet", "Geography"], desc: "Listen to live radio stations across the globe." },
  { name: "WindowSwap", url: "https://window-swap.com", cat: ["Fun", "Travel", "Interesting"], desc: "Look out of someone else's window somewhere in the world." },
  { name: "Neal.fun", url: "https://neal.fun", cat: ["Fun", "Interesting", "Internet"], desc: "A collection of quirky and beautiful web experiments." },
  { name: "GeoGuessr", url: "https://geoguessr.com", cat: ["Fun", "Geography", "Gaming"], desc: "A geography game that drops you anywhere in the world." },
  { name: "Airbnb", url: "https://airbnb.com", cat: ["Travel", "Hotels", "Interesting"], desc: "Find holiday rentals, cabins, beach houses and more." },
  { name: "Yelp", url: "https://yelp.com", cat: ["Food", "Business", "Local"], desc: "Find the best local businesses, restaurants and more." },
  { name: "TripAdvisor", url: "https://tripadvisor.com", cat: ["Travel", "Interesting", "Reviews"], desc: "Compare prices on hotels, flights and cruises." },
  { name: "MyFitnessPal", url: "https://myfitnesspal.com", cat: ["Health", "Fitness", "Food"], desc: "Track calories, break down ingredients, and log activities." },
  
  // --- FINANCE & BUSINESS ---
  { name: "TradingView", url: "https://tradingview.com", cat: ["Finance", "Investing", "Startups"], desc: "Advanced charts and social network for traders." },
  { name: "CoinGecko", url: "https://coingecko.com", cat: ["Finance", "Investing", "Internet"], desc: "Largest independent crypto data aggregator." },
  { name: "YNAB", url: "https://ynab.com", cat: ["Finance", "Productivity", "Home"], desc: "Personal budgeting software for better money habits." },
  { name: "Robinhood", url: "https://robinhood.com", cat: ["Finance", "Investing", "Startups"], desc: "Investing for everyone with zero commission fees." },
  { name: "Crunchbase", url: "https://crunchbase.com", cat: ["Startups", "Business", "Data"], desc: "The leading destination to find business information about companies." },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com", cat: ["Finance", "News", "Investing"], desc: "Stock market quotes, news, and financial information." },
  { name: "Investopedia", url: "https://investopedia.com", cat: ["Finance", "Education", "Business"], desc: "The world's leading source of financial content on the web." },
  { name: "Stripe", url: "https://stripe.com", cat: ["Business", "Developer", "Finance"], desc: "Online payment processing for internet businesses." },
  { name: "Gumroad", url: "https://gumroad.com", cat: ["Creative", "Business", "Jobs"], desc: "Sell what you create directly to your audience." },
  
  // --- CODING & DEVELOPER ---
  { name: "GitHub", url: "https://github.com", cat: ["Developer", "Coding", "Open Source"], desc: "The world's leading software development platform." },
  { name: "Stack Overflow", url: "https://stackoverflow.com", cat: ["Developer", "Coding", "Education"], desc: "The largest, most trusted online community for developers." },
  { name: "CodePen", url: "https://codepen.io", cat: ["Developer", "Design", "Coding"], desc: "The best place to build, test, and discover front-end code." },
  { name: "Replit", url: "https://replit.com", cat: ["Developer", "Coding", "Education"], desc: "Build software collaboratively from anywhere in the world." },
  { name: "Vercel", url: "https://vercel.com", cat: ["Developer", "Startups", "Internet"], desc: "The platform for frontend developers to deploy instantly." },
  { name: "Netlify", url: "https://netlify.com", cat: ["Developer", "Startups", "Internet"], desc: "Develop and deploy your websites and apps." },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org", cat: ["Developer", "Education", "Coding"], desc: "Resources for developers, by developers." },
  { name: "Glitch", url: "https://glitch.com", cat: ["Developer", "Coding", "Fun"], desc: "Simple tool for creating and sharing web apps." },
  { name: "Supabase", url: "https://supabase.com", cat: ["Developer", "Startups", "Data"], desc: "The open source Firebase alternative." },
  
  // --- MISC & INTERESTING ---
  { name: "The Useless Web", url: "https://theuselessweb.com", cat: ["Fun", "Interesting", "Internet"], desc: "Take me to a useless website." },
  { name: "Little Alchemy 2", url: "https://littlealchemy2.com", cat: ["Fun", "Brain Games", "Science"], desc: "Combine elements to create the entire world." },
  { name: "Pointer Pointer", url: "https://pointerpointer.com", cat: ["Fun", "Interesting", "Internet"], desc: "A website that finds photos of people pointing at your cursor." },
  { name: "Radiooo", url: "https://radiooooo.com", cat: ["Music", "History", "Fun"], desc: "The musical time machine." },
  { name: "Bored Panda", url: "https://boredpanda.com", cat: ["Entertainment", "Interesting", "Art"], desc: "Lighthearted content about art, design and photography." },
  { name: "Mental Floss", url: "https://mentalfloss.com", cat: ["Interesting", "Education", "History"], desc: "Amazing facts and fascinating stories." },
  { name: "Atlas Obscura", url: "https://atlasobscura.com", cat: ["Travel", "Interesting", "Geography"], desc: "Definitive guide to the world's wondrous and curious places." },
  { name: "Product Hunt", url: "https://producthunt.com", cat: ["Startups", "Internet", "AI Directories"], desc: "The place to discover your next favorite thing." },
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
