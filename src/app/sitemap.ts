export default function sitemap() {
  const baseUrl = 'https://www.bessites.store';
  const now = new Date();

  const guides = [
    'how-to-submit-website',
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
  ];

  const publicPages = [
    'about',
    'contact',
    'privacy-policy',
    'terms',
    'faq',
    'how-it-works',
    'explore'
  ];

  const guideUrls = guides.map((slug) => ({
    url: `${baseUrl}/guide/${slug}`,
    lastModified: now,
  }));

  const infoUrls = publicPages.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
  }));

  return [
    { url: baseUrl, lastModified: now },
    { url: `${baseUrl}/guide`, lastModified: now },
    ...infoUrls,
    ...guideUrls,
  ];
}
