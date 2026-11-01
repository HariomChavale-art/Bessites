import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bessites.store'
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
  ]
}
