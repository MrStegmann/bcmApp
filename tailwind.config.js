/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.js", "./src/**/*.{js,jsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "danish-red": "#78081d",
        "danish-white": "#F8F8F8",
        "danish-dark-gray": "#1D2633",
        "danish-light-gray": "#A1A7B2",
        "danish-gold": "#FFD700",
      },
    },
  },
  plugins: [],
};
