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
  // --- BATCH 1: CORE DISCOVERY ---
  { name: "Aceternity UI", title: "Aceternity UI | Modern Animated Components", url: "https://ui.aceternity.com", cat: ["Developer", "Design", "Utilities"], desc: "Aceternity UI is an award-winning collection of modern, copy-paste React and Tailwind CSS components designed for developers who want to build sleek, dark-mode websites.", pricing: "Free", pros: ["High-end animations", "Copy-paste ease", "Modern aesthetic"], cons: ["Tailwind specific", "Framer Motion dependency"], bestFor: "React developers building luxury landing pages." },
  { name: "Spline", title: "Spline 3D Design | Real-Time 3D for the Web", url: "https://spline.design", cat: ["3D", "Design", "Developer"], desc: "Spline is a collaborative browser-based 3D design software that allows creators to build, animate, and publish interactive 3D web experiences without complex code.", pricing: "Freemium", pros: ["Intuitive 3D logic", "Direct React exports", "Real-time physics"], cons: ["High resource usage", "Learning curve"], bestFor: "Designers adding interactive 3D assets to web projects." },
  { name: "Godly", title: "Godly | Top Web Design Inspiration Gallery", url: "https://godly.website", cat: ["Design", "Creative", "Interesting"], desc: "Godly is a strictly curated design gallery that indexes the top 1% of web design projects worldwide. Updated daily, it serves as the ultimate benchmark for modern typography.", pricing: "Free", pros: ["Daily inspiration", "Elite curation", "Filtered by style"], cons: ["Reference only", "No tools included"], bestFor: "UI/UX designers seeking high-end layout trends." },
  { name: "Radio Garden", title: "Radio Garden | Explore Live Global Radio", url: "https://radio.garden", cat: ["Interesting", "Music", "Travel"], desc: "Radio Garden is a live, interactive 3D globe that lets you explore and listen to thousands of local radio broadcasts worldwide in real time.", pricing: "Free" },
  { name: "Krea AI", title: "Krea AI Studio | Real-Time Creative AI", url: "https://krea.ai", cat: ["AI", "Design", "Creative"], desc: "Krea AI is an ultra-fast generative visual engine offering real-time AI canvas generation, AI video enhancement, and high-fidelity upscaling.", pricing: "Freemium" },
  { name: "Slow Roads", title: "Slow Roads | Procedural Browser Driving Simulator", url: "https://slowroads.io", cat: ["Fun", "Interesting", "Games"], desc: "Slow Roads is a procedurally generated 3D driving simulator that runs entirely inside your web browser using WebGL.", pricing: "Free" },
  { name: "Linear", title: "Linear | The Issue Tracker Built for Speed", url: "https://linear.app", cat: ["Productivity", "Startups", "Utilities"], desc: "Linear is a streamlined issue tracking and product management tool built specifically for high-velocity software engineering and design teams.", pricing: "Freemium" },
  { name: "Neal.fun", title: "Neal.fun | Viral Interactive Web Experiments", url: "https://neal.fun", cat: ["Fun", "Interesting", "Creative"], desc: "Neal.fun is a massive collection of viral, high-concept interactive web toys and digital experiments created by designer Neal Agarwal.", pricing: "Free" },
  { name: "Uiverse", title: "Uiverse.io | Open-Source UI Components", url: "https://uiverse.io", cat: ["Developer", "Coding", "Design"], desc: "Uiverse is the web's largest community-driven repository of 100% free, open-source UI micro-components. Pure HTML, CSS, and Tailwind code.", pricing: "Free" },
  { name: "Mobbin", title: "Mobbin | Comprehensive UI/UX Design Reference", url: "https://mobbin.com", cat: ["Design", "Startups", "Interesting"], desc: "Mobbin is the definitive reference library for digital product designers, archiving thousands of fully searchable screenshots and complete user flows.", pricing: "Freemium" },

  // --- BATCH 2: AI & INFRASTRUCTURE ---
  { name: "v0 by Vercel", title: "v0 by Vercel | Generative UI & Full-Stack React Code", url: "https://v0.dev", cat: ["AI", "Developer", "Design"], desc: "v0 is a generative user interface system built by Vercel that turns natural language prompts and design screenshots into production-ready React code.", pricing: "Freemium" },
  { name: "Lovable", title: "Lovable | Full-Stack AI Software Engineer", url: "https://lovable.dev", cat: ["AI", "Developer", "Startups"], desc: "Lovable is an autonomous full-stack AI development platform that builds, tests, and deploys complete web applications from prompts.", pricing: "Freemium" },
  { name: "ElevenLabs", title: "ElevenLabs | Voice AI & Generative Audio", url: "https://elevenlabs.io", cat: ["AI", "Voice", "Creative"], desc: "ElevenLabs is the industry-leading generative voice AI platform capable of producing hyper-realistic speech and voice clones.", pricing: "Freemium" },
  { name: "Luma Dream Machine", title: "Luma Dream Machine | Next-Gen Generative AI Video", url: "https://lumalabs.ai/dream-machine", cat: ["AI", "Video", "Creative"], desc: "Dream Machine is a high-speed video generation model that converts text and images into fluid, physically accurate video clips.", pricing: "Freemium" },
  { name: "Supabase", title: "Supabase | The Open-Source Firebase Alternative", url: "https://supabase.com", cat: ["Developer", "Coding", "Startups"], desc: "Supabase provides developers with an open-source backend suite offering dedicated PostgreSQL databases, instant APIs, and real-time sync.", pricing: "Freemium" },
  { name: "Resend", title: "Resend | Modern Email API for Developers", url: "https://resend.com", cat: ["Developer", "Utilities", "Startups"], desc: "Resend is an email platform designed specifically for software developers with React Email integration.", pricing: "Freemium" },
  { name: "tldraw", title: "tldraw | Collaborative Infinite Canvas & SDK", url: "https://tldraw.com", cat: ["Design", "Productivity", "Developer"], desc: "tldraw is an open-source digital whiteboard and collaborative infinite canvas with an ultra-responsive vector engine.", pricing: "Free" },
  { name: "Typefully", title: "Typefully | Distraction-Free Writing & Social Publishing", url: "https://typefully.com", cat: ["Creative", "Productivity", "Interesting"], desc: "Typefully is a minimalist writing canvas and social media scheduling platform built for creators.", pricing: "Freemium" },
  { name: "PostHog", title: "PostHog | All-in-One Product Analytics Suite", url: "https://posthog.com", cat: ["Developer", "Startups", "Finance"], desc: "PostHog is an open-source product analytics platform that combines event tracking, session replays, and heatmaps.", pricing: "Freemium" },
  { name: "ReadCV", title: "ReadCV | Professional Profiles & Creative Network", url: "https://read.cv", cat: ["Design", "Jobs", "Interesting"], desc: "ReadCV is a minimalist professional network and interactive resume builder tailored for creative builders.", pricing: "Free" },

  // --- BATCH 3: DESIGN & PRODUCTIVITY ---
  { name: "Cursor", title: "Cursor | The AI-First Code Editor", url: "https://www.cursor.com", cat: ["Developer", "AI", "Coding"], desc: "Cursor is an AI-native code editor built as a high-performance fork of VS Code.", pricing: "Freemium" },
  { name: "Perplexity", title: "Perplexity AI | Conversational Answer Engine", url: "https://www.perplexity.ai", cat: ["AI", "Search", "Internet"], desc: "Perplexity AI is an interactive conversational answer engine that delivers direct, cited answers.", pricing: "Freemium" },
  { name: "Midjourney", title: "Midjourney | Generative Visual Art Canvas", url: "https://www.midjourney.com", cat: ["AI", "Design", "Creative"], desc: "Midjourney is an AI image generation platform renowned for its photorealistic texturing and cinematic lighting.", pricing: "Paid" },
  { name: "Pika", title: "Pika Labs | Generative Video & Cinematic Effects", url: "https://pika.art", cat: ["AI", "Video", "Creative"], desc: "Pika is an intuitive browser-based AI video generation and animation platform.", pricing: "Freemium" },
  { name: "Framer", title: "Framer | Interactive Web Design & Publishing", url: "https://www.framer.com", cat: ["Design", "Startups", "Utilities"], desc: "Framer is a visual website builder that blends canvas design with production-grade web publishing.", pricing: "Freemium" },
  { name: "Veed", title: "Veed.io | In-Browser Video Studio & AI Captions", url: "https://www.veed.io", cat: ["Video", "Creative", "Utilities"], desc: "Veed is an all-in-one cloud-based video editing platform tailored for digital creators.", pricing: "Freemium" },
  { name: "Playroom", title: "Playroom | Multiplayer Web Game Engine", url: "https://joinplayroom.com", cat: ["Developer", "Fun", "Coding"], desc: "Playroom is a multiplayer toolkit that allows indie developers to build synchronized web games in minutes.", pricing: "Free" },
  { name: "Looka", title: "Looka | AI Brand Identity & Logo Maker", url: "https://looka.com", cat: ["Design", "Startups", "Creative"], desc: "Looka is an AI-powered brand generator that translates user preferences into custom vector logos.", pricing: "Paid" },
  { name: "Claude", title: "Claude by Anthropic | Frontier AI Reasoning", url: "https://claude.ai", cat: ["AI", "Developer", "Coding"], desc: "Claude is an advanced conversational AI assistant engineered for complex technical reasoning.", pricing: "Freemium" },
  { name: "Descript", title: "Descript | Document-Based Audio & Video Editor", url: "https://www.descript.com", cat: ["Audio", "Video", "Creative"], desc: "Descript is a multimedia editing platform where creators edit audio and video by editing text transcripts.", pricing: "Freemium" },

  // --- BATCH 4: ANIMATION & UTILITIES ---
  { name: "GSAP", title: "GSAP | Professional-Grade JavaScript Web Animation", url: "https://gsap.com", cat: ["Developer", "Design", "Animation"], desc: "The industry standard JavaScript animation library powering high-performance motion on 11M+ sites.", pricing: "Free" },
  { name: "Ray.so", title: "Ray.so | Beautiful Code Snippet Screenshot Generator", url: "https://ray.so", cat: ["Developer", "Utilities"], desc: "Transforms raw programming code into aesthetic, high-resolution syntax-highlighted images.", pricing: "Free" },
  { name: "Awwwards", title: "Awwwards | Digital Design Recognition & Agency Showcase", url: "https://www.awwwards.com", cat: ["Design", "Interesting"], desc: "The global benchmark platform that recognizes and awards the finest talent in digital design.", pricing: "Free" },
  { name: "Landingfolio", title: "Landingfolio | The Best Landing Page Design Inspiration", url: "https://www.landingfolio.com", cat: ["Design", "Startups"], desc: "A curated gallery showcasing high-converting landing page designs and component libraries.", pricing: "Free" },
  { name: "Coolors", title: "Coolors | Superfast Color Schemes Generator", url: "https://coolors.co", cat: ["Design", "Creative"], desc: "Lightning-fast color palette generator used by millions of designers daily.", pricing: "Free" },
  { name: "Vercel", title: "Vercel | The Frontend Cloud & Next.js Platform", url: "https://vercel.com", cat: ["Developer", "Startups"], desc: "The creators of Next.js, providing an end-to-end frontend cloud platform optimized for performance.", pricing: "Freemium" },
  { name: "Figma", title: "Figma | The Collaborative Interface Design Standard", url: "https://www.figma.com", cat: ["Design", "Developer", "Startups"], desc: "The industry-standard collaborative vector design and prototyping software used by product teams.", pricing: "Freemium" },
  { name: "Lucide", title: "Lucide Icons | Beautiful Open-Source Icon Toolkit", url: "https://lucide.dev", cat: ["Design", "Developer"], desc: "An open-source, community-run fork of Feather Icons providing 1,400+ clean vector stroke icons.", pricing: "Free" },
  { name: "Roadmap.sh", title: "Roadmap.sh | Developer Career & Skill Roadmaps", url: "https://roadmap.sh", cat: ["Education", "Developer", "Jobs"], desc: "Step-by-step visual roadmaps and study guides for software engineers and digital builders.", pricing: "Free" },
  { name: "Dribbble", title: "Dribbble | The World's Leading Design Portfolio Showcase", url: "https://dribbble.com", cat: ["Design", "Creative"], desc: "The premier discovery platform for digital product designers, illustrators, and artists.", pricing: "Free" },

  // --- BATCH 5: SPECIALIZED TOOLS ---
  { name: "Bolt.new", title: "Bolt.new | In-Browser Full-Stack AI Web Engineering", url: "https://bolt.new", cat: ["AI", "Developer", "Coding"], desc: "AI development workspace that executes full-stack production web apps completely inside your browser.", pricing: "Freemium" },
  { name: "Recraft", title: "Recraft AI | Generative Infinite Vector & 3D Art Studio", url: "https://www.recraft.ai", cat: ["AI", "Design", "Creative"], desc: "Professional generative visual studio that natively outputs fully editable vector SVG illustrations.", pricing: "Freemium" },
  { name: "Readymag", title: "Readymag | Editorial Web Design & Digital Publishing", url: "https://readymag.com", cat: ["Design", "Creative"], desc: "In-browser visual publishing platform crafted for creative directors and editorial designers.", pricing: "Freemium" },
  { name: "Streamline", title: "Streamline Icons | The World's Largest Vector Asset System", url: "https://www.streamlinehq.com", cat: ["Design", "Developer"], desc: "Exhaustive design system featuring 170,000+ vector icons and hand-crafted illustrations.", pricing: "Freemium" },
  { name: "Untitled UI", title: "Untitled UI | The Ultimate Figma UI Kit & Design System", url: "https://www.untitledui.com", cat: ["Design", "Startups"], desc: "The industry's largest and most widely used Figma UI kit and design system.", pricing: "Paid" },
  { name: "Microsoft Clarity", title: "Microsoft Clarity | Free Behavioral Analytics & Heatmaps", url: "https://clarity.microsoft.com", cat: ["Analytics", "Finance"], desc: "Free behavioral analytics tool that visualizes user journeys through automated click heatmaps.", pricing: "Free" },
  { name: "Spline AI", title: "Spline AI | Prompt-to-3D Texturing & Scene Generator", url: "https://spline.design/ai", cat: ["3D", "AI", "Design"], desc: "Generative AI integrated directly into the 3D web design workflow.", pricing: "Freemium" },
  { name: "Uxcel", title: "Uxcel | Interactive UX Design Training", url: "https://uxcel.com", cat: ["Education", "Design"], desc: "Gamified learning platform that teaches digital product design and UX heuristics.", pricing: "Freemium" },
  { name: "Memberstack", title: "Memberstack | Gated Memberships & Web Auth Engine", url: "https://www.memberstack.com", cat: ["Developer", "Startups"], desc: "Infrastructure layer to add secure logins and Stripe subscriptions to any website.", pricing: "Freemium" },
  { name: "Fabric", title: "Fabric | AI-Powered Unified Digital Workspace", url: "https://fabric.so", cat: ["Productivity", "AI"], desc: "Intelligent workspace that acts as a digital memory hub for bookmarks and files.", pricing: "Freemium" },

  // --- BATCH 6: ENTERPRISE & AUTOMATION ---
  { name: "TanStack", title: "TanStack | Headless Full-Stack Frameworks", url: "https://tanstack.com", cat: ["Developer", "Coding"], desc: "Headless, type-safe open-source web utilities powering modern software architectures.", pricing: "Free" },
  { name: "Zapier", title: "Zapier | Automated Enterprise Workflow Orchestration", url: "https://zapier.com", cat: ["Productivity", "Startups"], desc: "Connects over 6,000 web apps and enterprise APIs without requiring manual code.", pricing: "Freemium" },
  { name: "Shortwave", title: "Shortwave | AI-Native Email & Productivity System", url: "https://www.shortwave.com", cat: ["Productivity", "AI"], desc: "Email client designed around the Method of Inbox Zero, powered by an AI agent.", pricing: "Freemium" },
  { name: "Kuberns", title: "Kuberns | Agentic AI Cloud Deployment", url: "https://kuberns.com", cat: ["Developer", "AI"], desc: "Agentic AI cloud deployment platform that automates backend infrastructure setup.", pricing: "Freemium" },
  { name: "Adobe Firefly", title: "Adobe Firefly | Commercially Safe Generative AI", url: "https://firefly.adobe.com", cat: ["AI", "Design", "Creative"], desc: "Creative generative AI models trained exclusively on licensed content.", pricing: "Freemium" },

  // --- BATCH 7: KNOWLEDGE & SANDBOXES ---
  { name: "Glitch", title: "Glitch | Fast In-Browser Web App Creation", url: "https://glitch.com", cat: ["Developer", "Creative", "Fun"], desc: "Collaborative coding platform where users build and host Node.js web applications.", pricing: "Freemium" },
  { name: "Obsidian", title: "Obsidian | Extensible Markdown Knowledge Graph", url: "https://obsidian.md", cat: ["Productivity", "Interesting"], desc: "Private, offline-first knowledge management hub that treats notes as a network.", pricing: "Free" },
  { name: "Shapr3D", title: "Shapr3D | Direct Multi-Device CAD Modeling", url: "https://www.shapr3d.com", cat: ["3D", "Design"], desc: "Intuitive direct 3D modeling CAD tool engineered for industrial designers.", pricing: "Freemium" },
  { name: "Codeium", title: "Codeium | Free AI-Powered Code Acceleration", url: "https://codeium.com", cat: ["Developer", "AI", "Coding"], desc: "Modern AI coding assistant that integrates across dozens of IDEs for fast completion.", pricing: "Free" },
  { name: "Render", title: "Render | Modern Zero-DevOps Cloud Hosting", url: "https://render.com", cat: ["Developer", "Startups"], desc: "Unified cloud platform that builds and hosts web apps with automated Git deployments.", pricing: "Freemium" },
];

export const MOCK_WEBSITES: Website[] = Array.from(new Set(RAW_SITES.map(s => s.url)))
  .map((url, index) => {
    const site = RAW_SITES.find(s => s.url === url)!;
    const pricing = site.pricing || "Free";

    return {
      id: `site-${index}`,
      name: (site as any).title || site.name, // Discovery Title
      websiteName: site.name, // Brand Name
      developer: "Bessites Curator",
      description: site.desc || (site as any).description, // Detailed Info
      longDescription: site.desc || (site as any).description,
      rating: 4.5 + (Math.random() * 0.5),
      reviewCount: 12 + Math.floor(Math.random() * 100),
      categories: site.cat || (site as any).categories || [],
      imageUrl: "", 
      screenshots: [],
      url: site.url,
      size: "N/A",
      version: "1.0",
      updatedAt: "2024",
      pricing: pricing as any,
      pros: (site as any).pros || ["Hand-picked quality", "Verified URL", "Highly useful"],
      cons: (site as any).cons || ["May require account", "Limited free tier"],
      bestFor: (site as any).bestFor || "General users and digital creators."
    };
  });
