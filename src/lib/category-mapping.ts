/**
 * @fileOverview Centralized Category Mapping System for Bessites.
 * Maps 213+ technical/fragmented tags to 26 broad public categories.
 */

import { 
  Sparkles, Cpu, Code, Palette, Briefcase, DollarSign, Clock, BookOpen, 
  Gamepad2, Play, Music, Video, Camera, ShoppingBag, Plane, HeartPulse, 
  Utensils, Home, FlaskConical, Leaf, Car, Trophy, MessagesSquare, 
  Newspaper, Hammer, Search, Tag 
} from "lucide-react";

export const BROAD_CATEGORIES = [
  { id: "ai", name: "AI", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "tech", name: "Technology", icon: Cpu, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "coding", name: "Coding & Development", icon: Code, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "design", name: "Design", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10" },
  { id: "business", name: "Business", icon: Briefcase, color: "text-teal-400", bg: "bg-teal-500/10" },
  { id: "finance", name: "Finance", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
  { id: "productivity", name: "Productivity", icon: Clock, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { id: "education", name: "Education", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "gaming", name: "Gaming", icon: Gamepad2, color: "text-red-400", bg: "bg-red-500/10" },
  { id: "entertainment", name: "Entertainment", icon: Play, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { id: "music", name: "Music", icon: Music, color: "text-blue-300", bg: "bg-blue-500/10" },
  { id: "video", name: "Video & Media", icon: Video, color: "text-rose-400", bg: "bg-rose-500/10" },
  { id: "photography", name: "Photography", icon: Camera, color: "text-blue-300", bg: "bg-blue-500/10" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "travel", name: "Travel", icon: Plane, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: "health", name: "Health & Fitness", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "food", name: "Food & Cooking", icon: Utensils, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: "lifestyle", name: "Lifestyle", icon: Home, color: "text-orange-300", bg: "bg-orange-500/10" },
  { id: "science", name: "Science", icon: FlaskConical, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "nature", name: "Nature & Outdoors", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "cars", name: "Cars & Vehicles", icon: Car, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "sports", name: "Sports", icon: Trophy, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "social", name: "Social & Community", icon: MessagesSquare, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "news", name: "News & Information", icon: Newspaper, color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "tools", name: "Tools & Utilities", icon: Hammer, color: "text-stone-400", bg: "bg-stone-500/10" },
  { id: "other", name: "Other / Discover", icon: Search, color: "text-slate-400", bg: "bg-slate-500/10" },
];

/**
 * Maps a technical tag to its broad public categories.
 */
export function getBroadCategoriesForTag(tag: string): string[] {
  const t = tag.toLowerCase();
  const categories: string[] = [];

  // AI
  if (t.includes('ai') || t.includes('intelligence') || t.includes('machine learning') || t.includes('llm') || t.includes('generative')) {
    categories.push("AI");
  }

  // Technology
  if (t.includes('cloud') || t.includes('tech') || t.includes('osint') || t.includes('infrastructure') || t.includes('hardware') || t.includes('cybersecurity')) {
    categories.push("Technology");
  }

  // Coding & Development
  if (t.includes('code') || t.includes('developer') || t.includes('backend') || t.includes('frontend') || t.includes('api') || t.includes('framework') || t.includes('javascript') || t.includes('python') || t.includes('database')) {
    categories.push("Coding & Development");
  }

  // Design
  if (t.includes('design') || t.includes('ui') || t.includes('ux') || t.includes('icon') || t.includes('vector') || t.includes('font') || t.includes('typography') || t.includes('creative')) {
    categories.push("Design");
  }

  // Business
  if (t.includes('business') || t.includes('freelance') || t.includes('startup') || t.includes('seo') || t.includes('marketing') || t.includes('job')) {
    categories.push("Business");
  }

  // Finance
  if (t.includes('finance') || t.includes('wallet') || t.includes('payment') || t.includes('invest') || t.includes('dollar') || t.includes('bank')) {
    categories.push("Finance");
  }

  // Productivity
  if (t.includes('productivity') || t.includes('time') || t.includes('management') || t.includes('timer') || t.includes('dashboard') || t.includes('notes')) {
    categories.push("Productivity");
  }

  // Education
  if (t.includes('edu') || t.includes('learn') || t.includes('school') || t.includes('study') || t.includes('language') || t.includes('scholarship')) {
    categories.push("Education");
  }

  // Gaming
  if (t.includes('game') || t.includes('chess') || t.includes('board') || t.includes('puzzle') || t.includes('trivia') || t.includes('mods')) {
    categories.push("Gaming");
  }

  // Entertainment
  if (t.includes('entertainment') || t.includes('movie') || t.includes('tv') || t.includes('anime') || t.includes('fun') || t.includes('party')) {
    categories.push("Entertainment");
  }

  // Music
  if (t.includes('music') || t.includes('audio') || t.includes('radio') || t.includes('sound') || t.includes('podcast')) {
    categories.push("Music");
  }

  // Video & Media
  if (t.includes('video') || t.includes('media') || t.includes('film') || t.includes('recording')) {
    categories.push("Video & Media");
  }

  // Photography
  if (t.includes('photo') || t.includes('camera') || t.includes('imagery')) {
    categories.push("Photography");
  }

  // Shopping
  if (t.includes('shop') || t.includes('coupon') || t.includes('deal') || t.includes('gift')) {
    categories.push("Shopping");
  }

  // Travel
  if (t.includes('travel') || t.includes('plane') || t.includes('train') || t.includes('ship') || t.includes('map') || t.includes('hotel')) {
    categories.push("Travel");
  }

  // Health
  if (t.includes('health') || t.includes('fitness') || t.includes('meditation') || t.includes('sleep') || t.includes('gym')) {
    categories.push("Health & Fitness");
  }

  // Food
  if (t.includes('food') || t.includes('cook') || t.includes('recipe') || t.includes('chef') || t.includes('coffee') || t.includes('wine')) {
    categories.push("Food & Cooking");
  }

  // Lifestyle
  if (t.includes('lifestyle') || t.includes('home') || t.includes('parent') || t.includes('pets') || t.includes('dating')) {
    categories.push("Lifestyle");
  }

  // Science
  if (t.includes('science') || t.includes('physics') || t.includes('math') || t.includes('space') || t.includes('dna')) {
    categories.push("Science");
  }

  // Nature
  if (t.includes('nature') || t.includes('outdoor') || t.includes('bird') || t.includes('hike') || t.includes('earth') || t.includes('ocean')) {
    categories.push("Nature & Outdoors");
  }

  // Cars
  if (t.includes('car') || t.includes('vehicle') || t.includes('motorcycle') || t.includes('bike') || t.includes('drive')) {
    categories.push("Cars & Vehicles");
  }

  // Sports
  if (t.includes('sport') || t.includes('trophy') || t.includes('competition')) {
    categories.push("Sports");
  }

  // Social
  if (t.includes('social') || t.includes('community') || t.includes('chat') || t.includes('message')) {
    categories.push("Social & Community");
  }

  // News
  if (t.includes('news') || t.includes('info') || t.includes('newspaper') || t.includes('article')) {
    categories.push("News & Information");
  }

  // Tools
  if (t.includes('tool') || t.includes('utility') || t.includes('pdf') || t.includes('download') || t.includes('hammer')) {
    categories.push("Tools & Utilities");
  }

  if (categories.length === 0) categories.push("Other / Discover");
  
  return Array.from(new Set(categories));
}
