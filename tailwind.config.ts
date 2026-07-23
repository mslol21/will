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
          "navy-light": "#2C3B5E",
          gold: "#B88E34",
          "gold-light": "#D4AF37",
          "gold-dark": "#8C6B21",
          caramel: "#D2B48C",
          beige: "#F2ECE2",
          "beige-paper": "#FAF7F2",
          coffee: "#3D2E24",
          wood: "#5C3A21",
          "wood-dark": "#3B2212",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(31, 42, 68, 0.15)",
        gold: "0 4px 20px -2px rgba(184, 142, 52, 0.25)",
        card: "0 4px 20px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        'kraft-pattern': "radial-gradient(#D2B48C 0.75px, transparent 0.75px)",
      }
    },
  },
  plugins: [],
};
export default config;
