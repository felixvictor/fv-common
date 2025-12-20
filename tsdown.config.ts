import { defineConfig } from "tsdown"

const d = {
    format: "esm",
    minify: false,
    sourcemap: true,
    target: false,
    treeshake: true,
    tsconfig: "tsconfig.build.json",
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
