/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EDFAF3', 100: '#D3F3E2', 200: '#A8E6C5', 300: '#6FD3A1', 400: '#3DBB7E',
          500: '#1FA365', 600: '#0F8A55', 700: '#0B6E45', 800: '#0A5638', 900: '#083F2B',
        },
        ink: {
          50: '#F5F7F6', 100: '#EAEFEC', 200: '#D5DDD8', 300: '#A9B5AF',
          500: '#5B6B63', 700: '#2B3A33', 900: '#14201B',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,32,27,0.06), 0 4px 16px rgba(20,32,27,0.05)',
        pop: '0 12px 40px rgba(20,32,27,0.18)',
      },
    },
  },
  plugins: [],
};
