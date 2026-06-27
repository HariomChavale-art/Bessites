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
  { name: "Loot Drop", url: "https://lootdrop.io", cat: ["Gaming", "Fun"], desc: "Digital vault for game rewards and virtual items." },
  { name: "Emojikitchen", url: "https://emojikitchen.com", cat: ["Fun", "Design"], desc: "Combine your favorite emojis into unique mashups." },
  { name: "Dofsimulator", url: "https://dofsimulator.net", cat: ["Photography", "Tools"], desc: "Optical camera simulator for depth-of-field mastering." },
  { name: "Carcarekiosk", url: "https://carcarekiosk.com", cat: ["Tools", "Education"], desc: "DIY auto repair and maintenance video guides." },
  { name: "Modsnation", url: "https://modsnation.com", cat: ["Gaming"], desc: "Community portal for game modifications and assets." },
  { name: "Kartbros", url: "https://kartbros.com", cat: ["Gaming", "Fun"], desc: "Competitive kart racing game portal." },
  { name: "Tenasa", url: "https://tenasa.ai", cat: ["Productivity", "AI"], desc: "Intelligent workplace organization dashboard." },
  { name: "Delphi", url: "https://delphi.market", cat: ["AI", "Tools"], desc: "AI-powered prediction and analysis market." },
  { name: "Privnote", url: "https://privnote.com", cat: ["Security", "Tools"], desc: "Send notes that self-destruct after being read." },
  { name: "Picular", url: "https://picular.co", cat: ["Design", "Tools"], desc: "The fastest search engine for finding colors." },
  { name: "Redcoats", url: "https://redcoats.game", cat: ["Gaming"], desc: "Historical strategy game set in the Napoleonic era." },
  { name: "3Dsvg", url: "https://3dsvg.com", cat: ["Design", "3D"], desc: "Convert vector graphics into 3D models instantly." },
  { name: "Storyset", url: "https://storyset.com", cat: ["Design"], desc: "Customizable vector illustrations for projects." },
  { name: "Eyecandy", url: "https://eyecandy.visuals", cat: ["Design"], desc: "Visual inspiration feed for creative directors." },
  { name: "Entertrained", url: "https://entertrained.com", cat: ["Education", "Fun"], desc: "Educational content delivered through entertainment." },
  { name: "Toontone", url: "https://toontone.ai", cat: ["Audio", "AI"], desc: "AI character voice generator and editor." },
  { name: "Paperme", url: "https://paperme.io", cat: ["Fun", "Design"], desc: "Digital paper craft and origami simulator." },
  { name: "Workout", url: "https://workout.cool", cat: ["Health"], desc: "Simple and effective web-based exercise routines." },
  { name: "Hotkeycheatsheet", url: "https://hotkey.cheat", cat: ["Productivity", "Developer"], desc: "Universal database for software keyboard shortcuts." },
  { name: "123Apps", url: "https://123apps.com", cat: ["Tools"], desc: "Web-based suite for video, audio, and PDF editing." },
  { name: "Neal", url: "https://neal.fun", cat: ["Fun"], desc: "A collection of quirky and addictive web experiments." },
  { name: "Tinkercad", url: "https://tinkercad.com", cat: ["3D", "Education"], desc: "Easy-to-use 3D design and electronics tool." },
  { name: "Buildcores", url: "https://buildcores.com", cat: ["Developer", "Tools"], desc: "PC hardware comparison and build planner." },
  { name: "Funesworld", url: "https://funes.world", cat: ["Gaming", "Fun"], desc: "Immersive historical memory and exploration games." },
  { name: "Deadshot", url: "https://deadshot.io", cat: ["Gaming"], desc: "Professional aim training for FPS players." },
  { name: "Movewalls", url: "https://movewalls.art", cat: ["Design", "3D"], desc: "Generate dynamic and interactive digital wallpapers." },
  { name: "Zperiod", url: "https://zperiod.com", cat: ["Productivity"], desc: "Minimalist focused timer for deep work sessions." },
  { name: "Shadergradient", url: "https://shadergradient.co", cat: ["Design"], desc: "Create moving gradients for websites and apps." },
  { name: "Jetpunk", url: "https://jetpunk.com", cat: ["Education", "Fun"], desc: "Vast collection of geography and trivia quizzes." },
  { name: "Autodraw", url: "https://autodraw.com", cat: ["AI", "Design"], desc: "Machine learning based tool for fast drawing." },
  { name: "Uniqcode", url: "https://uniqcode.com", cat: ["Developer", "Tools"], desc: "Database for Unicode characters and symbols." },
  { name: "Goblin", url: "https://goblin.tools", cat: ["AI", "Productivity"], desc: "AI-powered task management for neurodivergent folks." },
  { name: "Origami", url: "https://origami.fold", cat: ["Fun", "Design"], desc: "Interactive paper folding guides and patterns." },
  { name: "Zoomquilt", url: "https://zoomquilt.org", cat: ["Fun", "Design"], desc: "Infinite zoom artwork that never ends." },
  { name: "Languageguide", url: "https://languageguide.org", cat: ["Education"], desc: "Visual and audio guides for language learning." },
  { name: "Textrepeater", url: "https://textrepeat.com", cat: ["Tools"], desc: "Utility for repeating large blocks of text." },
  { name: "Motormatchup", url: "https://motor.match", cat: ["Tools"], desc: "Automotive technical specification comparison." },
  { name: "Travelmap", url: "https://travelmap.net", cat: ["Travel"], desc: "Create a blog and map of your travel journey." },
  { name: "Jigsawpuzzles", url: "https://jigsaw.io", cat: ["Gaming", "Fun"], desc: "Multiplayer online jigsaw puzzles." },
  { name: "Terrainx", url: "https://terrainx.com", cat: ["Travel", "3D"], desc: "3D terrain analysis for outdoor navigation." },
  { name: "Perchance", url: "https://perchance.org", cat: ["Developer", "Fun"], desc: "Platform for creating random text generators." },
  { name: "Koupon", url: "https://koupon.ai", cat: ["Shopping"], desc: "AI-driven coupon and discount finder." },
  { name: "Avanka", url: "https://avanka.ui", cat: ["Design"], desc: "High-quality UI kits and design assets." },
  { name: "Veck", url: "https://veck.video", cat: ["Tools", "Design"], desc: "Video creation and creative automation tools." },
  { name: "Autocatalogarchive", url: "https://autobrochure.com", cat: ["Education", "Tools"], desc: "Historical archive of car brochures and specs." },
  { name: "Tasteatlas", url: "https://tasteatlas.com", cat: ["Food", "Travel"], desc: "World atlas of traditional dishes and ingredients." },
  { name: "Emojicombos", url: "https://emojicombos.com", cat: ["Fun", "Design"], desc: "Search engine for combined emoji art." },
  { name: "Universe", url: "https://universe.com", cat: ["Tools", "Developer"], desc: "Mobile-first website builder for everyone." },
  { name: "Drifted", url: "https://drifted.com", cat: ["Gaming"], desc: "Portal for car drifting games and culture." },
  { name: "Creativemodo", url: "https://creativemodo.com", cat: ["Design"], desc: "Daily inspiration for graphic designers." },
  { name: "Toools", url: "https://toools.design", cat: ["Design", "Tools"], desc: "Curated directory of design resources." },
  { name: "Myinstants", url: "https://myinstants.com", cat: ["Audio", "Fun"], desc: "Instant sound button board for the internet." },
  { name: "Idiottest", url: "https://idiottest.com", cat: ["Gaming", "Fun"], desc: "Brain-bending logic and perception tests." },
  { name: "Coolors", url: "https://coolors.co", cat: ["Design"], desc: "The super fast color schemes generator." },
  { name: "Vetted", url: "https://vetted.ai", cat: ["Shopping", "AI"], desc: "AI shopping assistant for vetted products." },
  { name: "Tosdr", url: "https://tosdr.org", cat: ["Security", "Tools"], desc: "Terms of Service summaries for major sites." },
  { name: "Justtherecipe", url: "https://justtherecipe.com", cat: ["Food"], desc: "Extract just the recipe from cluttered blogs." },
  { name: "Framesynthesis", url: "https://framesynthesis.com", cat: ["Gaming", "Tools"], desc: "Advanced driving and vehicle simulators." },
  { name: "Parlerbeads", url: "https://parlerbeads.art", cat: ["Design", "Fun"], desc: "Pattern generator for pixel and bead art." },
  { name: "Glint", url: "https://glint.ai", cat: ["AI", "Developer"], desc: "AI data insights and visualization engine." },
  { name: "Smart", url: "https://smart.auto", cat: ["Tools"], desc: "Smart home and device automation manager." },
  { name: "Withdiode", url: "https://withdiode.com", cat: ["Security", "Developer"], desc: "Decentralized hosting for modern apps." },
  { name: "Hackerai", url: "https://hackerai.co", cat: ["Security", "AI"], desc: "AI-powered security audits for source code." },
  { name: "Atomanimation", url: "https://atoms.dev", cat: ["Design", "Developer"], desc: "Web animation toolkit for modern designers." },
  { name: "Snazzymaps", url: "https://snazzymaps.com", cat: ["Design", "Travel"], desc: "Custom color schemes for Google Maps." },
  { name: "Rxresume", url: "https://rxresume.com", cat: ["Productivity"], desc: "Professional and open-source resume builder." },
  { name: "Maze", url: "https://maze.co", cat: ["Design", "Tools"], desc: "User testing and research platform for apps." },
  { name: "Recipescal", url: "https://recipescal.com", cat: ["Food", "Tools"], desc: "Tool for scaling ingredient quantities in recipes." },
  { name: "Textbehindimage", url: "https://textbehind.ai", cat: ["Design", "AI"], desc: "AI tool to place text behind image subjects." },
  { name: "Formia", url: "https://formia.io", cat: ["Tools", "Developer"], desc: "Modern and flexible online form builder." },
  { name: "Paper", url: "https://paper.io", cat: ["Gaming", "Fun"], desc: "Fast-paced territory expansion game." },
  { name: "Exercism", url: "https://exercism.org", cat: ["Developer", "Education"], desc: "Master 67+ programming languages with mentors." },
  { name: "Slowroads", url: "https://slowroads.io", cat: ["Gaming", "Fun"], desc: "Procedural zen driving simulator in the browser." },
  { name: "Ifixit", url: "https://ifixit.com", cat: ["Tools", "Education"], desc: "Repair manuals for almost everything." },
  { name: "Runnable", url: "https://runnable.com", cat: ["Developer", "Tools"], desc: "Quick code testing and deployment sandbox." },
  { name: "3DAimTrainer", url: "https://3daimtrainer.com", cat: ["Gaming"], desc: "Elite aim practice for competitive gaming." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Audio", "Travel"], desc: "Explore global live radio by rotating a globe." },
  { name: "Pixabay", url: "https://pixabay.com", cat: ["Design"], desc: "Vast collection of free stock photos and videos." },
  { name: "Massager", url: "https://massager.com", cat: ["Tools", "Health"], desc: "Browser-based vibration and relaxation tool." },
  { name: "Onelook", url: "https://onelook.com", cat: ["Education", "Tools"], desc: "Powerful dictionary and reverse search engine." },
  { name: "Prepostseo", url: "https://prepostseo.com", cat: ["Tools", "Developer"], desc: "Content and SEO checking suite." },
  { name: "Wifimap", url: "https://wifimap.io", cat: ["Travel", "Tools"], desc: "Global map of free Wi-Fi hotspots." },
  { name: "Systemrequirementslab", url: "https://cyri.com", cat: ["Gaming", "Tools"], desc: "Check if your PC can run specific games." },
  { name: "Darebee", url: "https://darebee.com", cat: ["Health"], desc: "Visual and non-profit fitness resource." },
  { name: "Bonk", url: "https://bonk.io", cat: ["Gaming", "Fun"], desc: "Physics-based multiplayer ball game." },
  { name: "Docsity", url: "https://docsity.com", cat: ["Education"], desc: "Student community for sharing study resources." },
  { name: "Chef", url: "https://chef.ai", cat: ["Food", "AI"], desc: "AI culinary assistant for personalized recipes." },
  { name: "Beforeiplay", url: "https://beforeiplay.com", cat: ["Gaming"], desc: "Crowdsourced tips for before you start a game." },
  { name: "3Dtuning", url: "https://3dtuning.com", cat: ["3D", "Gaming"], desc: "Photorealistic 3D car configuration simulator." },
  { name: "Reactbits", url: "https://reactbits.dev", cat: ["Developer", "Design"], desc: "Animated React components library." },
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
  imageUrl: "", // Handled by favicon service
  screenshots: [],
  url: site.url,
  size: "N/A",
  version: "1.0",
  updatedAt: "2024",
  pricing: Math.random() > 0.7 ? "Paid" : (Math.random() > 0.4 ? "Freemium" : "Free")
}));
