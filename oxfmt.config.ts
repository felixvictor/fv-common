import { defineConfig } from "oxfmt"

import type { BarrelCategory } from "./scripts/barrel-categories.types.js"

import categoriesJson from "./scripts/barrel-categories.json" with { type: "json" }

const barrelCategories = categoriesJson as BarrelCategory[]

const barrelFiles = barrelCategories.map((category) => `src/${category.name}.ts`)

export default defineConfig({
    ignorePatterns: ["CHANGELOG.md", "dist/**", "pnpm-lock.yaml", "src/index.ts", ...barrelFiles],
    printWidth: 120,
    semi: false,
    sortPackageJson: {
        sortScripts: true,
    },
})
