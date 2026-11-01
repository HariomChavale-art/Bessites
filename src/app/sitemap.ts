import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://bessites.com',
      lastModified: new Date(),
    },
  ]
}