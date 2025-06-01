/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",         // ✅ برای App Router
    "./components/**/*.{js,ts,jsx,tsx}",  // ✅ برای کامپوننت‌ها
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Pixel"', 'monospace'],   // ✅ چون در globals.css اینو تعریف کردی
        body: ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
};
