import SVGPathCommander from "svg-path-commander"

export const optimisePath = (path: string): string => new SVGPathCommander(path, { round: 2 }).optimize().toString()
