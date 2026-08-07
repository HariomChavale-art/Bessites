'use server';
/**
 * @fileOverview This file defines a Genkit flow for intelligent category tagging by analyzing actual website content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntelligentCategoryTaggingInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to categorize.'),
});

const IntelligentCategoryTaggingOutputSchema = z.object({
  categories: z.array(z.string().min(1).max(50)).describe('A list of 3-5 relevant interest tags.'),
});

const intelligentCategoryTaggingPrompt = ai.definePrompt({
  name: 'intelligentCategoryTaggingPrompt',
  input: { 
    schema: IntelligentCategoryTaggingInputSchema.extend({
      extractedTitle: z.string().optional(),
      pageContent: z.string().optional(),
    })
  },
  output: { schema: IntelligentCategoryTaggingOutputSchema },
  prompt: `Analyze the following website and generate a list of 3-5 relevant Pinterest-style interest tags.
  
URL: {{{url}}}
Page Title: {{{extractedTitle}}}

WEBSITE CONTENT SNIPPET:
{{{pageContent}}}

The tags should represent the niche, technology, and purpose of the website. 
Focus on specific discovery categories like "AI Productivity", "Minimalist Design", "Open Source Tools", etc.
Please output the categories in a JSON array format matching the requested schema.`,
});

const intelligentCategoryTaggingFlow = ai.defineFlow(
  {
    name: 'intelligentCategoryTaggingFlow',
    inputSchema: IntelligentCategoryTaggingInputSchema,
    outputSchema: IntelligentCategoryTaggingOutputSchema,
  },
  async (input) => {
    console.log(`[AI Tagging] Starting tag analysis for: ${input.url}`);
    let pageContent = '';
    let extractedTitle = '';

    try {
      console.log(`[AI Tagging] Fetching page content...`);
      const response = await fetch(input.url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36' 
        }
      });
      
      if (response.ok) {
        const html = await response.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        extractedTitle = titleMatch ? titleMatch[1].trim() : '';

        pageContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .substring(0, 4000);
        console.log(`[AI Tagging] Content fetched. Parsing ${pageContent.length} chars.`);
      } else {
        console.warn(`[AI Tagging] Fetch returned non-OK status: ${response.status}`);
      }
    } catch (e: any) {
      console.warn(`[AI Tagging] Scraper fetch failed: ${e.message}`);
    }

    try {
      console.log(`[AI Tagging] Invoking LLM for tags...`);
      const { output } = await intelligentCategoryTaggingPrompt({
        ...input,
        extractedTitle,
        pageContent
      });

      if (!output || !output.categories) {
        throw new Error("Invalid LLM response format");
      }

      console.log(`[AI Tagging] LLM generated tags: ${output.categories.join(', ')}`);
      return output;
    } catch (error: any) {
      console.error("[AI Tagging] Prompt call failed:", error);
      throw error;
    }
  }
);

export async function intelligentCategoryTagging(input: { url: string }) {
  try {
    return await intelligentCategoryTaggingFlow(input);
  } catch (error) {
    console.error("[AI Tagging] Exported wrapper caught error:", error);
    return { categories: ["Web App", "Tools", "General"] };
  }
}
