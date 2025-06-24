/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', '"Noto Sans"', 'sans-serif'],
      },
      colors: {
        dark: "#1a1a1a",
        accent: "#363636",
        text: "#adadad",
      },
    },
  },
  plugins: [],
}