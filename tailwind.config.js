/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dawere: {
          teal: '#1D6B69',
          'teal-dark': '#145250',
          'teal-light': '#2A8A87',
          'teal-50': '#E8F4F4',
          'teal-100': '#C5E3E2',
          orange: '#E8821E',
          'orange-dark': '#C96A10',
          'orange-light': '#F0A050',
          'orange-50': '#FEF3E8',
          dark: '#2D3E50',
          'dark-light': '#4A5E72',
          gray: '#8A9BB0',
          'gray-light': '#E8EDF2',
          'gray-50': '#F5F7FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        modal: '0 20px 60px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
