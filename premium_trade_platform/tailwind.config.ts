import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#F59E0B", // Amber-500 - Dorado más vibrante
          foreground: "#1F2937", // Gray-800 - Texto oscuro sobre dorado
          dark: "#D97706", // Amber-600 - Dorado más oscuro
          light: "#FEF3C7", // Amber-50 - Dorado muy claro
        },
        secondary: {
          DEFAULT: "#374151", // Gray-700 - Gris oscuro
          foreground: "#F9FAFB", // Gray-50 - Texto claro
        },
        destructive: {
          DEFAULT: "#EF4444", // Red-500
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1F2937", // Gray-800 - Fondo muted oscuro
          foreground: "#9CA3AF", // Gray-400 - Texto muted
        },
        accent: {
          DEFAULT: "#3B82F6", // Blue-500 - Azul vibrante
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#111827", // Gray-900 - Fondo popover muy oscuro
          foreground: "#F9FAFB", // Gray-50
        },
        card: {
          DEFAULT: "#1F2937", // Gray-800 - Fondo card oscuro
          foreground: "#F9FAFB", // Gray-50
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(245, 158, 11, 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in": "slide-in 0.6s ease-out",
        "scale-in": "scale-in 0.6s ease-out",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
