/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blueprint: {
          bg: "#070e1c",
          surface: "#091426",
          card: "#0a162b",
          "card-hover": "#0e1e3b",
          border: "#182c48",
          "border-light": "#234067",
          "border-active": "#3b82f6",
          grid: "rgba(56, 189, 248, 0.08)",
        },
        accent: {
          amber: {
            DEFAULT: "#f59e0b",
            hover: "#d97706",
            light: "#fbbf24",
            dim: "rgba(245, 158, 11, 0.15)",
          },
          cyan: {
            DEFAULT: "#22d3ee",
            hover: "#06b6d4",
            light: "#67e8f9",
            dim: "rgba(34, 211, 238, 0.12)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "blueprint-grid": "linear-gradient(to right, rgba(56, 189, 248, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.07) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-size": "36px 36px",
      },
    },
  },
  plugins: [],
}
