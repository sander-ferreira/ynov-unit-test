import js from "@eslint/js";

export default [
  {
    ignores: ["**/*.test.js", "**/*.test.jsx", "node_modules/", "docs/"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        console: "readonly",
        module: "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-unused-vars": ["warn", { varsIgnorePattern: "^React$" }],
    },
  },
];
