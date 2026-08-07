'use server';
/**
 * @fileOverview This file formerly contained AI metadata enrichment logic.
 * Feature removed to prioritize stability.
 */

export async function enrichWebsiteMetadata(input: { url: string, mode: 'title' | 'description' | 'full' }) {
  return { title: "", description: "" };
}
