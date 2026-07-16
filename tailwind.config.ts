import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        page: "#f4f1ea",
        ink: "#16211c",
        muted: "#5f6d67",
        accent: "#2f6f62",
        accentSoft: "#d9ebe3",
        sand: "#efe5d3",
        line: "rgba(22, 33, 28, 0.12)",
      },
      boxShadow: {
        soft: "0 24px 60px rgba(22, 33, 28, 0.12)",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;