/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // enables `dark:` variants
  theme: {
    extend: {
      colors: {
        // Optional: Add your brand colors
      }
    }
  },
  plugins: [],
}