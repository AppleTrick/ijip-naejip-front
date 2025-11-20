import { colors } from './src/constants/colors.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.primary,
          hover: colors.primaryHover,
        },
        secondary: {
          DEFAULT: colors.secondary,
          hover: colors.secondaryHover,
        },
        bg: colors.background,
        text: colors.text,
        danger: {
          DEFAULT: colors.danger,
          hover: colors.dangerHover,
        },
      }
    },
  },
  plugins: [],
}
