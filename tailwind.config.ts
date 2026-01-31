import type { Config } from 'tailwindcss';

export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./*.tsx",
    "./*.ts",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
