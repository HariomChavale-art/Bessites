import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'], // Studio preference for Inter headlines
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        halloween: {
          void: '#09090B', // Refined void
          crypt: '#111116',
          obsidian: '#181820',
          pumpkin: '#FF6B00',
          'pumpkin-glow': '#FF8533',
          ember: '#993D00',
          slime: '#00FF85',
          acid: '#10B981',
          witchcraft: '#8A2BE2',
          mystic: '#9D4EDD',
          haze: '#3C096C',
          fog: '#9E9BA8', // Studio ash gray
          bone: '#F4F4F6' // Studio bone white
        },
        primary: {
          DEFAULT: '#FF6B00',
          foreground: '#F4F4F6',
        },
        secondary: {
          DEFAULT: '#8A2BE2',
          foreground: '#F4F4F6',
        },
        border: 'rgba(255, 255, 255, 0.07)', // Hairline borders
      },
      boxShadow: {
        'specular': 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
        'pumpkin-glow': '0 0 40px -10px rgba(255, 107, 0, 0.2)',
      },
      letterSpacing: {
        tightest: '-0.03em',
        widest: '0.04em',
      },
      keyframes: {
        'flame-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'border-beam': {
          '100%': { transform: 'translateX(-50%) translateY(-50%) rotate(360deg)' },
        }
      },
      animation: {
        'flame-flicker': 'flame-flicker 0.2s ease-in-out infinite',
        'border-beam': 'border-beam 8s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;