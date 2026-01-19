import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "no-console": "warn",
      "prettier/prettier": "error",
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
    },
  },
];
