
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
  { 
    name: "Aceternity UI", 
    title: "Aceternity UI | Modern Animated Components", 
    url: "https://ui.aceternity.com", 
    cat: ["Developer Tools & UI Kits"], 
    desc: "Aceternity UI is a premium, award-winning collection of modern, copy-paste React and Tailwind CSS components designed for developers who want to build sleek, dark-mode websites without spending hours on complex motion logic. It features a curated gallery of high-performance landing page blocks, from hero sections to interactive grid systems, all optimized for Framer Motion and modern frontend frameworks. Aceternity provides an absolute edge for digital builders looking to achieve a high-end, sophisticated aesthetic with minimal friction.", 
    pricing: "Free", 
    pros: ["High-end animations", "Copy-paste ease", "Modern aesthetic"], 
    cons: ["Tailwind specific", "Framer Motion dependency"], 
    bestFor: "React developers building luxury landing pages and SaaS interfaces." 
  },
  { 
    name: "Spline", 
    title: "Spline 3D Design | Real-Time 3D for the Web", 
    url: "https://spline.design", 
    cat: ["3D Design & Web Graphics"], 
    desc: "Spline is a revolutionary, collaborative browser-based 3D design software that allows creators to build, animate, and publish interactive 3D web experiences without writing complex WebGL code. It features real-time lighting, physics simulations, and direct export options for React, Three.js, and vanilla HTML. Spline bridges the gap between traditional 2D design and the spatial web, empowering designers to add depth and immersive micro-interactions to their digital properties with an intuitive, cloud-native interface used by thousands of creative professionals worldwide.", 
    pricing: "Freemium", 
    pros: ["Intuitive 3D logic", "Direct React exports", "Real-time physics"], 
    cons: ["High resource usage", "Learning curve"], 
    bestFor: "Designers adding interactive 3D assets to modern web projects." 
  },
  { 
    name: "Godly", 
    title: "Godly | Top Web Design Inspiration Gallery", 
    url: "https://godly.website", 
    cat: ["Design Inspiration & Curation"], 
    desc: "Godly is a strictly curated design gallery that indexes the top 1% of web design projects worldwide. Updated daily, it serves as the ultimate benchmark for modern typography, layout innovation, and sophisticated web interactions. Godly isn't just a mood board; it's an educational archive of digital craftsmanship, showcasing how the world's leading creative directors and agencies are pushing the boundaries of what is possible on a browser canvas. It is a vital discovery node for any designer seeking to escape algorithmic boredom.", 
    pricing: "Free", 
    pros: ["Daily inspiration", "Elite curation", "Filtered by style"], 
    cons: ["Reference only", "No tools included"], 
    bestFor: "UI/UX designers seeking high-end layout trends and visual direction." 
  },
  { 
    name: "Radio Garden", 
    title: "Radio Garden | Explore Live Global Radio", 
    url: "https://radio.garden", 
    cat: ["Interactive Web & Audio"], 
    desc: "Radio Garden is a live, interactive 3D globe that lets you explore and listen to thousands of local radio broadcasts worldwide in real time. Created as a non-profit educational project, it provides a unique sonic window into different cultures, languages, and geographic regions. By simply spinning the globe, users can tune into local FM stations from Tokyo to Buenos Aires, experiencing the world's auditory diversity through a seamless, high-fidelity web interface that celebrates the borderless nature of radio technology.", 
    pricing: "Free" 
  },
  { 
    name: "Krea AI", 
    title: "Krea AI Studio | Real-Time Creative AI", 
    url: "https://krea.ai", 
    cat: ["Generative AI & Image Generation"], 
    desc: "Krea AI is an ultra-fast generative visual engine offering real-time AI canvas generation, high-fidelity video enhancement, and professional-grade upscaling. It is designed for creative directors and artists who need immediate feedback loops during the conceptualization process. Krea's real-time generation allows users to paint with AI guidance, instantly translating rough sketches into photorealistic renders. It represents the pinnacle of human-AI collaboration in the visual arts, providing a high-velocity pipeline for modern content creation and aesthetic exploration.", 
    pricing: "Freemium" 
  },
  { 
    name: "Slow Roads", 
    title: "Slow Roads | Procedural Browser Driving Simulator", 
    url: "https://slowroads.io", 
    cat: ["Browser Games & Simulators"], 
    desc: "Slow Roads is a procedurally generated 3D driving simulator that runs entirely inside your web browser using high-performance WebGL. It offers a meditative, zen-like experience of endless road trips across diverse terrains and lighting conditions. With no goals, timers, or scoreboards, Slow Roads focuses purely on the atmosphere and physics of motion. It is a masterpiece of browser-based creative coding, demonstrating how complex environmental rendering can be achieved without native installations, making it a definitive asset in the interactive web discovery category.", 
    pricing: "Free" 
  },
  { 
    name: "Linear", 
    title: "Linear | The Issue Tracker Built for Speed", 
    url: "https://linear.app", 
    cat: ["Productivity & Project Management"], 
    desc: "Linear is a streamlined, high-performance issue tracking and product management tool built specifically for high-velocity software engineering and design teams. It focuses on keyboard-first navigation, real-time synchronization, and a minimalist interface that eliminates the friction typical of enterprise project management software. Linear is engineered for creators who value momentum, offering powerful automated workflows and deep Git integrations that help engineering teams ship better products faster with absolute clarity and zero padding.", 
    pricing: "Freemium" 
  },
  { 
    name: "Neal.fun", 
    title: "Neal.fun | Viral Interactive Web Experiments", 
    url: "https://neal.fun", 
    cat: ["Creative Experiments & Mini Games"], 
    desc: "Neal.fun is a massive collection of viral, high-concept interactive web toys and digital experiments created by designer Neal Agarwal. From 'The Deep Sea' to 'Spend Bill Gates' Money,' these projects represent the peak of internet creativity and curiosity-driven design. Each experiment is a self-contained masterpiece of educational entertainment, using interactive storytelling to explain complex data or simply provide a moment of web-native joy. It is the gold standard for 'Interesting & Random' discovery on the modern web.", 
    pricing: "Free" 
  },
  { 
    name: "Uiverse", 
    title: "Uiverse.io | Open-Source UI Components", 
    url: "https://uiverse.io", 
    cat: ["Open Source CSS & Frontend Assets"], 
    desc: "Uiverse is the web's largest community-driven repository of 100% free, open-source UI micro-components. It offers thousands of copy-paste CSS and HTML elements, from animated buttons and checkboxes to complex loading states and glassmorphic cards. Uiverse empowers developers to build sophisticated interfaces by leveraging the collective creativity of a global community. Every component is verified for performance and compatibility, making it an essential resource for any developer looking to add professional polish to their projects with zero overhead.", 
    pricing: "Free" 
  },
  { 
    name: "Mobbin", 
    title: "Mobbin | Comprehensive UI/UX Design Reference", 
    url: "https://mobbin.com", 
    cat: ["UI/UX Research & App Architecture"], 
    desc: "Mobbin is the definitive reference library for digital product designers, archiving thousands of fully searchable screenshots and complete user flows from the world's most successful mobile and web applications. It serves as an architectural blueprint for product builders, allowing them to research industry-standard patterns for onboarding, checkout, and navigation. Mobbin's high-resolution archives provide a real-world look at how top-tier apps like Airbnb and Uber solve complex interaction challenges, making it an indispensable tool for competitive research.", 
    pricing: "Freemium" 
  },

  // --- BATCH 2: AI & INFRASTRUCTURE ---
  { name: "v0 by Vercel", title: "v0 by Vercel | Generative UI & Full-Stack React Code", url: "https://v0.dev", cat: ["AI Development & Generative Code"], desc: "v0 is a generative user interface system built by Vercel that turns natural language prompts and design screenshots into production-ready React, Next.js, and Tailwind CSS code. It accelerates the bridge between design and code.", pricing: "Freemium" },
  { name: "Lovable", title: "Lovable | Full-Stack AI Software Engineer", url: "https://lovable.dev", cat: ["AI Development & Generative Code"], desc: "Lovable is an autonomous full-stack AI development platform that builds, tests, and deploys complete web applications from conversational prompts.", pricing: "Freemium" },
  { name: "ElevenLabs", title: "ElevenLabs | Voice AI & Generative Audio", url: "https://elevenlabs.io", cat: ["Voice AI & Audio Synthesis"], desc: "ElevenLabs is the industry-leading generative voice AI platform capable of producing hyper-realistic speech and voice clones.", pricing: "Freemium" },
  { name: "Luma Dream Machine", title: "Luma Dream Machine | Next-Gen Generative AI Video", url: "https://lumalabs.ai/dream-machine", cat: ["Generative AI Video & 3D"], desc: "Dream Machine is a high-speed video generation model that converts text and images into fluid, physically accurate video clips.", pricing: "Freemium" },
  { name: "Supabase", title: "Supabase | The Open-Source Firebase Alternative", url: "https://supabase.com", cat: ["Cloud Backend & Database Infrastructure"], desc: "Supabase provides developers with an open-source backend suite offering dedicated PostgreSQL databases, instant APIs, and real-time sync.", pricing: "Freemium" },
  { name: "Resend", title: "Resend | Modern Email API for Developers", url: "https://resend.com", cat: ["Developer APIs & Infrastructure"], desc: "Resend is an email platform designed specifically for software developers with React Email integration.", pricing: "Freemium" },
  { name: "tldraw", title: "tldraw | Collaborative Infinite Canvas & SDK", url: "https://tldraw.com", cat: ["Visual Workspace & Whiteboarding"], desc: "tldraw is an open-source digital whiteboard and collaborative infinite canvas with an ultra-responsive vector engine.", pricing: "Free" },
  { name: "Typefully", title: "Typefully | Distraction-Free Writing & Social Publishing", url: "https://typefully.com", cat: ["Content Creation & Social Growth"], desc: "Typefully is a minimalist writing canvas and social media scheduling platform built for creators.", pricing: "Freemium" },
  { name: "PostHog", title: "PostHog | All-in-One Product Analytics Suite", url: "https://posthog.com", cat: ["Analytics & User Behavior"], desc: "PostHog is an open-source product analytics platform that combines event tracking, session replays, and heatmaps.", pricing: "Freemium" },
  { name: "ReadCV", title: "ReadCV | Professional Profiles & Creative Network", url: "https://read.cv", cat: ["Portfolios & Professional Networking"], desc: "ReadCV is a minimalist professional network and interactive resume builder tailored for designers, engineers, and creative builders.", pricing: "Free" },

  // ... rest of the sites mapping remains the same to keep the registry large
];

export const MOCK_WEBSITES: Website[] = Array.from(new Set(RAW_SITES.map(s => s.url)))
  .map((url, index) => {
    const site = RAW_SITES.find(s => s.url === url)!;
    const pricing = site.pricing || "Free";

    return {
      id: `site-${index}`,
      name: (site as any).title || site.name, 
      websiteName: site.name, 
      developer: (site as any).developer || "Bessites Curator",
      description: site.desc || (site as any).description, 
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
