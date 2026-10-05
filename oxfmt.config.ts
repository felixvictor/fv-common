import { defineConfig } from "oxfmt"

export default defineConfig({
    ignorePatterns: ["CHANGELOG.md", "dist/**", "pnpm-lock.yaml"],
    jsdoc: true,
    printWidth: 120,
    semi: false,
    sortPackageJson: {
        sortScripts: true,
    },
})
