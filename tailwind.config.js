/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        background: "#202020",
        surface: "#2E2E2E",
        "text-primary": "#FFFFFF",
        "text-secondary": "#B0B0B0",
        navbar: "#3A3A3A",
        "button-primary": "#6C757D",
        "button-secondary": "#A5A5A5",
        "button-danger": "#FF6F61",
        highlight: "#2272FF",
        focus: "#00BFA5",
        card: "#2E2E2E",
        input: "#1C1C1C",
      },
    },
  },
  plugins: [],
};
