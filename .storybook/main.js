module.exports = {
  stories: ["../stories/**/*.stories.@(ts|tsx|js|jsx)"],
  addons: ["@storybook/addon-essentials"],
  typescript: {
    check: true, // type-check stories during Storybook build
  },
};
