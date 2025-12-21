/**
 * Generates an SVG path string for a circle.
 * Uses arc commands to draw two semicircles.
 *
 * @param x - Center x-coordinate.
 * @param y - Center y-coordinate.
 * @param r - Radius.
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgCircle(50, 50, 20)} />
 * // Draws a circle centered at (50, 50) with radius 20
 */
export const drawSvgCircle = (x: number, y: number, r: number): string => {
    // Move to leftmost point, draw two 180° arcs to complete the circle
    // Format: M(x,y) a(rx,ry) rotation large-arc-flag sweep-flag (dx,dy)
    return `M${x - r},${y}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`
}

/**
 * Generates an SVG path string for a rectangle.
 * The rectangle is centered at (x, y).
 *
 * @param x - Center x-coordinate.
 * @param y - Center y-coordinate.
 * @param size - Width and height of the rectangle.
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgRect(50, 50, 30)} />
 * // Draws a 30×30 square centered at (50, 50)
 */
export const drawSvgRect = (x: number, y: number, size: number): string => {
    const halfSize = size / 2
    // Move to top-left, draw horizontal, vertical, horizontal back, close path
    return `M${x - halfSize},${y - halfSize}h${size}v${size}h${-size}z`
}

/**
 * Generates an SVG path string for a rectangle with separate width and height.
 * The rectangle is centered at (x, y).
 *
 * @param x - Center x-coordinate.
 * @param y - Center y-coordinate.
 * @param width - Rectangle width.
 * @param height - Rectangle height.
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgRectWH(50, 50, 40, 20)} />
 * // Draws a 40×20 rectangle centered at (50, 50)
 */
export const drawSvgRectWH = (x: number, y: number, width: number, height: number): string => {
    const halfWidth = width / 2
    const halfHeight = height / 2
    return `M${x - halfWidth},${y - halfHeight}h${width}v${height}h${-width}z`
}

/**
 * Generates an SVG path string for a vertical line.
 *
 * @param x - Starting x-coordinate.
 * @param y - Starting y-coordinate.
 * @param length - Length of the line (positive = down, negative = up).
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgVLine(50, 20, 60)} />
 * // Draws a vertical line from (50, 20) downward 60 units
 */
export const drawSvgVLine = (x: number, y: number, length: number): string => {
    return `M${x},${y}v${length}`
}

/**
 * Generates an SVG path string for a horizontal line.
 *
 * @param x - Starting x-coordinate.
 * @param y - Starting y-coordinate.
 * @param length - Length of the line (positive = right, negative = left).
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgHLine(20, 50, 60)} />
 * // Draws a horizontal line from (20, 50) rightward 60 units
 */
export const drawSvgHLine = (x: number, y: number, length: number): string => {
    return `M${x},${y}h${length}`
}

/**
 * Generates an SVG path string for a line between two points.
 *
 * @param x1 - Starting x-coordinate.
 * @param y1 - Starting y-coordinate.
 * @param x2 - Ending x-coordinate.
 * @param y2 - Ending y-coordinate.
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgLine(10, 10, 90, 90)} />
 * // Draws a line from (10, 10) to (90, 90)
 */
export const drawSvgLine = (x1: number, y1: number, x2: number, y2: number): string => {
    return `M${x1},${y1}L${x2},${y2}`
}
