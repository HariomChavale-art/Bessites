'use server';
/**
 * @fileOverview A flow to verify if a website is online and reachable.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifyWebsiteInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to verify.'),
});

const VerifyWebsiteOutputSchema = z.object({
  reachable: z.boolean().describe('Whether the website is reachable.'),
  status: z.number().optional().describe('The HTTP status code.'),
  error: z.string().optional().describe('The error message if unreachable.'),
});

export async function verifyWebsite(input: { url: string }) {
  return verifyWebsiteFlow(input);
}

const verifyWebsiteFlow = ai.defineFlow(
  {
    name: 'verifyWebsiteFlow',
    inputSchema: VerifyWebsiteInputSchema,
    outputSchema: VerifyWebsiteOutputSchema,
  },
  async (input) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(input.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        }
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        return { reachable: true, status: response.status };
      } else {
        return { reachable: false, status: response.status, error: `HTTP ${response.status}` };
      }
    } catch (error: any) {
      return { reachable: false, error: error.message || 'Connection timeout' };
    }
  }
);
