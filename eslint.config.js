import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jest from "eslint-plugin-jest";
import eslintSecurity from "eslint-plugin-security";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */

export default [
  { ignores: ["node_modules/", "dist/", "**/*.config.*"] },
  { files: ["src/**/*.{js,mjs,cjs,ts}", "tests/**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node, parserOptions: { ecmaVersion: 2016, sourceType: "commonjs" } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["tests/**/*.{js,mjs,cjs,ts}"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off"
    }
  },
  eslintSecurity.configs.recommended,
  eslintConfigPrettier
];
