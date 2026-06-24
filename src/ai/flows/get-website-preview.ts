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
    
    // Default fallback values using stable third-party services
    const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(input.url)}?w=1200`;
    const defaultLogoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

    try {
      // Create a timeout controller to prevent hanging on slow websites
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(input.url, { 
        signal: controller.signal,
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const html = await response.text();
      
      // Look for og:image
      let imageUrl = '';
      const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      
      if (ogMatch && ogMatch[1]) {
        imageUrl = ogMatch[1];
        if (imageUrl.startsWith('/')) imageUrl = `${urlObj.origin}${imageUrl}`;
      } else {
        imageUrl = screenshotUrl;
      }

      // Look for Logo
      let logoUrl = '';
      const iconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i) ||
                        html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i);

      if (iconMatch && iconMatch[1]) {
        logoUrl = iconMatch[1];
        if (logoUrl.startsWith('/')) logoUrl = `${urlObj.origin}${logoUrl}`;
        if (logoUrl.startsWith('//')) logoUrl = `https:${logoUrl}`;
      } else {
        logoUrl = defaultLogoUrl;
      }

      return { 
        imageUrl: imageUrl || screenshotUrl, 
        logoUrl: logoUrl || defaultLogoUrl,
        source: ogMatch ? 'og' : 'screenshot' 
      };

    } catch (error) {
      // Graceful fallback on any network error
      return { 
        imageUrl: screenshotUrl, 
        logoUrl: defaultLogoUrl,
        source: 'screenshot' 
      };
    }
  }
);