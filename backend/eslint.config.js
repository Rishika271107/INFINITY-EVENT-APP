module.exports = [
  {
    ignores: ["coverage/**", "logs/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    rules: {},
  },
];
