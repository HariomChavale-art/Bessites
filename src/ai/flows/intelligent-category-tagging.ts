
'use server';
/**
 * @fileOverview This file defines a Genkit flow for intelligent category tagging of websites.
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
    schema: IntelligentCategoryTaggingInputSchema,
  },
  output: { schema: IntelligentCategoryTaggingOutputSchema },
  prompt: `Analyze the following website URL and generate a list of 3-5 relevant Pinterest-style interest tags.
  
  URL: {{{url}}}
  
  Please output the categories in a JSON array format.`,
});

const intelligentCategoryTaggingFlow = ai.defineFlow(
  {
    name: 'intelligentCategoryTaggingFlow',
    inputSchema: IntelligentCategoryTaggingInputSchema,
    outputSchema: IntelligentCategoryTaggingOutputSchema,
  },
  async (input) => {
    const { output } = await intelligentCategoryTaggingPrompt(input);
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
