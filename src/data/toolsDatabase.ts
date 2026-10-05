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
    id: "remove-bg",
    name: "Remove.bg",
    url: "https://www.remove.bg",
    category: "Photo Editing",
    description: "Remove image backgrounds automatically in 5 seconds.",
    longDescription: "Remove.bg uses AI to strip backgrounds from any photo instantly. Perfect for product shots, profile pictures, and transparent assets.",
    tags: ["background remover", "remove bg", "transparent background", "image editor"],
    keywords: ["remove background", "bg remover", "transparent", "remove.bg", "erase bg"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "cursor",
    name: "Cursor",
    url: "https://cursor.sh",
    category: "Development",
    description: "The AI-native code editor built for high-velocity teams.",
    longDescription: "Cursor is a fork of VS Code with AI deeply integrated. It helps you write, refactor, and understand code 10x faster.",
    tags: ["code editor", "ai coding", "ide", "development"],
    keywords: ["coding", "programming", "cursor", "ai code", "vs code ai"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "perplexity",
    name: "Perplexity",
    url: "https://www.perplexity.ai",
    category: "AI Search",
    description: "AI search engine that provides cited, real-time answers.",
    longDescription: "Perplexity is a conversational search engine that delivers accurate, cited answers to complex questions using the latest LLMs.",
    tags: ["ai search", "research", "search engine", "information"],
    keywords: ["search", "perplexity", "ask ai", "research tool", "real time search"],
    pricing: "Freemium",
    rating: 4.8
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chatgpt.com",
    category: "AI Chat",
    description: "The world's leading conversational AI by OpenAI.",
    longDescription: "ChatGPT is a powerful AI chatbot that can help with writing, coding, translation, and general productivity.",
    tags: ["ai chat", "chatbot", "gpt4", "writing assistant"],
    keywords: ["chat", "gpt", "openai", "ask assistant"],
    pricing: "Freemium",
    rating: 5.0
  },
  {
    id: "grammarly",
    name: "Grammarly",
    url: "https://www.grammarly.com",
    category: "Writing",
    description: "AI writing assistant for grammar, tone, and clarity.",
    longDescription: "Grammarly makes your communication clear and effective by checking spelling, grammar, and tone across all your apps.",
    tags: ["writing", "grammar", "editing", "assistant"],
    keywords: ["write", "grammarly", "fix grammar", "spell check", "ai editor"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "notion",
    name: "Notion AI",
    url: "https://www.notion.so",
    category: "Productivity",
    description: "Integrated AI for notes, docs, and task management.",
    longDescription: "Notion AI helps you write, summarize, and organize your work inside your connected workspace.",
    tags: ["notes", "productivity", "docs", "workspace"],
    keywords: ["notion", "organize", "notes ai"],
    pricing: "Paid",
    rating: 4.8
  },
  {
    id: "midjourney",
    name: "Midjourney",
    url: "https://www.midjourney.com",
    category: "Design",
    description: "The most advanced AI image generation engine.",
    longDescription: "Midjourney generates stunning, artistic images from simple text prompts using proprietary models.",
    tags: ["image generation", "ai art", "visuals"],
    keywords: ["midjourney", "ai image", "art generator"],
    pricing: "Paid",
    rating: 5.0
  },
  {
    id: "looka",
    name: "Looka",
    url: "https://looka.com",
    category: "Design",
    description: "AI logo maker and complete brand identity platform.",
    longDescription: "Looka uses AI to design a custom logo and build a brand you love instantly.",
    tags: ["logo maker", "branding", "ai design"],
    keywords: ["logo", "brand", "make logo"],
    pricing: "Paid",
    rating: 4.7
  },
  {
    id: "capcut",
    name: "CapCut",
    url: "https://www.capcut.com",
    category: "Video",
    description: "Easy-to-use AI video editor for social media content.",
    longDescription: "CapCut offers AI templates, captions, and effects for TikTok and Reels creators.",
    tags: ["video editor", "tiktok", "reels", "video"],
    keywords: ["video", "edit video", "capcut"],
    pricing: "Free",
    rating: 4.8
  },
  {
    id: "adobe-express",
    name: "Adobe Express",
    url: "https://www.adobe.com/express/",
    category: "Design",
    description: "Fast design tool with Adobe Firefly AI integration.",
    longDescription: "Create posters, social graphics, and more with powerful generative AI tools from Adobe.",
    tags: ["design", "social media", "adobe"],
    keywords: ["adobe", "express", "flyer maker"],
    pricing: "Freemium",
    rating: 4.6
  },
  {
    id: "photopea",
    name: "Photopea",
    url: "https://www.photopea.com",
    category: "Photo Editing",
    description: "Free online image editor that works like Photoshop.",
    longDescription: "Professional web-based photo editor supporting PSD, Sketch, and XCF formats.",
    tags: ["photo editor", "photoshop online", "free psd"],
    keywords: ["edit photo", "photopea", "photoshop"],
    pricing: "Free",
    rating: 4.7
  },
  {
    id: "tinywow",
    name: "TinyWow",
    url: "https://tinywow.com",
    category: "Utilities",
    description: "Huge collection of free tools for PDF, video, and more.",
    longDescription: "No-signup tools for everything: PDF editing, video downloading, and image conversion.",
    tags: ["utilities", "pdf tools", "free apps"],
    keywords: ["tinywow", "pdf editor", "download video"],
    pricing: "Free",
    rating: 4.8
  },
  {
    id: "leonardo-ai",
    name: "Leonardo AI",
    url: "https://leonardo.ai",
    category: "Design",
    description: "Creative AI for production-quality images and textures.",
    longDescription: "Leonardo provides advanced generative tools to create consistent, stunning visuals for any project.",
    tags: ["image generation", "ai art", "game assets"],
    keywords: ["leonardo", "ai image", "art"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "invideo",
    name: "InVideo AI",
    url: "https://invideo.io",
    category: "Video",
    description: "Turn text prompts into high-quality AI videos instantly.",
    longDescription: "InVideo AI generates scripts, voiceovers, and footage to create complete videos from your ideas.",
    tags: ["video generator", "text to video", "ai video"],
    keywords: ["video", "make video", "ai video"],
    pricing: "Freemium",
    rating: 4.7
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    url: "https://www.copy.ai",
    category: "Writing",
    description: "AI copywriter for marketing, ads, and social content.",
    longDescription: "Copy.ai helps teams generate high-converting copy for emails, blogs, and social media ads in seconds.",
    tags: ["writing", "copywriting", "marketing"],
    keywords: ["write", "copy", "ai writer"],
    pricing: "Freemium",
    rating: 4.5
  }
];
