/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "18px",
      lg: "20px",
      xl: "24px",
      "2xl": "30px",
      "3xl": "36px",
      "4xl": "48px",
      "5xl": "64px",
    },
    extend: {
      fontFamily: {
        pixel: ['"Pixel"', 'monospace'],  
        body: ['"VT323"', 'monospace'],   
      },
    },
  },
  plugins: [],
};
