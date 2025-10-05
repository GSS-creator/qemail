import type { Config } from "tailwindcss";

const config: Config = {
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Quantum colors
        "quantum-void": "hsl(var(--quantum-void))",
        "quantum-deep": "hsl(var(--quantum-deep))",
        "quantum-space": "hsl(var(--quantum-space))",
        "quantum-nebula": "hsl(var(--quantum-nebula))",
        "quantum-energy": "hsl(var(--quantum-energy))",
        "neural-cyan": "hsl(var(--neural-cyan))",
        "neural-pink": "hsl(var(--neural-pink))",
        "neural-purple": "hsl(var(--neural-purple))",
        "neural-green": "hsl(var(--neural-green))",
        "neural-orange": "hsl(var(--neural-orange))",
        "neural-red": "hsl(var(--neural-red))",
        "neural-blue": "hsl(var(--neural-blue))",
        "neural-yellow": "hsl(var(--neural-yellow))",
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
        "quantum-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "quantum-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "quantum-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--quantum-energy))" },
          "50%": { boxShadow: "0 0 40px hsl(var(--quantum-energy))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "quantum-spin": "quantum-spin 2s linear infinite",
        "quantum-pulse": "quantum-pulse 2s ease-in-out infinite",
        "quantum-glow": "quantum-glow 2s ease-in-out infinite",
      },
      fontFamily: {
        "quantum": ["Orbitron", "monospace"],
        "neural": ["Exo 2", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
