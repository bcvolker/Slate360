import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */

const config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate360: { blue: '#4B9CD3', copper: '#B87333', slate: '#2F4F4F' },
      },
      fontFamily: { orbitron: ['Orbitron', 'sans-serif'], inter: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [tailwindcssAnimate],
};

module.exports = config;
