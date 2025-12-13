export const drawSvgRect = (x: number, y: number, h: number, w: number): string => `M${x},${y}h${w}v${h}h${-w}`
export const drawSvgLine = (x1: number, y1: number, x2: number, y2: number): string => `M${x1},${y1}L${x2},${y2}`
export const drawSvgVLine = (x: number, y: number, l: number): string => `M${x},${y}v${l}`
export const drawSvgHLine = (x: number, y: number, l: number): string => `M${x},${y}h${l}`
