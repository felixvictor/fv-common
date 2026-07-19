export interface BarrelCategory {
    name: string
    dir: string
    platform?: "browser" | "neutral" | "node"
    tsconfig?: string
    outputExtension?: string
}
