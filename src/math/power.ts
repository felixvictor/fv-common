/**
 * Calculates the largest power of 2 that is less than or equal to the given number.
 *
 * @param value - The input number (must be positive).
 * @returns The largest power of 2 ≤ value.
 * @throws {Error} If value is not a positive number.
 *
 * @example
 * nearestPow2(100) // 64 (2^6)
 * nearestPow2(64)  // 64 (2^6)
 * nearestPow2(65)  // 64 (2^6)
 * nearestPow2(7)   // 4 (2^2)
 */
export const nearestPow2 = (value: number): number => {
    if (value <= 0 || !Number.isFinite(value)) {
        throw new Error("Value must be a positive finite number")
    }

    // Using bit manipulation for efficiency
    // This approach: floor the log2, then raise 2 to that power
    return 2 ** Math.floor(Math.log2(value))
}

/**
 * Calculates the smallest power of 2 that is greater than or equal to the given number.
 *
 * @param value - The input number (must be positive).
 * @returns The smallest power of 2 ≥ value.
 * @throws {Error} If value is not a positive number.
 *
 * @example
 * nextPow2(100) // 128 (2^7)
 * nextPow2(64)  // 64 (2^6)
 * nextPow2(65)  // 128 (2^7)
 */
export const nextPow2 = (value: number): number => {
    if (value <= 0 || !Number.isFinite(value)) {
        throw new Error("Value must be a positive finite number")
    }

    return 2 ** Math.ceil(Math.log2(value))
}
