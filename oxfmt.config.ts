import { defineConfig } from "oxfmt"

export default defineConfig({
    ignorePatterns: ["CHANGELOG.md", "dist/**", "pnpm-lock.yaml"],
    printWidth: 120,
    semi: false,
    sortPackageJson: {
        sortScripts: true,
    },
})
