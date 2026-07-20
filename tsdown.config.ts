import { defineConfig } from "tsdown"

import type { BarrelCategory } from "./scripts/barrel-categories.types.js"

import categoriesJson from "./scripts/barrel-categories.json" with { type: "json" }

const barrelCategories = categoriesJson as BarrelCategory[]

const sharedConfig = {
    format: "esm",
    minify: true,
    sourcemap: true,
    target: false,
    treeshake: true,
} as const

const categoryEntries = barrelCategories.map((category) => {
    const needsCustomExtension = category.outputExtension && category.outputExtension !== ".js"

    return {
        entry: `src/${category.name}.ts`,
        platform: category.platform ?? "neutral",
        tsconfig: category.tsconfig ?? "./tsconfig.browser.json",
        ...(needsCustomExtension ? { outputOptions: { entryFileNames: `[name]${category.outputExtension}` } } : {}),
        ...sharedConfig,
    }
})

export default defineConfig([
    {
        entry: "src/index.ts",
        platform: "browser",
        tsconfig: "./tsconfig.browser.json",
        ...sharedConfig,
    },
    ...categoryEntries,
])
