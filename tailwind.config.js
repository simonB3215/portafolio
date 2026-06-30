/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#0a0f0d',
        charcoal: '#121a16',
        obsidian: '#18211c',
        gold: '#c9a86a',
        amber: '#e3c58c',
        bronze: '#b8895a',
        emerald: '#3fa37a',
        emeraldDeep: '#25634a',
        ivory: '#e8e2d4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
