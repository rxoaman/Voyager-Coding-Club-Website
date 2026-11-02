/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#000000',
          surface: '#0A0A0A',
          card: '#0F0F0F',
          border: 'rgba(255, 255, 255, 0.08)',
          green: '#10B981',
          greenDark: '#059669',
          muted: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'green': '0 0 15px -3px rgba(16, 185, 129, 0.3)'
      }
    },
  },
  plugins: [],
}
