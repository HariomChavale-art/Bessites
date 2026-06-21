
'use server';
/**
 * @fileOverview A Genkit flow to retrieve website preview images and logos.
 *
 * - getWebsitePreview - Fetches og:image, icons, or generates a screenshot URL.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetWebsitePreviewInputSchema = z.object({
  url: z.string().url(),
});

const GetWebsitePreviewOutputSchema = z.object({
  imageUrl: z.string(),
  logoUrl: z.string(),
  source: z.enum(['og', 'screenshot']),
});

export async function getWebsitePreview(input: { url: string }) {
  return getWebsitePreviewFlow(input);
}

const getWebsitePreviewFlow = ai.defineFlow(
  {
    name: 'getWebsitePreviewFlow',
    inputSchema: GetWebsitePreviewInputSchema,
    outputSchema: GetWebsitePreviewOutputSchema,
  },
  async (input) => {
    const urlObj = new URL(input.url);
    const domain = urlObj.hostname;
    
    // Default logo using Google's high-res favicon service
    const defaultLogoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    try {
      const response = await fetch(input.url, { 
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
      });
      
      if (!response.ok) throw new Error('Fetch failed');
      
      const html = await response.text();
      
      // 1. Look for og:image (Big preview)
      let imageUrl = '';
      const ogMatch = /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i.exec(html) ||
                      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i.exec(html);
      
      if (ogMatch && ogMatch[1]) {
        imageUrl = ogMatch[1];
        if (imageUrl.startsWith('/')) {
          imageUrl = `${urlObj.origin}${imageUrl}`;
        }
      } else {
        // Fallback to screenshot
        imageUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(input.url)}?w=1200`;
      }

      // 2. Look for Logo (Apple touch icon is usually best quality)
      let logoUrl = defaultLogoUrl;
      const appleIconMatch = /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["'][^>]*>/i.exec(html);
      const shortcutIconMatch = /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i.exec(html);
      
      const foundIcon = (appleIconMatch && appleIconMatch[1]) || (shortcutIconMatch && shortcutIconMatch[1]);
      
      if (foundIcon) {
        logoUrl = foundIcon;
        if (logoUrl.startsWith('/')) {
          logoUrl = `${urlObj.origin}${logoUrl}`;
        } else if (!logoUrl.startsWith('http')) {
          logoUrl = `${urlObj.origin}/${logoUrl}`;
        }
      }

      return { 
        imageUrl, 
        logoUrl,
        source: ogMatch ? 'og' : 'screenshot' 
      };

    } catch (error) {
      console.error('Error fetching preview metadata:', error);
      return { 
        imageUrl: `https://s0.wp.com/mshots/v1/${encodeURIComponent(input.url)}?w=1200`, 
        logoUrl: defaultLogoUrl,
        source: 'screenshot' 
      };
    }
  }
);
