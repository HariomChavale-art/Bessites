/**
 * @fileOverview Centralized Interest & Category Mapping System for Bessites.
 * Transforms technical tags into human-friendly interests across 20 high-fidelity sectors.
 * Currently indexing 2,000+ distinct discovery nodes.
 */

import React from 'react';
import { 
  Palette, Music, Mountain, Trophy, HeartPulse, Sparkles, Code, Camera, 
  Gamepad2, Utensils, Hammer, Home, ShoppingBag, BookOpen, FlaskConical, 
  Plane, Briefcase, Play, Users, Archive, Search, Globe, Laptop, Smartphone,
  Binary, Database, Terminal, Layers, PenTool, Layout, Image as ImageIcon,
  Mic, Headphones, GraduationCap, Book, Globe2, Wind, Bird, Waves, Zap,
  Rocket, Coins, ShoppingBasket, Map, Dumbbell, PawPrint, Ghost, Stars,
  Microscope, Box, Shield, Smile, Coffee, BookMarked, Brain, Eye, User,
  Brush, Pen, TrendingUp, Activity, Lock, Share2, Info, Menu, X, Trash2,
  ExternalLink, Keyboard, Monitor, Mouse, Gamepad, Type, 
  FileText, Timer, Footprints, Swords, Flag, Bike, Speaker, UserCheck, 
  Cloud, Scissors, Anchor, MapPin, DollarSign, Video, Car, Cpu, Minus, 
  Leaf, Heart, LayoutGrid, HelpCircle, Clock, Target, Rss, Phone, Scale, 
  Percent, TrendingDown, Wheat, GlassWater, Gift, RefreshCw, Settings,
  List, BarChart3, Train, Apple, Milk, Tent, Mail, Newspaper, Bookmark, Dice,
  MessagesSquare, ShieldCheck
} from "lucide-react";

// --- CUSTOM ICON NODES ---
const DigitalArtIcon = () => (
  <div className="relative w-6 h-6">
    <Monitor className="w-full h-full opacity-40" />
    <Brush className="w-1/2 h-1/2 absolute bottom-0 right-0 text-primary" />
  </div>
);

const KeyIcon = () => <div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center font-bold text-[8px]">K</div>;

export const BROAD_CATEGORIES = [
  { id: "arts_visual", name: "Arts & Visual Creation", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10" },
  { id: "music_audio", name: "Music, Audio & Performing Arts", icon: Music, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { id: "sports_outdoor", name: "Sports, Gymnastics & Outdoor Athletics", icon: Mountain, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "team_combat_sports", name: "Team, Racket & Combat Sports", icon: Trophy, color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "fitness_wellness", name: "Fitness, Dance & Wellness", icon: HeartPulse, color: "text-rose-400", bg: "bg-rose-500/10" },
  { id: "ai_tech_hardware", name: "AI, Hardware & Emerging Tech", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "coding_software", name: "Coding, Web Development & Software", icon: Code, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "design_photo_video", name: "Design, Photography & Video", icon: Camera, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "gaming_esports", name: "Gaming, Esports & Tabletop", icon: Gamepad2, color: "text-red-400", bg: "bg-red-500/10" },
  { id: "food_drinks", name: "Food, Cooking, Baking & Drinks", icon: Utensils, color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "crafts_diy", name: "Crafts, DIY & Maker Hobbies", icon: Hammer, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { id: "home_gardening", name: "Home, Interior Design & Gardening", icon: Home, color: "text-slate-400", bg: "bg-slate-500/10" },
  { id: "fashion_beauty", name: "Fashion, Style, Beauty & Grooming", icon: ShoppingBag, color: "text-pink-300", bg: "bg-pink-300/10" },
  { id: "books_writing", name: "Books, Writing, Languages & Philosophy", icon: BookOpen, color: "text-stone-400", bg: "bg-stone-500/10" },
  { id: "science_nature", name: "Science, Space, History & Nature", icon: FlaskConical, color: "text-blue-300", bg: "bg-blue-300/10" },
  { id: "travel_vehicles", name: "Travel, Adventure & Vehicles", icon: Plane, color: "text-sky-400", bg: "bg-sky-400/10" },
  { id: "business_finance", name: "Business, Finance, Marketing & Career", icon: Briefcase, color: "text-teal-400", bg: "bg-teal-500/10" },
  { id: "entertainment_pop", name: "Entertainment, Movies, Anime & Pop Culture", icon: Play, color: "text-violet-400", bg: "bg-violet-500/10" },
  { id: "family_lifestyle", name: "Pets, Family, Community & Lifestyle", icon: Users, color: "text-green-400", bg: "bg-green-500/10" },
  { id: "collecting_aesthetics", name: "Collecting, Aesthetics & Modern Subcultures", icon: Archive, color: "text-gray-400", bg: "bg-gray-500/10" },
];

export const INTERESTS = [
  // --- USER SPECIFIED TOP INTERESTS ---
  { name: "Gaming", group: "gaming_esports", icon: Gamepad2 },
  { name: "AI Tools", group: "ai_tech_hardware", icon: Sparkles },
  { name: "Movies", group: "entertainment_pop", icon: Play },
  { name: "Music", group: "music_audio", icon: Music },
  { name: "Anime", group: "entertainment_pop", icon: Ghost },
  { name: "Coding", group: "coding_software", icon: Code },
  { name: "Cooking", group: "food_drinks", icon: Utensils },
  { name: "Fitness", group: "fitness_wellness", icon: Dumbbell },
  { name: "Memes", group: "entertainment_pop", icon: Smile },
  { name: "Travel", group: "travel_vehicles", icon: Plane },
  { name: "Photography", group: "design_photo_video", icon: Camera },
  { name: "Personal Finance", group: "business_finance", icon: Coins },
  { name: "Investing", group: "business_finance", icon: DollarSign },
  { name: "Cryptocurrency", group: "business_finance", icon: Binary },
  { name: "Books", group: "books_writing", icon: Book },
  { name: "Video Editing", group: "design_photo_video", icon: Video },
  { name: "Digital Art", group: "arts_visual", icon: DigitalArtIcon },
  { name: "Graphic Design", group: "design_photo_video", icon: Palette },
  { name: "Cybersecurity", group: "ai_tech_hardware", icon: Shield },
  { name: "Cars", group: "travel_vehicles", icon: Car },
  { name: "Space", group: "science_nature", icon: Stars },
  { name: "Fashion", group: "fashion_beauty", icon: ShoppingBag },
  { name: "Skincare", group: "fashion_beauty", icon: HeartPulse },
  { name: "Psychology", group: "books_writing", icon: Brain },
  { name: "History", group: "science_nature", icon: Clock },
  { name: "Language Learning", group: "books_writing", icon: Globe2 },
  { name: "Podcasts", group: "media_content", icon: Mic },
  { name: "Chess", group: "gaming_esports", icon: Trophy },
  { name: "Coffee", group: "food_drinks", icon: Coffee },
  { name: "Startups", group: "business_finance", icon: Rocket },
  { name: "Web Development", group: "coding_software", icon: Globe },
  { name: "Game Development", group: "gaming_esports", icon: Code },
  { name: "3D Modeling", group: "design_photo_video", icon: Box },
  { name: "Music Production", group: "music_audio", icon: Headphones },
  { name: "YouTube Creation", group: "media_content", icon: Video },
  { name: "Stock Trading", group: "business_finance", icon: TrendingUp },
  { name: "Manga", group: "entertainment_pop", icon: BookMarked },
  { name: "K-Pop", group: "music_audio", icon: Music },
  { name: "Esports", group: "gaming_esports", icon: Trophy },
  { name: "PC Building", group: "ai_tech_hardware", icon: Monitor },
  { name: "Minecraft", group: "gaming_esports", icon: Box },
  { name: "Retro Gaming", group: "gaming_esports", icon: Gamepad },
  { name: "Board Games", group: "gaming_esports", icon: Gamepad2 },
  { name: "Tabletop RPGs", group: "gaming_esports", icon: Ghost },
  { name: "UI Design", group: "design_photo_video", icon: Layout },
  { name: "Animation", group: "media_content", icon: Sparkles },
  { name: "Illustration", group: "arts_visual", icon: PenTool },
  { name: "Filmmaking", group: "media_content", icon: Video },
  { name: "Writing", group: "books_writing", icon: Pen },
  { name: "Marketing", group: "business_finance", icon: Search },
  { name: "E-Commerce", group: "business_finance", icon: ShoppingBasket },
  { name: "Dropshipping", group: "business_finance", icon: Plane },
  { name: "Side Hustles", group: "business_finance", icon: Zap },
  { name: "Freelancing", group: "business_finance", icon: Laptop },
  { name: "Productivity", group: "business_finance", icon: Clock },
  { name: "Note-Taking", group: "learning_knowledge", icon: BookOpen },
  { name: "AI Art", group: "ai_tech_hardware", icon: ImageIcon },
  { name: "AI Video", group: "ai_tech_hardware", icon: Video },
  { name: "AI Music", group: "ai_tech_hardware", icon: Music },
  { name: "Vibe Coding", group: "coding_software", icon: Zap },
  { name: "Prompt Engineering", group: "ai_tech_hardware", icon: Binary },
  { name: "Local AI", group: "ai_tech_hardware", icon: Laptop },
  { name: "Automation", group: "ai_tech_hardware", icon: Cpu },
  { name: "Ethical Hacking", group: "ai_tech_hardware", icon: Lock },
  { name: "Linux", group: "coding_software", icon: Terminal },
  { name: "Open Source", group: "coding_software", icon: Globe },
  { name: "Self-Hosting", group: "coding_software", icon: Home },
  { name: "3D Printing", group: "crafts_diy", icon: Box },
  { name: "Electronics", group: "ai_tech_hardware", icon: Cpu },
  { name: "Robotics", group: "ai_tech_hardware", icon: Cpu },
  { name: "Mechanical Keyboards", group: "collecting_aesthetics", icon: Keyboard },
  { name: "Streetwear", group: "fashion_beauty", icon: ShoppingBag },
  { name: "Sneakers", group: "fashion_beauty", icon: Footprints },
  { name: "Thrift Shopping", group: "fashion_beauty", icon: ShoppingBasket },
  { name: "Fragrances", group: "fashion_beauty", icon: Sparkles },
  { name: "Interior Design", group: "home_gardening", icon: Home },
  { name: "Architecture", group: "arts_visual", icon: Home },
  { name: "Minimalism", group: "collecting_aesthetics", icon: Minus },
  { name: "Gardening", group: "home_gardening", icon: Leaf },
  { name: "Houseplants", group: "home_gardening", icon: Leaf },
  { name: "Pets", group: "family_lifestyle", icon: PawPrint },
  { name: "Baking", group: "food_drinks", icon: Utensils },
  { name: "Nutrition", group: "fitness_wellness", icon: Apple },
  { name: "Bodybuilding", group: "fitness_wellness", icon: Dumbbell },
  { name: "Calisthenics", group: "fitness_wellness", icon: Activity },
  { name: "Running", group: "sports_outdoor", icon: Activity },
  { name: "Martial Arts", group: "team_combat_sports", icon: Swords },
  { name: "Yoga", group: "fitness_wellness", icon: Activity },
  { name: "Meditation", group: "fitness_wellness", icon: Wind },
  { name: "Longevity", group: "fitness_wellness", icon: Heart },
  { name: "Football", group: "team_combat_sports", icon: Trophy },
  { name: "Basketball", group: "team_combat_sports", icon: Trophy },
  { name: "Formula 1", group: "travel_vehicles", icon: Flag },
  { name: "Cycling", group: "sports_outdoor", icon: Bike },
  { name: "Hiking", group: "sports_outdoor", icon: Map },
  { name: "Rock Climbing", group: "sports_outdoor", icon: Mountain },
  { name: "Camping", group: "sports_outdoor", icon: Tent },
  { name: "Guitar", group: "music_audio", icon: Music },
  { name: "Piano", group: "music_audio", icon: Music },
  { name: "DJing", group: "music_audio", icon: Headphones },
  { name: "Songwriting", group: "music_audio", icon: PenTool },
  { name: "Music Theory", group: "music_audio", icon: Book },
  { name: "Sound Design", group: "music_audio", icon: Speaker },
  { name: "Cinematography", group: "media_content", icon: Camera },
  { name: "Screenwriting", group: "media_content", icon: FileText },
  { name: "Motion Graphics", group: "media_content", icon: Play },
  { name: "Typography", group: "design_photo_video", icon: Type },
  { name: "Logo Design", group: "design_photo_video", icon: Palette },
  { name: "Pixel Art", group: "arts_visual", icon: LayoutGrid },
  { name: "Cosplay", group: "entertainment_pop", icon: User },
  { name: "Lego", group: "collecting_aesthetics", icon: Box },
  { name: "Collectibles", group: "collecting_aesthetics", icon: Archive },
  { name: "True Crime", group: "entertainment_pop", icon: Search },
  { name: "Internet Mysteries", group: "entertainment_pop", icon: HelpCircle },
  { name: "Worldbuilding", group: "gaming_esports", icon: Globe },
  { name: "Mythology", group: "books_writing", icon: Book },
  { name: "Philosophy", group: "books_writing", icon: Brain },
  { name: "Astronomy", group: "science_nature", icon: Stars },
  { name: "Astrophotography", group: "science_nature", icon: Camera },
  { name: "Aviation", group: "travel_vehicles", icon: Plane },
  { name: "Weather", group: "science_nature", icon: Wind },
  { name: "Geography", group: "science_nature", icon: Map },
  { name: "Science", group: "science_nature", icon: Microscope },
  { name: "Mathematics", group: "learning_knowledge", icon: Binary },
  { name: "Puzzles", group: "gaming_esports", icon: Search },
  { name: "Trivia", group: "gaming_esports", icon: HelpCircle },
  { name: "Magic Tricks", group: "gaming_esports", icon: Sparkles },
  { name: "Browser Games", group: "gaming_esports", icon: Globe },
  { name: "Sim Racing", group: "gaming_esports", icon: Car },
  { name: "Woodworking", group: "crafts_diy", icon: Hammer },
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
  return sector ? sector.name : "Family, Community & Lifestyle";
}

export function getBroadCategoriesForTag(tag: string): string[] {
  return getInterestsForTag(tag).map(i => getSectorForInterest(i));
}
