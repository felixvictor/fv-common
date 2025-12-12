import Color, {} from "colorjs.io";
import { clamp } from "../common.js";
export class HslColour {
    static colorSpace = "okhsl";
    static hexFormat = "hex";
    static hueMax = 360;
    static hueMin = 0;
    static lightnessMax = 100;
    static lightnessMin = 0;
    static outputColorSpace = "srgb";
    static saturationMax = 100;
    static saturationMin = 0;
    get colourObject() {
        return this.#colour;
    }
    get h() {
        return this.#colour.h ?? HslColour.hueMin;
    }
    set h(value) {
        const h = Number(value);
        if (!Number.isNaN(h)) {
            this.#colour.h = ((h % HslColour.hueMax) + HslColour.hueMax) % HslColour.hueMax;
        }
    }
    get hex() {
        return this.#colour.to(HslColour.outputColorSpace).toString({ format: HslColour.hexFormat });
    }
    get l() {
        return this.#colour.l ?? HslColour.lightnessMin;
    }
    set l(value) {
        const l = Number(value);
        if (!Number.isNaN(l)) {
            this.#colour.l = clamp(l, HslColour.lightnessMin, HslColour.lightnessMax);
        }
    }
    get s() {
        return this.#colour.s ?? HslColour.saturationMin;
    }
    set s(value) {
        const s = Number(value);
        if (!Number.isNaN(s)) {
            this.#colour.s = clamp(s, HslColour.saturationMin, HslColour.saturationMax);
        }
    }
    #colour;
    constructor(argument) {
        if (typeof argument === "string") {
            this.#colour = new Color(argument).to(HslColour.colorSpace);
        }
        else if (argument instanceof Color) {
            this.#colour = new Color(argument).to(HslColour.colorSpace);
        }
        else {
            this.#colour = new Color({ coords: argument, space: HslColour.colorSpace });
        }
    }
    static mix(color1, color2, weight) {
        const mix = Color.mix(color1.colourObject, color2.colourObject, weight, {
            outputSpace: HslColour.colorSpace,
            space: HslColour.colorSpace,
        });
        return new HslColour(mix);
    }
    clone() {
        return new HslColour(this.#colour);
    }
    toString() {
        return this.hex;
    }
}
//# sourceMappingURL=hsl-colour.js.map