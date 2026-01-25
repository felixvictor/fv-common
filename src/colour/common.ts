import Color from "colorjs.io"

export const getContrastColour = (colour: string, colourBlack = "#000", colourWhite = "#fff"): string => {
    const colour2 = new Color(colour)

    const colourBReference = new Color(colourBlack)
    const colourWReference = new Color(colourWhite)

    const contrastB = colour2.contrast(colourBReference, "WCAG21")
    const contrastW = colour2.contrast(colourWReference, "WCAG21")
    return contrastB > contrastW ? colourBlack : colourWhite
}
