
'use server';
/**
 * @fileOverview A Genkit flow to retrieve website preview images.
 *
 * - getWebsitePreview - Fetches og:image or generates a screenshot URL.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetWebsitePreviewInputSchema = z.object({
  url: z.string().url(),
});

const GetWebsitePreviewOutputSchema = z.object({
  imageUrl: z.string(),
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
    try {
      const response = await fetch(input.url, { next: { revalidate: 3600 } });
      if (!response.ok) throw new Error('Fetch failed');
      
      const html = await response.text();
      
      // Look for og:image
      const ogMatch = /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i.exec(html) ||
                      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i.exec(html);
      
      if (ogMatch && ogMatch[1]) {
        let imageUrl = ogMatch[1];
        // Handle relative URLs
        if (imageUrl.startsWith('/')) {
          const urlObj = new URL(input.url);
          imageUrl = `${urlObj.origin}${imageUrl}`;
        }
        return { imageUrl, source: 'og' };
      }

      // Fallback to screenshot service if no OG image
      // Using WordPress mshots as a reliable free service
      const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(input.url)}?w=1200`;
      return { imageUrl: screenshotUrl, source: 'screenshot' };

    } catch (error) {
      console.error('Error fetching preview:', error);
      // Absolute fallback
      return { 
        imageUrl: `https://s0.wp.com/mshots/v1/${encodeURIComponent(input.url)}?w=1200`, 
        source: 'screenshot' 
      };
    }
  }
);
