import Color from "colorjs.io"

import { blackHex, whiteHex } from "@/colour/constant"
import { round } from "@/format/number"

export type ApcaTextRole = "bodyText" | "largeFluentText" | "otherContentText"

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

    const contrastB = colour2.contrast(colourBReference, "APCA")
    const contrastW = colour2.contrast(colourWReference, "APCA")

    return Math.abs(contrastB) > Math.abs(contrastW) ? colourBlack : colourWhite
}

/** Absolute APCA Lc contrast (0–108) between text and background colours */
export const getApcaContrast = (textHex: string, backgroundHex: string): number => {
    const contrast = new Color(textHex).contrast(new Color(backgroundHex), "APCA")
    return round(Math.abs(contrast), 2)
}

/** APCA "Bronze" Conformance (https://readtech.org/ARC/tests/bronze-simple-mode/) */
export const apcaMinLcByRole: Record<ApcaTextRole, number> = {
    bodyText: 75,
    largeFluentText: 45,
    otherContentText: 60,
}

export const apcaMaxLcLargeFluentText = 90
export const apcaMinLcUiComponent = 30

export const isMeetingApcaContrast = (
    textHex: string,
    backgroundHex: string,
    role: ApcaTextRole = "bodyText",
): boolean => {
    const lc = getApcaContrast(textHex, backgroundHex)
    const isMeetsMin = lc >= apcaMinLcByRole[role]
    if (role === "largeFluentText") {
        return isMeetsMin && lc <= apcaMaxLcLargeFluentText
    }
    return isMeetsMin
}
