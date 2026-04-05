/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2f2f8f",
          dark: "#1a1a5c",
          muted: "#4a4aad",
        },
        accent: {
          red: "#c62828",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      screens: {
        'xs': '475px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        'hero-ken-burns': 'heroKenBurns 28s ease-in-out infinite alternate',
        'hero-fade-up':
          'heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'hero-fade-up-delay':
          'heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both',
        'hero-fade-up-delay-2':
          'heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.24s both',
        'hero-fade-up-delay-3':
          'heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.36s both',
        'hero-scroll-hint': 'heroScrollHint 2.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        heroKenBurns: {
          '0%': { transform: 'scale(1.06) translate(0%, 0%)' },
          '100%': { transform: 'scale(1.14) translate(-1.5%, -0.8%)' },
        },
        heroFadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroScrollHint: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
