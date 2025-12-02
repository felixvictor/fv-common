import eslint from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import nodePlugin from "eslint-plugin-n"
import perfectionist from "eslint-plugin-perfectionist"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import globals from "globals"
import typescriptEslint from "typescript-eslint"
import requireFreshBarrel from "./eslint-rules/require-barrel.mts"

const localPlugin = {
    rules: {
        "require-barrel": requireFreshBarrel,
    },
}

export default typescriptEslint.config(
    eslint.configs.recommended,
    ...typescriptEslint.configs.strictTypeChecked,
    ...typescriptEslint.configs.stylisticTypeChecked,
    eslintPluginUnicorn.configs["flat/recommended"],
    nodePlugin.configs["flat/recommended"],
    perfectionist.configs["recommended-natural"],
    eslintConfigPrettier,
    {
        ignores: [".gitignore", "eslint.config.mjs", "dist/**", "node_modules/**"],
    },
    {
        languageOptions: {
            globals: {
                ...globals.es2021,
                ...globals.node,
            },
            parserOptions: {
                project: "./tsconfig.eslint.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
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
            "local/require-barrel": "error",
            // Disable rules that might conflict with auto-generated code
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
)
