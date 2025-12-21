import { defineConfig } from "tsdown"

const config = {
    format: "esm",
    minify: true,
    sourcemap: true,
    target: false, // disable all syntax transformations
    treeshake: true,
} as const

export default defineConfig([
    {
        entry: "src/index.ts",
        platform: "browser",
        tsconfig: "tsconfig.browser.json",
        ...config,
    },
    {
        entry: "src/node.ts",
        platform: "node",
        tsconfig: "tsconfig.node.json",
        ...config,
    },
    {
        entry: "src/na.ts",
        platform: "neutral",
        tsconfig: "tsconfig.browser.json",
        ...config,
    },
])
