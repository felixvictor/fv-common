import SVGPathCommander from "svg-path-commander";
export const optimisePath = (path) => new SVGPathCommander(path, { round: 2 }).optimize().toString();
//# sourceMappingURL=optimise.js.map