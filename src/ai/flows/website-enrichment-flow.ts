'use server';
/**
 * @fileOverview Genkit flow to generate professional metadata for a website.
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
  category: z.string().optional().describe('A suggested primary category.'),
});

export async function enrichWebsiteMetadata(input: { url: string, mode: 'title' | 'description' | 'full' }) {
  return enrichWebsiteMetadataFlow(input);
}

const enrichmentPrompt = ai.definePrompt({
  name: 'enrichmentPrompt',
  input: { schema: EnrichmentInputSchema },
  output: { schema: EnrichmentOutputSchema },
  prompt: `You are an expert digital curator and SEO specialist for Bessites, a premium web directory.
  
  Analyze the following website URL: {{{url}}}
  
  Task: {{#if (eq mode 'title')}}Generate a professional, concise, and catchy name for this digital property.{{/if}}
  {{#if (eq mode 'description')}}Generate a short (2-3 sentences), attractive, and SEO-friendly description that explains what the website does and why users should visit it. Use an encouraging, "tech-noir" professional tone.{{/if}}
  {{#if (eq mode 'full')}}Generate both a professional title and a compelling description.{{/if}}
  
  URL: {{{url}}}`,
});

const enrichWebsiteMetadataFlow = ai.defineFlow(
  {
    name: 'enrichWebsiteMetadataFlow',
    inputSchema: EnrichmentInputSchema,
    outputSchema: EnrichmentOutputSchema,
  },
  async (input) => {
    const { output } = await enrichmentPrompt(input);
    return output!;
  }
);
