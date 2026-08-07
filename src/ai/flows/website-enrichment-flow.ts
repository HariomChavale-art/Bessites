'use server';
/**
 * @fileOverview Genkit flow to generate professional metadata by analyzing the actual website content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EnrichmentInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to analyze.'),
  mode: z.enum(['title', 'description', 'full']).describe('Whether to generate a title, description, or both.'),
});

const EnrichmentOutputSchema = z.object({
  title: z.string().optional().describe('A professional, SEO-friendly name for the website.'),
  description: z.string().optional().describe('A short, attractive description explaining the value proposition.'),
});

export async function enrichWebsiteMetadata(input: { url: string, mode: 'title' | 'description' | 'full' }) {
  return enrichWebsiteMetadataFlow(input);
}

const enrichmentPrompt = ai.definePrompt({
  name: 'enrichmentPrompt',
  input: { 
    schema: EnrichmentInputSchema.extend({
      extractedTitle: z.string().optional(),
      extractedMetaDesc: z.string().optional(),
      pageContent: z.string().optional(),
    })
  },
  output: { schema: EnrichmentOutputSchema },
  prompt: `You are an expert digital curator and SEO specialist for Bessites, a premium web directory.
  
Your mission is to analyze the provided website data and generate high-quality metadata.

ANALYSIS DATA:
URL: {{{url}}}
Page Title Tag: {{{extractedTitle}}}
Meta Description: {{{extractedMetaDesc}}}
Page Snippet: 
{{{pageContent}}}

TASK:
{{#if (eq mode 'title')}}
Generate a professional, concise, and catchy name for this digital property. It should be SEO-friendly and represent the brand accurately.
{{/if}}
{{#if (eq mode 'description')}}
Generate a short (2-3 sentences), attractive, and SEO-friendly description that explains what the website does and why users should visit it. Use an encouraging, "tech-noir" professional tone.
{{/if}}
{{#if (eq mode 'full')}}
Generate both a professional title and a compelling description.
{{/if}}

Ensure the output is based ONLY on the provided website data. Do not invent details.`,
});

const enrichWebsiteMetadataFlow = ai.defineFlow(
  {
    name: 'enrichWebsiteMetadataFlow',
    inputSchema: EnrichmentInputSchema,
    outputSchema: EnrichmentOutputSchema,
  },
  async (input) => {
    let extractedTitle = '';
    let extractedMetaDesc = '';
    let pageContent = '';

    try {
      const response = await fetch(input.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const html = await response.text();

      // Simple extraction
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      extractedTitle = titleMatch ? titleMatch[1].trim() : '';

      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      extractedMetaDesc = descMatch ? descMatch[1].trim() : '';

      // Get some visible text
      pageContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 3000);
    } catch (e) {
      console.warn("Analysis fetch failed, falling back to URL-only analysis.");
    }

    const { output } = await enrichmentPrompt({
      ...input,
      extractedTitle,
      extractedMetaDesc,
      pageContent
    });

    return output!;
  }
);
