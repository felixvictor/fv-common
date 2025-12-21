/**
 * Splits an array into n pieces.
 *
 * @param array - The source array to be split.
 * @param n - The number of pieces to create (must be >= 1).
 * @param balanced - If true, chunk sizes differ by at most 1 element.
 *                    If false, creates n-1 equal chunks with remainder in the last chunk.
 * @returns An array of n (or fewer) arrays containing the split pieces.
 * @throws {Error} If n is less than 1.
 *
 * @example
 * // Balanced split (default)
 * chunkify([1,2,3,4,5,6,7], 3) // [[1,2,3], [4,5], [6,7]]
 *
 * @example
 * // Unbalanced split
 * chunkify([1,2,3,4,5,6,7], 3, false) // [[1,2], [3,4], [5,6,7]]
 */
export const chunkify = <T>(array: T[], n: number, balanced = true): T[][] => {
    // Input validation
    if (n < 1) {
        throw new Error("n must be at least 1")
    }

    if (!Number.isInteger(n)) {
        throw new TypeError("n must be an integer")
    }

    const length = array.length

    // Edge cases
    if (length === 0) {
        return []
    }

    if (n === 1) {
        return [array]
    }

    if (n >= length) {
        return array.map((item) => [item])
    }

    const result: T[][] = []

    if (balanced) {
        // Balanced: distribute elements so chunk sizes differ by at most 1
        // This ensures chunks are as even as possible
        let index = 0
        let remainingChunks = n

        while (remainingChunks > 0) {
            const remainingElements = length - index
            const chunkSize = Math.ceil(remainingElements / remainingChunks)
            result.push(array.slice(index, index + chunkSize))
            index += chunkSize
            remainingChunks--
        }
    } else {
        // Unbalanced: create n-1 equal-sized chunks, with remainder in the last chunk
        const baseChunkSize = Math.floor(length / n)
        let index = 0

        for (let index_ = 0; index_ < n - 1; index_++) {
            result.push(array.slice(index, index + baseChunkSize))
            index += baseChunkSize
        }

        // Last chunk gets all remaining elements
        result.push(array.slice(index))
    }

    return result
}
