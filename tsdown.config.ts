import { defineConfig } from "tsdown"

const config = {
    format: "esm",
    minify: true,
    sourcemap: true,
    target: false, // disable all syntax transformations
    treeshake: true,
    tsconfig: "tsconfig.build.json",
} as const

export default defineConfig([
    {
        entry: "src/index.ts",
        platform: "browser",
        ...config,
    },
    {
        entry: "src/node.ts",
        platform: "node",
        ...config,
    },
    {
        entry: "src/na.ts",
        platform: "neutral",
        ...config,
    },
])
