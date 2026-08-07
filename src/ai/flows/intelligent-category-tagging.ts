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
      pageContent: z.string().optional(),
    })
  },
  output: { schema: IntelligentCategoryTaggingOutputSchema },
  prompt: `Analyze the following website and generate a list of 3-5 relevant Pinterest-style interest tags.
  
URL: {{{url}}}

WEBSITE CONTENT SNIPPET:
{{{pageContent}}}

The tags should represent the niche, technology, and purpose of the website.
Please output the categories in a JSON array format.`,
});

const intelligentCategoryTaggingFlow = ai.defineFlow(
  {
    name: 'intelligentCategoryTaggingFlow',
    inputSchema: IntelligentCategoryTaggingInputSchema,
    outputSchema: IntelligentCategoryTaggingOutputSchema,
  },
  async (input) => {
    let pageContent = '';
    try {
      const response = await fetch(input.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const html = await response.text();
      pageContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 3000);
    } catch (e) {
      console.warn("Analysis fetch failed for tags.");
    }

    const { output } = await intelligentCategoryTaggingPrompt({
      ...input,
      pageContent
    });
    return output!;
  }
);

export async function intelligentCategoryTagging(input: { url: string }) {
  try {
    return await intelligentCategoryTaggingFlow(input);
  } catch (error) {
    console.error("AI Tagging Error:", error);
    return { categories: ["Web App", "Tools", "General"] };
  }
}
