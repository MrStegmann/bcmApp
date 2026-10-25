/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // CourtVision Kinetic Surfaces
        surface: "#0B1326",
        "surface-dim": "#0B1326",
        "surface-bright": "#31394D",
        "surface-container-lowest": "#060E20",
        "surface-container-low": "#131B2E",
        "surface-container": "#171F33",
        "surface-container-high": "#222A3D",
        "surface-container-highest": "#2D3449",
        "surface-variant": "#2D3449",

        // Contrast & Text
        "on-surface": "#DAE2FD",
        "on-surface-variant": "#E0C0B1",
        "inverse-surface": "#DAE2FD",
        "inverse-on-surface": "#283044",

        // Structural & Borders
        outline: "#A78B7D",
        "outline-variant": "#584237",
        "slate-dark": "#0F172A",
        "slate-card": "#1E293B",
        "slate-border": "#334155",

        // Brand & Accents
        primary: "#FFB690",
        "on-primary": "#552100",
        "primary-container": "#F97316",
        "on-primary-container": "#582200",
        "court-orange": "#F97316",
        "court-orange-dark": "#EA580C",

        secondary: "#89CEFF",
        "on-secondary": "#00344D",
        "secondary-container": "#00A2E6",
        "on-secondary-container": "#00344E",
        "tactical-blue": "#0EA5E9",
        "tactical-blue-light": "#38BDF8",

        tertiary: "#7BD0FF",
        "on-tertiary": "#00354A",
        "tertiary-container": "#00A6DF",
        "on-tertiary-container": "#00374D",

        // Functional & Feedback
        error: "#FFB4AB",
        "on-error": "#690005",
        "error-container": "#93000A",
        "on-error-container": "#FFDAD6",
        "court-green": "#10B981",
        "court-red": "#EF4444",

        // Text Aliases
        "court-white": "#FFFFFF",
        "court-offwhite": "#F8FAFC",

        // Backward-compatible Danish tokens
        "danish-red": "#78081d",
        "danish-white": "#F8F8F8",
        "danish-dark-gray": "#1D2633",
        "danish-light-gray": "#A1A7B2",
        "danish-gold": "#FFD700",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "-apple-system", "Roboto", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "Roboto", "sans-serif"],
        mono: ["monospace"],
      },
      spacing: {
        gutter: "1rem",
        "gutter-sm": "0.75rem",
        margin: "1rem",
        "margin-tablet": "1.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
