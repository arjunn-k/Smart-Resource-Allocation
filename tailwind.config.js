/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        base: "#030712",
        surface: "#0f172a",
        urgent: "#ef4444",
        survey: "#facc15",
        volunteer: "#22c55e",
        match: "#22d3ee",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 16px 40px rgba(34,211,238,0.12)",
        urgent: "0 0 25px rgba(239,68,68,0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "70%": { transform: "scale(1.08)", opacity: "0.1" },
          "100%": { transform: "scale(1.12)", opacity: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseRing: "pulseRing 2.2s ease-out infinite",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.14) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
