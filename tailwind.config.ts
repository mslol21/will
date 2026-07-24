import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emporio: {
          navy: "#1F2A44",
          "navy-dark": "#141C2E",
          wood: "#8B5E34",
          "wood-dark": "#6F4928",
          straw: "#D2B48C",
          beige: "#F2ECE2",
          "dark-text": "#2E2E2E",
          gold: "#B88E34",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(31, 42, 68, 0.15)",
        card: "0 4px 20px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
