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
  
  // Entertainment
  { name: "Reelgood", url: "https://reelgood.com", cat: ["Entertainment"], desc: "Unified streaming guide for all your services." },
  { name: "Simkl", url: "https://simkl.com", cat: ["Entertainment"], desc: "Track all your movies, TV shows and anime." },
  { name: "Trakt", url: "https://trakt.tv", cat: ["Entertainment"], desc: "Automatically track what you're watching." },
  { name: "JustWatch", url: "https://justwatch.com", cat: ["Entertainment"], desc: "Find where to stream any movie or show." },
  { name: "TV Time", url: "https://tvtime.com", cat: ["Entertainment"], desc: "The number one tool for TV show enthusiasts." },
  
  // Anime
  { name: "MyAnimeList", url: "https://myanimelist.net", cat: ["Anime"], desc: "The world's largest anime and manga database." },
  { name: "AniList", url: "https://anilist.co", cat: ["Anime"], desc: "Modern way to track your anime and manga progress." },
  { name: "Anime-Planet", url: "https://anime-planet.com", cat: ["Anime"], desc: "Create your anime list and get recommendations." },
  { name: "LiveChart", url: "https://livechart.me", cat: ["Anime"], desc: "Real-time seasonal anime charts and schedules." },
  
  // Shopping
  { name: "Temu", url: "https://temu.com", cat: ["Shopping"], desc: "Global marketplace for affordable products." },
  { name: "Etsy", url: "https://etsy.com", cat: ["Shopping"], desc: "Marketplace for unique and creative goods." },
  { name: "CamelCamelCamel", url: "https://camelcamelcamel.com", cat: ["Shopping"], desc: "Amazon price tracker and price drop alerts." },
  { name: "Slickdeals", url: "https://slickdeals.net", cat: ["Shopping", "Deals"], desc: "Community-driven deal sharing platform." },
  { name: "Honey", url: "https://joinhoney.com", cat: ["Shopping", "Deals"], desc: "Automatically find and apply coupon codes." },

  // Coding / Developer Tools
  { name: "CodeSandbox", url: "https://codesandbox.io", cat: ["Coding"], desc: "Instant cloud development environment." },
  { name: "Glitch", url: "https://glitch.com", cat: ["Coding"], desc: "Build and deploy web apps together." },
  { name: "DevDocs", url: "https://devdocs.io", cat: ["Coding"], desc: "Fast, offline search for all documentation." },
  { name: "Hoppscotch", url: "https://hoppscotch.io", cat: ["Coding"], desc: "Open-source API development tool." },
  { name: "Ray.so", url: "https://ray.so", cat: ["Coding"], desc: "Create beautiful images of your code." },

  // Sports
  { name: "SofaScore", url: "https://sofascore.com", cat: ["Sports"], desc: "Live scores, results and stats for all sports." },
  { name: "Flashscore", url: "https://flashscore.com", cat: ["Sports"], desc: "Fast and accurate live sports results." },
  { name: "FotMob", url: "https://fotmob.com", cat: ["Sports"], desc: "Complete football coverage with live scores." },
  { name: "Transfermarkt", url: "https://transfermarkt.com", cat: ["Sports"], desc: "Football transfer news, values and statistics." },

  // Jobs
  { name: "Wellfound", url: "https://wellfound.com", cat: ["Jobs"], desc: "The place where startups and job seekers connect." },
  { name: "We Work Remotely", url: "https://weworkremotely.com", cat: ["Jobs"], desc: "The largest remote work community in the world." },
  { name: "Remote OK", url: "https://remoteok.com", cat: ["Jobs"], desc: "Find the best remote jobs in tech." },
  { name: "FlexJobs", url: "https://flexjobs.com", cat: ["Jobs"], desc: "Hand-screened flexible and remote job listings." },

  // Health
  { name: "Healthline", url: "https://healthline.com", cat: ["Health"], desc: "Medical information and health advice you can trust." },
  { name: "WebMD", url: "https://webmd.com", cat: ["Health"], desc: "Better information for better health." },
  { name: "Drugs.com", url: "https://drugs.com", cat: ["Health"], desc: "The most popular, comprehensive drug information online." },

  // Space
  { name: "Eyes on the Solar System", url: "https://eyes.nasa.gov", cat: ["Space"], desc: "NASA's 3D explorer for planets and spacecraft." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space"], desc: "Track satellites and ISS passes in real-time." },
  { name: "Stellarium Web", url: "https://stellarium-web.org", cat: ["Space"], desc: "A planetarium in your browser." },

  // Fashion
  { name: "Grailed", url: "https://grailed.com", cat: ["Fashion"], desc: "Curated community marketplace for men's clothing." },
  { name: "StockX", url: "https://stockx.com", cat: ["Fashion"], desc: "The current culture marketplace for sneakers and more." },
  { name: "Farfetch", url: "https://farfetch.com", cat: ["Fashion"], desc: "The global destination for modern luxury." },

  // Android
  { name: "APKMirror", url: "https://apkmirror.com", cat: ["Android"], desc: "Safe and secure Android APK downloads." },
  { name: "F-Droid", url: "https://f-droid.org", cat: ["Android"], desc: "Catalogue of FOSS applications for Android." },
  { name: "Aurora Store", url: "https://auroraoss.com", cat: ["Android"], desc: "Private Google Play Store client." },

  // Photography
  { name: "500px", url: "https://500px.com", cat: ["Photography"], desc: "The premier network for high-quality photography." },
  { name: "Unsplash", url: "https://unsplash.com", cat: ["Photography"], desc: "Beautiful, free images and photos." },
  { name: "Pexels", url: "https://pexels.com", cat: ["Photography"], desc: "Free stock photos shared by talented creators." },

  // Home & DIY
  { name: "Instructables", url: "https://instructables.com", cat: ["Home & DIY"], desc: "Step-by-step user-created DIY projects." },
  { name: "Family Handyman", url: "https://familyhandyman.com", cat: ["Home & DIY"], desc: "Expert tips for home improvement and repair." },
  { name: "Planner5D", url: "https://planner5d.com", cat: ["Home & DIY"], desc: "Advanced and easy to use 2D/3D home design tool." },

  // Languages
  { name: "LingQ", url: "https://lingq.com", cat: ["Languages"], desc: "Learn languages from content you love." },
  { name: "Forvo", url: "https://forvo.com", cat: ["Languages"], desc: "The largest pronunciation guide in the world." },
  { name: "Tatoeba", url: "https://tatoeba.org", cat: ["Languages"], desc: "Large database of sentences and translations." },

  // Finance
  { name: "Rocket Money", url: "https://rocketmoney.com", cat: ["Finance"], desc: "Manage subscriptions and lower your bills." },
  { name: "YNAB", url: "https://ynab.com", cat: ["Finance"], desc: "Personal budgeting software for better money habits." },
  { name: "Acquire.com", url: "https://acquire.com", cat: ["Finance"], desc: "The best marketplace to buy and sell startups." },

  // Cybersecurity
  { name: "Have I Been Pwned", url: "https://haveibeenpwned.com", cat: ["Cybersecurity"], desc: "Check if your email has been compromised in a data breach." },
  { name: "VirusTotal", url: "https://virustotal.com", cat: ["Cybersecurity"], desc: "Analyze suspicious files and URLs to detect malware." },
  { name: "DNSChecker", url: "https://dnschecker.org", cat: ["Cybersecurity"], desc: "Check propagation of your DNS records globally." },
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
