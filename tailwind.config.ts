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
        headline: ['Poppins', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        halloween: {
          void: '#070709',
          crypt: '#0D0C13',
          obsidian: '#13121C',
          pumpkin: '#FF6B00',
          'pumpkin-glow': '#FF8533',
          ember: '#993D00',
          slime: '#00FF85',
          acid: '#10B981',
          witchcraft: '#8A2BE2',
          mystic: '#9D4EDD',
          haze: '#3C096C',
          fog: '#A19EAF',
          bone: '#F3F3F6'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#FF6B00', // Spectral Pumpkin
          foreground: '#F3F3F6',
        },
        secondary: {
          DEFAULT: '#8A2BE2', // Witchcraft Violet
          foreground: '#F3F3F6',
        },
        muted: {
          DEFAULT: '#13121C',
          foreground: '#A19EAF',
        },
        accent: {
          DEFAULT: '#00FF85', // Phantom Ectoplasm
          foreground: '#070709',
        },
        destructive: {
          DEFAULT: '#FF0000',
          foreground: '#000000',
        },
        border: 'rgba(255, 107, 0, 0.15)',
        input: 'rgba(255, 107, 0, 0.1)',
        ring: '#FF6B00',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'pumpkin-glow': '0 0 25px -5px rgba(255, 107, 0, 0.35)',
        'slime-glow': '0 0 20px -5px rgba(0, 255, 133, 0.4)',
        'witch-glow': '0 0 20px -5px rgba(138, 43, 226, 0.3)',
      },
      keyframes: {
        'flame-flicker': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.95) translateY(2px)' },
        },
        'fog-float': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, 10px) scale(1.1)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        'ember-drift': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: '0' },
        },
        'border-beam': {
          '0%, 100%': { transform: 'translateX(-50%) translateY(-50%) rotate(0deg)' },
          '100%': { transform: 'translateX(-50%) translateY(-50%) rotate(360deg)' },
        }
      },
      animation: {
        'flame-flicker': 'flame-flicker 0.2s ease-in-out infinite',
        'fog-float': 'fog-float 10s ease-in-out infinite',
        'ember-drift': 'ember-drift 15s linear infinite',
        'border-beam': 'border-beam 8s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;