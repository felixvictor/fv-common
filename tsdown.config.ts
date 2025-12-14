import { defineConfig } from "tsdown"

const d = {
    tsconfig: "tsconfig.build.json",
    format: "esm",
    target: false,
    minify: false,
    sourcemap: true,
    treeshake: true,
}

export default defineConfig([
    {
        entry: "src/index.ts",
        platform: "browser",
        ...d,
    },
    {
        entry: "src/node.ts",
        platform: "node",
        ...d,
    },
])
