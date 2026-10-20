
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
  pricing: "Free" | "Paid" | "Freemium" | "Unknown";
  pros?: string[];
  cons?: string[];
  bestFor?: string;
}

const RAW_SITES = [
  // --- AI & TECHNOLOGY ---
  { name: "ChatGPT", title: "ChatGPT | AI Conversational Partner", url: "https://chatgpt.com", cat: ["AI Tools", "AI Assistants"], desc: "The industry-standard AI conversational agent for complex tasks.", pricing: "Freemium" },
  { name: "Claude", title: "Claude | Constitutional AI", url: "https://claude.ai", cat: ["AI Tools", "AI Assistants"], desc: "Advanced AI assistant focused on helpfulness and safety.", pricing: "Freemium" },
  { name: "Perplexity", title: "Perplexity | AI Search", url: "https://perplexity.ai", cat: ["AI Search", "AI Tools"], desc: "AI-powered search engine with real-time citations.", pricing: "Freemium" },
  { name: "Midjourney", title: "Midjourney | Generative Art", url: "https://midjourney.com", cat: ["AI Image Generation"], desc: "The world's most advanced text-to-image generation engine.", pricing: "Paid" },
  { name: "Runway Gen-3", title: "Runway | AI Video Synthesis", url: "https://runwayml.com", cat: ["AI Video"], desc: "Next-gen generative video models for professional creative teams.", pricing: "Paid" },
  { name: "ElevenLabs", title: "ElevenLabs | AI Audio Research", url: "https://elevenlabs.io", cat: ["AI Audio & Voice"], desc: "Hyper-realistic speech synthesis and voice cloning.", pricing: "Freemium" },
  { name: "Cursor", title: "Cursor | AI Code Editor", url: "https://cursor.com", cat: ["AI Coding", "Code Editors"], desc: "AI-native code editor built for high-velocity engineering.", pricing: "Freemium" },
  { name: "Hugging Face", title: "Hugging Face | ML Community", url: "https://huggingface.co", cat: ["Machine Learning", "Open Source"], desc: "The platform for building and sharing ML models.", pricing: "Free" },
  { name: "Ollama", title: "Ollama | Run LLMs Locally", url: "https://ollama.com", cat: ["Local AI", "Open Source"], desc: "Get up and running with large language models locally.", pricing: "Free" },
  { name: "Cloudflare", title: "Cloudflare | Edge Infrastructure", url: "https://cloudflare.com", cat: ["Cloud & Hosting", "Cybersecurity"], desc: "Global edge network for speed and security.", pricing: "Freemium" },
  { name: "Elicit", title: "Elicit | AI Research Assistant", url: "https://elicit.com", cat: ["AI Search", "Education"], desc: "Automate literature reviews and data extraction from research papers.", pricing: "Freemium" },
  { name: "Recraft", title: "Recraft | AI Vector Engine", url: "https://www.recraft.ai", cat: ["AI Image Generation", "Graphic Design"], desc: "Generate scalable vector art and icons with AI styling control.", pricing: "Freemium" },
  { name: "Aider", title: "Aider | Terminal AI Partner", url: "https://aider.chat", cat: ["AI Coding", "Programming"], desc: "AI pair programmer in your terminal for multi-file Git refactors.", pricing: "Free" },

  // --- CODING & SOFTWARE ---
  { name: "VS Code", title: "Visual Studio Code", url: "https://code.visualstudio.com", cat: ["Code Editors"], desc: "The most popular extensible code editor for modern development.", pricing: "Free" },
  { name: "Tailwind CSS", title: "Tailwind CSS | Utility Framework", url: "https://tailwindcss.com", cat: ["Frontend Development", "Design Systems"], desc: "Rapidly build modern websites without leaving your HTML.", pricing: "Free" },
  { name: "Supabase", title: "Supabase | Open Source Firebase", url: "https://supabase.com", cat: ["Databases", "Backend Development"], desc: "PostgreSQL database, authentication, and real-time sync.", pricing: "Freemium" },
  { name: "GitHub", title: "GitHub | Source Control", url: "https://github.com", cat: ["Open Source", "DevOps"], desc: "The world's leading software development platform.", pricing: "Freemium" },
  { name: "Bun", title: "Bun | Fast JS Runtime", url: "https://bun.sh", cat: ["JavaScript", "Backend Development"], desc: "Fast all-in-one JavaScript runtime, manager, and test runner.", pricing: "Free" },
  { name: "Transform Tools", title: "Transform | Polyglot Converter", url: "https://transform.tools", cat: ["Developer Tools", "JavaScript"], desc: "Convert data formats between JSON, TS, CSS, and SVG instantly.", pricing: "Free" },

  // --- DESIGN & CREATIVE ---
  { name: "Figma", title: "Figma | Collaborative Design", url: "https://figma.com", cat: ["UI/UX Design", "Graphic Design"], desc: "The industry standard for collaborative interface design.", pricing: "Freemium" },
  { name: "Aceternity UI", title: "Aceternity UI | Components", url: "https://ui.aceternity.com", cat: ["Design Inspiration", "Frontend Development"], desc: "Premium React and Tailwind CSS components for high-end landing pages.", pricing: "Free" },
  { name: "Spline", title: "Spline 3D | Real-Time 3D", url: "https://spline.design", cat: ["3D Design", "Web Development"], desc: "Collaborative browser-based 3D design software.", pricing: "Freemium" },
  { name: "Godly", title: "Godly | Design Gallery", url: "https://godly.website", cat: ["Design Inspiration"], desc: "Strictly curated design gallery showcasing the top 1% of web projects.", pricing: "Free" },

  // --- MEDIA & CONTENT ---
  { name: "DaVinci Resolve", title: "DaVinci | Cinema Editor", url: "https://www.blackmagicdesign.com/products/davinciresolve", cat: ["Video Editing", "Media Creation"], desc: "Professional Hollywood-grade video editing and color correction.", pricing: "Freemium" },
  { name: "Jitter", title: "Jitter | UI Animation", url: "https://jitter.video", cat: ["Animation", "Motion Graphics"], desc: "Animate UI micro-interactions with Figma-like ergonomics.", pricing: "Freemium" },
  { name: "OBS Studio", title: "OBS | Live Broadcast", url: "https://obsproject.com", cat: ["Screen Recording", "Video Creation"], desc: "Powerful open-source software for video recording and streaming.", pricing: "Free" },

  // --- LIFESTYLE & HEALTH ---
  { name: "The Man in Seat 61", title: "Seat 61 | Train Travel", url: "https://www.seat61.com", cat: ["Travel"], desc: "Detailed itineraries and advice for train travel worldwide.", pricing: "Free" },
  { name: "MuscleWiki", title: "MuscleWiki | Workout Map", url: "https://musclewiki.com", cat: ["Health & Fitness", "Science"], desc: "Interactive anatomy map to discover exercises for any muscle.", pricing: "Free" },
  { name: "A Soft Murmur", title: "A Soft Murmur | Focus", url: "https://asoftmurmur.com", cat: ["Lifestyle & Hobbies", "Audio Editing"], desc: "Mix nature sounds to create personal focus and sleep hubs.", pricing: "Free" }
];

export const MOCK_WEBSITES: Website[] = Array.from({ length: 405 }).map((_, index) => {
  const sourceIndex = index % RAW_SITES.length;
  const site = RAW_SITES[sourceIndex];
  const pricing = site.pricing || "Free";

  return {
    id: `site-${index}`,
    name: site.title || site.name, 
    websiteName: site.name, 
    developer: "Bessites Curation",
    description: site.desc, 
    longDescription: site.desc,
    rating: 4.8 + (Math.random() * 0.2),
    reviewCount: 50 + Math.floor(Math.random() * 500),
    categories: site.cat || [],
    imageUrl: "", 
    screenshots: [],
    url: site.url,
    size: "N/A",
    version: "2026.1",
    updatedAt: "Oct 2026",
    pricing: pricing as any,
    pros: ["Verified", "Zero Padding", "High Utility"],
    cons: ["May require account"],
    bestFor: "Builders seeking absolute discovery."
  };
});
