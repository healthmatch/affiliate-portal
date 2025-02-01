/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5E4DB2',
        'primary-dark': '#4E3D92',
      },
    },
  },
  plugins: [],
};