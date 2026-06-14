import Color from "colorjs.io"

export const wcagTextMinRatio = 4.5 // WCAG AA for normal text
export const wcagUiMinRatio = 3 // WCAG AA for UI components and outlines
export const minSurfaceLightnessDelta = 0.02 // minimum ΔL between adjacent surface levels

export const contrastRatio = (hex1: string, hex2: string) =>
    Math.abs(new Color(hex1).contrast(new Color(hex2), "WCAG21"))
