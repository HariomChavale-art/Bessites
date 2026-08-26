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
  { name: "Aceternity UI", title: "Aceternity UI | Modern Animated Components", url: "https://ui.aceternity.com", cat: ["Developer Tools & UI Kits"], desc: "Aceternity UI is an award-winning collection of modern, copy-paste React and Tailwind CSS components designed for developers who want to build sleek, dark-mode websites.", pricing: "Free", pros: ["High-end animations", "Copy-paste ease", "Modern aesthetic"], cons: ["Tailwind specific", "Framer Motion dependency"], bestFor: "React developers building luxury landing pages." },
  { name: "Spline", title: "Spline 3D Design | Real-Time 3D for the Web", url: "https://spline.design", cat: ["3D Design & Web Graphics"], desc: "Spline is a collaborative browser-based 3D design software that allows creators to build, animate, and publish interactive 3D web experiences without complex code.", pricing: "Freemium", pros: ["Intuitive 3D logic", "Direct React exports", "Real-time physics"], cons: ["High resource usage", "Learning curve"], bestFor: "Designers adding interactive 3D assets to web projects." },
  { name: "Godly", title: "Godly | Top Web Design Inspiration Gallery", url: "https://godly.website", cat: ["Design Inspiration & Curation"], desc: "Godly is a strictly curated design gallery that indexes the top 1% of web design projects worldwide. Updated daily, it serves as the ultimate benchmark for modern typography.", pricing: "Free", pros: ["Daily inspiration", "Elite curation", "Filtered by style"], cons: ["Reference only", "No tools included"], bestFor: "UI/UX designers seeking high-end layout trends." },
  { name: "Radio Garden", title: "Radio Garden | Explore Live Global Radio", url: "https://radio.garden", cat: ["Interactive Web & Audio"], desc: "Radio Garden is a live, interactive 3D globe that lets you explore and listen to thousands of local radio broadcasts worldwide in real time.", pricing: "Free" },
  { name: "Krea AI", title: "Krea AI Studio | Real-Time Creative AI", url: "https://krea.ai", cat: ["Generative AI & Image Generation"], desc: "Krea AI is an ultra-fast generative visual engine offering real-time AI canvas generation, AI video enhancement, and high-fidelity upscaling.", pricing: "Freemium" },
  { name: "Slow Roads", title: "Slow Roads | Procedural Browser Driving Simulator", url: "https://slowroads.io", cat: ["Browser Games & Simulators"], desc: "Slow Roads is a procedurally generated 3D driving simulator that runs entirely inside your web browser using WebGL.", pricing: "Free" },
  { name: "Linear", title: "Linear | The Issue Tracker Built for Speed", url: "https://linear.app", cat: ["Productivity & Project Management"], desc: "Linear is a streamlined issue tracking and product management tool built specifically for high-velocity software engineering and design teams.", pricing: "Freemium" },
  { name: "Neal.fun", title: "Neal.fun | Viral Interactive Web Experiments", url: "https://neal.fun", cat: ["Creative Experiments & Mini Games"], desc: "Neal.fun is a massive collection of viral, high-concept interactive web toys and digital experiments created by designer Neal Agarwal.", pricing: "Free" },
  { name: "Uiverse", title: "Uiverse.io | Open-Source UI Components", url: "https://uiverse.io", cat: ["Open Source CSS & Frontend Assets"], desc: "Uiverse is the web's largest community-driven repository of 100% free, open-source UI micro-components. Pure HTML, CSS, and Tailwind code.", pricing: "Free" },
  { name: "Mobbin", title: "Mobbin | Comprehensive UI/UX Design Reference", url: "https://mobbin.com", cat: ["UI/UX Research & App Architecture"], desc: "Mobbin is the definitive reference library for digital product designers, archiving thousands of fully searchable screenshots and complete user flows.", pricing: "Freemium" },

  // --- BATCH 2: AI & INFRASTRUCTURE ---
  { name: "v0 by Vercel", title: "v0 by Vercel | Generative UI & Full-Stack React Code", url: "https://v0.dev", cat: ["AI Development & Generative Code"], desc: "v0 is a generative user interface system built by Vercel that turns natural language prompts and design screenshots into production-ready React, Next.js, and Tailwind CSS code.", pricing: "Freemium" },
  { name: "Lovable", title: "Lovable | Full-Stack AI Software Engineer", url: "https://lovable.dev", cat: ["AI Development & Generative Code"], desc: "Lovable is an autonomous full-stack AI development platform that builds, tests, and deploys complete web applications from conversational prompts.", pricing: "Freemium" },
  { name: "ElevenLabs", title: "ElevenLabs | Voice AI & Generative Audio", url: "https://elevenlabs.io", cat: ["Voice AI & Audio Synthesis"], desc: "ElevenLabs is the industry-leading generative voice AI platform capable of producing hyper-realistic speech and voice clones.", pricing: "Freemium" },
  { name: "Luma Dream Machine", title: "Luma Dream Machine | Next-Gen Generative AI Video", url: "https://lumalabs.ai/dream-machine", cat: ["Generative AI Video & 3D"], desc: "Dream Machine is a high-speed video generation model that converts text and images into fluid, physically accurate video clips.", pricing: "Freemium" },
  { name: "Supabase", title: "Supabase | The Open-Source Firebase Alternative", url: "https://supabase.com", cat: ["Cloud Backend & Database Infrastructure"], desc: "Supabase provides developers with an open-source backend suite offering dedicated PostgreSQL databases, instant APIs, and real-time sync.", pricing: "Freemium" },
  { name: "Resend", title: "Resend | Modern Email API for Developers", url: "https://resend.com", cat: ["Developer APIs & Infrastructure"], desc: "Resend is an email platform designed specifically for software developers with React Email integration.", pricing: "Freemium" },
  { name: "tldraw", title: "tldraw | Collaborative Infinite Canvas & SDK", url: "https://tldraw.com", cat: ["Visual Workspace & Whiteboarding"], desc: "tldraw is an open-source digital whiteboard and collaborative infinite canvas with an ultra-responsive vector engine.", pricing: "Free" },
  { name: "Typefully", title: "Typefully | Distraction-Free Writing & Social Publishing", url: "https://typefully.com", cat: ["Content Creation & Social Growth"], desc: "Typefully is a minimalist writing canvas and social media scheduling platform built for creators.", pricing: "Freemium" },
  { name: "PostHog", title: "PostHog | All-in-One Product Analytics Suite", url: "https://posthog.com", cat: ["Analytics & User Behavior"], desc: "PostHog is an open-source product analytics platform that combines event tracking, session replays, and heatmaps.", pricing: "Freemium" },
  { name: "ReadCV", title: "ReadCV | Professional Profiles & Creative Network", url: "https://read.cv", cat: ["Portfolios & Professional Networking"], desc: "ReadCV is a minimalist professional network and interactive resume builder tailored for designers, engineers, and creative builders.", pricing: "Free" },

  // --- BATCH 3: SPECIALIZED TOOLS ---
  { name: "Cursor", title: "Cursor | The AI-First Code Editor", url: "https://www.cursor.com", cat: ["Developer Tools & AI IDEs"], desc: "Cursor is an AI-native code editor built as a high-performance fork of VS Code.", pricing: "Freemium" },
  { name: "Perplexity", title: "Perplexity AI | Conversational Answer Engine", url: "https://www.perplexity.ai", cat: ["AI Search & Research Engines"], desc: "Perplexity AI is an interactive conversational answer engine that delivers direct, cited answers.", pricing: "Freemium" },
  { name: "Midjourney", title: "Midjourney | Generative Visual Art Canvas", url: "https://www.midjourney.com", cat: ["Generative AI & Concept Art"], desc: "Midjourney is an AI image generation platform renowned for its photorealistic texturing.", pricing: "Paid" },
  { name: "Pika", title: "Pika Labs | Generative Video & Cinematic Effects", url: "https://pika.art", cat: ["Generative AI Video & 3D"], desc: "Pika is an intuitive browser-based AI video generation and animation platform.", pricing: "Freemium" },
  { name: "Framer", title: "Framer | Interactive Web Design & Publishing", url: "https://www.framer.com", cat: ["No-Code & Web Architecture"], desc: "Framer is a visual website builder that blends canvas design with production-grade web publishing.", pricing: "Freemium" },
  { name: "Veed", title: "Veed.io | In-Browser Video Studio & AI Captions", url: "https://www.veed.io", cat: ["Video Editing & Content Creation"], desc: "Veed is an all-in-one cloud-based video editing platform tailored for digital creators.", pricing: "Freemium" },
  { name: "Playroom", title: "Playroom | Multiplayer Web Game Engine", url: "https://joinplayroom.com", cat: ["Game Development & Interactive Tech"], desc: "Playroom is a multiplayer toolkit that allows indie developers to build synchronized web games in minutes.", pricing: "Free" },
  { name: "Looka", title: "Looka | AI Brand Identity & Logo Maker", url: "https://looka.com", cat: ["Design & Branding"], desc: "Looka is an AI-powered brand generator that translates user preferences into custom vector logos.", pricing: "Paid" },
  { name: "Claude", title: "Claude by Anthropic | Frontier AI Reasoning", url: "https://claude.ai", cat: ["AI Assistants & LLM Interfaces"], desc: "Claude is an advanced conversational AI assistant engineered for complex technical reasoning.", pricing: "Freemium" },
  { name: "Descript", title: "Descript | Document-Based Audio & Video Editor", url: "https://www.descript.com", cat: ["Audio Production & Podcasting"], desc: "Descript is a multimedia editing platform where creators edit audio and video by editing text transcripts.", pricing: "Freemium" },

  // --- BATCH 4: ANIMATION & INFRASTRUCTURE ---
  { name: "GSAP", title: "GSAP | Professional-Grade JavaScript Web Animation", url: "https://gsap.com", cat: ["Web Animation & Creative Coding"], desc: "The industry standard JavaScript animation library powering high-performance motion on 11M+ sites.", pricing: "Free" },
  { name: "Ray.so", title: "Ray.so | Beautiful Code Snippet Screenshot Generator", url: "https://ray.so", cat: ["Developer Utilities & Code Presentation"], desc: "Transforms raw programming code into aesthetic, high-resolution syntax-highlighted images.", pricing: "Free" },
  { name: "Awwwards", title: "Awwwards | Digital Design Recognition & Agency Showcase", url: "https://www.awwwards.com", cat: ["Design Awards & Creative Inspiration"], desc: "The global benchmark platform that recognizes and awards the finest talent in digital design.", pricing: "Free" },
  { name: "Landingfolio", title: "Landingfolio | The Best Landing Page Design Inspiration", url: "https://www.landingfolio.com", cat: ["Landing Page & Conversion Design"], desc: "A curated gallery showcasing high-converting landing page designs.", pricing: "Free" },
  { name: "Coolors", title: "Coolors | Superfast Color Schemes Generator", url: "https://coolors.co", cat: ["Color Tools & UI Design Systems"], desc: "Lightning-fast color palette generator used by millions of designers daily.", pricing: "Free" },
  { name: "Vercel", title: "Vercel | The Frontend Cloud & Next.js Platform", url: "https://vercel.com", cat: ["Cloud Hosting & Deployment Infrastructure"], desc: "The creators of Next.js, providing an end-to-end frontend cloud platform.", pricing: "Freemium" },
  { name: "Figma", title: "Figma | The Collaborative Interface Design Standard", url: "https://www.figma.com", cat: ["Product UI/UX & Vector Design"], desc: "The industry-standard collaborative vector design software.", pricing: "Freemium" },
  { name: "Lucide", title: "Lucide Icons | Beautiful Open-Source Icon Toolkit", url: "https://lucide.dev", cat: ["Vector Graphics & Iconography"], desc: "An open-source, community-run fork of Feather Icons.", pricing: "Free" },
  { name: "Roadmap.sh", title: "Roadmap.sh | Developer Career & Skill Roadmaps", url: "https://roadmap.sh", cat: ["Developer Education & Career Learning"], desc: "Step-by-step visual roadmaps and study guides for software engineers.", pricing: "Free" },
  { name: "Dribbble", title: "Dribbble | The World's Leading Design Portfolio Showcase", url: "https://dribbble.com", cat: ["Design Inspiration & Curation"], desc: "The premier discovery platform for digital product designers.", pricing: "Free" },

  // --- BATCH 5: SPECIALIZED TOOLS ---
  { name: "Bolt.new", title: "Bolt.new | In-Browser Full-Stack AI Web Engineering", url: "https://bolt.new", cat: ["AI Development & Generative Code"], desc: "AI development workspace that executes full-stack production web apps inside your browser.", pricing: "Freemium" },
  { name: "Recraft", title: "Recraft AI | Generative Infinite Vector & 3D Art Studio", url: "https://www.recraft.ai", cat: ["Generative Vector & Brand Illustration"], desc: "Professional generative visual studio that natively outputs vector SVG illustrations.", pricing: "Freemium" },
  { name: "Readymag", title: "Readymag | Editorial Web Design & Digital Publishing", url: "https://readymag.com", cat: ["Editorial & Creative Web Publishing"], desc: "In-browser visual publishing platform crafted for creative directors.", pricing: "Freemium" },
  { name: "Streamline", title: "Streamline Icons | The World's Largest Vector Asset System", url: "https://www.streamlinehq.com", cat: ["Design Assets & Icon Systems"], desc: "Exhaustive design system featuring 170,000+ vector icons.", pricing: "Freemium" },
  { name: "Untitled UI", title: "Untitled UI | The Ultimate Figma UI Kit & Design System", url: "https://www.untitledui.com", cat: ["UI Kits & Design Systems"], desc: "The industry's largest and most widely used Figma UI kit.", pricing: "Paid" },
  { name: "Microsoft Clarity", title: "Microsoft Clarity | Free Behavioral Analytics & Heatmaps", url: "https://clarity.microsoft.com", cat: ["Analytics & User Behavior"], desc: "Free behavioral analytics tool that visualizes user journeys.", pricing: "Free" },
  { name: "Spline AI", title: "Spline AI | Prompt-to-3D Texturing & Scene Generator", url: "https://spline.design/ai", cat: ["3D Design & Web Graphics"], desc: "Generative AI integrated directly into the 3D web design workflow.", pricing: "Freemium" },
  { name: "Uxcel", title: "Uxcel | Interactive UX Design Training", url: "https://uxcel.com", cat: ["Developer Education & Career Learning"], desc: "Gamified learning platform that teaches digital product design.", pricing: "Freemium" },
  { name: "Memberstack", title: "Memberstack | Gated Memberships & Web Auth Engine", url: "https://www.memberstack.com", cat: ["No-Code & Web Architecture"], desc: "Infrastructure layer to add secure logins and subscriptions.", pricing: "Freemium" },
  { name: "Fabric", title: "Fabric | AI-Powered Unified Digital Workspace", url: "https://fabric.so", cat: ["Visual Workspace & Whiteboarding"], desc: "Intelligent workspace that acts as a digital memory hub.", pricing: "Freemium" },

  // --- BATCH 6: ENTERPRISE & AUTOMATION ---
  { name: "TanStack", title: "TanStack | Headless Full-Stack Frameworks", url: "https://tanstack.com", cat: ["Frontend Frameworks & State Architecture"], desc: "Headless, type-safe open-source web utilities.", pricing: "Free" },
  { name: "Zapier", title: "Zapier | Automated Enterprise Workflow Orchestration", url: "https://zapier.com", cat: ["No-Code Databases & Workflow Automation"], desc: "Connects over 6,000 web apps without requiring manual code.", pricing: "Freemium" },
  { name: "Shortwave", title: "Shortwave | AI-Native Email & Productivity System", url: "https://www.shortwave.com", cat: ["Productivity & Time Management"], desc: "Email client designed around the Method of Inbox Zero.", pricing: "Freemium" },
  { name: "Kuberns", title: "Kuberns | Agentic AI Cloud Deployment", url: "https://kuberns.com", cat: ["Cloud Hosting & Deployment Infrastructure"], desc: "Agentic AI cloud deployment platform that automates backend setup.", pricing: "Freemium" },
  { name: "Adobe Firefly", title: "Adobe Firefly | Commercially Safe Generative AI", url: "https://firefly.adobe.com", cat: ["Generative AI & Concept Art"], desc: "Creative generative AI models trained on licensed content.", pricing: "Freemium" },

  // --- BATCH 7: KNOWLEDGE & SANDBOXES ---
  { name: "Glitch", title: "Glitch | Fast In-Browser Web App Creation", url: "https://glitch.com", cat: ["Creative Coding & Social Sandboxes"], desc: "Collaborative coding platform where users build and host web apps.", pricing: "Freemium" },
  { name: "Obsidian", title: "Obsidian | Extensible Markdown Knowledge Graph", url: "https://obsidian.md", cat: ["Knowledge Graphs & Personal Productivity"], desc: "Private, offline-first knowledge management hub.", pricing: "Free" },
  { name: "Shapr3D", title: "Shapr3D | Direct Multi-Device CAD Modeling", url: "https://www.shapr3d.com", cat: ["CAD Engineering & Industrial Design"], desc: "Intuitive direct 3D modeling CAD tool.", pricing: "Freemium" },
  { name: "Codeium", title: "Codeium | Free AI-Powered Code Acceleration", url: "https://codeium.com", cat: ["Developer Tools & AI IDEs"], desc: "Modern AI coding assistant that integrates across IDEs.", pricing: "Free" },
  { name: "Render", title: "Render | Modern Zero-DevOps Cloud Hosting", url: "https://render.com", cat: ["Cloud Hosting & Deployment Infrastructure"], desc: "Unified cloud platform that builds and hosts web apps.", pricing: "Freemium" },

  // --- BATCH 8: INFRASTRUCTURE & COMMERCE ---
  { name: "Stripe", title: "Stripe | Financial Infrastructure for the Internet", url: "https://stripe.com", cat: ["Payments & Global Commerce"], desc: "World's leading financial infrastructure platform.", pricing: "Freemium" },
  { name: "Cloudflare", title: "Cloudflare Workers | Serverless Edge Computing & CDN", url: "https://workers.cloudflare.com", cat: ["Edge Computing & Web Security"], desc: "Lightweight serverless execution environment at the edge.", pricing: "Freemium" },
  { name: "Temporal", title: "Temporal | Durable Execution & Distributed State", url: "https://temporal.io", cat: ["Backend Orchestration & Microservices"], desc: "Open-source workflow orchestration engine.", pricing: "Free" },
  { name: "LaunchDarkly", title: "LaunchDarkly | Feature Flagging & Experimentation", url: "https://launchdarkly.com", cat: ["DevOps & Continuous Delivery"], desc: "Enterprise feature management platform.", pricing: "Paid" },
  { name: "Sentry", title: "Sentry | Real-Time Error Tracking & Code Observability", url: "https://sentry.io", cat: ["Application Monitoring & Observability"], desc: "Real-time error tracking designed for modern apps.", pricing: "Freemium" },
  { name: "WorkOS", title: "WorkOS | Enterprise SSO, SCIM & Directory Sync", url: "https://workos.com", cat: ["Identity & Enterprise Authentication"], desc: "Developer-friendly APIs for enterprise-ready SaaS.", pricing: "Freemium" },
  { name: "Datadog", title: "Datadog | Cloud Monitoring & Security Analytics", url: "https://www.datadoghq.com", cat: ["Application Monitoring & Observability"], desc: "Observability analytics platform for cloud infrastructure.", pricing: "Paid" },
  { name: "HeyGen", title: "HeyGen | Generative AI Video & Photorealistic Avatars", url: "https://www.heygen.com", cat: ["AI Video Generation & Digital Avatars"], desc: "AI video studio that creates spokesperson videos.", pricing: "Freemium" },
  { name: "FastAPI", title: "FastAPI | Modern Python Web Framework", url: "https://fastapi.tiangolo.com", cat: ["Backend APIs & Python Development"], desc: "Fast Python web framework for scalable RESTful APIs.", pricing: "Free" },
  { name: "SurferSEO", title: "SurferSEO | Content Intelligence & SEO Optimization", url: "https://surferseo.com", cat: ["SEO Analytics & Organic Search"], desc: "AI-powered search optimization platform.", pricing: "Paid" },
  { name: "Shopify", title: "Shopify | Global E-Commerce Platform", url: "https://www.shopify.com", cat: ["Payments & Global Commerce"], desc: "Global commerce platform powering online storefronts.", pricing: "Paid" },

  // --- BATCH 9: AUTH & MODERN STACK ---
  { name: "Clerk", title: "Clerk | Complete User Authentication", url: "https://clerk.com", cat: ["Identity & User Authentication"], desc: "Developer-first auth platform for React and Next.js.", pricing: "Freemium" },
  { name: "Upstash", title: "Upstash | Serverless Redis & Kafka", url: "https://upstash.com", cat: ["Serverless Data & Edge Caching"], desc: "Serverless data platform for edge computing.", pricing: "Freemium" },
  { name: "PlanetScale", title: "PlanetScale | Serverless MySQL", url: "https://planetscale.com", cat: ["Cloud Databases & Data Infrastructure"], desc: "Advanced MySQL-compatible serverless database.", pricing: "Paid" },
  { name: "Prisma", title: "Prisma | TypeScript ORM", url: "https://www.prisma.io", cat: ["Backend Tooling & Database ORMs"], desc: "Next-generation ORM toolkit for Node.js.", pricing: "Free" },
  { name: "Biome", title: "Biome | Fast Web Development Toolchain", url: "https://biomejs.dev", cat: ["Developer Utilities & Code Quality"], desc: "High-performance toolchain written in Rust.", pricing: "Free" },
  { name: "Bun", title: "Bun | Fast All-in-One JS Runtime", url: "https://bun.sh", cat: ["Developer Tooling & JavaScript Runtimes"], desc: "All-in-one JavaScript runtime and package manager.", pricing: "Free" },
  { name: "Mintlify", title: "Mintlify | Modern Documentation", url: "https://mintlify.com", cat: ["Developer Documentation & Knowledge Bases"], desc: "MDX-powered documentation engine for startups.", pricing: "Freemium" },
  { name: "Hugging Face", title: "Hugging Face | The Open AI Model Hub", url: "https://huggingface.co", cat: ["AI Models & Open-Source Machine Learning"], desc: "Central collaboration hub for the machine learning ecosystem.", pricing: "Freemium" },
  { name: "Tailwind UI", title: "Tailwind UI | Official Component Library", url: "https://tailwindui.com", cat: ["Frontend Frameworks & Component Blocks"], desc: "Official visual component library by Tailwind Labs.", pricing: "Paid" },

  // --- BATCH 10: VIDEO & CREATIVE UTILS ---
  { name: "Screen Studio", title: "Screen Studio | Professional Screen Recorder for macOS", url: "https://www.screen.studio", cat: ["Video Production & Screen Recording"], desc: "Advanced screen recording software that transforms captures into promotional videos automatically.", pricing: "Paid" },
  { name: "Ollama", title: "Ollama | Run Large Language Models Locally", url: "https://ollama.com", cat: ["Local AI & Machine Learning Tools"], desc: "Open-source framework to run and manage LLMs locally on personal hardware.", pricing: "Free" },
  { name: "Raycast Extensions", title: "Raycast Store | Extensible Developer Plugins", url: "https://www.raycast.com/store", cat: ["Developer Tooling & Desktop Ecosystems"], desc: "Open-source ecosystem of thousands of community-built extensions for Raycast launcher.", pricing: "Free" },
  { name: "Slicknode", title: "Slicknode | Modular Serverless GraphQL Backend Engine", url: "https://slicknode.com", cat: ["Backend APIs & Data Orchestration"], desc: "Serverless GraphQL backend framework combining schema modeling with instant infrastructure.", pricing: "Freemium" },
  { name: "Phosphor Icons", title: "Phosphor Icons | Flexible Icon Family for Interfaces", url: "https://phosphoricons.com", cat: ["Vector Graphics & Iconography"], desc: "Flexible icon family with over 9,000 vector assets across six distinct weights.", pricing: "Free" },
  { name: "OpenStatus", title: "OpenStatus | Open-Source Monitoring & Status Pages", url: "https://www.openstatus.dev", cat: ["Application Monitoring & Observability"], desc: "Modern synthetic monitoring platform and incident status page builder.", pricing: "Freemium" },
  { name: "Fontshare Variable", title: "Fontshare Variable Fonts | Dynamic Axis Explorer", url: "https://www.fontshare.com/variable", cat: ["Typography & Font Discovery"], desc: "Interactive controls to manipulate axes across a curated catalog of free variable fonts.", pricing: "Free" },
  { name: "Resend React Email", title: "React Email | Component Collection for Email Templates", url: "https://react.email", cat: ["Developer APIs & Infrastructure"], desc: "Open-source suite of clean, responsive components for crafting HTML emails with React.", pricing: "Free" },
  { name: "Warp", title: "Warp | AI-Enabled Modern Terminal for Developers", url: "https://www.warp.dev", cat: ["Developer Tools & AI IDEs"], desc: "GPU-accelerated terminal application built in Rust with integrated AI command generation.", pricing: "Freemium" },
  { name: "Jitter Motion Studio", title: "Jitter | Fast Motion Design & UI Animations", url: "https://jitter.video", cat: ["Web Animation & Creative Coding"], desc: "Web-based motion design platform built for animating UI components and typography.", pricing: "Freemium" },
  { name: "V0 UI Blocks", title: "v0 Explore Blocks | Production Component Layouts", url: "https://v0.dev/explore", cat: ["Frontend Frameworks & Component Blocks"], desc: "Curated gallery of modular React UI blocks generated with AI and verified by Vercel.", pricing: "Free" },
  { name: "Uiverse Pure CSS", title: "Uiverse CSS Buttons | Community Micro-Interactions", url: "https://uiverse.io/buttons", cat: ["Open Source CSS & Frontend Assets"], desc: "Expansive sub-library dedicated specifically to copyable interactive button design.", pricing: "Free" },
  { name: "Spline 3D Shaders", title: "Spline Material Shaders | Procedural Glass Generator", url: "https://spline.design/materials", cat: ["3D Design & Web Graphics"], desc: "Create procedural glass and matcap finishes on 3D meshes directly in the browser.", pricing: "Freemium" },
  { name: "Pico CSS", title: "Pico CSS | Minimalist Semantic CSS Framework", url: "https://picocss.com", cat: ["Frontend Frameworks & Styling Tooling"], desc: "Lightweight, semantic CSS framework that styles pure HTML elements automatically.", pricing: "Free" },
  { name: "Gradients Guru", title: "Gradients Guru | Mesh & Linear Gradient Studio", url: "https://gradients.guru", cat: ["Color Tools & UI Design Systems"], desc: "Aesthetic collection of complex multi-color mesh gradients and noise backgrounds.", pricing: "Free" },
  { name: "Uncut Type", title: "Uncut.wtf | Contemporary Open-Source Typographic Showcase", url: "https://uncut.wtf", cat: ["Typography & Font Discovery"], desc: "Curated directory of experimental and open-source display typefaces.", pricing: "Free" },
  { name: "Ray.so Backgrounds", title: "Ray.so Backgrounds | Modern Wallpaper Generator", url: "https://ray.so/backgrounds", cat: ["Design Assets & Graphic Elements"], desc: "Generative tool that creates modern 4K desktop wallpapers and mesh gradients.", pricing: "Free" },
  { name: "Fontshare Font Pairs", title: "Fontshare Pairings | Curated Editorial Combinations", url: "https://www.fontshare.com/pairs", cat: ["Typography & Font Discovery"], desc: "Ready-to-use typography pairings matching headlines with readable body copy.", pricing: "Free" },
  { name: "Hover.dev Bento Grids", title: "Hover.dev Bento Grids | Animated React & Tailwind Cards", url: "https://www.hover.dev/components/bento-grids", cat: ["Component Libraries & Design Systems"], desc: "Pre-built modular bento-box layouts animated with Framer Motion.", pricing: "Freemium" },
  { name: "Magic UI Bento", title: "Magic UI Bento Grid | Kinetic Layout Blocks", url: "https://magicui.design/docs/components/bento-grid", cat: ["Animation & Frontend Frameworks"], desc: "Bento Grid components featuring kinetic micro-animations and animated SVG backgrounds.", pricing: "Free" },
  { name: "Lucide Studio", title: "Lucide Studio | Vector Icon Customizer", url: "https://lucide.dev/icons", cat: ["Vector Graphics & Iconography"], desc: "Interactive web interface to search, filter, and customize over 1,400 icons.", pricing: "Free" },
  { name: "TinyPNG", title: "TinyPNG | Smart WebP and PNG Compression", url: "https://tinypng.com", cat: ["Image Optimization & Performance"], desc: "Smart lossy compression techniques to drastically reduce image file sizes.", pricing: "Free" },
];

export const MOCK_WEBSITES: Website[] = Array.from(new Set(RAW_SITES.map(s => s.url)))
  .map((url, index) => {
    const site = RAW_SITES.find(s => s.url === url)!;
    const pricing = site.pricing || "Free";

    return {
      id: `site-${index}`,
      name: (site as any).title || site.name, // Discovery Title
      websiteName: site.name, // Brand Name
      developer: (site as any).developer || "Bessites Curator",
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
