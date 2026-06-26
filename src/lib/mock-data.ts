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

const SITE_LIST = [
  { name: "Loot Drop", url: "https://lootdrop.io", cat: ["Gaming"], desc: "Digital vault for gaming assets and drops." },
  { name: "Emojikitchen", url: "https://emojikitchen.com", cat: ["Design", "Fun"], desc: "Mash up different emojis to create unique stickers." },
  { name: "Dofsimulator", url: "https://dofsimulator.net", cat: ["Photography"], desc: "Visual depth of field calculator for photographers." },
  { name: "Carcarekiosk", url: "https://carcarekiosk.com", cat: ["Tools", "Education"], desc: "Free DIY car repair videos and guides." },
  { name: "Modsnation", url: "https://modsnation.com", cat: ["Gaming"], desc: "A hub for high-quality gaming mods and community." },
  { name: "Kartbros", url: "https://kartbros.com", cat: ["Gaming"], desc: "Classic kart racing games and community portal." },
  { name: "Tenasa", url: "https://tenasa.com", cat: ["Productivity"], desc: "Minimalist workspace for task management." },
  { name: "Delphi", url: "https://delphi.ai", cat: ["AI"], desc: "AI-powered prediction and analysis market." },
  { name: "Privnote", url: "https://privnote.com", cat: ["Tools", "Security"], desc: "Send notes that self-destruct after being read." },
  { name: "Picular", url: "https://picular.co", cat: ["Design"], desc: "The fastest color search engine for designers." },
  { name: "Redcoats", url: "https://redcoats.io", cat: ["Gaming"], desc: "Strategy based battle simulations." },
  { name: "3Dsvg", url: "https://3dsvg.com", cat: ["Design", "3D"], desc: "Convert SVG paths into 3D models instantly." },
  { name: "Storyset", url: "https://storyset.com", cat: ["Design"], desc: "Customizable high-quality illustrations for projects." },
  { name: "Eyecandy", url: "https://eyecandy.io", cat: ["Design"], desc: "Visual design inspiration and UI patterns." },
  { name: "Entertrained", url: "https://entertrained.com", cat: ["Education"], desc: "Interactive training portals for various skills." },
  { name: "Toontone", url: "https://toontone.com", cat: ["Audio"], desc: "Cartoon voice effects and audio filters." },
  { name: "Paperme", url: "https://paperme.com", cat: ["Design", "Fun"], desc: "Digital paper crafting and origami guides." },
  { name: "Workout", url: "https://workout.lol", cat: ["Health"], desc: "The simplest workout tracker on the web." },
  { name: "Hotkeycheatsheet", url: "https://hotkeycheatsheet.com", cat: ["Productivity", "Developer"], desc: "Master software shortcuts with ease." },
  { name: "123Apps", url: "https://123apps.com", cat: ["Tools"], desc: "Web-based apps for video, audio, and PDF editing." },
  { name: "Neal", url: "https://neal.fun", cat: ["Fun"], desc: "A collection of quirky and fun web experiments." },
  { name: "Tinkercad", url: "https://tinkercad.com", cat: ["3D", "Design"], desc: "3D design and circuit simulation for everyone." },
  { name: "Buildcores", url: "https://buildcores.com", cat: ["Gaming", "Tools"], desc: "PC hardware building and comparison simulator." },
  { name: "Funesworld", url: "https://funesworld.com", cat: ["Education", "Gaming"], desc: "Historical games and memory challenges." },
  { name: "Deadshot", url: "https://deadshot.io", cat: ["Gaming"], desc: "Competitive aim trainer for FPS enthusiasts." },
  { name: "Movewalls", url: "https://movewalls.com", cat: ["Design"], desc: "Dynamic and animated wallpaper generator." },
  { name: "Zperiod", url: "https://zperiod.com", cat: ["Productivity"], desc: "Focused timer for deep work sessions." },
  { name: "Shadergradient", url: "https://shadergradient.co", cat: ["Design"], desc: "Create abstract gradients with ease." },
  { name: "Jetpunk", url: "https://jetpunk.com", cat: ["Education", "Fun"], desc: "Trivia quizzes and educational challenges." },
  { name: "Autodraw", url: "https://autodraw.com", cat: ["AI", "Design"], desc: "Fast drawing tool assisted by machine learning." },
  { name: "Uniqcode", url: "https://uniqcode.com", cat: ["Developer", "Tools"], desc: "Universal character and symbol database." },
  { name: "Goblin", url: "https://goblin.tools", cat: ["AI", "Productivity"], desc: "AI tools to help neurodivergent people with tasks." },
  { name: "Origami", url: "https://origami.me", cat: ["Design", "Fun"], desc: "Step-by-step paper folding instructions." },
  { name: "Zoomquilt", url: "https://zoomquilt.org", cat: ["Design", "Fun"], desc: "The original infinite zooming artwork." },
  { name: "Languageguide", url: "https://languageguide.org", cat: ["Education"], desc: "Visual and audio language learning guides." },
  { name: "Textrepeater", url: "https://textrepeater.com", cat: ["Tools"], desc: "Instantly repeat text for various uses." },
  { name: "Motormatchup", url: "https://motormatchup.com", cat: ["Tools"], desc: "Automotive specs and comparison tool." },
  { name: "Travelmap", url: "https://travelmap.net", cat: ["Travel"], desc: "Create personal maps of your travels." },
  { name: "Jigsawpuzzles", url: "https://jigsawpuzzles.io", cat: ["Gaming"], desc: "Multiplayer jigsaw puzzles for the web." },
  { name: "Terrainx", url: "https://terrainx.com", cat: ["Design", "3D"], desc: "3D terrain generation and analysis." },
  { name: "Perchance", url: "https://perchance.org", cat: ["Tools", "Developer"], desc: "A platform for creating random generators." },
  { name: "Koupon", url: "https://koupon.com", cat: ["Shopping"], desc: "Aggregator for online shopping discounts." },
  { name: "Avanka", url: "https://avanka.com", cat: ["Design"], desc: "High-quality UI design assets." },
  { name: "Veck", url: "https://veck.com", cat: ["Audio"], desc: "Professional video creative tools." },
  { name: "Autocatalogarchive", url: "https://autocatalogarchive.com", cat: ["Education", "Tools"], desc: "A massive library of car brochures." },
  { name: "Tasteatlas", url: "https://tasteatlas.com", cat: ["Food", "Travel"], desc: "Interactive encyclopedia of world cuisines." },
  { name: "Emojicombos", url: "https://emojicombos.com", cat: ["Design"], desc: "Find the perfect emoji combinations." },
  { name: "Universe", url: "https://univer.se", cat: ["Tools", "Developer"], desc: "The world's easiest mobile website builder." },
  { name: "Drifted", url: "https://drifted.com", cat: ["Gaming"], desc: "Online hub for car drifting games." },
  { name: "Creativemodo", url: "https://creativemodo.com", cat: ["Design"], desc: "Design inspiration and resources." },
  { name: "Toools", url: "https://toools.design", cat: ["Design", "Tools"], desc: "Directory of best design tools and assets." },
  { name: "Myinstants", url: "https://myinstants.com", cat: ["Audio", "Fun"], desc: "Huge collection of sound buttons." },
  { name: "Idiottest", url: "https://idiottest.com", cat: ["Gaming", "Fun"], desc: "Brain teasers and logic challenges." },
  { name: "Coolors", url: "https://coolors.co", cat: ["Design"], desc: "The super fast color palettes generator." },
  { name: "Vetted", url: "https://vetted.ai", cat: ["Shopping", "AI"], desc: "AI shopping assistant for better choices." },
  { name: "Tosdr", url: "https://tosdr.org", cat: ["Tools", "Security"], desc: "Terms of Service summary and ratings." },
  { name: "Justtherecipe", url: "https://justtherecipe.com", cat: ["Food"], desc: "Get recipes without the clutter." },
  { name: "Framesynthesis", url: "https://framesynthesis.com", cat: ["Gaming"], desc: "Experimental browser-based driving games." },
  { name: "Parlerbeads", url: "https://parlerbeads.com", cat: ["Design", "Fun"], desc: "Create and share bead art patterns." },
  { name: "Glint", url: "https://glint.ai", cat: ["AI", "Productivity"], desc: "Intelligent data analysis for businesses." },
  { name: "Smart", url: "https://smart.io", cat: ["Tools"], desc: "Intelligent automation for web tasks." },
  { name: "Withdiode", url: "https://withdiode.com", cat: ["Developer", "Security"], desc: "Decentralized web hosting for modern apps." },
  { name: "Hackerai", url: "https://hackerai.com", cat: ["AI", "Security"], desc: "AI security auditor for code and systems." },
  { name: "Atomanimation", url: "https://atomanimation.com", cat: ["Design", "Developer"], desc: "High-performance browser animation tools." },
  { name: "Snazzymaps", url: "https://snazzymaps.com", cat: ["Design", "Tools"], desc: "Styled Google Maps for web projects." },
  { name: "Rxresume", url: "https://rxresume.me", cat: ["Productivity"], desc: "Open-source, free resume builder." },
  { name: "Maze", url: "https://maze.co", cat: ["Tools", "Developer"], desc: "User research platform for testing designs." },
  { name: "Recipescal", url: "https://recipescal.com", cat: ["Food"], desc: "Instantly scale your recipes up or down." },
  { name: "Textbehindimage", url: "https://textbehindimage.com", cat: ["AI", "Design"], desc: "AI tool to place text behind objects in images." },
  { name: "Formia", url: "https://formia.so", cat: ["Tools", "Developer"], desc: "The modern form builder for teams." },
  { name: "Paper", url: "https://paper.io", cat: ["Gaming", "Fun"], desc: "The classic territory conquest game." },
  { name: "Exercism", url: "https://exercism.org", cat: ["Education", "Developer"], desc: "Learn coding through mentor-reviewed exercises." },
  { name: "Slowroads", url: "https://slowroads.io", cat: ["Gaming", "Fun"], desc: "Endless zen driving simulator for the web." },
  { name: "Ifixit", url: "https://ifixit.com", cat: ["Education", "Tools"], desc: "Global community repair guides for everything." },
  { name: "Runnable", url: "https://runnable.com", cat: ["Developer"], desc: "Fast and lightweight code runner for the web." },
  { name: "3DAimTrainer", url: "https://3daimtrainer.com", cat: ["Gaming"], desc: "Professional aim training for gamers." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Audio", "Travel"], desc: "Listen to live radio from around the globe." },
  { name: "Pixabay", url: "https://pixabay.com", cat: ["Design"], desc: "Free stock images and creative assets." },
  { name: "Massager", url: "https://massager.com", cat: ["Tools", "Fun"], desc: "Turn your device into a haptic tool." },
  { name: "Onelook", url: "https://onelook.com", cat: ["Education", "Tools"], desc: "Massive dictionary search engine." },
  { name: "Prepostseo", url: "https://prepostseo.com", cat: ["Tools", "Developer"], desc: "Essential SEO tools for content creators." },
  { name: "Wifimap", url: "https://wifimap.io", cat: ["Travel", "Tools"], desc: "Find free hotspots around the world." },
  { name: "Systemrequirementslab", url: "https://systemrequirementslab.com", cat: ["Gaming", "Tools"], desc: "Check if your PC can run any game." },
  { name: "Darebee", url: "https://darebee.com", cat: ["Health"], desc: "Non-profit visual fitness resource." },
  { name: "Bonk", url: "https://bonk.io", cat: ["Gaming"], desc: "Physics-based multiplayer ball game." },
  { name: "Docsity", url: "https://docsity.com", cat: ["Education"], desc: "Study resources and document sharing for students." },
  { name: "Chef", url: "https://chef.ai", cat: ["Food", "AI"], desc: "AI-powered personalized culinary coach." },
  { name: "Beforeiplay", url: "https://beforeiplay.com", cat: ["Gaming"], desc: "Non-spoiler tips for starting new games." },
  { name: "3Dtuning", url: "https://3dtuning.com", cat: ["3D", "Gaming"], desc: "3D car tuning and configuration simulator." },
  { name: "Reactbits", url: "https://reactbits.dev", cat: ["Developer"], desc: "Curated collection of React components and snippets." }
];

export const MOCK_WEBSITES: Website[] = SITE_LIST.map((site, index) => ({
  id: `mock-${index}`,
  name: site.name,
  developer: "Curated",
  description: site.desc,
  longDescription: `${site.name} is a high-performance web platform specializing in ${site.cat[0].toLowerCase()}. Discover unique features and tools designed for the modern web.`,
  rating: 4.3 + (Math.random() * 0.6),
  reviewCount: 10 + Math.floor(Math.random() * 900),
  categories: site.cat,
  imageUrl: "", // Favicon service handles this
  screenshots: [],
  url: site.url,
  size: "N/A",
  version: "1.0",
  updatedAt: "2024",
  pricing: Math.random() > 0.7 ? "Paid" : (Math.random() > 0.4 ? "Freemium" : "Free")
}));
