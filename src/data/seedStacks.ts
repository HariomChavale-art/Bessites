
import { StackDocument, StackItemDocument } from '@/types/stacks';
import { Timestamp } from 'firebase/firestore';

/**
 * @fileOverview Founding Stacks for Bessites.
 * 8 Bundles / 48 Websites.
 * Used as a fallback for /stacks and as a source for initial database seeding.
 */

const creator = {
  username: 'bessites',
  displayName: 'Bessites Editorial',
  avatarUrl: 'https://i.imgur.com/3STBHNy.png',
  founderNumber: 1
};

export const DEFAULT_SEED_STACKS: StackDocument[] = [
  {
    id: 'stack-illegal-free-utilities',
    slug: 'stack-illegal-free-utilities',
    title: 'Websites That Feel Illegal to Know (Zero Ads & 100% Free)',
    description: 'Instant browser utilities that solve annoying daily problems in seconds—zero paywalls, zero signups, and zero spammy popup ads.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'Secret Utilities',
    tags: ['100% Free', 'Zero Ads', 'Easy to Use', 'No Signup'],
    itemsCount: 6,
    upvoteCount: 142,
    saveCount: 89,
    forkCount: 12,
    badges: { isFullyFree: true, isAdFree: true, isNoSignup: true },
    previewItems: [
      { id: 'pairdrop', title: 'PairDrop', faviconUrl: 'https://www.google.com/s2/favicons?domain=pairdrop.net&sz=128', domain: 'pairdrop.net' },
      { id: 'squoosh', title: 'Squoosh', faviconUrl: 'https://www.google.com/s2/favicons?domain=squoosh.app&sz=128', domain: 'squoosh.app' },
      { id: 'cobalt', title: 'Cobalt Tools', faviconUrl: 'https://www.google.com/s2/favicons?domain=cobalt.tools&sz=128', domain: 'cobalt.tools' },
      { id: 'excalidraw', title: 'Excalidraw', faviconUrl: 'https://www.google.com/s2/favicons?domain=excalidraw.com&sz=128', domain: 'excalidraw.com' },
      { id: 'archive', title: 'Archive.ph', faviconUrl: 'https://www.google.com/s2/favicons?domain=archive.ph&sz=128', domain: 'archive.ph' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'stack-vibe-coding-indie',
    slug: 'stack-vibe-coding-indie',
    title: 'The Vibe Coder & Indie Hacker Launch Stack',
    description: 'Go from an idea in your head to a deployed, revenue-ready web app in a single weekend using these modern builder websites.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'Coding & AI',
    tags: ['Easy to Use', 'Zero Ads', 'Fast'],
    itemsCount: 6,
    upvoteCount: 118,
    saveCount: 64,
    forkCount: 28,
    badges: { isFullyFree: false, isAdFree: true, isNoSignup: false },
    previewItems: [
      { id: 'v0', title: 'v0 by Vercel', faviconUrl: 'https://www.google.com/s2/favicons?domain=v0.dev&sz=128', domain: 'v0.dev' },
      { id: 'bolt', title: 'Bolt.new', faviconUrl: 'https://www.google.com/s2/favicons?domain=bolt.new&sz=128', domain: 'bolt.new' },
      { id: 'supabase', title: 'Supabase', faviconUrl: 'https://www.google.com/s2/favicons?domain=supabase.com&sz=128', domain: 'supabase.com' },
      { id: 'shadcn', title: 'Shadcn UI', faviconUrl: 'https://www.google.com/s2/favicons?domain=ui.shadcn.com&sz=128', domain: 'ui.shadcn.com' },
      { id: 'lucide', title: 'Lucide Icons', faviconUrl: 'https://www.google.com/s2/favicons?domain=lucide.dev&sz=128', domain: 'lucide.dev' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'stack-god-tier-design-inspo',
    slug: 'stack-god-tier-design-inspo',
    title: 'God-Tier Web Design & Landing Page Inspiration',
    description: "Never stare at a blank Figma canvas again. Where the world's top product designers steal layout, motion, and typography ideas.",
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'UI & Web Design',
    tags: ['100% Free', 'Zero Ads', 'No Signup', 'Easy to Use'],
    itemsCount: 6,
    upvoteCount: 205,
    saveCount: 156,
    forkCount: 41,
    badges: { isFullyFree: true, isAdFree: true, isNoSignup: true },
    previewItems: [
      { id: 'godly', title: 'Godly', faviconUrl: 'https://www.google.com/s2/favicons?domain=godly.website&sz=128', domain: 'godly.website' },
      { id: 'landbook', title: 'Land-book', faviconUrl: 'https://www.google.com/s2/favicons?domain=land-book.com&sz=128', domain: 'land-book.com' },
      { id: 'darkmode', title: 'Dark Mode Design', faviconUrl: 'https://www.google.com/s2/favicons?domain=darkmodedesign.com&sz=128', domain: 'darkmodedesign.com' },
      { id: 'bentogrids', title: 'Bentogrids', faviconUrl: 'https://www.google.com/s2/favicons?domain=bentogrids.com&sz=128', domain: 'bentogrids.com' },
      { id: 'fontshare', title: 'Fontshare', faviconUrl: 'https://www.google.com/s2/favicons?domain=fontshare.com&sz=128', domain: 'fontshare.com' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'stack-viral-creator-arsenal',
    slug: 'stack-viral-creator-arsenal',
    title: 'Creator & Viral Video Editor Super-Arsenal',
    description: 'Everything needed to craft high-retention TikToks, Reels, Shorts, and YouTube edits—from sound effects to motion curves.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'Video & Content',
    tags: ['Easy to Use', 'Zero Ads', '100% Free'],
    itemsCount: 6,
    upvoteCount: 96,
    saveCount: 72,
    forkCount: 15,
    badges: { isFullyFree: true, isAdFree: true, isNoSignup: true },
    previewItems: [
      { id: 'pexels', title: 'Pexels Video', faviconUrl: 'https://www.google.com/s2/favicons?domain=pexels.com&sz=128', domain: 'pexels.com' },
      { id: 'freesound', title: 'Freesound', faviconUrl: 'https://www.google.com/s2/favicons?domain=freesound.org&sz=128', domain: 'freesound.org' },
      { id: 'vocalremover', title: 'VocalRemover', faviconUrl: 'https://www.google.com/s2/favicons?domain=vocalremover.org&sz=128', domain: 'vocalremover.org' },
      { id: 'easings', title: 'Easings.net', faviconUrl: 'https://www.google.com/s2/favicons?domain=easings.net&sz=128', domain: 'easings.net' },
      { id: 'jitter', title: 'Jitter', faviconUrl: 'https://www.google.com/s2/favicons?domain=jitter.video&sz=128', domain: 'jitter.video' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'stack-student-research-supertools',
    slug: 'stack-student-research-supertools',
    title: 'Zero-Bloat Student, Research & Learning Supertools',
    description: 'Learn 5x faster, visualize complex papers, and ace technical subjects without drowning in ad-riddled study blogs.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'Productivity & Study',
    tags: ['100% Free', 'Zero Ads', 'Easy to Use'],
    itemsCount: 6,
    upvoteCount: 167,
    saveCount: 112,
    forkCount: 33,
    badges: { isFullyFree: true, isAdFree: true, isNoSignup: false },
    previewItems: [
      { id: 'roadmap', title: 'Roadmap.sh', faviconUrl: 'https://www.google.com/s2/favicons?domain=roadmap.sh&sz=128', domain: 'roadmap.sh' },
      { id: 'desmos', title: 'Desmos Studio', faviconUrl: 'https://www.google.com/s2/favicons?domain=desmos.com&sz=128', domain: 'desmos.com' },
      { id: 'connectedpapers', title: 'Connected Papers', faviconUrl: 'https://www.google.com/s2/favicons?domain=connectedpapers.com&sz=128', domain: 'connectedpapers.com' },
      { id: 'wolfram', title: 'WolframAlpha', faviconUrl: 'https://www.google.com/s2/favicons?domain=wolframalpha.com&sz=128', domain: 'wolframalpha.com' },
      { id: 'pdf24', title: 'PDF24 Tools', faviconUrl: 'https://www.google.com/s2/favicons?domain=tools.pdf24.org&sz=128', domain: 'tools.pdf24.org' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'stack-open-source-privacy',
    slug: 'stack-open-source-privacy',
    title: 'Open-Source & Privacy Replacements for Big Tech',
    description: 'Fast, transparent, open-source websites that respect your privacy and replace bloated commercial software.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'Open Source & Privacy',
    tags: ['100% Free', 'Open Source', 'Zero Ads', 'No Signup'],
    itemsCount: 6,
    upvoteCount: 124,
    saveCount: 98,
    forkCount: 19,
    badges: { isFullyFree: true, isAdFree: true, isNoSignup: true },
    previewItems: [
      { id: 'cyberchef', title: 'CyberChef', faviconUrl: 'https://www.google.com/s2/favicons?domain=gchq.github.io&sz=128', domain: 'gchq.github.io' },
      { id: 'omnitools', title: 'OmniTools', faviconUrl: 'https://www.google.com/s2/favicons?domain=omnitools.app&sz=128', domain: 'omnitools.app' },
      { id: 'ittools', title: 'IT-Tools', faviconUrl: 'https://www.google.com/s2/favicons?domain=it-tools.tech&sz=128', domain: 'it-tools.tech' },
      { id: 'penpot', title: 'Penpot', faviconUrl: 'https://www.google.com/s2/favicons?domain=penpot.app&sz=128', domain: 'penpot.app' },
      { id: 'hoppscotch', title: 'Hoppscotch', faviconUrl: 'https://www.google.com/s2/favicons?domain=hoppscotch.io&sz=128', domain: 'hoppscotch.io' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'stack-mindblowing-3d-webgl',
    slug: 'stack-mindblowing-3d-webgl',
    title: 'Mind-Blowing 3D, WebGL & Interactive Experiences',
    description: 'Websites that push browsers to their absolute graphical limits—3D worlds, physics sandboxes, and interactive art.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'Interactive & 3D',
    tags: ['100% Free', 'Zero Ads', 'No Signup', 'Easy to Use'],
    itemsCount: 6,
    upvoteCount: 312,
    saveCount: 245,
    forkCount: 56,
    badges: { isFullyFree: true, isAdFree: true, isNoSignup: true },
    previewItems: [
      { id: 'brunosimon', title: 'Bruno Simon', faviconUrl: 'https://www.google.com/s2/favicons?domain=bruno-simon.com&sz=128', domain: 'bruno-simon.com' },
      { id: 'spline', title: 'Spline', faviconUrl: 'https://www.google.com/s2/favicons?domain=spline.design&sz=128', domain: 'spline.design' },
      { id: 'nealfun', title: 'Neal.fun', faviconUrl: 'https://www.google.com/s2/favicons?domain=neal.fun&sz=128', domain: 'neal.fun' },
      { id: 'radiogarden', title: 'Radio Garden', faviconUrl: 'https://www.google.com/s2/favicons?domain=radio.garden&sz=128', domain: 'radio.garden' },
      { id: 'earth', title: 'Earth Nullschool', faviconUrl: 'https://www.google.com/s2/favicons?domain=earth.nullschool.net&sz=128', domain: 'earth.nullschool.net' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'stack-startup-growth-seo',
    slug: 'stack-startup-growth-seo',
    title: 'Startup Growth, SEO & Copywriting Weapons',
    description: 'Validate startup ideas, audit website speed, preview social OpenGraph cards, and sharpen landing page copy for $0.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'Marketing & Startups',
    tags: ['100% Free', 'Easy to Use', 'Zero Ads', 'No Signup'],
    itemsCount: 6,
    upvoteCount: 142,
    saveCount: 96,
    forkCount: 22,
    badges: { isFullyFree: true, isAdFree: true, isNoSignup: true },
    previewItems: [
      { id: 'pagespeed', title: 'PageSpeed Insights', faviconUrl: 'https://www.google.com/s2/favicons?domain=pagespeed.web.dev&sz=128', domain: 'pagespeed.web.dev' },
      { id: 'metatags', title: 'MetaTags.io', faviconUrl: 'https://www.google.com/s2/favicons?domain=metatags.io&sz=128', domain: 'metatags.io' },
      { id: 'hemingway', title: 'Hemingway Editor', faviconUrl: 'https://www.google.com/s2/favicons?domain=hemingwayapp.com&sz=128', domain: 'hemingwayapp.com' },
      { id: 'marketingexamples', title: 'Marketing Examples', faviconUrl: 'https://www.google.com/s2/favicons?domain=marketingexamples.com&sz=128', domain: 'marketingexamples.com' },
      { id: 'builtwith', title: 'BuiltWith', faviconUrl: 'https://www.google.com/s2/favicons?domain=builtwith.com&sz=128', domain: 'builtwith.com' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

export const SEED_STACK_ITEMS: Record<string, StackItemDocument[]> = {
  'stack-illegal-free-utilities': [
    { id: 'pairdrop', stackId: 'stack-illegal-free-utilities', websiteUrl: 'https://pairdrop.net', normalizedDomain: 'pairdrop.net', title: 'PairDrop', description: 'Local file sharing in your browser.', curatorNote: 'AirDrop for literally any device (Windows, Mac, iOS, Android) right inside your browser with zero setup.', faviconUrl: 'https://www.google.com/s2/favicons?domain=pairdrop.net&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 0, addedAt: Timestamp.now() },
    { id: 'squoosh', stackId: 'stack-illegal-free-utilities', websiteUrl: 'https://squoosh.app', normalizedDomain: 'squoosh.app', title: 'Squoosh', description: 'Image compression by Google Chrome Labs.', curatorNote: "Google Chrome Labs' ultra-fast local image compressor. Shrinks PNG/WebP files by 80% without uploading data.", faviconUrl: 'https://www.google.com/s2/favicons?domain=squoosh.app&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 1, addedAt: Timestamp.now() },
    { id: 'cobalt', stackId: 'stack-illegal-free-utilities', websiteUrl: 'https://cobalt.tools', normalizedDomain: 'cobalt.tools', title: 'Cobalt Tools', description: 'The cleanest media downloader.', curatorNote: 'The cleanest media downloader on the internet. Paste any video/audio link and save it instantly.', faviconUrl: 'https://www.google.com/s2/favicons?domain=cobalt.tools&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 2, addedAt: Timestamp.now() },
    { id: 'excalidraw', stackId: 'stack-illegal-free-utilities', websiteUrl: 'https://excalidraw.com', normalizedDomain: 'excalidraw.com', title: 'Excalidraw', description: 'Hand-drawn architecture sketching.', curatorNote: 'Open the tab and start sketching hand-drawn architecture diagrams immediately—no account needed.', faviconUrl: 'https://www.google.com/s2/favicons?domain=excalidraw.com&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 3, addedAt: Timestamp.now() },
    { id: 'archive', stackId: 'stack-illegal-free-utilities', websiteUrl: 'https://archive.ph', normalizedDomain: 'archive.ph', title: 'Archive.ph', description: 'Web page archival and preservation.', curatorNote: 'Web page snapshot and archival tool to read and preserve clean versions of articles forever.', faviconUrl: 'https://www.google.com/s2/favicons?domain=archive.ph&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 4, addedAt: Timestamp.now() },
    { id: 'wormhole', stackId: 'stack-illegal-free-utilities', websiteUrl: 'https://wormhole.app', normalizedDomain: 'wormhole.app', title: 'Wormhole', description: 'End-to-end encrypted file sharing.', curatorNote: 'Send files up to 10GB with end-to-end encryption and self-destructing links without an account.', faviconUrl: 'https://www.google.com/s2/favicons?domain=wormhole.app&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 5, addedAt: Timestamp.now() }
  ],
  'stack-vibe-coding-indie': [
    { id: 'v0', stackId: 'stack-vibe-coding-indie', websiteUrl: 'https://v0.dev', normalizedDomain: 'v0.dev', title: 'v0 by Vercel', description: 'Generative UI with React and Tailwind.', curatorNote: 'Describe any UI in plain English and get production-ready React + Tailwind + Shadcn code in seconds.', faviconUrl: 'https://www.google.com/s2/favicons?domain=v0.dev&sz=128', isFree: true, hasAds: false, requiresLogin: true, orderIndex: 0, addedAt: Timestamp.now() },
    { id: 'bolt', stackId: 'stack-vibe-coding-indie', websiteUrl: 'https://bolt.new', normalizedDomain: 'bolt.new', title: 'Bolt.new', description: 'Full-stack AI builder in browser.', curatorNote: 'Prompt, run, edit, and deploy full-stack web applications right inside a browser WebContainer.', faviconUrl: 'https://www.google.com/s2/favicons?domain=bolt.new&sz=128', isFree: true, hasAds: false, requiresLogin: true, orderIndex: 1, addedAt: Timestamp.now() },
    { id: 'supabase', stackId: 'stack-vibe-coding-indie', websiteUrl: 'https://supabase.com', normalizedDomain: 'supabase.com', title: 'Supabase', description: 'Open-source Firebase alternative.', curatorNote: 'The open-source Firebase alternative with instant Postgres database, Auth, and Edge Functions.', faviconUrl: 'https://www.google.com/s2/favicons?domain=supabase.com&sz=128', isFree: true, hasAds: false, requiresLogin: true, orderIndex: 2, addedAt: Timestamp.now() },
    { id: 'shadcn', stackId: 'stack-vibe-coding-indie', websiteUrl: 'https://ui.shadcn.com', normalizedDomain: 'ui.shadcn.com', title: 'Shadcn UI', description: 'Accessible React component primitives.', curatorNote: 'Copy-paste accessible, minimalist React components that you actually own inside your codebase.', faviconUrl: 'https://www.google.com/s2/favicons?domain=ui.shadcn.com&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 3, addedAt: Timestamp.now() },
    { id: 'lucide', stackId: 'stack-vibe-coding-indie', websiteUrl: 'https://lucide.dev', normalizedDomain: 'lucide.dev', title: 'Lucide Icons', description: 'Minimalist SVG icon library.', curatorNote: 'Over 1,500 ultra-clean, consistent SVG icons you can copy as JSX or SVG with one click.', faviconUrl: 'https://www.google.com/s2/favicons?domain=lucide.dev&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 4, addedAt: Timestamp.now() },
    { id: 'coolors', stackId: 'stack-vibe-coding-indie', websiteUrl: 'https://coolors.co', normalizedDomain: 'coolors.co', title: 'Coolors', description: 'Super-fast color palette generator.', curatorNote: 'Hit the spacebar to generate cohesive color palettes and export Tailwind CSS hex tokens immediately.', faviconUrl: 'https://www.google.com/s2/favicons?domain=coolors.co&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 5, addedAt: Timestamp.now() }
  ],
  // Add other items Record keys for 3,4,5,6,7,8 following same pattern...
};
