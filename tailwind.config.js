module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        action: "#1EA7FD",
      },
      backgroundImage: {
        alpha0:
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA+SURBVHgB7dQxCgAgDATBKHai/3+nUVv9glfYhN36YIpAks99TGj4UuaW7XMAAAARgKL+lt6qtOcGAAAAD132Zgno1nuxuwAAAABJRU5ErkJggg==')",
      },
      maxHeight: {
        sidebar: "40rem",
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
