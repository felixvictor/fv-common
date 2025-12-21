/**
 * Gets the bounding rectangle with all dimensions floored.
 * This is the base function that other utilities build upon.
 *
 * @param element - The HTML or SVG element to measure.
 * @returns A DOMRect-like object with all values floored to integers.
 *
 * @example
 * const rect = getElementRect(document.getElementById('myDiv'))
 * console.log(rect.top, rect.left, rect.width, rect.height)
 */
export const getElementRect = (
    element: HTMLElement | SVGElement,
): {
    bottom: number
    height: number
    left: number
    right: number
    top: number
    width: number
    x: number
    y: number
} => {
    const rect = element.getBoundingClientRect()
    return {
        bottom: Math.floor(rect.bottom),
        height: Math.floor(rect.height),
        left: Math.floor(rect.left),
        right: Math.floor(rect.right),
        top: Math.floor(rect.top),
        width: Math.floor(rect.width),
        x: Math.floor(rect.x),
        y: Math.floor(rect.y),
    }
}

/**
 * Gets the height of an element in pixels (floored to nearest integer).
 *
 * @param element - The HTML or SVG element to measure.
 * @returns The floored height in pixels, including padding and borders.
 *
 * @example
 * const height = getElementHeight(document.getElementById('myDiv'))
 */
export const getElementHeight = (element: HTMLElement | SVGElement): number => {
    return getElementRect(element).height
}

/**
 * Gets the width of an element in pixels (floored to nearest integer).
 *
 * @param element - The HTML or SVG element to measure.
 * @returns The floored width in pixels, including padding and borders.
 *
 * @example
 * const width = getElementWidth(document.getElementById('myDiv'))
 */
export const getElementWidth = (element: HTMLElement | SVGElement): number => {
    return getElementRect(element).width
}

/**
 * Gets both width and height of an element in pixels (floored to nearest integers).
 *
 * @param element - The HTML or SVG element to measure.
 * @returns An object containing floored width and height in pixels.
 *
 * @example
 * const { width, height } = getElementDimensions(document.getElementById('myDiv'))
 */
export const getElementDimensions = (element: HTMLElement | SVGElement): { height: number; width: number } => {
    const { height, width } = getElementRect(element)
    return { height, width }
}

/**
 * Gets precise (non-floored) dimensions of an element.
 *
 * @param element - The HTML or SVG element to measure.
 * @returns An object containing precise width and height in pixels.
 *
 * @example
 * const { width, height } = getElementDimensionsPrecise(document.getElementById('myDiv'))
 * // Returns fractional pixels: { width: 150.5, height: 200.75 }
 */
export const getElementDimensionsPrecise = (element: HTMLElement | SVGElement): { height: number; width: number } => {
    const { height, width } = element.getBoundingClientRect()
    return { height, width }
}
