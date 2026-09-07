# Bessites Taxonomy Reference

This document serves as the official registry of all categories, interests, and technical tag mappings used by the Bessites Discovery Engine.

---

## 1. Broad Sectors (10)
The highest level of hierarchy used for landing page filters and broad audience segments.

- **AI & Technology** (`ai_tech`)
- **Coding & Software** (`coding_sw`)
- **Design & Creative** (`design_creative`)
- **Media & Content** (`media_content`)
- **Music** (`music`)
- **Gaming & Fun** (`gaming_fun`)
- **Learning & Knowledge** (`learning_knowledge`)
- **Science & Nature** (`science_nature`)
- **Business & Money** (`business_money`)
- **Lifestyle & Discovery** (`lifestyle_discovery`)

---

## 2. Discovery Interests (100)
Specific, human-friendly labels chosen by users to personalize their feeds.

### AI & Technology
- AI Tools, AI Assistants, AI Search, AI Image Generation, AI Video, AI Audio & Voice, AI Coding, Machine Learning, Local AI, Developer Tools, Web Development, Mobile & Android, Cloud & Hosting, Cybersecurity, APIs & Infrastructure.

### Coding & Software
- Programming, Code Editors, Frontend Development, Backend Development, JavaScript, Python, Databases, DevOps, Open Source, Software & Desktop Tools.

### Design & Creative
- Graphic Design, UI/UX Design, Design Inspiration, Design Systems, Icons & Graphics, Fonts & Typography, Logos & Branding, Illustration, 3D Design, Architecture.

### Media & Content
- Video Editing, Video Creation, Animation, Motion Graphics, Screen Recording, Photography, Stock Photos & Assets, Content Creation, Social Media Tools, Podcasts.

### Music
- Music Discovery, Music Production, Audio Editing, Music Theory, Instruments & Guitar.

### Gaming & Fun
- Games, Browser Games, Game Development, Simulators, Board Games, Tabletop RPGs, Chess, Puzzles & Trivia, Brain Games, Magic & Tricks.

### Learning & Knowledge
- Education, School, Programming Education, Language Learning, Reading & Books, History, Science, Physics & Math, Space & Astronomy, Geography.

### Science & Nature
- Earth & Weather, Nature & Wildlife, Birds & Birdwatching, Oceans & Marine Life, Volcanoes, DNA & Genetics, Astronomy & Stargazing, Telescopes & Astrophotography, Satellites & Space Technology, Aviation.

### Business & Money
- Business, Startups, Freelancing, Jobs & Careers, Finance, Investing, SEO & Marketing, E-commerce & Shopping, Deals & Discounts, Productivity & Management.

### Lifestyle & Discovery
- Travel, Food & Cooking, Health & Fitness, Home & DIY, Cars, Motorcycles & Cycling, Hiking & Outdoors, Pets, Lifestyle & Hobbies, Interesting & Random.

---

## 3. Tag Mapping Logic
The system automatically maps technical strings (tags/raw categories) to the interests above using the following keyword patterns:

| Keyword Pattern | Target Interest(s) |
| :--- | :--- |
| `ai`, `llm`, `intelligence` | AI Tools |
| `search` | AI Search |
| `image`, `re-light` | AI Image Generation |
| `video`, `pika`, `runway` | AI Video |
| `voice`, `audio`, `stem` | AI Audio & Voice |
| `code`, `programming` | AI Coding |
| `security`, `cyber`, `virus` | Cybersecurity |
| `design`, `ui`, `ux` | Graphic Design, UI/UX Design |
| `font`, `type` | Fonts & Typography |
| `3d`, `spatial`, `poly` | 3D Design |
| `finance`, `equity`, `invest` | Finance, Investing |
| `hardware`, `circuit` | Home & DIY, Engineering |
| `nature`, `bird`, `outdoor` | Nature & Wildlife, Hiking & Outdoors |
| `math`, `calculat`, `physic` | Physics & Math |
| `game`, `play`, `rpg` | Games, Tabletop RPGs |
