import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c111d",
        panel: "#111827",
        line: "rgba(148, 163, 184, 0.18)",
        brand: "#8fd8ff",
        accent: "#9bffd2"
      },
      boxShadow: {
        panel: "0 24px 80px rgba(0, 0, 0, 0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
