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
  { url: "https://lovart.ai", name: "Lovart AI", cat: ["AI", "Design"], desc: "AI-driven art and creative asset generation." },
  { url: "https://codebanana.com", name: "Code Banana", cat: ["Dev", "Tools"], desc: "A playground for developers to experiment with snippets." },
  { url: "https://pippit.ai", name: "Pippit AI", cat: ["AI", "Audio"], desc: "Next-gen AI voice and audio synthesis." },
  { url: "https://haveibeenpwned.com", name: "Have I Been Pwned", cat: ["Security"], desc: "Check if your email has been compromised." },
  { url: "https://atomanimation.com", name: "Atom Animation", cat: ["Design", "Dev"], desc: "High-performance browser animation tools." },
  { url: "https://classcentral.com", name: "Class Central", cat: ["Education"], desc: "The leading search engine for free online courses." },
  { url: "https://roomunlocker.com", name: "Room Unlocker", cat: ["Tools"], desc: "Utilities for digital space management." },
  { url: "https://eatthismuch.com", name: "Eat This Much", cat: ["Health", "Food"], desc: "Automatic meal planner for fitness goals." },
  { url: "https://clip.reka.ai", name: "Reka Clip", cat: ["AI"], desc: "Advanced multimodal AI experimentation." },
  { url: "https://messeger.abeto.co", name: "Abeto Messenger", cat: ["Tools"], desc: "Minimalist web-based communication tool." },
  { url: "https://supercook.com", name: "Supercook", cat: ["Food"], desc: "Recipe search by ingredients you have." },
  { url: "https://sporcle.com", name: "Sporcle", cat: ["Gaming"], desc: "The world's largest trivia quiz platform." },
  { url: "https://loadmuscle.com", name: "Load Muscle", cat: ["Health"], desc: "Interactive strength training database." },
  { url: "https://kickresume.com", name: "Kickresume", cat: ["Tools", "AI"], desc: "AI resume and cover letter builder." },
  { url: "https://timeanddate.com", name: "Time and Date", cat: ["Tools"], desc: "World clock, calendars, and time zone converters." },
  { url: "https://tripo3d.ai", name: "Tripo AI", cat: ["AI", "Design"], desc: "Generate 3D models from text and images." },
  { url: "https://app.agnes-ai.com", name: "Agnes AI", cat: ["AI"], desc: "Intelligent personal assistant for workflows." },
  { url: "https://projectx.cloud", name: "Project X", cat: ["Tools", "Dev"], desc: "Cloud-native project management suite." },
  { url: "https://ankool.com", name: "Ankool", cat: ["Tools"], desc: "Handy collection of web utilities." },
  { url: "https://meow.camera", name: "Meow Camera", cat: ["Photography"], desc: "Playful camera filters for the web." },
  { url: "https://pixelthought.so", name: "Pixel Thought", cat: ["Health"], desc: "A 60-second meditation tool for anxiety." },
  { url: "https://flova.ai", name: "Flova AI", cat: ["AI"], desc: "Flow-based AI automation engine." },
  { url: "https://meetaugust.ai", name: "August AI", cat: ["AI", "Health"], desc: "AI health consultant and tracker." },
  { url: "https://rainymood.com", name: "Rainy Mood", cat: ["Health"], desc: "The internet's most popular rain sounds." },
  { url: "https://kortix.com", name: "Kortix", cat: ["Dev"], desc: "Developer productivity dashboard." },
  { url: "https://edx.org", name: "edX", cat: ["Education"], desc: "Online courses from Harvard and MIT." },
  { url: "https://lightbot.lu", name: "Lightbot", cat: ["Education", "Gaming"], desc: "Learn programming logic through puzzles." },
  { url: "https://deepagent.abacus.ai", name: "DeepAgent", cat: ["AI"], desc: "Enterprise-grade AI agent deployment." },
  { url: "https://borebutton.com", name: "Bore Button", cat: ["Gaming"], desc: "Press the button to escape boredom." },
  { url: "https://cheatedu.io", name: "CheatEDU", cat: ["AI", "Education"], desc: "AI study aids and learning tools." },
  { url: "https://downdetector.com", name: "Downdetector", cat: ["Tools"], desc: "Real-time status of websites and services." },
  { url: "https://patatap.com", name: "Patatap", cat: ["Design", "Gaming"], desc: "Portable animation and sound kit." },
  { url: "https://minimix.io", name: "Minimix", cat: ["Audio"], desc: "Minimalist music mixer and looper." },
  { url: "https://finalroundai.com", name: "Final Round AI", cat: ["AI", "Tools"], desc: "AI copilot for job interviews." },
  { url: "https://napkin.ai", name: "Napkin AI", cat: ["AI", "Design"], desc: "Visual storytelling with AI." },
  { url: "https://tinywow.com", name: "TinyWow", cat: ["Tools"], desc: "Free tools to solve every file problem." },
  { url: "https://openclaw.ai", name: "OpenClaw", cat: ["AI"], desc: "Open-source AI research tools." },
  { url: "https://forvo.com", name: "Forvo", cat: ["Education"], desc: "Pronunciation dictionary for all languages." },
  { url: "https://onepage.io", name: "OnePage", cat: ["Tools"], desc: "The simplest one-page website builder." },
  { url: "https://withdiode.com", name: "WithDiode", cat: ["Dev", "Tools"], desc: "Decentralized hosting for modern apps." },
  { url: "https://apob.ai", name: "Apob AI", cat: ["AI"], desc: "Generative AI for creative workflows." },
  { url: "https://builditapp.com", name: "BuildIt", cat: ["Dev"], desc: "No-code platform for app development." },
  { url: "https://manus.im", name: "Manus", cat: ["Tools"], desc: "Minimalist journal for daily reflections." },
  { url: "https://gptsers.com", name: "GPTsers", cat: ["AI"], desc: "Directory of custom GPT models." },
  { url: "https://openlibrary.org", name: "Open Library", cat: ["Education"], desc: "One web page for every book ever published." },
  { url: "https://learnxinyminutes.com", name: "Learn X in Y", cat: ["Education", "Dev"], desc: "Quick language tutorials for developers." },
  { url: "https://notebookllm.google", name: "NotebookLM", cat: ["AI", "Education"], desc: "Personalized AI research assistant." },
  { url: "https://atoms.dev", name: "Atoms", cat: ["Dev"], desc: "Atomic CSS resources and tools." },
  { url: "https://bugmenot.com", name: "BugMeNot", cat: ["Tools"], desc: "Shared passwords for forced registrations." },
  { url: "https://tosdr.org", name: "ToS;DR", cat: ["Security"], desc: "Terms of Service; Didn't Read." },
  { url: "https://languagereactor.com", name: "Language Reactor", cat: ["Education"], desc: "Learn languages with Netflix and YouTube." },
  { url: "https://replit.com", name: "Replit", cat: ["Dev"], desc: "The collaborative browser-based IDE." },
  { url: "https://suno.com", name: "Suno", cat: ["AI", "Audio"], desc: "High-fidelity AI music generation." },
  { url: "https://monkeytype.com", name: "Monkeytype", cat: ["Tools"], desc: "The ultimate typing test platform." },
  { url: "https://pixai.art", name: "PixAI", cat: ["AI", "Design"], desc: "AI anime art generator." },
  { url: "https://ilovepdf.com", name: "iLovePDF", cat: ["Tools"], desc: "Every tool you need for PDF management." },
  { url: "https://virustotal.com", name: "VirusTotal", cat: ["Security"], desc: "Analyze suspicious files and URLs." },
  { url: "https://everynoise.com", name: "Every Noise", cat: ["Audio"], desc: "The map of every music genre on Earth." }
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
  imageUrl: "", // Handled by favicon service in WebsitePreview
  screenshots: [],
  url: site.url,
  size: "N/A",
  version: "1.0",
  updatedAt: "2024",
  pricing: Math.random() > 0.7 ? "Paid" : (Math.random() > 0.4 ? "Freemium" : "Free")
}));
