import type { Config } from "tailwindcss";
export const myThemeColors = {
  primary: "#F69A27",
  secondary: "#f6d860",
  warning: "#6C5130",
  "warning-content": "#EC9517",
  accent: "#89488B",
  "accent-content": "#FFFFFF",
  neutral: "#9A9A9A",
  "neutral-content": "#A2A2A2",
  "base-100": "#1E1E1E",
  "base-200": "#323232",
  "base-300": "#464646",
  success: "#2D613A",
  "success-content": "#43D74B",
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/*.{js,ts,jsx,tsx,mdx}",
    "./src/style/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mytheme: myThemeColors,
      },
      "night",
      "emerald",
    ],
  },
};
export default config;
