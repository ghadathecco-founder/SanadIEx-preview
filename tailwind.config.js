/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          950: "#2D1B4E",
          800: "#4C2A7A",
          600: "#6B3FA0",
          400: "#9B6DD4",
        },
        cream: {
          50: "#FBF7F0",
          100: "#F4EDE0",
        },
        sand: {
          300: "#D4C4A8",
          500: "#C4A37A",
        },
        ink: "#1A1228",
        muted: "#6B5E73",
      },
      fontFamily: {
        sans: [
          "IBM Plex Sans Arabic",
          "IBM Plex Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        latin: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(45, 27, 78, 0.04), 0 8px 24px -12px rgba(45, 27, 78, 0.18)",
        inset: "inset 0 0 0 1px rgba(212, 196, 168, 0.55)",
      },
      maxWidth: {
        shell: "1440px",
      },
    },
  },
  plugins: [],
};
