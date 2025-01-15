import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";

/** @type {import('eslint').Linter.Config} */
export default {
  files: ["**/*.{js,mjs,cjs,ts}"],
  rules: {
    "no-unused-vars": ["error", { varsIgnorePattern: "^mongoose$" }],
  },
  languageOptions: {
    globals: globals.browser,
  },
  extends: [
    pluginJs.configs.recommended,
    "plugin:@typescript-eslint/recommended", // Correct reference for TypeScript ESLint plugin
  ],
};
