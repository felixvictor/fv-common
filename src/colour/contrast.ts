import Color from "colorjs.io"

import { blackHex, whiteHex } from "@/colour/constant"

export const wcagTextMinRatio = 4.5 // WCAG AA for normal text
export const wcagUiMinRatio = 3 // WCAG AA for UI components and outlines
export const minSurfaceLightnessDelta = 0.02 // minimum ΔL between adjacent surface levels

export const getContrastRatio = (hex1: string, hex2: string) =>
    Math.abs(new Color(hex1).contrast(new Color(hex2), "WCAG21"))

export const getContrastColour = (colour: string, colourBlack = blackHex, colourWhite = whiteHex): string => {
    const colour2 = new Color(colour)

    const colourBReference = new Color(colourBlack)
    const colourWReference = new Color(colourWhite)

    const contrastB = colour2.contrast(colourBReference, "WCAG21")
    const contrastW = colour2.contrast(colourWReference, "WCAG21")
    return contrastB > contrastW ? colourBlack : colourWhite
}
