/**
 * @fileOverview Centralized Interest & Category Mapping System for Bessites.
 * Transforms 300+ technical tags into 100 human-friendly Interests, 
 * organized by 10 Broad Sectors.
 */

import { 
  Sparkles, Cpu, Code, Palette, Briefcase, DollarSign, Clock, BookOpen, 
  Gamepad2, Play, Music, Video, Camera, ShoppingBag, Plane, HeartPulse, 
  Utensils, Home, FlaskConical, Leaf, Car, Trophy, MessagesSquare, 
  Newspaper, Hammer, Search, Globe, Laptop, Smartphone, Binary, Database,
  Terminal, Layers, PenTool, Layout, Image as ImageIcon, Mic, Headphones,
  GraduationCap, Book, Globe2, Wind, Bird, Waves, Zap, Rocket, Coins,
  ShoppingBasket, Map, Dumbbell, PawPrint, Ghost, Stars, Microscope,
  Box, Shield
} from "lucide-react";

export const BROAD_CATEGORIES = [
  { id: "ai_tech", name: "AI & Technology", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "coding_sw", name: "Coding & Software", icon: Code, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "design_creative", name: "Design & Creative", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10" },
  { id: "media_content", name: "Media & Content", icon: Video, color: "text-rose-400", bg: "bg-rose-500/10" },
  { id: "music", name: "Music", icon: Music, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { id: "gaming_fun", name: "Gaming & Fun", icon: Gamepad2, color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "learning_knowledge", name: "Learning & Knowledge", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "science_nature", name: "Science & Nature", icon: FlaskConical, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "business_money", name: "Business & Money", icon: Briefcase, color: "text-teal-400", bg: "bg-teal-500/10" },
  { id: "lifestyle_discovery", name: "Lifestyle & Discovery", icon: Home, color: "text-slate-400", bg: "bg-slate-500/10" },
];

export const INTERESTS = [
  // AI & Technology
  { name: "AI Tools", group: "ai_tech", icon: Sparkles },
  { name: "AI Assistants", group: "ai_tech", icon: MessagesSquare },
  { name: "AI Search", group: "ai_tech", icon: Search },
  { name: "AI Image Generation", group: "ai_tech", icon: ImageIcon },
  { name: "AI Video", group: "ai_tech", icon: Video },
  { name: "AI Audio & Voice", group: "ai_tech", icon: Mic },
  { name: "AI Coding", group: "ai_tech", icon: Binary },
  { name: "Machine Learning", group: "ai_tech", icon: Cpu },
  { name: "Local AI", group: "ai_tech", icon: Laptop },
  { name: "Developer Tools", group: "ai_tech", icon: Terminal },
  { name: "Web Development", group: "ai_tech", icon: Globe },
  { name: "Mobile & Android", group: "ai_tech", icon: Smartphone },
  { name: "Cloud & Hosting", group: "ai_tech", icon: Layers },
  { name: "Cybersecurity", group: "ai_tech", icon: Zap },
  { name: "APIs & Infrastructure", group: "ai_tech", icon: Database },

  // Coding & Software
  { name: "Programming", group: "coding_sw", icon: Code },
  { name: "Code Editors", group: "coding_sw", icon: Terminal },
  { name: "Frontend Development", group: "coding_sw", icon: Layout },
  { name: "Backend Development", group: "coding_sw", icon: Database },
  { name: "JavaScript", group: "coding_sw", icon: Binary },
  { name: "Python", group: "coding_sw", icon: Binary },
  { name: "Databases", group: "coding_sw", icon: Database },
  { name: "DevOps", group: "coding_sw", icon: Layers },
  { name: "Open Source", group: "coding_sw", icon: Globe },
  { name: "Software & Desktop Tools", group: "coding_sw", icon: Laptop },

  // Design & Creative
  { name: "Graphic Design", group: "design_creative", icon: Palette },
  { name: "UI/UX Design", group: "design_creative", icon: Layout },
  { name: "Design Inspiration", group: "design_creative", icon: Sparkles },
  { name: "Design Systems", group: "design_creative", icon: Layers },
  { name: "Icons & Graphics", group: "design_creative", icon: PenTool },
  { name: "Fonts & Typography", group: "design_creative", icon: PenTool },
  { name: "Logos & Branding", group: "design_creative", icon: ImageIcon },
  { name: "Illustration", group: "design_creative", icon: Palette },
  { name: "3D Design", group: "design_creative", icon: Box },
  { name: "Architecture", group: "design_creative", icon: Home },

  // Media & Content
  { name: "Video Editing", group: "media_content", icon: Video },
  { name: "Video Creation", group: "media_content", icon: Play },
  { name: "Animation", group: "media_content", icon: Sparkles },
  { name: "Motion Graphics", group: "media_content", icon: Play },
  { name: "Screen Recording", group: "media_content", icon: Smartphone },
  { name: "Photography", group: "media_content", icon: Camera },
  { name: "Stock Photos & Assets", group: "media_content", icon: ImageIcon },
  { name: "Content Creation", group: "media_content", icon: Play },
  { name: "Social Media Tools", group: "media_content", icon: MessagesSquare },
  { name: "Podcasts", group: "media_content", icon: Mic },

  // Music
  { name: "Music Discovery", group: "music", icon: Music },
  { name: "Music Production", group: "music", icon: Headphones },
  { name: "Audio Editing", group: "music", icon: Mic },
  { name: "Music Theory", group: "music", icon: Book },
  { name: "Instruments & Guitar", group: "music", icon: Music },

  // Gaming & Fun
  { name: "Games", group: "gaming_fun", icon: Gamepad2 },
  { name: "Browser Games", group: "gaming_fun", icon: Globe },
  { name: "Game Development", group: "gaming_fun", icon: Code },
  { name: "Simulators", group: "gaming_fun", icon: Play },
  { name: "Board Games", group: "gaming_fun", icon: Gamepad2 },
  { name: "Tabletop RPGs", group: "gaming_fun", icon: Ghost },
  { name: "Chess", group: "gaming_fun", icon: Trophy },
  { name: "Puzzles & Trivia", group: "gaming_fun", icon: Search },
  { name: "Brain Games", group: "gaming_fun", icon: Zap },
  { name: "Magic & Tricks", group: "gaming_fun", icon: Sparkles },

  // Learning & Knowledge
  { name: "Education", group: "learning_knowledge", icon: GraduationCap },
  { name: "School", group: "learning_knowledge", icon: GraduationCap },
  { name: "Programming Education", group: "learning_knowledge", icon: Code },
  { name: "Language Learning", group: "learning_knowledge", icon: Globe2 },
  { name: "Reading & Books", group: "learning_knowledge", icon: Book },
  { name: "History", group: "learning_knowledge", icon: Clock },
  { name: "Science", group: "learning_knowledge", icon: Microscope },
  { name: "Physics & Math", group: "learning_knowledge", icon: Binary },
  { name: "Space & Astronomy", group: "learning_knowledge", icon: Stars },
  { name: "Geography", group: "learning_knowledge", icon: Map },

  // Science & Nature
  { name: "Earth & Weather", group: "science_nature", icon: Wind },
  { name: "Nature & Wildlife", group: "science_nature", icon: Leaf },
  { name: "Birds & Birdwatching", group: "science_nature", icon: Bird },
  { name: "Oceans & Marine Life", group: "science_nature", icon: Waves },
  { name: "Volcanoes", group: "science_nature", icon: FlaskConical },
  { name: "DNA & Genetics", group: "science_nature", icon: Microscope },
  { name: "Astronomy & Stargazing", group: "science_nature", icon: Stars },
  { name: "Telescopes & Astrophotography", group: "science_nature", icon: Camera },
  { name: "Satellites & Space Technology", group: "science_nature", icon: Rocket },
  { name: "Aviation", group: "science_nature", icon: Plane },

  // Business & Money
  { name: "Business", group: "business_money", icon: Briefcase },
  { name: "Startups", group: "business_money", icon: Rocket },
  { name: "Freelancing", group: "business_money", icon: Laptop },
  { name: "Jobs & Careers", group: "business_money", icon: Briefcase },
  { name: "Finance", group: "business_money", icon: Coins },
  { name: "Investing", group: "business_money", icon: DollarSign },
  { name: "SEO & Marketing", group: "business_money", icon: Search },
  { name: "E-commerce & Shopping", group: "business_money", icon: ShoppingBag },
  { name: "Deals & Discounts", group: "business_money", icon: ShoppingBasket },
  { name: "Productivity & Management", group: "business_money", icon: Clock },

  // Lifestyle & Discovery
  { name: "Travel", group: "lifestyle_discovery", icon: Plane },
  { name: "Food & Cooking", group: "lifestyle_discovery", icon: Utensils },
  { name: "Health & Fitness", group: "lifestyle_discovery", icon: Dumbbell },
  { name: "Home & DIY", group: "lifestyle_discovery", icon: Hammer },
  { name: "Cars", group: "lifestyle_discovery", icon: Car },
  { name: "Motorcycles & Cycling", group: "lifestyle_discovery", icon: Trophy },
  { name: "Hiking & Outdoors", group: "lifestyle_discovery", icon: Map },
  { name: "Pets", group: "lifestyle_discovery", icon: PawPrint },
  { name: "Lifestyle & Hobbies", group: "lifestyle_discovery", icon: HeartPulse },
  { name: "Interesting & Random", group: "lifestyle_discovery", icon: Search },
];

/**
 * Maps a technical tag or raw database category to its public human-friendly interests.
 */
export function getInterestsForTag(tag: string): string[] {
  const t = tag.toLowerCase();
  const interests: string[] = [];

  // --- RAW SEED CATEGORY MAPPINGS ---
  if (t === 'design') interests.push("Graphic Design", "UI/UX Design");
  if (t === 'development') interests.push("Developer Tools", "Web Development");
  if (t === 'audio') interests.push("AI Audio & Voice", "Music Discovery");
  if (t === 'gaming') interests.push("Games", "Browser Games");
  if (t === 'productivity') interests.push("Productivity & Management");
  if (t === 'hardware') interests.push("Home & DIY", "Developer Tools");
  if (t === 'outdoors') interests.push("Hiking & Outdoors", "Nature & Wildlife");
  if (t === 'security') interests.push("Cybersecurity");
  if (t === 'education') interests.push("Education", "Science");
  if (t === 'finance') interests.push("Finance", "Investing");

  // --- KEYWORD HEURISTICS ---
  if (t.includes('ai') || t.includes('llm') || t.includes('intelligence')) {
    interests.push("AI Tools");
    if (t.includes('assist')) interests.push("AI Assistants");
    if (t.includes('search')) interests.push("AI Search");
    if (t.includes('image')) interests.push("AI Image Generation");
    if (t.includes('video')) interests.push("AI Video");
    if (t.includes('voice') || t.includes('audio')) interests.push("AI Audio & Voice");
    if (t.includes('code')) interests.push("AI Coding");
  }

  if (t.includes('dev') || t.includes('tool') || t.includes('code') || t.includes('programming') || t.includes('api')) {
    interests.push("Developer Tools");
    if (t.includes('web')) interests.push("Web Development");
    if (t.includes('editor')) interests.push("Code Editors");
    if (t.includes('front')) interests.push("Frontend Development");
    if (t.includes('back')) interests.push("Backend Development");
    if (t.includes('database') || t.includes('api')) interests.push("APIs & Infrastructure");
  }

  if (t.includes('game') || t.includes('play') || t.includes('chess') || t.includes('puzz') || t.includes('rpg') || t.includes('speedrun') || t.includes('pinball') || t.includes('arcade')) {
    interests.push("Games");
    if (t.includes('browser')) interests.push("Browser Games");
    if (t.includes('board') || t.includes('chess')) interests.push("Board Games");
    if (t.includes('rpg') || t.includes('wargam') || t.includes('tabletop')) interests.push("Tabletop RPGs");
    if (t.includes('chess')) interests.push("Chess");
  }

  if (t.includes('design') || t.includes('ui') || t.includes('ux') || t.includes('vector') || t.includes('typography') || t.includes('logo') || t.includes('model')) {
    interests.push("Graphic Design");
    if (t.includes('ui') || t.includes('ux')) interests.push("UI/UX Design");
    if (t.includes('font') || t.includes('typography')) interests.push("Fonts & Typography");
    if (t.includes('logo') || t.includes('brand')) interests.push("Logos & Branding");
    if (t.includes('3d') || t.includes('spatial')) interests.push("3D Design");
  }

  if (t.includes('learn') || t.includes('edu') || t.includes('school') || t.includes('math') || t.includes('academic')) {
    interests.push("Education");
    if (t.includes('lang')) interests.push("Language Learning");
    if (t.includes('math') || t.includes('calculat')) interests.push("Physics & Math");
    if (t.includes('science') || t.includes('physics')) interests.push("Science");
  }

  if (t.includes('nature') || t.includes('bird') || t.includes('outdoor') || t.includes('earth') || t.includes('astronomy') || t.includes('climb') || t.includes('hike') || t.includes('trail')) {
    interests.push("Nature & Wildlife");
    if (t.includes('bird')) interests.push("Birds & Birdwatching");
    if (t.includes('hike') || t.includes('trail') || t.includes('climb') || t.includes('mountaineer')) interests.push("Hiking & Outdoors");
    if (t.includes('astronomy') || t.includes('space') || t.includes('astrophy') || t.includes('planetary')) interests.push("Space & Astronomy");
  }

  if (t.includes('business') || t.includes('startup') || t.includes('job') || t.includes('finance') || t.includes('invest') || t.includes('legal') || t.includes('macro')) {
    interests.push("Business");
    if (t.includes('startup')) interests.push("Startups");
    if (t.includes('job') || t.includes('career')) interests.push("Jobs & Careers");
    if (t.includes('finance') || t.includes('trading') || t.includes('invest') || t.includes('equity')) interests.push("Finance");
  }

  if (t.includes('cook') || t.includes('food') || t.includes('diet') || t.includes('nutrition') || t.includes('baking') || t.includes('culinary')) {
    interests.push("Food & Cooking");
  }

  if (t.includes('health') || t.includes('fitness') || t.includes('muscle') || t.includes('anatomy') || t.includes('biomechanics') || t.includes('lifting') || t.includes('training') || t.includes('swimming') || t.includes('bjj') || t.includes('grappling')) {
    interests.push("Health & Fitness");
    if (t.includes('anatomy') || t.includes('bio')) interests.push("Science");
  }

  if (t.includes('woodworking') || t.includes('diy') || t.includes('maker') || t.includes('fabrication') || t.includes('home') || t.includes('bonsai') || t.includes('terrarium') || t.includes('ant') || t.includes('hobby') || t.includes('collect') || t.includes('coin') || t.includes('numista') || t.includes('vinyl') || t.includes('lego') || t.includes('origami') || t.includes('shooting') || t.includes('rc') || t.includes('golf') || t.includes('archery') || t.includes('bowhunt')) {
    interests.push("Lifestyle & Hobbies");
    if (t.includes('home') || t.includes('diy') || t.includes('woodworking')) interests.push("Home & DIY");
  }

  if (t.includes('video') || t.includes('media') || t.includes('film') || t.includes('cinematography') || t.includes('screen recording')) {
    interests.push("Video & Media");
    if (t.includes('photo')) interests.push("Photography");
  }

  if (t.includes('history') || t.includes('archive') || t.includes('museum')) {
    interests.push("History");
  }

  if (t.includes('geohash') || t.includes('coordinate') || t.includes('random') || t.includes('interesting')) {
    interests.push("Interesting & Random");
  }

  if (interests.length === 0) interests.push("Interesting & Random");
  
  return Array.from(new Set(interests));
}

/**
 * Returns the broad sector name for a given interest.
 */
export function getSectorForInterest(interestName: string): string {
  const interest = INTERESTS.find(i => i.name === interestName);
  if (!interest) return "Lifestyle & Discovery";
  const sector = BROAD_CATEGORIES.find(b => b.id === interest.group);
  return sector ? sector.name : "Lifestyle & Discovery";
}

/**
 * Returns all broad sectors associated with a technical tag.
 */
export function getBroadCategoriesForTag(tag: string): string[] {
  const interests = getInterestsForTag(tag);
  const sectors = interests.map(i => getSectorForInterest(i));
  return Array.from(new Set(sectors));
}
