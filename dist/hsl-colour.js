import Color, {} from "colorjs.io";
export class HslColour {
    get colourObject() {
        return this.#colour;
    }
    get h() {
        return this.#colour.coords[0];
    }
    set h(h) {
        this.#colour.h = Number(h);
    }
    get hex() {
        return this.#colour.to("srgb").toString({ format: "hex" });
    }
    get l() {
        return this.#colour.coords[2];
    }
    set l(l) {
        this.#colour.l = Number(l);
    }
    get s() {
        return this.#colour.coords[1];
    }
    set s(s) {
        this.#colour.s = Number(s);
    }
    #colour;
    constructor(argument) {
        if (typeof argument === "string") {
            this.#colour = this.#getHsl(argument);
        }
        else if (argument instanceof Color) {
            this.#colour = new Color(argument);
        }
        else {
            this.#colour = new Color({ coords: argument, space: "okhsl" });
        }
    }
    static mix(color1Input, color2Input, weightScale) {
        const mix = Color.mix(color1Input.colourObject, color2Input.colourObject, weightScale, {
            outputSpace: "okhsl",
            space: "okhsl",
        });
        return new HslColour(mix);
    }
    #getHsl(colourHex) {
        return new Color(colourHex).to("okhsl");
    }
}
//# sourceMappingURL=hsl-colour.js.map