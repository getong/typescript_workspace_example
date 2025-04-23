import honoConfig from "@hono/eslint-config";

export default [
  {
    ignores: ["eslint.config.mjs"],
  },
  {
    files: ["eslint.config.mjs"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  ...honoConfig,
];
