/**
 * @fileOverview Centralized Interest & Category Mapping System for Bessites.
 * Transforms technical tags into human-friendly interests across 10 sectors.
 * Prioritizes the user's specific high-impact interest list.
 */

import React from 'react';
import { 
  Sparkles, Cpu, Code, Palette, Briefcase, DollarSign, Clock, BookOpen, 
  Gamepad2, Play, Music, Video, Camera, ShoppingBag, Plane, HeartPulse, 
  Utensils, Home, FlaskConical, Leaf, Car, Trophy, MessagesSquare, 
  Newspaper, Hammer, Search, Globe, Laptop, Smartphone, Binary, Database,
  Terminal, Layers, PenTool, Layout, Image as ImageIcon, Mic, Headphones,
  GraduationCap, Book, Globe2, Wind, Bird, Waves, Zap, Rocket, Coins,
  ShoppingBasket, Map, Dumbbell, PawPrint, Ghost, Stars, Microscope,
  Box, Shield, Smile, Coffee, BookMarked, Brain, Eye, User, Brush, Pen, 
  TrendingUp, Lock, Share2, Info, ExternalLink, Keyboard, Monitor, 
  Heart, Flag, Bike, Mountain, Tent, Archive, Bolt, Type, HelpCircle, FileText,
  Speaker, LayoutGrid, Activity, Footprints, Apple, Sword, Minus, Mouse, Gamepad
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
  { name: "Gaming", group: "gaming_fun", icon: Gamepad2 },
  { name: "AI Tools", group: "ai_tech", icon: Sparkles },
  { name: "Movies", group: "media_content", icon: Play },
  { name: "Music", group: "music", icon: Music },
  { name: "Anime", group: "lifestyle_discovery", icon: Ghost },
  { name: "Coding", group: "coding_sw", icon: Code },
  { name: "Cooking", group: "lifestyle_discovery", icon: Utensils },
  { name: "Fitness", group: "lifestyle_discovery", icon: Dumbbell },
  { name: "Memes", group: "lifestyle_discovery", icon: Smile },
  { name: "Travel", group: "lifestyle_discovery", icon: Plane },
  { name: "Photography", group: "media_content", icon: Camera },
  { name: "Personal Finance", group: "business_money", icon: Coins },
  { name: "Investing", group: "business_money", icon: DollarSign },
  { name: "Cryptocurrency", group: "business_money", icon: Binary },
  { name: "Books", group: "learning_knowledge", icon: Book },
  { name: "Video Editing", group: "media_content", icon: Video },
  { name: "Digital Art", group: "design_creative", icon: Brush },
  { name: "Graphic Design", group: "design_creative", icon: Palette },
  { name: "Cybersecurity", group: "ai_tech", icon: Shield },
  { name: "Cars", group: "lifestyle_discovery", icon: Car },
  { name: "Space", group: "science_nature", icon: Stars },
  { name: "Fashion", group: "lifestyle_discovery", icon: ShoppingBag },
  { name: "Skincare", group: "lifestyle_discovery", icon: HeartPulse },
  { name: "Psychology", group: "learning_knowledge", icon: Brain },
  { name: "History", group: "learning_knowledge", icon: Clock },
  { name: "Language Learning", group: "learning_knowledge", icon: Globe2 },
  { name: "Podcasts", group: "media_content", icon: Mic },
  { name: "Chess", group: "gaming_fun", icon: Trophy },
  { name: "Coffee", group: "lifestyle_discovery", icon: Coffee },
  { name: "Startups", group: "business_money", icon: Rocket },
  { name: "Web Development", group: "coding_sw", icon: Globe },
  { name: "Game Development", group: "gaming_fun", icon: Code },
  { name: "3D Modeling", group: "design_creative", icon: Box },
  { name: "Music Production", group: "music", icon: Headphones },
  { name: "YouTube Creation", group: "media_content", icon: Video },
  { name: "Stock Trading", group: "business_money", icon: TrendingUp },
  { name: "Manga", group: "lifestyle_discovery", icon: BookMarked },
  { name: "K-Pop", group: "music", icon: Music },
  { name: "Esports", group: "gaming_fun", icon: Trophy },
  { name: "PC Building", group: "lifestyle_discovery", icon: Monitor },
  { name: "Minecraft", group: "gaming_fun", icon: Box },
  { name: "Retro Gaming", group: "gaming_fun", icon: Gamepad },
  { name: "Board Games", group: "gaming_fun", icon: Gamepad2 },
  { name: "Tabletop RPGs", group: "gaming_fun", icon: Ghost },
  { name: "UI Design", group: "design_creative", icon: Layout },
  { name: "Animation", group: "design_creative", icon: Sparkles },
  { name: "Illustration", group: "design_creative", icon: PenTool },
  { name: "Filmmaking", group: "media_content", icon: Video },
  { name: "Writing", group: "learning_knowledge", icon: Pen },
  { name: "Marketing", group: "business_money", icon: Search },
  { name: "E-Commerce", group: "business_money", icon: ShoppingBasket },
  { name: "Dropshipping", group: "business_money", icon: Plane },
  { name: "Side Hustles", group: "business_money", icon: Zap },
  { name: "Freelancing", group: "business_money", icon: Laptop },
  { name: "Productivity", group: "business_money", icon: Clock },
  { name: "Note-Taking", group: "learning_knowledge", icon: BookOpen },
  { name: "AI Art", group: "ai_tech", icon: ImageIcon },
  { name: "AI Video", group: "ai_tech", icon: Video },
  { name: "AI Music", group: "ai_tech", icon: Music },
  { name: "Vibe Coding", group: "coding_sw", icon: Bolt },
  { name: "Prompt Engineering", group: "ai_tech", icon: Binary },
  { name: "Local AI", group: "ai_tech", icon: Laptop },
  { name: "Automation", group: "ai_tech", icon: Cpu },
  { name: "Ethical Hacking", group: "ai_tech", icon: Lock },
  { name: "Linux", group: "coding_sw", icon: Terminal },
  { name: "Open Source", group: "coding_sw", icon: Globe },
  { name: "Self-Hosting", group: "coding_sw", icon: Layers },
  { name: "3D Printing", group: "lifestyle_discovery", icon: Box },
  { name: "Electronics", group: "science_nature", icon: Cpu },
  { name: "Robotics", group: "science_nature", icon: Cpu },
  { name: "Mechanical Keyboards", group: "lifestyle_discovery", icon: Keyboard },
  { name: "Streetwear", group: "lifestyle_discovery", icon: ShoppingBag },
  { name: "Sneakers", group: "lifestyle_discovery", icon: Footprints },
  { name: "Thrift Shopping", group: "lifestyle_discovery", icon: ShoppingBasket },
  { name: "Fragrances", group: "lifestyle_discovery", icon: Sparkles },
  { name: "Interior Design", group: "lifestyle_discovery", icon: Home },
  { name: "Architecture", group: "design_creative", icon: Home },
  { name: "Minimalism", group: "lifestyle_discovery", icon: Minus },
  { name: "Gardening", group: "lifestyle_discovery", icon: Leaf },
  { name: "Houseplants", group: "lifestyle_discovery", icon: Leaf },
  { name: "Pets", group: "lifestyle_discovery", icon: PawPrint },
  { name: "Baking", group: "lifestyle_discovery", icon: Utensils },
  { name: "Nutrition", group: "lifestyle_discovery", icon: Apple },
  { name: "Bodybuilding", group: "lifestyle_discovery", icon: Dumbbell },
  { name: "Calisthenics", group: "lifestyle_discovery", icon: Activity },
  { name: "Running", group: "lifestyle_discovery", icon: Activity },
  { name: "Martial Arts", group: "lifestyle_discovery", icon: Shield },
  { name: "Yoga", group: "lifestyle_discovery", icon: Activity },
  { name: "Meditation", group: "lifestyle_discovery", icon: Wind },
  { name: "Longevity", group: "lifestyle_discovery", icon: Heart },
  { name: "Football", group: "lifestyle_discovery", icon: Trophy },
  { name: "Basketball", group: "lifestyle_discovery", icon: Trophy },
  { name: "Formula 1", group: "lifestyle_discovery", icon: Flag },
  { name: "Cycling", group: "lifestyle_discovery", icon: Bike },
  { name: "Hiking", group: "lifestyle_discovery", icon: Map },
  { name: "Rock Climbing", group: "lifestyle_discovery", icon: Mountain },
  { name: "Camping", group: "lifestyle_discovery", icon: Tent },
  { name: "Guitar", group: "music", icon: Music },
  { name: "Piano", group: "music", icon: Music },
  { name: "DJing", group: "music", icon: Headphones },
  { name: "Songwriting", group: "music", icon: PenTool },
  { name: "Music Theory", group: "music", icon: Book },
  { name: "Sound Design", group: "music", icon: Speaker },
  { name: "Cinematography", group: "media_content", icon: Camera },
  { name: "Screenwriting", group: "media_content", icon: FileText },
  { name: "Motion Graphics", group: "media_content", icon: Play },
  { name: "Typography", group: "design_creative", icon: Type },
  { name: "Logo Design", group: "design_creative", icon: Palette },
  { name: "Pixel Art", group: "design_creative", icon: LayoutGrid },
  { name: "Cosplay", group: "lifestyle_discovery", icon: User },
  { name: "Lego", group: "lifestyle_discovery", icon: Box },
  { name: "Collectibles", group: "lifestyle_discovery", icon: Archive },
  { name: "True Crime", group: "learning_knowledge", icon: Search },
  { name: "Internet Mysteries", group: "learning_knowledge", icon: HelpCircle },
  { name: "Worldbuilding", group: "learning_knowledge", icon: Globe },
  { name: "Mythology", group: "learning_knowledge", icon: Book },
  { name: "Philosophy", group: "learning_knowledge", icon: Brain },
  { name: "Astronomy", group: "science_nature", icon: Stars },
  { name: "Astrophotography", group: "science_nature", icon: Camera },
  { name: "Aviation", group: "science_nature", icon: Plane },
  { name: "Weather", group: "science_nature", icon: Wind },
  { name: "Geography", group: "learning_knowledge", icon: Map },
  { name: "Science", group: "science_nature", icon: Microscope },
  { name: "Mathematics", group: "learning_knowledge", icon: Binary },
  { name: "Puzzles", group: "gaming_fun", icon: Search },
  { name: "Trivia", group: "gaming_fun", icon: HelpCircle },
  { name: "Magic Tricks", group: "gaming_fun", icon: Sparkles },
  { name: "Browser Games", group: "gaming_fun", icon: Globe },
  { name: "Sim Racing", group: "gaming_fun", icon: Car },
  { name: "Woodworking", group: "lifestyle_discovery", icon: Hammer },
];

export function getInterestsForTag(tag: string): string[] {
  const t = tag.toLowerCase();
  const interests: string[] = [];

  if (t === 'design') interests.push("Graphic Design", "UI Design");
  if (t === 'development') interests.push("Web Development", "Coding");
  if (t === 'audio') interests.push("Music", "Music Production");
  if (t === 'gaming') interests.push("Gaming", "Browser Games");
  if (t === 'productivity') interests.push("Productivity");
  if (t === 'education') interests.push("Science", "Mathematics");
  
  if (t.includes('ai')) interests.push("AI Tools");
  if (t.includes('code') || t.includes('dev')) interests.push("Coding", "Web Development");
  
  if (interests.length === 0) interests.push("Interesting & Random");
  return Array.from(new Set(interests));
}

export function getSectorForInterest(interestName: string): string {
  const interest = INTERESTS.find(i => i.name === interestName);
  const sector = BROAD_CATEGORIES.find(b => b.id === interest?.group);
  return sector ? sector.name : "Lifestyle & Discovery";
}

export function getBroadCategoriesForTag(tag: string): string[] {
  return getInterestsForTag(tag).map(i => getSectorForInterest(i));
}
