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
        cyan: {
          DEFAULT: "#00FFFF",
          400: "#66FFFF",
          500: "#00FFFF",
          600: "#00D4D4",
        },
        magenta: {
          DEFAULT: "#FF00FF",
          400: "#FF66FF",
          500: "#FF00FF",
          600: "#D400D4",
        },
        success: {
          DEFAULT: "#00FF88",
          400: "#66FFB2",
          500: "#00FF88",
        },
        error: {
          DEFAULT: "#FF4444",
          400: "#FF7777",
          500: "#FF4444",
        },
        dark: {
          DEFAULT: "#000000",
          900: "#0A0A0A",
          800: "#111111",
          700: "#1A1A1A",
          600: "#222222",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px #00FFFF" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px #00FFFF" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #00FFFF, 0 0 10px #00FFFF" },
          "100%": { boxShadow: "0 0 20px #00FFFF, 0 0 30px #00FFFF" },
        },
      },
      backgroundImage: {
        "dot-matrix": "radial-gradient(circle, #333 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-matrix": "20px 20px",
      },
    },
  },
  plugins: [],
};

export default config;
