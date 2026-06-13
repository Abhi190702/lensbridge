import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0f18",
        panel: "#101722",
        line: "rgba(148, 163, 184, 0.16)",
        brand: "#7dd3fc",
        accent: "#6ee7b7"
      },
      boxShadow: {
        panel: "0 16px 48px rgba(0, 0, 0, 0.22)"
      }
    }
  },
  plugins: []
} satisfies Config;
