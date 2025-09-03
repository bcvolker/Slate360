/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',  // Add for utils/hooks
    './src/models/**/*.{js,ts}',       // Add for models
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
