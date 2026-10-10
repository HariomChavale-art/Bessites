import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bessites.store'
  
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
  ]

  const guideUrls = guides.map((slug) => ({
    url: `${baseUrl}/guide/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...guideUrls,
  ]
}
