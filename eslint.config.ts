import eslint from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
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

export default defineConfig(
    eslint.configs.recommended,
    ...typescriptEslint.configs.strictTypeChecked,
    ...typescriptEslint.configs.stylisticTypeChecked,
    eslintPluginUnicorn.configs.recommended,
    perfectionist.configs["recommended-natural"],
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
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    custom: {
                        match: true,
                        regex: "^(is|has|can|should|will|did)[A-Z]",
                    },
                    format: ["camelCase"],
                    selector: "variable",
                    types: ["boolean"],
                },
            ],
            "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
            "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
            curly: ["error", "multi-line"],
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
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    custom: {
                        match: true,
                        regex: "^(is|has|can|should|will|did)[A-Z]",
                    },
                    format: ["camelCase"],
                    selector: "variable",
                    types: ["boolean"],
                },
            ],
            "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
            "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
            curly: ["error", "multi-line"],
            "prefer-template": "error",
        },
    },
    {
        files: ["src/index.ts"],
        plugins: {
            local: localPlugin,
        },
        rules: {
            "local/require-barrel": "error",
        },
    },
)
