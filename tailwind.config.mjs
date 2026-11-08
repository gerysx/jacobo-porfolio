/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,md}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Geist Variable'", "system-ui", "sans-serif"],
        serif: ["'Fraunces Variable'", "Georgia", "serif"],
      },
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        pine: "rgb(var(--pine) / <alpha-value>)",
      },
    },
  },
}
