// tailwind.config.ts (v4-friendly)
import type { Config } from "tailwindcss";

const config: Config = {
 important: true,
 content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx,css}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx,css}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx,css}",
 ],
 theme: {
  extend: {
   colors: {
    primary: "#FF5A3C",
    secondary: "#6366F1",
    success: { DEFAULT: "#16A34A", 50: "#ECFDF3", 200: "#ABEFC6", 700: "#067647" },
    warning: { DEFAULT: "#FACC15", 50: "#FFFAEB", 200: "#FEDF89", 700: "#B54708" },
    error: { DEFAULT: "#DC2626", 50: "#FEF3F2", 200: "#FECDCA", 700: "#B42318" },
    white: { DEFAULT: "#ffffff" },
    black: { DEFAULT: "#000000" },
    red: { DEFAULT: "#F84C41", 50: "#FEEEED", 600: "#A60C0C" },
    brand: { 500: "#FF4700" },
    gray: { 50: "#F8FAFC", 200: "#E3E8EF", 300: "#CDD5DF", 400: "#9AA4B2", 500: "#697586", 600: "#121926", 700: "#364152", 900: "#121926" },
    blue: { 50: "#EFF8FF", 700: "#175CD3" },
    pink: { 50: "#FDF2FA", 700: "#C11574" },
    purple: { 50: "#F4F3FF", 700: "#5925DC" },
   },
   borderRadius: { sm: "6px", md: "8px", lg: "12px", xl: "16px" },
   fontSize: {
    "10": "10px", "12": "12px", "14": "14px", "16": "16px", "18": "18px",
    "20": "20px", "22": "22px", "24": "24px", "26": "26px", "28": "28px",
    "30": "30px", "32": "32px",
   },
   spacing: {
    "4": "4px", "6": "6px", "8": "8px", "10": "10px", "12": "12px", "14": "14px",
    "16": "16px", "18": "18px", "20": "20px", "24": "24px", "32": "32px",
    "40": "40px", "48": "48px", "56": "56px", "64": "64px", "72": "72px",
   },
   boxShadow: { button: "0px 1px 2px 0px #0A0D120D" },
  },
 },
 plugins: [],
};

export default config;
