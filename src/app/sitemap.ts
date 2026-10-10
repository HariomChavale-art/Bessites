import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bessites.store'
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/guide`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-submit-website-to-bessites`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-get-free-traffic`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-submit-to-google`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-make-website-faster`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-get-first-100-visitors`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-write-seo-title`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-share-website-on-pinterest`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-use-bessites`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-get-backlinks-free`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-promote-on-reddit`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-find-new-websites`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-increase-website-ranking`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-create-sitemap`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-use-search-console`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-make-website-mobile-friendly`, lastModified: new Date() },
    { url: `${baseUrl}/guide/best-tools-for-new-websites`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-grow-from-zero`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-get-website-discovered`, lastModified: new Date() },
    { url: `${baseUrl}/guide/common-mistakes-new-websites`, lastModified: new Date() },
    { url: `${baseUrl}/guide/how-to-track-website-traffic`, lastModified: new Date() },
  ]
    }
