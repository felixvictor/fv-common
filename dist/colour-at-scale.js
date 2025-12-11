/**
 * {@link: https://matthewstrom.com/writing/generating-color-palettes/}
 */
import { clamp } from "./common.js";
import { HslColour } from "./hsl-colour.js";
const k1 = 0.206;
const k2 = 0.03;
const k3 = (1 + k1) / (1 + k2);
const YtoL = (Y) => (Y <= 0.008_856_451_6 ? Y * 903.296_296_2 : 116 * Math.pow(Y, 1 / 3) - 16);
const toe = (l) => 0.5 * (k3 * l - k1 + Math.sqrt((k3 * l - k1) * (k3 * l - k1) + 4 * k2 * k3 * l));
const normalizeScaleNumber = (scaleNumber, maxScaleNumber) => scaleNumber / maxScaleNumber;
// hue, chroma, and lightness functions
const computeScaleHue = (scaleValue, baseHue) => baseHue + 5 * (1 - scaleValue);
const computeScaleChroma = (scaleValue, minChroma, maxChroma) => {
    const chromaDifference = maxChroma - minChroma;
    return -4 * chromaDifference * Math.pow(scaleValue, 2) + 4 * chromaDifference * scaleValue + minChroma;
};
const computeScaleLightness = (scaleValue, backgroundY) => {
    const foregroundY = backgroundY > 0.18
        ? (backgroundY + 0.05) / Math.exp(3.04 * scaleValue) - 0.05
        : Math.exp(3.04 * scaleValue) * (backgroundY + 0.05) - 0.05;
    return toe(YtoL(foregroundY));
};
export const computeColorAtScaleNumber = (scaleNumber, maxScaleNumber, baseHue, minChroma, maxChroma, backgroundY) => {
    const scaleValue = normalizeScaleNumber(scaleNumber, maxScaleNumber);
    const l = clamp(computeScaleLightness(scaleValue, backgroundY) / 100, 0, 1);
    return new HslColour([
        computeScaleHue(scaleValue, baseHue),
        computeScaleChroma(scaleValue, minChroma, maxChroma),
        l,
    ]);
};
//# sourceMappingURL=colour-at-scale.js.map