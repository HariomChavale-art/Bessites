'use server';
/**
 * @fileOverview This file defines a Genkit flow for intelligent category tagging of websites.
 *
 * - intelligentCategoryTagging - A function that analyzes a submitted website's content
 *                                and categorizes it into relevant Pinterest-style interest tags.
 * - IntelligentCategoryTaggingInput - The input type for the intelligentCategoryTagging function.
 * - IntelligentCategoryTaggingOutput - The return type for the intelligentCategoryTagging function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntelligentCategoryTaggingInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to categorize.'),
});
export type IntelligentCategoryTaggingInput = z.infer<typeof IntelligentCategoryTaggingInputSchema>;

const IntelligentCategoryTaggingOutputSchema = z.object({
  categories: z.array(z.string().min(1).max(50)).describe('A list of relevant Pinterest-style interest tags for the website. Each tag should be concise, 1-3 words, and clearly describe a core interest or topic related to the website.'),
});
export type IntelligentCategoryTaggingOutput = z.infer<typeof IntelligentCategoryTaggingOutputSchema>;

// Helper function to fetch and extract content from a URL
async function fetchAndExtractContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch URL ${url}: ${response.statusText}`);
      return null;
    }
    const html = await response.text();

    // Basic extraction of title and body text.
    // This is a simplified approach; a more robust solution might use a library like 'cheerio'.
    let extractedContent = '';

    // Extract title
    const titleMatch = /<title>(.*?)<\/title>/i.exec(html);
    if (titleMatch && titleMatch[1]) {
      extractedContent += `Title: ${titleMatch[1].trim()}\n`;
    }

    // Extract body text (limited to avoid too much content)
    const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
    if (bodyMatch && bodyMatch[1]) {
      const bodyText = bodyMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')   // Remove style tags
        .replace(/<[^>]*>/g, '')                           // Remove all other HTML tags
        .replace(/\s+/g, ' ')                              // Replace multiple spaces with single space
        .trim();
      extractedContent += `Content Snippet: ${bodyText.substring(0, 2000)}...`; // Limit to first 2000 chars
    }

    if (!extractedContent) {
        console.warn(`No significant content extracted from ${url}`);
        return null;
    }

    return extractedContent;
  } catch (error) {
    console.error(`Error fetching or parsing URL ${url}:`, error);
    return null;
  }
}

const intelligentCategoryTaggingPrompt = ai.definePrompt({
  name: 'intelligentCategoryTaggingPrompt',
  input: {
    schema: z.object({
      url: z.string(),
      content: z.string().nullable().describe('Extracted content (title and a snippet of body text) from the website.'),
    }),
  },
  output: { schema: IntelligentCategoryTaggingOutputSchema },
  prompt: `Analyze the following website URL and its provided content to generate a list of relevant Pinterest-style interest tags. Each tag should be concise, 1-3 words, and clearly describe a core interest or topic related to the website. Provide at least 3, but no more than 10 unique tags. Ensure the tags are diverse and cover the main themes of the website. If the content is null or very minimal, try to infer categories from the URL and general knowledge.\n\nURL: {{{url}}}\n{{#if content}}\nExtracted Content:\n{{{content}}}\n{{else}}\nNo detailed content could be extracted. Please categorize based on the URL and general knowledge.\n{{/if}}\n\nPlease output the categories in a JSON array format, like:\n{ "categories": ["category1", "category2", "category3"] }\n`,
});

const intelligentCategoryTaggingFlow = ai.defineFlow(
  {
    name: 'intelligentCategoryTaggingFlow',
    inputSchema: IntelligentCategoryTaggingInputSchema,
    outputSchema: IntelligentCategoryTaggingOutputSchema,
  },
  async (input) => {
    const websiteContent = await fetchAndExtractContent(input.url);

    const { output } = await intelligentCategoryTaggingPrompt({
      url: input.url,
      content: websiteContent,
    });

    if (!output) {
      throw new Error('Failed to generate categories.');
    }

    return output;
  }
);

export async function intelligentCategoryTagging(input: IntelligentCategoryTaggingInput): Promise<IntelligentCategoryTaggingOutput> {
  return intelligentCategoryTaggingFlow(input);
}
