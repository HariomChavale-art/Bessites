'use server';
/**
 * @fileOverview This file formerly contained AI tagging logic. 
 * Feature removed to prioritize stability.
 */

export async function intelligentCategoryTagging(input: { url: string }) {
  return { categories: ["Web App", "Tools", "General"] };
}
