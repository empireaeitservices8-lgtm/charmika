import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#6A102A",
          50: "#FDF4F6",
          100: "#FBE6EC",
          200: "#F5C2CE",
          300: "#EE93A8",
          400: "#E25A7C",
          500: "#CA2F58",
          600: "#AA1D43",
          700: "#8B1436",
          800: "#6A102A", // Brand primary
          900: "#4B091C",
          950: "#2D0310",
        },
        gold: {
          DEFAULT: "#C89B3C",
          50: "#FAF6E8",
          100: "#F4ECC9",
          200: "#E9D896",
          300: "#DFC263",
          400: "#D4AF37",
          500: "#C89B3C", // Brand primary gold
          600: "#A57B28",
          700: "#7F5A1C",
          800: "#5D4014",
          900: "#3D280B",
        },
        beige: {
          DEFAULT: "#FAF6F2",
          light: "#FCFAF7",
          dark: "#EFE5D9",
        },
        charcoal: {
          DEFAULT: "#222222",
          light: "#333333",
          muted: "#666666",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -5px rgba(106, 16, 42, 0.08), 0 4px 12px -2px rgba(200, 155, 60, 0.06)",
        "luxury-lg": "0 20px 40px -10px rgba(106, 16, 42, 0.12), 0 8px 24px -4px rgba(200, 155, 60, 0.1)",
        gold: "0 0 20px rgba(200, 155, 60, 0.25)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E5C268 0%, #C89B3C 50%, #9B7424 100%)",
        "maroon-gradient": "linear-gradient(135deg, #8B1436 0%, #6A102A 50%, #4B091C 100%)",
        "luxury-radial": "radial-gradient(circle at center, rgba(200, 155, 60, 0.12) 0%, transparent 70%)",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        float: "float 4s ease-in-out infinite",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
