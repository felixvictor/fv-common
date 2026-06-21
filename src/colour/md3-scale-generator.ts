import { ColourScaleGenerator } from "@/colour/colour-scale-generator"
import { descendingScales, scaleNumberMax, type ToneProfile } from "@/colour/md3-tones"

export class Md3ScaleGenerator extends ColourScaleGenerator {
    #ceiling: number
    /**
     * How close lightness must get to 1 before a scale number is treated as
     * "already white". Slightly below 1 rather than exactly 1 to tolerate the
     * toe curve's own clamping arriving at the ceiling a touch early.
     */
    readonly #lightnessSaturationThreshold = 0.999

    constructor(maxScaleNumber: number, baseHue: number, minChroma: number, maxChroma: number, backgroundY: number) {
        super(maxScaleNumber, baseHue, minChroma, maxChroma, backgroundY)
        this.#ceiling = this.#findLightnessCeiling()
    }

    /** Reapplies those fractional positions to the dark base tone and its real (not nominal) lightness ceiling. */
    buildDarkLightenScaleNumbers = (profile: ToneProfile): readonly number[] => {
        return this.#deriveLightenFractions(profile).map(
            (fraction) => Math.round((profile.dark + fraction * (this.#ceiling - profile.dark)) * 10) / 10,
        )
    }

    /** Converts a family's light-theme milestones into fractional positions between its base tone and white. */
    #deriveLightenFractions = (profile: ToneProfile): readonly number[] =>
        profile.lightLightenMilestones.map(
            (milestone) => (milestone - profile.light) / (scaleNumberMax - profile.light),
        )

    /** First scale number (walking down from the ceiling) whose lightness has not yet saturated to white. */
    #findLightnessCeiling = (): number =>
        descendingScales(scaleNumberMax, 0.5).find(
            (scale) => this.computeColour(scale).l < this.#lightnessSaturationThreshold,
        ) ?? scaleNumberMax
}
