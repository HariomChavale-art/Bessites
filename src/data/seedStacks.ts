
import { StackDocument, StackItemDocument } from '@/types/stacks';
import { Timestamp } from 'firebase/firestore';

/**
 * @fileOverview Founding Stacks for Bessites.
 * 11 Bundles / 66+ Websites.
 * Updated to include specific entrepreneurial and creator bundles.
 */

const creator = {
  username: 'bessites',
  displayName: 'Bessites Editorial',
  avatarUrl: 'https://i.imgur.com/3STBHNy.png',
  founderNumber: 1
};

export const DEFAULT_SEED_STACKS: StackDocument[] = [
  {
    id: 'stack-intl-dropshipping-paid',
    slug: 'intl-dropshipping-paid',
    title: 'International Dropshipping Bundle (Paid)',
    description: 'A professional setup for launching an automated global e-commerce store with high-velocity scaling tools.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'E-Commerce',
    tags: ['Paid', 'Scale', 'Automation'],
    itemsCount: 6,
    upvoteCount: 85,
    saveCount: 42,
    forkCount: 5,
    badges: { isFullyFree: false, isAdFree: true, isNoSignup: false },
    previewItems: [
      { id: 'shopify', title: 'Shopify', faviconUrl: 'https://www.google.com/s2/favicons?domain=shopify.com&sz=128', domain: 'shopify.com' },
      { id: 'aliexpress', title: 'AliExpress', faviconUrl: 'https://www.google.com/s2/favicons?domain=aliexpress.com&sz=128', domain: 'aliexpress.com' },
      { id: 'dsers', title: 'DSers', faviconUrl: 'https://www.google.com/s2/favicons?domain=dsers.com&sz=128', domain: 'dsers.com' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'stack-india-dropshipping-freetostart',
    slug: 'india-dropshipping-freetostart',
    title: 'India Dropshipping Bundle (Free to start)',
    description: 'The lean startup configuration for Indian entrepreneurs focusing on local sourcing and logistics.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'E-Commerce',
    tags: ['Free to start', 'India', 'Lean'],
    itemsCount: 6,
    upvoteCount: 112,
    saveCount: 67,
    forkCount: 14,
    badges: { isFullyFree: false, isAdFree: true, isNoSignup: false },
    previewItems: [
      { id: 'shopify-in', title: 'Shopify India', faviconUrl: 'https://www.google.com/s2/favicons?domain=shopify.com&sz=128', domain: 'shopify.com/in' },
      { id: 'roposo', title: 'Roposo Clout', faviconUrl: 'https://www.google.com/s2/favicons?domain=roposoclout.com&sz=128', domain: 'roposoclout.com' },
      { id: 'razorpay', title: 'Razorpay', faviconUrl: 'https://www.google.com/s2/favicons?domain=razorpay.com&sz=128', domain: 'razorpay.com' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'stack-gta6-creator-freetostart',
    slug: 'gta6-creator-freetostart',
    title: 'GTA 6 Creator Bundle (Free to start)',
    description: 'Tools for high-fidelity gaming content creation, from live streaming to cinematic video editing.',
    creatorId: 'system',
    creatorSnapshot: creator,
    isPublic: true,
    isStaffPick: true,
    category: 'Gaming & Content',
    tags: ['Free to start', 'Gaming', 'Creative'],
    itemsCount: 6,
    upvoteCount: 245,
    saveCount: 189,
    forkCount: 32,
    badges: { isFullyFree: false, isAdFree: true, isNoSignup: true },
    previewItems: [
      { id: 'obs', title: 'OBS Studio', faviconUrl: 'https://www.google.com/s2/favicons?domain=obsproject.com&sz=128', domain: 'obsproject.com' },
      { id: 'davinci', title: 'DaVinci Resolve', faviconUrl: 'https://www.google.com/s2/favicons?domain=blackmagicdesign.com&sz=128', domain: 'blackmagicdesign.com' },
      { id: 'discord', title: 'Discord', faviconUrl: 'https://www.google.com/s2/favicons?domain=discord.com&sz=128', domain: 'discord.com' }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
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
  'stack-intl-dropshipping-paid': [
    { id: 'shopify', stackId: 'stack-intl-dropshipping-paid', websiteUrl: 'https://www.shopify.com', normalizedDomain: 'shopify.com', title: 'Shopify', description: 'The industry-standard store platform.', curatorNote: 'Set up your storefront account on Shopify.', faviconUrl: 'https://www.google.com/s2/favicons?domain=shopify.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 0, addedAt: Timestamp.now() },
    { id: 'aliexpress', stackId: 'stack-intl-dropshipping-paid', websiteUrl: 'https://www.aliexpress.com', normalizedDomain: 'aliexpress.com', title: 'AliExpress', description: 'Global marketplace for product sourcing.', curatorNote: 'Research high-demand products on the AliExpress marketplace.', faviconUrl: 'https://www.google.com/s2/favicons?domain=aliexpress.com&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 1, addedAt: Timestamp.now() },
    { id: 'dsers', stackId: 'stack-intl-dropshipping-paid', websiteUrl: 'https://www.dsers.com', normalizedDomain: 'dsers.com', title: 'DSers', description: 'Official AliExpress dropshipping automation.', curatorNote: 'Connect DSers to sync products and automate order fulfillment.', faviconUrl: 'https://www.google.com/s2/favicons?domain=dsers.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 2, addedAt: Timestamp.now() },
    { id: 'canva', stackId: 'stack-intl-dropshipping-paid', websiteUrl: 'https://www.canva.com', normalizedDomain: 'canva.com', title: 'Canva', description: 'Professional design suite for ad creatives.', curatorNote: 'Use Canva to create professional social media ad creatives.', faviconUrl: 'https://www.google.com/s2/favicons?domain=canva.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 3, addedAt: Timestamp.now() },
    { id: 'stripe', stackId: 'stack-intl-dropshipping-paid', websiteUrl: 'https://www.stripe.com', normalizedDomain: 'stripe.com', title: 'Stripe', description: 'Financial infrastructure for e-commerce payments.', curatorNote: 'Enable Stripe in your settings to accept global credit cards.', faviconUrl: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 4, addedAt: Timestamp.now() },
    { id: 'meta-ads', stackId: 'stack-intl-dropshipping-paid', websiteUrl: 'https://adsmanager.facebook.com', normalizedDomain: 'facebook.com', title: 'Meta Ads Manager', description: 'Scale traffic via Facebook and Instagram.', curatorNote: 'Start a conversion campaign in Meta Ads Manager.', faviconUrl: 'https://www.google.com/s2/favicons?domain=facebook.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 5, addedAt: Timestamp.now() }
  ],
  'stack-india-dropshipping-freetostart': [
    { id: 'shopify-in', stackId: 'stack-india-dropshipping-freetostart', websiteUrl: 'https://www.shopify.com/in', normalizedDomain: 'shopify.com/in', title: 'Shopify India', description: 'Localized store platform for Indian merchants.', curatorNote: 'Open a local e-commerce store on Shopify India.', faviconUrl: 'https://www.google.com/s2/favicons?domain=shopify.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 0, addedAt: Timestamp.now() },
    { id: 'roposo', stackId: 'stack-india-dropshipping-freetostart', websiteUrl: 'https://www.roposoclout.com', normalizedDomain: 'roposoclout.com', title: 'Roposo Clout', description: 'India\'s leading product sourcing platform.', curatorNote: 'Link Roposo Clout to find and import products with local shipping.', faviconUrl: 'https://www.google.com/s2/favicons?domain=roposoclout.com&sz=128', isFree: true, hasAds: false, requiresLogin: true, orderIndex: 1, addedAt: Timestamp.now() },
    { id: 'canva-in', stackId: 'stack-india-dropshipping-freetostart', websiteUrl: 'https://www.canva.com', normalizedDomain: 'canva.com', title: 'Canva', description: 'Graphic design for banners and posts.', curatorNote: 'Design your brand identity and product banners using Canva.', faviconUrl: 'https://www.google.com/s2/favicons?domain=canva.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 2, addedAt: Timestamp.now() },
    { id: 'razorpay', stackId: 'stack-india-dropshipping-freetostart', websiteUrl: 'https://razorpay.com', normalizedDomain: 'razorpay.com', title: 'Razorpay', description: 'India\'s most popular payment gateway.', curatorNote: 'Integrate Razorpay to accept UPI and card payments from Indian customers.', faviconUrl: 'https://www.google.com/s2/favicons?domain=razorpay.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 3, addedAt: Timestamp.now() },
    { id: 'nimbuspost', stackId: 'stack-india-dropshipping-freetostart', websiteUrl: 'https://nimbuspost.com', normalizedDomain: 'nimbuspost.com', title: 'NimbusPost', description: 'Unified logistics and shipping management.', curatorNote: 'Sign up for NimbusPost to manage door-to-door courier logistics.', faviconUrl: 'https://www.google.com/s2/favicons?domain=nimbuspost.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 4, addedAt: Timestamp.now() },
    { id: 'whatsapp-biz', stackId: 'stack-india-dropshipping-freetostart', websiteUrl: 'https://www.whatsapp.com/business', normalizedDomain: 'whatsapp.com', title: 'WhatsApp Business', description: 'Customer support and order communication.', curatorNote: 'Utilize WhatsApp Business for order confirmation and support.', faviconUrl: 'https://www.google.com/s2/favicons?domain=whatsapp.com&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 5, addedAt: Timestamp.now() }
  ],
  'stack-gta6-creator-freetostart': [
    { id: 'rockstar-news', stackId: 'stack-gta6-creator-freetostart', websiteUrl: 'https://www.rockstargames.com/newswire', normalizedDomain: 'rockstargames.com', title: 'Rockstar Newswire', description: 'Official source for GTA 6 updates.', curatorNote: 'Monitor the Rockstar Newswire for official asset drops and release dates.', faviconUrl: 'https://www.google.com/s2/favicons?domain=rockstargames.com&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 0, addedAt: Timestamp.now() },
    { id: 'obs', stackId: 'stack-gta6-creator-freetostart', websiteUrl: 'https://obsproject.com', normalizedDomain: 'obsproject.com', title: 'OBS Studio', description: 'Open-source broadcasting software.', curatorNote: 'Set up OBS Studio for recording game footage and live commentary.', faviconUrl: 'https://www.google.com/s2/favicons?domain=obsproject.com&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 1, addedAt: Timestamp.now() },
    { id: 'davinci', stackId: 'stack-gta6-creator-freetostart', websiteUrl: 'https://www.blackmagicdesign.com/products/davinciresolve', normalizedDomain: 'blackmagicdesign.com', title: 'DaVinci Resolve', description: 'Professional-grade video editing.', curatorNote: 'Import your recordings into DaVinci Resolve for professional editing.', faviconUrl: 'https://www.google.com/s2/favicons?domain=blackmagicdesign.com&sz=128', isFree: true, hasAds: false, requiresLogin: false, orderIndex: 2, addedAt: Timestamp.now() },
    { id: 'canva-gta', stackId: 'stack-gta6-creator-freetostart', websiteUrl: 'https://www.canva.com', normalizedDomain: 'canva.com', title: 'Canva', description: 'Creative suite for video thumbnails.', curatorNote: 'Build eye-catching video thumbnails with Canva design tools.', faviconUrl: 'https://www.google.com/s2/favicons?domain=canva.com&sz=128', isFree: false, hasAds: false, requiresLogin: true, orderIndex: 3, addedAt: Timestamp.now() },
    { id: 'yt-studio', stackId: 'stack-gta6-creator-freetostart', websiteUrl: 'https://studio.youtube.com', normalizedDomain: 'youtube.com', title: 'YouTube Studio', description: 'Channel management and analytics.', curatorNote: 'Manage your channel and check audience insights in YouTube Studio.', faviconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128', isFree: true, hasAds: false, requiresLogin: true, orderIndex: 4, addedAt: Timestamp.now() },
    { id: 'discord-gta', stackId: 'stack-gta6-creator-freetostart', websiteUrl: 'https://discord.com', normalizedDomain: 'discord.com', title: 'Discord', description: 'Chat and community platform.', curatorNote: 'Set up a Discord server to host your community discussions.', faviconUrl: 'https://www.google.com/s2/favicons?domain=discord.com&sz=128', isFree: true, hasAds: false, requiresLogin: true, orderIndex: 5, addedAt: Timestamp.now() }
  ],
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
};
