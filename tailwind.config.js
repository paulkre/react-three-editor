module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        action: "#1EA7FD",
      },
      boxShadow: {
        viewer:
          "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
      },
      backgroundImage: {
        alpha0:
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABCSURBVHgB7dSxCQAgDETRKE4g2cXaEdx/heAKuoJX2IT/64NXBFLGXMeE3Lsyt2qfAwAAyAA09bdEbGnPDQAAAB66OGYFNLcrc5kAAAAASUVORK5CYII=')",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
