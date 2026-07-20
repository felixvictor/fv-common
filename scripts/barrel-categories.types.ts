export interface BarrelCategory {
    dir: string
    name: string
    outputExtension?: string
    platform?: "browser" | "neutral" | "node"
    tsconfig?: string
}
