import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bessites.store'
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/guide`, lastModified: new Date() },
    { url: `${baseUrl}/explore`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date() },
  ]
}