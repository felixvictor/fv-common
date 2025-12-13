export const drawSvgRect = (x, y, h, w) => `M${x},${y}h${w}v${h}h${-w}`;
export const drawSvgLine = (x1, y1, x2, y2) => `M${x1},${y1}L${x2},${y2}`;
export const drawSvgVLine = (x, y, l) => `M${x},${y}v${l}`;
export const drawSvgHLine = (x, y, l) => `M${x},${y}h${l}`;
//# sourceMappingURL=draw.js.map