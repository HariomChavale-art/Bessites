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
  { name: "Krea AI", url: "https://krea.ai", cat: ["AI", "Creative", "Design"], desc: "Want to generate art in real-time? Krea AI gives you a live canvas to create, enhance, and upscale images as you move your mouse, making high-end AI design feel like actual drawing." },
  { name: "Napkin AI", url: "https://napkin.ai", cat: ["AI", "Productivity", "Ideas"], desc: "Need to turn complex thoughts into visuals? Napkin AI transforms your text-based ideas into professional diagrams and charts instantly, helping you explain anything to anyone without design skills." },
  { name: "OpenRouter", url: "https://openrouter.ai", cat: ["AI", "Coding", "Developer"], desc: "Looking for the best AI models in one place? OpenRouter provides a single API to access every major LLM (like GPT-4, Claude, and Llama), letting you compare prices and performance for your apps." },
  { name: "Jan", url: "https://jan.ai", cat: ["AI", "Privacy", "Utilities"], desc: "Want an AI assistant that stays on your computer? Jan is an open-source tool that lets you run powerful AI models locally, keeping your conversations private and working even when you're offline." },
  { name: "LM Studio", url: "https://lmstudio.ai", cat: ["AI", "Developer", "PC Software"], desc: "Ready to experiment with local AI? LM Studio makes it incredibly easy to discover, download, and run open-source LLMs on your Mac or PC with a clean, professional interface." },
  { name: "FlowGPT", url: "https://flowgpt.com", cat: ["AI", "AI Directories", "Creative"], desc: "Struggling to get good results from ChatGPT? FlowGPT is a massive library of community-tested prompts that help you unlock hidden features and get better answers for work, study, or fun." },
  { name: "Hugging Face", url: "https://huggingface.co", cat: ["AI", "Developer", "Coding"], desc: "Building the next big AI app? Hugging Face is the central hub where developers share datasets, models, and demo apps, serving as the 'GitHub of AI' for the modern web." },
  { name: "Ideogram", url: "https://ideogram.ai", cat: ["AI", "Design", "Creative"], desc: "Need AI art with readable text? Ideogram excels at generating images with beautiful typography, making it perfect for creating logos, posters, and social media graphics that actually say something." },
  { name: "Perplexity", url: "https://perplexity.ai", cat: ["AI", "Search", "Internet"], desc: "Tired of scrolling through SEO-heavy search results? Perplexity acts as an AI research assistant that reads the web for you and provides cited, direct answers to any question you ask." },
  { name: "Poe", url: "https://poe.com", cat: ["AI", "Chat & Community", "Fun"], desc: "Want to try every AI chatbot in one app? Poe lets you talk to everything from GPT-4 to Claude, and even build your own custom bots to handle specific tasks or personas." },
  { name: "Runway", url: "https://runwayml.com", cat: ["AI", "Video", "Creative"], desc: "Looking to make cinematic videos from thin air? Runway provides professional-grade AI tools for video generation, motion tracking, and green-screen effects that used to take days in a studio." },
  { name: "Leonardo AI", url: "https://leonardo.ai", cat: ["AI", "Design", "Creative"], desc: "Creating assets for a game or brand? Leonardo AI offers a powerful suite of generative tools with high-level control over style and consistency, perfect for professional creative workflows." },
  { name: "Gamma", url: "https://gamma.app", cat: ["AI", "Design", "Productivity"], desc: "Hate building slide decks? Gamma uses AI to generate beautiful presentations, documents, and even mini-websites from a single prompt, handling all the layout and styling for you." },
  { name: "Phind", url: "https://phind.com", cat: ["AI", "Coding", "Developer"], desc: "Stuck on a coding bug? Phind is a search engine designed specifically for developers, providing AI-generated code solutions and explanations based on the latest documentation." },
  { name: "Suno", url: "https://suno.com", cat: ["AI", "Music", "Creative"], desc: "Want to write a hit song in seconds? Suno creates complete musical tracks with vocals and instruments from your text descriptions, covering everything from jazz to heavy metal." },
  { name: "ElevenLabs", url: "https://elevenlabs.io", cat: ["AI", "Voice", "Creative"], desc: "Need a professional voiceover without the cost? ElevenLabs uses advanced AI to create incredibly realistic speech and voice clones for videos, audiobooks, and games." },
  { name: "Mistral AI", url: "https://mistral.ai", cat: ["AI", "Developer"], desc: "Looking for efficient, high-performance AI? Mistral builds open-weight models that rival the world's best, offering developers a powerful alternative for building custom AI applications." },
  { name: "Groq", url: "https://groq.com", cat: ["AI", "Developer"], desc: "Waiting too long for AI responses? Groq's specialized hardware makes LLMs run at near-instant speeds, providing the fastest AI inference currently available on the market." },
  { name: "DeepL", url: "https://deepl.com", cat: ["AI", "Education", "Languages"], desc: "Need a translation that doesn't sound robotic? DeepL uses AI to provide extremely accurate and natural-sounding translations that understand context and nuance better than standard tools." },
  { name: "Synthesia", url: "https://synthesia.io", cat: ["AI", "Video"], desc: "Want to create training videos without a camera crew? Synthesia lets you turn text into videos featuring realistic AI avatars that speak in over 120 languages." },
  { name: "Midjourney", url: "https://midjourney.com", cat: ["AI", "Design", "Creative"], desc: "Looking for the highest quality AI art? Midjourney is a community-driven tool that consistently produces the most aesthetic and artistic images in the generative AI space." },
  
  // --- GAMING & ENTERTAINMENT ---
  { name: "Game Jolt", url: "https://gamejolt.com", cat: ["Gaming", "Entertainment", "Fun"], desc: "Looking for the next big indie game? Game Jolt is a social playground where you can play thousands of fan-made games, join creator communities, and follow your favorite developers." },
  { name: "ModDB", url: "https://moddb.com", cat: ["Gaming", "PC Software", "Utilities"], desc: "Want to refresh your favorite classic games? ModDB is the world's largest library of game modifications, providing new maps, graphics, and features for thousands of titles." },
  { name: "My Abandonware", url: "https://myabandonware.com", cat: ["Gaming", "History", "Fun"], desc: "Feeling nostalgic for the 90s? My Abandonware lets you legally rediscover and play thousands of classic computer games that are no longer available in stores." },
  { name: "Nexus Mods", url: "https://nexusmods.com", cat: ["Gaming", "PC Software", "Downloads"], desc: "Modding your favorite RPG? Nexus Mods is the premier hub for game enhancements, offering millions of community-created files and a powerful manager to keep them organized." },
  { name: "GG.deals", url: "https://gg.deals", cat: ["Gaming", "Deals", "Shopping"], desc: "Want to build your game library on a budget? GG.deals tracks prices across every major digital store to find you the absolute lowest prices and best bundles for PC games." },
  { name: "Chess.com", url: "https://chess.com", cat: ["Gaming", "Brain Games", "Education"], desc: "Want to master the game of kings? Chess.com is the #1 global platform to play against friends, learn from grandmasters, and track your progress through interactive lessons." },
  { name: "Itch.io", url: "https://itch.io", cat: ["Gaming", "Creative", "Startups"], desc: "Love experimental and unique games? Itch.io is the independent marketplace where creators sell their most creative projects, from tiny game-jam entries to full-scale indie hits." },
  { name: "Board Game Arena", url: "https://boardgamearena.com", cat: ["Gaming", "Fun", "Brain Games"], desc: "Missed your weekly board game night? Board Game Arena lets you play hundreds of official board games directly in your browser with friends or players from around the world." },
  { name: "Lichess", url: "https://lichess.org", cat: ["Gaming", "Brain Games", "Education"], desc: "Looking for pure chess without the ads? Lichess is a completely free, open-source platform that offers elite features, puzzles, and analysis for every level of player." },
  { name: "Speedrun.com", url: "https://speedrun.com", cat: ["Gaming", "Entertainment", "Interesting"], desc: "How fast can a game be finished? Speedrun.com is the global database for world records, strategies, and leaderboards for thousands of games across every platform." },
  { name: "SteamDB", url: "https://steamdb.info", cat: ["Gaming", "Deals", "Data"], desc: "Curious about Steam stats? SteamDB provides deep insights into player counts, price histories, and upcoming updates for every game on the Steam platform." },
  { name: "Hollow Knight Map", url: "https://hollowknightmap.com", cat: ["Gaming", "Interesting"], desc: "Lost in Hallownest? This interactive map provides a detailed guide to every secret, item, and boss in Hollow Knight, helping you achieve that elusive 112% completion." },
  { name: "Vim Adventures", url: "https://vim-adventures.com", cat: ["Gaming", "Coding", "Education"], desc: "Want to learn the Vim text editor? Vim Adventures turns complex keyboard shortcuts into a fun RPG quest, helping you build muscle memory while playing a game." },
  { name: "Infinite Craft", url: "https://neal.fun/infinite-craft/", cat: ["Gaming", "Fun", "AI"], desc: "What happens when you mix Fire and Water? Infinite Craft uses AI to let you combine basic elements into anything—from dinosaurs to pop stars—in a never-ending discovery loop." },
  
  // --- EDUCATION & SCIENCE ---
  { name: "Wolfram Alpha", url: "https://wolframalpha.com", cat: ["Science", "Math", "Physics", "Education"], desc: "Need a definitive answer to a math or science problem? Wolfram Alpha uses vast datasets to calculate answers, solve equations, and visualize data instead of just searching for it." },
  { name: "PhET Simulations", url: "https://phet.colorado.edu", cat: ["Science", "Physics", "Education", "Fun"], desc: "Visualizing complex science? PhET provides interactive, game-like simulations for physics, chemistry, and biology that make learning feel like an experiment." },
  { name: "NASA Eyes", url: "https://eyes.nasa.gov", cat: ["Space", "Science", "Education", "Astronomy"], desc: "Want to explore the solar system from home? NASA Eyes lets you fly alongside real spacecraft and explore planets in a real-time 3D environment based on actual data." },
  { name: "Heavens Above", url: "https://heavens-above.com", cat: ["Space", "Astronomy", "Interesting"], desc: "Want to see the Space Station tonight? Heavens Above provides precise predictions for satellite passes, planets, and constellations based on your exact location." },
  { name: "Khan Academy", url: "https://khanacademy.org", cat: ["Education", "School", "Math"], desc: "Struggling with a school subject? Khan Academy offers free, high-quality lessons and practice exercises in math, science, and history for learners of all ages." },
  { name: "Duolingo", url: "https://duolingo.com", cat: ["Education", "Languages", "Fun"], desc: "Planning a trip abroad? Duolingo turns language learning into a daily habit with short, game-like lessons that help you speak, read, and listen in over 40 languages." },
  { name: "Brilliant", url: "https://brilliant.org", cat: ["Education", "Science", "Math"], desc: "Want to build better thinking skills? Brilliant uses interactive storytelling and hands-on problems to help you master concepts in STEM without memorizing dry formulas." },
  { name: "Codecademy", url: "https://codecademy.com", cat: ["Education", "Coding", "Developer"], desc: "Ready to start your coding journey? Codecademy provides an interactive browser-based environment where you can learn Python, JavaScript, and more with instant feedback." },
  { name: "freeCodeCamp", url: "https://freecodecamp.org", cat: ["Education", "Coding", "Developer"], desc: "Want to earn a developer certification for free? freeCodeCamp offers thousands of hours of lessons and real-world projects that help you learn to build the modern web." },
  { name: "Project Gutenberg", url: "https://gutenberg.org", cat: ["Reading", "History", "Education"], desc: "Looking for your next classic read? Project Gutenberg is a digital archive of over 70,000 free eBooks, focusing on older works for which U.S. copyright has expired." },
  { name: "arXiv", url: "https://arxiv.org", cat: ["Science", "Education", "Physics"], desc: "Want the latest in scientific research? arXiv is the world's leading open-access archive for scholarly articles in physics, mathematics, and computer science." },
  { name: "World History Encyclopedia", url: "https://worldhistory.org", cat: ["History", "Education", "Interesting"], desc: "Curious about the ancient world? This non-profit encyclopedia provides beautifully illustrated and deeply researched articles on human history from every corner of the globe." },
  { name: "LibriVox", url: "https://librivox.org", cat: ["Reading", "Audio", "Education"], desc: "Love audiobooks but hate the price? LibriVox provides free, high-quality audio recordings of public domain books, read by volunteers from around the world." },
  { name: "Z-Library", url: "https://z-lib.org", cat: ["Reading", "Education"], desc: "Searching for a specific textbook or research paper? Z-Library is one of the world's largest digital archives for books and articles, making knowledge accessible to everyone." },
  { name: "Wait But Why", url: "https://waitbutwhy.com", cat: ["Education", "Interesting", "Ideas"], desc: "Want to understand complex topics deeply? Tim Urban's Wait But Why uses stick figures and long-form humor to explain everything from AI and space to procrastination and life." },
  
  // --- DESIGN & CREATIVE ---
  { name: "Figma", url: "https://figma.com", cat: ["Design", "Creative", "Productivity"], desc: "Designing an app or website with a team? Figma is the industry-standard collaborative tool that lets you design, prototype, and share your work in real-time." },
  { name: "Canva", url: "https://canva.com", cat: ["Design", "Creative", "Marketing"], desc: "Need a professional graphic but not a designer? Canva provides thousands of templates and a drag-and-drop editor to create social posts, logos, and presentations in minutes." },
  { name: "Coolors", url: "https://coolors.co", cat: ["Design", "Creative", "Utilities"], desc: "Stuck on a color scheme? Coolors is a super-fast generator that helps you discover, save, and export beautiful palettes for your next design project." },
  { name: "Dribbble", url: "https://dribbble.com", cat: ["Design", "Creative", "Photography"], desc: "Looking for design inspiration? Dribbble is the world's leading portfolio site where designers share 'shots' of their work and discover new trends." },
  { name: "Behance", url: "https://behance.net", cat: ["Design", "Creative", "Portfolio"], desc: "Want to see full-scale creative projects? Behance is Adobe's massive showcase for photographers, illustrators, and designers to display their professional portfolios." },
  { name: "Framer", url: "https://framer.com", cat: ["Design", "Startups", "Developer"], desc: "Ready to launch a high-end website? Framer lets you design your site visually and publish it instantly with cinematic animations and lightning-fast performance." },
  { name: "Webflow", url: "https://webflow.com", cat: ["Design", "Developer", "Startups"], desc: "Building a custom site without code? Webflow gives you the power of HTML and CSS in a visual interface, letting you build production-ready websites from scratch." },
  { name: "Unsplash", url: "https://unsplash.com", cat: ["Design", "Photography", "Creative"], desc: "Need high-quality photos for your project? Unsplash provides a massive library of beautiful, high-resolution images that are completely free to use for anything." },
  { name: "Pexels", url: "https://pexels.com", cat: ["Design", "Photography", "Video"], desc: "Looking for free stock assets? Pexels offers a huge collection of photos and videos that help you bring your website or presentation to life without a budget." },
  { name: "Iconfinder", url: "https://iconfinder.com", cat: ["Design", "Creative", "Utilities"], desc: "Searching for the perfect icon? Iconfinder gives you access to millions of professional SVG and PNG icons in every style imaginable for your apps and designs." },
  { name: "Fontjoy", url: "https://fontjoy.com", cat: ["Design", "Creative", "AI"], desc: "Struggling to pair fonts? Fontjoy uses deep learning to generate balanced font combinations, making sure your headers and body text always look great together." },
  { name: "Khroma", url: "https://khroma.co", cat: ["Design", "AI", "Creative"], desc: "Want a personalized color tool? Khroma learns which colors you like and uses AI to generate infinite palettes that match your unique style." },
  { name: "Lapa Ninja", url: "https://lapa.ninja", cat: ["Design", "Creative"], desc: "Looking for landing page ideas? Lapa Ninja curates the best landing pages from across the web to help you find inspiration for your next marketing site." },
  
  // --- TOOLS & UTILITIES ---
  { name: "TinyWow", url: "https://tinywow.com", cat: ["Utilities", "PDF", "Video", "Photography"], desc: "Need a quick tool for a file? TinyWow provides a massive suite of free online utilities to convert PDFs, edit videos, remove backgrounds, and much more." },
  { name: "Convertio", url: "https://convertio.co", cat: ["Utilities", "Productivity", "Downloads"], desc: "Stuck with an incompatible file format? Convertio supports over 300 different file formats, letting you convert documents, images, and videos in seconds." },
  { name: "Bitwarden", url: "https://bitwarden.com", cat: ["Cybersecurity", "Password Managers", "Privacy"], desc: "Concerned about online security? Bitwarden is a secure, open-source password manager that keeps all your login credentials synced and encrypted across every device." },
  { name: "Monkeytype", url: "https://monkeytype.com", cat: ["Keyboard", "Utilities", "Fun"], desc: "Want to type faster? Monkeytype is a minimalist, highly customizable typing test that helps you build speed and accuracy while tracking your progress over time." },
  { name: "Reactive Resume", url: "https://rxresume.com", cat: ["Utilities", "Resume Builders", "Jobs"], desc: "Applying for a new job? Reactive Resume is a free, privacy-first tool that makes building a professional, high-quality resume as easy as filling out a form." },
  { name: "SmallPDF", url: "https://smallpdf.com", cat: ["Utilities", "PDF", "Productivity"], desc: "Dealing with messy PDF files? SmallPDF offers a clean interface to merge, split, compress, and sign documents without needing heavy software." },
  { name: "Speedtest", url: "https://speedtest.net", cat: ["Internet", "Utilities", "Interesting"], desc: "Is your internet actually slow? Speedtest gives you an instant, accurate reading of your download and upload speeds to help you troubleshoot your connection." },
  { name: "Wayback Machine", url: "https://archive.org/web/", cat: ["History", "Internet", "Utilities"], desc: "Want to see how the web used to look? The Wayback Machine lets you travel back in time to view over 800 billion archived web pages from the past 25 years." },
  { name: "Remove.bg", url: "https://remove.bg", cat: ["Photography", "Design", "AI"], desc: "Need a clean cutout of a person? Remove.bg uses AI to automatically detect the subject and erase the background of any photo with incredible precision." },
  { name: "TinyPNG", url: "https://tinypng.com", cat: ["Design", "Utilities", "Developer"], desc: "Is your website loading too slow? TinyPNG compresses your images by up to 80% without losing quality, making your pages fly while saving storage space." },
  { name: "10MinuteMail", url: "https://10minutemail.com", cat: ["Privacy", "Utilities", "Cybersecurity"], desc: "Signing up for a site you don't trust? 10MinuteMail gives you a temporary email address that self-destructs after 10 minutes, keeping your real inbox spam-free." },
  { name: "Regex101", url: "https://regex101.com", cat: ["Developer", "Coding", "Utilities"], desc: "Writing complex regular expressions? Regex101 helps you build, test, and debug your patterns with a live explanation of every character in your string." },
  { name: "JSON Formatter", url: "https://jsonformatter.curiousconcept.com", cat: ["Developer", "Utilities"], desc: "Reading messy data strings? This tool formats and validates JSON data into a clean, readable structure, helping developers find errors instantly." },
  { name: "CyberChef", url: "https://gchq.github.io/CyberChef/", cat: ["Cybersecurity", "Utilities"], desc: "Processing complex data? CyberChef is a powerful 'Swiss Army Knife' that lets you perform every operation from encryption and encoding to data extraction." },
  
  // --- LIFESTYLE & TRAVEL ---
  { name: "Skyscanner", url: "https://skyscanner.com", cat: ["Travel", "Hotels", "Trains"], desc: "Planning your next adventure? Skyscanner compares millions of flights, hotels, and car rentals to find you the absolute cheapest way to get from A to B." },
  { name: "AllRecipes", url: "https://allrecipes.com", cat: ["Food", "Cooking", "Home"], desc: "What's for dinner? AllRecipes is a massive community-driven cookbook with thousands of tested recipes, complete with reviews, photos, and scaling tools." },
  { name: "MuscleWiki", url: "https://musclewiki.com", cat: ["Health", "Fitness", "Education"], desc: "Want a better workout? MuscleWiki lets you click on any muscle on a body map to see the best exercises and stretches for that specific area." },
  { name: "Medito", url: "https://meditofoundation.org", cat: ["Health", "Meditation", "Sleep"], desc: "Need to clear your mind? Medito is a completely free, non-profit meditation app that offers guided sessions for sleep, stress, and focus without any subscriptions." },
  { name: "Radio Garden", url: "https://radio.garden", cat: ["Fun", "Music", "Geography"], desc: "Want to hear what's playing in Tokyo or Paris? Radio Garden lets you spin a virtual globe and tune into thousands of live radio stations from every city on Earth." },
  { name: "WindowSwap", url: "https://window-swap.com", cat: ["Fun", "Travel", "Interesting"], desc: "Need a change of scenery? WindowSwap lets you look out of someone else's window somewhere else in the world, providing a peaceful, random view from across the globe." },
  { name: "Neal.fun", url: "https://neal.fun", cat: ["Fun", "Interesting", "Internet"], desc: "Looking for a productive way to waste time? Neal.fun is a collection of quirky, beautiful, and sometimes absurd web experiments that will keep you entertained for hours." },
  { name: "GeoGuessr", url: "https://geoguessr.com", cat: ["Fun", "Geography", "Gaming"], desc: "How well do you know the world? GeoGuessr drops you into a random Google Street View location and challenges you to figure out where you are using only your surroundings." },
  { name: "Airbnb", url: "https://airbnb.com", cat: ["Travel", "Hotels", "Interesting"], desc: "Tired of generic hotels? Airbnb lets you find unique stays—from cabins and treehouses to castles and lofts—hosted by locals in over 190 countries." },
  { name: "Yelp", url: "https://yelp.com", cat: ["Food", "Business", "Local"], desc: "Searching for the best local pizza or plumber? Yelp provides millions of crowd-sourced reviews and photos to help you find the most trusted businesses in your neighborhood." },
  { name: "TripAdvisor", url: "https://tripadvisor.com", cat: ["Travel", "Interesting", "Reviews"], desc: "Planning a trip? TripAdvisor is the world's largest travel site, helping you compare prices on flights and hotels while reading millions of honest traveler reviews." },
  { name: "MyFitnessPal", url: "https://myfitnesspal.com", cat: ["Health", "Fitness", "Food"], desc: "Tracking your health goals? MyFitnessPal makes it easy to log your meals and exercises, with a massive database of over 14 million foods to help you stay on track." },
  { name: "Nomad List", url: "https://nomadlist.com", cat: ["Travel", "Jobs", "Startups"], desc: "Working remotely? Nomad List ranks thousands of cities based on cost of living, internet speed, and safety to help you find the perfect place to live and work." },
  
  // --- FINANCE & BUSINESS ---
  { name: "TradingView", url: "https://tradingview.com", cat: ["Finance", "Investing", "Startups"], desc: "Tracking the markets? TradingView provides world-class charts and a massive social network for traders to share ideas and follow the latest market trends." },
  { name: "CoinGecko", url: "https://coingecko.com", cat: ["Finance", "Investing", "Internet"], desc: "Investing in crypto? CoinGecko provides a comprehensive look at the crypto market, tracking prices, volumes, and market caps for thousands of different coins." },
  { name: "YNAB", url: "https://ynab.com", cat: ["Finance", "Productivity", "Home"], desc: "Want to take control of your money? YNAB (You Need A Budget) is a proven system and app that helps you give every dollar a job and break the paycheck-to-paycheck cycle." },
  { name: "Robinhood", url: "https://robinhood.com", cat: ["Finance", "Investing", "Startups"], desc: "Ready to start investing? Robinhood pioneered commission-free trading, making it easy for anyone to buy stocks, ETFs, and crypto with a clean, mobile-first interface." },
  { name: "Crunchbase", url: "https://crunchbase.com", cat: ["Startups", "Business", "Data"], desc: "Researching companies? Crunchbase is the premier platform for finding information on private and public companies, from funding rounds to executive leadership." },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com", cat: ["Finance", "News", "Investing"], desc: "Need the latest market news? Yahoo Finance provides real-time stock quotes, financial reports, and expert analysis to help you stay ahead of the curve." },
  { name: "Investopedia", url: "https://investopedia.com", cat: ["Finance", "Education", "Business"], desc: "Confused by financial jargon? Investopedia is the world's largest financial education site, providing clear explanations for every concept from 'short selling' to 'compound interest'." },
  { name: "Stripe", url: "https://stripe.com", cat: ["Business", "Developer", "Finance"], desc: "Building an online business? Stripe provides the gold-standard infrastructure for accepting payments, managing subscriptions, and handling global commerce for apps and websites." },
  { name: "Gumroad", url: "https://gumroad.com", cat: ["Creative", "Business", "Jobs"], desc: "Selling a digital product? Gumroad is the simplest way for creators to sell everything from eBooks and courses to software and music directly to their audience." },
  { name: "Product Hunt", url: "https://producthunt.com", cat: ["Startups", "Internet", "AI Directories"], desc: "Want to see what's new in tech? Product Hunt is the place where creators launch their latest apps and websites every day, letting the community vote on the best ones." },
  
  // --- CODING & DEVELOPER ---
  { name: "GitHub", url: "https://github.com", cat: ["Developer", "Coding", "Open Source"], desc: "Writing code with a team? GitHub is the world's leading platform for hosting and managing software projects, providing the tools you need to collaborate and ship better code." },
  { name: "Stack Overflow", url: "https://stackoverflow.com", cat: ["Developer", "Coding", "Education"], desc: "Got a coding question? Stack Overflow is the massive community where developers help each other solve complex problems and share their programming knowledge." },
  { name: "CodePen", url: "https://codepen.io", cat: ["Developer", "Design", "Coding"], desc: "Building a front-end snippet? CodePen is a social development environment that lets you write HTML, CSS, and JS in your browser and see the results instantly." },
  { name: "Replit", url: "https://replit.com", cat: ["Developer", "Coding", "Education"], desc: "Want to build an app in seconds? Replit provides a collaborative, browser-based coding environment that lets you write, run, and host code in any language without any setup." },
  { name: "Vercel", url: "https://vercel.com", cat: ["Developer", "Startups", "Internet"], desc: "Deploying a front-end app? Vercel provides the fastest, most intuitive platform for hosting your websites with automatic scaling and a global edge network." },
  { name: "Netlify", url: "https://netlify.com", cat: ["Developer", "Startups", "Internet"], desc: "Need a modern web workflow? Netlify lets you connect your GitHub repo and deploy your site in minutes, handling everything from SSL to serverless functions." },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org", cat: ["Developer", "Education", "Coding"], desc: "Need a reference for web tech? MDN is the definitive, community-maintained resource for learning HTML, CSS, and JavaScript, built by the people who make Firefox." },
  { name: "Glitch", url: "https://glitch.com", cat: ["Developer", "Coding", "Fun"], desc: "Want to make a quick web app? Glitch is a friendly community and tool that lets you remix existing projects and build your own apps with a live, collaborative editor." },
  { name: "Supabase", url: "https://supabase.com", cat: ["Developer", "Startups", "Data"], desc: "Need a backend for your app? Supabase provides an open-source alternative to Firebase, offering a powerful Postgres database, authentication, and storage with a single tool." },
  { name: "Roadmap.sh", url: "https://roadmap.sh", cat: ["Developer", "Education", "Jobs"], desc: "Lost in your learning path? Roadmap.sh provides clear, step-by-step visual guides to help you learn everything from Frontend development to DevOps." },
  { name: "Can I Use", url: "https://caniuse.com", cat: ["Developer", "Coding"], desc: "Worried about browser compatibility? This tool provides up-to-date support tables for every modern web feature, helping you make sure your site works for everyone." },
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
