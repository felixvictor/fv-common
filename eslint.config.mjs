import eslint from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import nodePlugin from "eslint-plugin-n"
import perfectionist from "eslint-plugin-perfectionist"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import globals from "globals"
import typescriptEslint from "typescript-eslint"

export default typescriptEslint.config(
    eslint.configs.recommended,
    ...typescriptEslint.configs.strictTypeChecked,
    ...typescriptEslint.configs.stylisticTypeChecked,
    eslintPluginUnicorn.configs["flat/recommended"],
    nodePlugin.configs["flat/recommended"],
    perfectionist.configs["recommended-natural"],
    eslintConfigPrettier,
    { ignores: [".gitignore", "eslint.config.mjs", "dist/"] },
    {
        languageOptions: {
            globals: {
                ...globals.es2021,
                ...globals.node,
            },
            parserOptions: {
                project: true,
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
)
