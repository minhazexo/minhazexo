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
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'dark-bg': 'var(--bg-primary)',
        'dark-surface': 'var(--bg-secondary)',
        'dark-elevated': 'var(--bg-elevated)',
        'dark-card': 'var(--bg-card)',
        'void-black': 'var(--bg-void)',
        cyan: {
          300: 'var(--primary-light)',
          400: 'var(--primary)',
          500: 'var(--primary-dark)',
          600: 'var(--primary-dark)',
        },
        magenta: {
          300: 'var(--secondary-light)',
          400: 'var(--secondary)',
          500: 'var(--secondary-dark)',
          600: 'var(--secondary-dark)',
        },
        green: {
          300: 'var(--accent-light)',
          400: 'var(--accent)',
          500: 'var(--accent-dark)',
          600: 'var(--accent-dark)',
        },
        amber: {
          400: 'var(--accent-light)',
          500: 'var(--accent)',
        },
        violet: {
          400: 'var(--tertiary-light)',
          500: 'var(--tertiary)',
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
        'neon': 'var(--shadow-neon)',
        'neon-magenta': 'var(--shadow-magenta)',
        'neon-green': 'var(--shadow-green)',
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
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