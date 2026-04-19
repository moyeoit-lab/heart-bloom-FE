import nextConfig from "eslint-config-next";
import tanstackQuery from "@tanstack/eslint-plugin-query";

const eslintConfig = [
  ...nextConfig,
  ...tanstackQuery.configs["flat/recommended"],
  {
    rules: {
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/stable-query-client": "error",
      "@tanstack/query/no-rest-destructuring": "warn",
      "@tanstack/query/no-unstable-deps": "warn",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/public/**",
      "**/dist/**",
      ".next/**",
      "out/**",
    ],
  },
];

export default eslintConfig;
