import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/app/**/*.ts", "src/app/**/*.tsx", "src/components/**/*.ts", "src/components/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/data/mock", "@/lib/data/mock/*"],
              message: "Import from '@/lib/data' (factory) or '@/lib/domain/types' instead. Direct mock imports violate the repository boundary."
            },
            {
              group: ["@/lib/data/profit4", "@/lib/data/profit4/*"],
              message: "Import from '@/lib/data' (factory) or '@/lib/domain/types' instead. Direct profit4 imports violate the repository boundary."
            }
          ]
        }
      ]
    }
  }
]);

export default eslintConfig;
