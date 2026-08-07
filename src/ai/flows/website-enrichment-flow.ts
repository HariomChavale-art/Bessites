'use server';
/**
 * @fileOverview Genkit flow to generate professional metadata by analyzing the actual website content.
 * 
 * - enrichWebsiteMetadata: Generates catchy names and descriptions based on scraped content.
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
      isTitleMode: z.boolean().optional(),
      isDescriptionMode: z.boolean().optional(),
      isFullMode: z.boolean().optional(),
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
{{#if isTitleMode}}
Generate a professional, concise, and catchy name for this digital property. It should be SEO-friendly and represent the brand accurately.
{{/if}}
{{#if isDescriptionMode}}
Generate a short (2-3 sentences), attractive, and SEO-friendly description that explains what the website does and why users should visit it. Use an encouraging, "tech-noir" professional tone.
{{/if}}
{{#if isFullMode}}
Generate both a professional title and a compelling description.
{{/if}}

Ensure the output is based ONLY on the provided website data. Do not invent details. Provide response in JSON format matching the requested schema.`,
});

const enrichWebsiteMetadataFlow = ai.defineFlow(
  {
    name: 'enrichWebsiteMetadataFlow',
    inputSchema: EnrichmentInputSchema,
    outputSchema: EnrichmentOutputSchema,
  },
  async (input) => {
    console.log(`[AI Analysis] Starting enrichment flow for: ${input.url} (Mode: ${input.mode})`);
    
    let extractedTitle = '';
    let extractedMetaDesc = '';
    let pageContent = '';

    try {
      console.log(`[AI Analysis] Fetching HTML content...`);
      const response = await fetch(input.url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        }
      });
      
      if (!response.ok) {
        console.error(`[AI Analysis] Fetch failed with status: ${response.status}`);
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const html = await response.text();
      console.log(`[AI Analysis] HTML fetched successfully (${html.length} chars). Parsing metadata...`);

      // Improved extraction
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      extractedTitle = titleMatch ? titleMatch[1].trim() : '';

      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i) ||
                        html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      extractedMetaDesc = descMatch ? descMatch[1].trim() : '';

      // Get clean visible text
      pageContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 4000); // Increased limit for better context
        
      console.log(`[AI Analysis] Metadata extracted. Title: "${extractedTitle}", Snippet length: ${pageContent.length}`);
    } catch (e: any) {
      console.warn(`[AI Analysis] Scraper encountered an issue: ${e.message}. Falling back to URL analysis.`);
    }

    try {
      console.log(`[AI Analysis] Sending request to Genkit LLM...`);
      const { output } = await enrichmentPrompt({
        ...input,
        extractedTitle,
        extractedMetaDesc,
        pageContent,
        isTitleMode: input.mode === 'title',
        isDescriptionMode: input.mode === 'description',
        isFullMode: input.mode === 'full',
      });
      
      if (!output) {
        console.error(`[AI Analysis] LLM returned empty output.`);
        throw new Error("LLM output is undefined");
      }

      console.log(`[AI Analysis] LLM generation successful.`);
      return output;
    } catch (llmError: any) {
      console.error(`[AI Analysis] LLM execution failed:`, llmError);
      throw new Error(`AI Generation Failed: ${llmError.message}`);
    }
  }
);
