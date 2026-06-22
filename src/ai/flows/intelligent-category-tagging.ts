
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Failed to fetch URL ${url}: ${response.statusText}`);
      return null;
    }
    const html = await response.text();

    let extractedContent = '';

    // Extract title
    const titleMatch = /<title>(.*?)<\/title>/i.exec(html);
    if (titleMatch && titleMatch[1]) {
      extractedContent += `Title: ${titleMatch[1].trim()}\n`;
    }

    // Extract body text
    const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
    if (bodyMatch && bodyMatch[1]) {
      const bodyText = bodyMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      extractedContent += `Content Snippet: ${bodyText.substring(0, 2000)}...`;
    }

    return extractedContent || null;
  } catch (error) {
    console.warn(`Error fetching or parsing URL ${url} for categorization:`, error instanceof Error ? error.message : String(error));
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
  prompt: `Analyze the following website URL and its provided content to generate a list of relevant Pinterest-style interest tags. Each tag should be concise, 1-3 words, and clearly describe a core interest or topic related to the website. Provide at least 3, but no more than 10 unique tags. Ensure the tags are diverse and cover the main themes of the website.\n\nURL: {{{url}}}\n{{#if content}}\nExtracted Content:\n{{{content}}}\n{{else}}\nNo detailed content could be extracted. Please categorize based on the URL and general knowledge.\n{{/if}}\n\nPlease output the categories in a JSON array format, like:\n{ "categories": ["category1", "category2", "category3"] }\n`,
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
      return { categories: ["General", "Web", "Discovery"] }; // Safe fallback
    }

    return output;
  }
);

export async function intelligentCategoryTagging(input: IntelligentCategoryTaggingInput): Promise<IntelligentCategoryTaggingOutput> {
  return intelligentCategoryTaggingFlow(input);
}
