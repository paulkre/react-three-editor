const {
  CracoAliasPlugin,
  configPaths,
} = require("react-app-rewire-alias/lib/aliasDangerous");
const postcssConfig = require("../postcss.config");

module.exports = {
  style: {
    postcss: postcssConfig,
  },
  webpack: {
    remove: ["ModuleScopePlugin"],
  },
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: { alias: configPaths("./tsconfig.paths.json") },
    },
  ],
};
