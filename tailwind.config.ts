import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D4FF',
        secondary: '#FF00FF',
        accent: '#00FF88',
        'dark-bg': '#0A0A0F',
        'dark-surface': '#12121A',
        'dark-elevated': '#1A1A25',
        'dark-card': '#16161F',
        'void-black': '#000000',
        cyan: {
          300: '#33DDFF',
          400: '#00D4FF',
          500: '#00B8E0',
          600: '#0099C0',
        },
        magenta: {
          300: '#FF33BB',
          400: '#FF00AA',
          500: '#E00095',
          600: '#C00080',
        },
        green: {
          300: '#33FFA0',
          400: '#00FF88',
          500: '#00E07A',
          600: '#00C06A',
        },
        amber: {
          400: '#FFB800',
          500: '#E0A000',
        },
        violet: {
          400: '#8B5CF6',
          500: '#7C3AED',
        },
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        exo: ['var(--font-exo-2)', 'sans-serif'],
        jetbrains: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin-reverse 15s linear infinite',
        'glitch': 'glitch 0.3s ease infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
        'cinematic-float': 'cinematic-float 6s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'grain-shift': 'grainShift 0.5s steps(10) infinite',
        'warp': 'warpSpeed 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'skill-shine': 'skillShine 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.4)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        },
        'cinematic-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(1deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0deg)' },
          '75%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        grainShift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-1px, 1px)' },
          '20%': { transform: 'translate(1px, -1px)' },
          '30%': { transform: 'translate(-1px, -1px)' },
          '40%': { transform: 'translate(1px, 1px)' },
          '50%': { transform: 'translate(-1px, 0)' },
          '60%': { transform: 'translate(1px, 1px)' },
          '70%': { transform: 'translate(0, -1px)' },
          '80%': { transform: 'translate(-1px, 1px)' },
          '90%': { transform: 'translate(1px, 0)' },
        },
        warpSpeed: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.05) rotate(1deg)', opacity: '0.5', filter: 'blur(5px)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1', filter: 'blur(0)' },
        },
        skillShine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
        'neon-magenta': '0 0 20px rgba(255, 0, 170, 0.5), 0 0 40px rgba(255, 0, 170, 0.3)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)',
        'card': '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 212, 255, 0.1)',
        'card-hover': '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 212, 255, 0.2)',
        'bloom': '0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)',
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'cinematic-out': 'cubic-bezier(0.2, 0, 0.1, 1)',
      },
      transitionDuration: {
        'slow': '1.2s',
        'normal': '0.6s',
        'fast': '0.3s',
      },
    },
  },
  plugins: [],
}

export default config