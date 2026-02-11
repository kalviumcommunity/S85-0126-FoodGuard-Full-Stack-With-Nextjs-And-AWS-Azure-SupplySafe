import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F9FC",
        foreground: "#1A1A1A",
        primary: "#0F2A44",
        "primary-foreground": "#ffffff",
        secondary: "#1E7F5C",
        "secondary-foreground": "#ffffff",
        accent: "#FF9F1C",
        "accent-foreground": "#ffffff",
        muted: "#6B7280",
        "muted-foreground": "#9CA3AF",
        border: "#E5E7EB",
        input: "#FFFFFF",
        card: "#FFFFFF",
        "card-foreground": "#1A1A1A",
        destructive: "#DC2626",
        "destructive-foreground": "#ffffff",
        warning: "#F59E0B",
        success: "#10B981",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "spin-slow": "spin-slow 8s linear infinite",
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
