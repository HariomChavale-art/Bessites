import { MetadataRoute } from 'next'

/**
 * Dynamic Sitemap Generator for Bessites.store
 * Includes all 20 User Manual nodes, Blog articles, and Main Public routes.
 * This file is essential for AdSense approval and Absolute Discovery.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bessites.store'

  // 1. The 20 User Manual / Help Center Slugs
  const guideSlugs = [
    'how-to-submit-website',
    'how-to-get-free-traffic',
    'how-to-submit-to-google',
    'how-to-make-website-faster',
    'how-to-get-first-100-visitors',
    'how-to-write-seo-title',
    'how-to-share-website-on-pinterest',
    'how-to-use-bessites',
    'how-to-get-backlinks-free',
    'how-to-promote-on-reddit',
    'how-to-find-new-websites',
    'how-to-increase-website-ranking',
    'how-to-create-sitemap',
    'how-to-use-search-console',
    'how-to-make-website-mobile-friendly',
    'best-tools-for-new-websites',
    'how-to-grow-from-zero',
    'how-to-get-website-discovered',
    'common-mistakes-new-websites',
    'how-to-track-website-traffic',
  ]

  // 2. Published Blog Article Slugs
  const blogSlugs = [
    'free-traffic-for-new-website',
    'submit-website-to-google'
  ]

  // 3. Main Public Routes
  const mainRoutes = [
    '',
    '/explore',
    '/blog',
    '/guide',
    '/about',
    '/contact',
    '/privacy-policy',
    '/disclaimer',
    '/faq',
    '/how-it-works',
    '/terms'
  ]

  const guides = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guide/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const blogs = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const routes = mainRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' || route === '/explore') ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1.0 : 0.9,
  }))

  return [...routes, ...blogs, ...guides]
}
