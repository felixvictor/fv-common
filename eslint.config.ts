import eslint from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import nodePlugin from "eslint-plugin-n"
import perfectionist from "eslint-plugin-perfectionist"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import { defineConfig } from "eslint/config"
import globals from "globals"
import typescriptEslint from "typescript-eslint"

import requireFreshBarrel from "./eslint-rules/require-barrel.mjs"

const localPlugin = {
    rules: {
        "require-barrel": requireFreshBarrel,
    },
}

const perfectionistConfig = perfectionist.configs?.["recommended-natural"]

export default defineConfig(
    eslint.configs.recommended,
    ...typescriptEslint.configs.strictTypeChecked,
    ...typescriptEslint.configs.stylisticTypeChecked,
    eslintPluginUnicorn.configs.recommended,
    // @ts-expect-error - perfectionist config types don't match exactly
    ...(perfectionistConfig ? [perfectionistConfig] : []),
    eslintConfigPrettier,
    {
        ignores: [".gitignore", "dist/**", "node_modules/**"],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    nodePlugin.configs["flat/recommended"],
    {
        files: ["src/**/*"],
        ignores: ["scripts/**/*", "src/node/**/*", "src/node.ts"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2024,
            },
        },
        name: "browser",
        rules: {
            "@typescript-eslint/no-extraneous-class": "off",
            "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
            "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
            curly: ["error", "multi-line"],
            "n/no-missing-import": "off",
            "prefer-template": "error",
        },
    },
    {
        files: ["*.config.*", "scripts/**/*", "src/node/**/*", "src/node.ts"],
        languageOptions: {
            globals: {
                ...globals.nodeBuiltin,
                ...globals.es2024,
            },
        },
        name: "node",
        rules: {
            "@typescript-eslint/no-extraneous-class": "off",
            "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
            "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
            curly: ["error", "multi-line"],
            "n/no-missing-import": "off",
            "n/no-unpublished-import": "off",
            "prefer-template": "error",
        },
    },
    {
        files: ["src/index.ts"],
        plugins: {
            local: localPlugin,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "off",
            "local/require-barrel": "error",
        },
    },
)
