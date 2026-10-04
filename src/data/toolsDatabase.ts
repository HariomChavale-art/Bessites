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
    id: "looka",
    name: "Looka",
    url: "https://looka.com",
    category: "Design",
    description: "AI-powered logo maker and brand identity builder.",
    longDescription: "Looka uses AI to help you design a custom logo and build a brand you love. It generates endless options based on your style preferences.",
    tags: ["logo maker", "branding", "ai logo", "identity design"],
    keywords: ["logo", "brand", "make logo", "ai design", "logo creator"],
    pricing: "Paid",
    rating: 4.7
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
    id: "adobe-express",
    name: "Adobe Express",
    url: "https://www.adobe.com/express/",
    category: "Design",
    description: "Quick and easy content creation with Adobe Firefly AI.",
    longDescription: "Adobe Express offers thousands of templates and AI-powered tools like text-to-image and generative fill to create social content fast.",
    tags: ["design", "social media", "adobe", "generative ai"],
    keywords: ["adobe", "express", "design", "make poster", "flyer maker"],
    pricing: "Freemium",
    rating: 4.6
  },
  {
    id: "capcut",
    name: "CapCut",
    url: "https://www.capcut.com",
    category: "Video",
    description: "Powerful all-in-one video editor for social media.",
    longDescription: "CapCut is the leading video editor for TikTok and Reels, offering AI captions, background removal, and trending templates.",
    tags: ["video editing", "tiktok", "reels", "video creator"],
    keywords: ["video", "edit video", "capcut", "movie maker", "video effects"],
    pricing: "Free",
    rating: 4.8
  },
  {
    id: "invideo",
    name: "InVideo AI",
    url: "https://invideo.io",
    category: "Video",
    description: "Turn text into high-quality videos instantly with AI.",
    longDescription: "InVideo AI allows you to generate complete videos with scripts, stock footage, and voiceovers just by typing a prompt.",
    tags: ["video generator", "text to video", "content creation", "ai video"],
    keywords: ["video", "make video", "ai video", "invideo", "video prompt"],
    pricing: "Freemium",
    rating: 4.7
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    url: "https://www.copy.ai",
    category: "Writing",
    description: "AI copywriter for marketing, ads, and social media.",
    longDescription: "Copy.ai helps teams generate high-converting marketing copy for emails, ads, and blogs in seconds.",
    tags: ["writing", "copywriting", "marketing", "content creation"],
    keywords: ["write", "copy", "ai writer", "marketing copy", "blog writer"],
    pricing: "Freemium",
    rating: 4.5
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    url: "https://www.notion.so",
    category: "Productivity",
    description: "Work faster and write better inside your Notion workspace.",
    longDescription: "Notion AI is an integrated assistant that helps you summarize notes, write drafts, and brainstorm ideas within your documents.",
    tags: ["productivity", "notes", "writing", "organization"],
    keywords: ["notion", "productivity", "ai notes", "workspace", "organize"],
    pricing: "Paid",
    rating: 4.8
  },
  {
    id: "leonardo-ai",
    name: "Leonardo AI",
    url: "https://leonardo.ai",
    category: "Design",
    description: "Pro-grade generative AI for images and 3D assets.",
    longDescription: "Leonardo.ai provides artists and designers with powerful generative tools to create stunning, consistent visual assets.",
    tags: ["image generation", "art", "design", "ai generator"],
    keywords: ["leonardo", "ai art", "generate image", "midjourney alternative"],
    pricing: "Freemium",
    rating: 4.9
  },
  {
    id: "photopea",
    name: "Photopea",
    url: "https://www.photopea.com",
    category: "Photo Editing",
    description: "Free online photo editor that works like Photoshop.",
    longDescription: "Photopea is a professional-grade web-based photo editor that supports PSD, XCF, and Sketch files with zero installation.",
    tags: ["photo editor", "photoshop alternative", "design", "graphic editing"],
    keywords: ["edit photo", "photopea", "photoshop online", "free psd editor"],
    pricing: "Free",
    rating: 4.7
  },
  {
    id: "tinywow",
    name: "TinyWow",
    url: "https://tinywow.com",
    category: "Utilities",
    description: "Huge collection of free tools for PDF, Video, and Images.",
    longDescription: "TinyWow provides free, no-signup tools for everything: PDF merging, background removal, video downloading, and more.",
    tags: ["utilities", "pdf tools", "free tools", "file converter"],
    keywords: ["tinywow", "pdf editor", "video downloader", "convert file"],
    pricing: "Free",
    rating: 4.8
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
    id: "midjourney",
    name: "Midjourney",
    url: "https://www.midjourney.com",
    category: "Design",
    description: "The world's most advanced AI image generation engine.",
    longDescription: "Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species through art.",
    tags: ["image generation", "ai art", "creative", "visuals"],
    keywords: ["midjourney", "ai image", "art generator", "best ai art"],
    pricing: "Paid",
    rating: 5.0
  },
  {
    id: "logo-com",
    name: "Logo.com",
    url: "https://logo.com",
    category: "Design",
    description: "Simple and fast AI logo generator for businesses.",
    longDescription: "Logo.com uses advanced algorithms to generate professional logos and brand assets for startups and small businesses instantly.",
    tags: ["logo maker", "branding", "business tools"],
    keywords: ["logo", "logo.com", "business logo", "brand creator"],
    pricing: "Freemium",
    rating: 4.6
  }
];
