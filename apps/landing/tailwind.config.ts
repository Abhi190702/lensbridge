import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c111d",
        brand: "#8fd8ff",
        accent: "#9bffd2"
      }
    }
  },
  plugins: []
} satisfies Config;
