import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier/flat"
import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Typescript-specific rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "no-explicit-any": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",

      // Core formatting
      quotes: ["error", "double"],
      semi: ["error", "never"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "comma-spacing": ["error", { before: false, after: true }],
      "keyword-spacing": ["error", { before: true, after: true }],
      "object-curly-spacing": ["error", "always"],
      "space-before-blocks": "error",
      "space-before-function-paren": [
        "error",
        { anonymous: "never", named: "never", asyncArrow: "always" },
      ],
      "space-infix-ops": "error",
      "space-unary-ops": "error",

      // Code quality and best practices
      curly: ["error", "multi-line", "consistent"],
      eqeqeq: ["warn", "always", { null: "ignore" }],
      yoda: "error",
      "dot-location": ["error", "property"],
      "no-lonely-if": "error",
      "no-console": "warn",
      "no-empty-function": ["error", { allow: ["arrowFunctions"] }],
      "no-floating-decimal": "error",
      "no-var": "error",
      "prefer-const": ["error", { destructuring: "all" }],
      "prefer-template": "error",
      "no-useless-concat": "error",
      "no-unneeded-ternary": "error",

      // Readability and consistency
      "max-statements-per-line": ["error", { max: 2 }],
      "max-nested-callbacks": ["error", { max: 4 }],
      "spaced-comment": ["error", "always", { exceptions: ["*"], markers: ["/"] }],

      // Whitespace rules
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
      "no-trailing-spaces": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "lib/generated/**",
  ]),
])

export default eslintConfig
