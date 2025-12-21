export const speedConstB = 0.007_216_940_683_850_481
export const speedConstM = 0.071_382_379_498_913_39

export const speedFactor = 390
export const timeFactor = 2.63

/**
 * The hour (UTC) when server maintenance/reset occurs.
 * Server day boundaries align with this time.
 */
export const serverMaintenanceHour = 10

/**
 * Hours in a day.
 */
export const hoursPerDay = 24

/**
 * Maximum allowed port battle time (2 hours before server maintenance).
 */
export const maxPortBattleHour = serverMaintenanceHour - 2

/**
 * Degrees in a full circle.
 */
export const degreesFullCircle = 360

/**
 * Degrees in a half circle.
 */
export const degreesHalfCircle = 180

/**
 * Degrees in a quarter circle.
 */
export const degreesQuarterCircle = 90

/**
 * Compass directions using 24-point compass rose.
 * Each direction represents 15° (360° / 24).
 *
 * Format uses fractional notation:
 * - N⅓NE means "North by one-third toward Northeast" (between N and NE)
 * - N⅔NE means "North by two-thirds toward Northeast" (closer to NE)
 */
export const compassDirections = [
    "N",
    "N⅓NE",
    "N⅔NE",
    "NE",
    "E⅔NE",
    "E⅓NE",
    "E",
    "E⅓SE",
    "E⅔SE",
    "SE",
    "S⅔SE",
    "S⅓SE",
    "S",
    "S⅓SW",
    "S⅔SW",
    "SW",
    "W⅔SW",
    "W⅓SW",
    "W",
    "W⅓NW",
    "W⅔NW",
    "NW",
    "N⅔NW",
    "N⅓NW",
] as const

/**
 * Degrees per compass direction (15° for 24-point compass).
 */
export const degreesPerDirection = degreesFullCircle / compassDirections.length
