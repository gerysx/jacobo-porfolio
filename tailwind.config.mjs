/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,md}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Geist Variable'", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        "brand-fg": "rgb(var(--brand-fg) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        up: "rgb(var(--up) / <alpha-value>)",
        down: "rgb(var(--down) / <alpha-value>)",
        navy: { 950: "#06111f", 900: "#0b1d36", 800: "#12294a", 700: "#1b3a66" },
      },
    },
  },
}
