import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  ...compat.config({
    ignorePatterns: ["node_modules", ".next", "public", "utils/supabase/**"],
    rules: {
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-var-requires": "warn",
      "no-empty": ["error", { allowEmptyCatch: false }],
      "comma-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],
      "react-hooks/exhaustive-deps": "off",
    },
  }),
];

export default eslintConfig;
