/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4cd964",
        // Background colors
        "bg-primary": "#0f1218",
        "bg-app": "#151922",
        "bg-panel": "#1a1f2a",
        "bg-button": "#1b202a",
        "bg-input": "#11151d",
        "bg-modal": "#141925",
        "bg-modal-input": "#0f141c",
        "bg-token": "#0f141c",
        "bg-token-hover": "#141925",

        // Text colors
        "text-primary": "#e8eaed",
        "text-secondary": "#aab0b7",
        "text-muted": "#8b93a1",
        "text-input": "#f5f7fb",
        "text-balance": "#cbd3df",
        "text-token": "#f5f7fb",

        // Border colors
        "border-panel": "rgba(255, 255, 255, 0.04)",
        "border-modal": "#2a3347",
        "border-input": "rgba(255, 255, 255, 0.06)",

        // Scrollbar colors
        scrollbar: "#2a3142",
        "scrollbar-hover": "#3a4256",

        // Shadow colors
        "shadow-app": "rgba(0, 0, 0, 0.6)",
        "shadow-modal": "rgba(0, 0, 0, 0.5)",
        "shadow-swap": "rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
