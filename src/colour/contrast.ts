import Color from "colorjs.io"

import { blackHex, whiteHex } from "@/colour/constant"
import { round } from "@/format/number"

export const wcagTextMinRatio = 4.5 // WCAG AA for normal text
export const wcagUiMinRatio = 3 // WCAG AA for UI components and outlines

export const getContrastRatio = (hex1: string, hex2: string) => {
    const contrast = new Color(hex1).contrast(new Color(hex2), "WCAG21")
    return round(Math.abs(contrast), 2)
}

export const getContrastColour = (colour: string, colourBlack = blackHex, colourWhite = whiteHex): string => {
    const colour2 = new Color(colour)

    const colourBReference = new Color(colourBlack)
    const colourWReference = new Color(colourWhite)

    const contrastB = Math.abs(colour2.contrast(colourBReference, "WCAG21"))
    const contrastW = Math.abs(colour2.contrast(colourWReference, "WCAG21"))
    return contrastB > contrastW ? colourBlack : colourWhite
}
