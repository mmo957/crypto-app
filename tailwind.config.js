/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        negative: "#F85A58",
        positive: "#0ECB81",
        orange: "#E59838",
        color1: "#D38F4B",
        color2: "#5286BC",
        color3: "#86BA70",
        color4: "#602F2C",
        gray: "#4C4C4C",
        special: "#E6DB67",
        gray1: "#6F747C",
        boxColor: "#333649",
      },
    },
  },
  plugins: [],
};
