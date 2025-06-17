/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores marrón terra
        terra: {
          50: '#faf5f0',
          100: '#f0e6d8',
          200: '#e2cdb3',
          300: '#d4b48e',
          400: '#c69b69',
          500: '#b88244',
          600: '#a66d35',
          700: '#8b582d',
          800: '#71472a',
          900: '#5c3b26',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
    },
  },
  plugins: [],
}
