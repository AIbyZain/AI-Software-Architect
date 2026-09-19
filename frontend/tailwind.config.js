/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F6F4",
        panel: "#FFFFFF",
        ink: {
          DEFAULT: "#10192B",
          soft: "#3A4557",
          muted: "#6B7280",
        },
        line: "#DCDFE3",
        accent: {
          DEFAULT: "#1B5FA8",
          dark: "#123F73",
          soft: "#E9F1FA",
        },
        success: { DEFAULT: "#1F7A4D", soft: "#E7F5EC" },
        danger: { DEFAULT: "#B23A2E", soft: "#FBEAE8" },
        warning: { DEFAULT: "#B8791A", soft: "#FBF1E1" },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(to right, rgba(27,95,168,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,95,168,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      keyframes: {
        draw: {
          "0%": { strokeDashoffset: "240" },
          "100%": { strokeDashoffset: "0" },
        },
        pulseFade: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        draw: "draw 1.8s ease-in-out infinite",
        pulseFade: "pulseFade 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
