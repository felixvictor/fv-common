import { getStatAsync, getStatSync } from "./stat.js"

/**
 * Compares the modification time of two files.
 *
 * @param filePathA - Path to the first file.
 * @param filePathB - Path to the second file.
 * @returns True if filePathA is older than filePathB, false otherwise or if either file doesn't exist.
 *
 * @example
 * if (isFileOlderThan('/path/to/source.csv', '/path/to/output.json')) {
 *   console.log('Source file is older, regeneration needed')
 * }
 */
export const isFileOlderThan = (filePathA: string, filePathB: string): boolean => {
    const statsA = getStatSync(filePathA)
    const statsB = getStatSync(filePathB)

    if (!statsA || !statsB) {
        return false
    }

    return statsA.mtime < statsB.mtime
}

/**
 * Compares the modification time of two files asynchronously.
 *
 * @param filePathA - Path to the first file.
 * @param filePathB - Path to the second file.
 * @returns Promise resolving to true if filePathA is older than filePathB, false otherwise or if either file doesn't exist.
 *
 * @example
 * if (await isFileOlderThanAsync('/path/to/source.csv', '/path/to/output.json')) {
 *   console.log('Source file is older, regeneration needed')
 * }
 */
export const isFileOlderThanAsync = async (filePathA: string, filePathB: string): Promise<boolean> => {
    const statsA = await getStatAsync(filePathA)
    const statsB = await getStatAsync(filePathB)

    if (!statsA || !statsB) {
        return false
    }

    return statsA.mtime < statsB.mtime
}
