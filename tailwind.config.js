/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,tsx}",
    "./src/**/**/*.{html,js,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Roboto", "Helvetica", "Arial", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: ["0.65rem", { lineHeight: "1.25" }], 
        xs: ["0.75rem", { lineHeight: "1.25" }], 
        sm: ["0.875rem", { lineHeight: "1.25" }], 
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.5" }], 
        xl: ["1.25rem", { lineHeight: "2" }], 
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
