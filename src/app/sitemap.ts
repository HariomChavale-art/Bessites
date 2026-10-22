import { MetadataRoute } from 'next'

/**
 * @fileOverview Dynamic Sitemap Generator for Bessites.store.
 * Indexes all public discovery hubs for high-fidelity search engine visibility.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bessites.store'
  const now = new Date()

  const mainPages = [
    '',
    '/explore',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/faq',
    '/how-it-works',
    '/disclaimer',
    '/methodology',
    '/trends',
    '/toolkit',
    '/glossary',
    '/benchmarks',
    '/guide'
  ]

  const guides = [
    'how-to-submit-website-to-bessites',
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
    'how-to-submit-website'
  ]

  const mainUrls = mainPages.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.9
  }))

  const guideUrls = guides.map(slug => ({
    url: `${baseUrl}/guide/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  return [...mainUrls, ...guideUrls]
}
