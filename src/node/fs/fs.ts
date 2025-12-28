import fs from "node:fs"
import fsPromises from "node:fs/promises"

import { putError } from "../error.js"

// ============================================================================
// File System Statistics - Internal Helpers
// ============================================================================

/**
 * Gets file system statistics for a directory synchronously.
 * Returns undefined if an error occurs.
 */
const getStatFsSync = (directory: string): fs.StatsFs | undefined => {
    try {
        return fs.statfsSync(directory)
    } catch (error: unknown) {
        putError(error)
        return undefined
    }
}

/**
 * Gets file system statistics for a directory asynchronously.
 * Returns undefined if an error occurs.
 */
const getStatFsAsync = async (directory: string): Promise<fs.StatsFs | undefined> => {
    try {
        return await fsPromises.statfs(directory)
    } catch (error: unknown) {
        putError(error)
        return undefined
    }
}

/**
 * Calculates disk space metrics from file system stats.
 * Returns undefined if stat is undefined.
 */
const calculateDiskMetrics = (stat: fs.StatsFs | undefined) => {
    if (!stat) return

    const total = stat.bsize * stat.blocks
    const free = stat.bsize * stat.bavail
    const used = stat.bsize * (stat.blocks - stat.bfree)
    const percentUsed = total > 0 ? (used / total) * 100 : 0

    return { free, percentUsed, total, used }
}

// ============================================================================
// Disk Space Operations
// ============================================================================

/**
 * Gets the available free space in bytes for a directory's file system.
 *
 * @param directory - Path to the directory to check.
 * @returns Free space in bytes, or undefined on error.
 *
 * @example
 * const freeBytes = getFreeSpace('/home/user')
 * if (freeBytes !== undefined) {
 *   console.log(`Free space: ${(freeBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 * }
 */
export const getFreeSpace = (directory: string): number | undefined => {
    return calculateDiskMetrics(getStatFsSync(directory))?.free
}

/**
 * Gets the available free space in bytes for a directory's file system asynchronously.
 *
 * @param directory - Path to the directory to check.
 * @returns Promise resolving to free space in bytes, or undefined on error.
 *
 * @example
 * const freeBytes = await getFreeSpaceAsync('/home/user')
 * if (freeBytes !== undefined) {
 *   console.log(`Free space: ${(freeBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 * }
 */
export const getFreeSpaceAsync = async (directory: string): Promise<number | undefined> => {
    return calculateDiskMetrics(await getStatFsAsync(directory))?.free
}

/**
 * Gets the total space in bytes for a directory's file system.
 *
 * @param directory - Path to the directory to check.
 * @returns Total space in bytes, or undefined on error.
 *
 * @example
 * const totalBytes = getTotalSpace('/home/user')
 * if (totalBytes !== undefined) {
 *   console.log(`Total space: ${(totalBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 * }
 */
export const getTotalSpace = (directory: string): number | undefined => {
    return calculateDiskMetrics(getStatFsSync(directory))?.total
}

/**
 * Gets the total space in bytes for a directory's file system asynchronously.
 *
 * @param directory - Path to the directory to check.
 * @returns Promise resolving to total space in bytes, or undefined on error.
 *
 * @example
 * const totalBytes = await getTotalSpaceAsync('/home/user')
 * if (totalBytes !== undefined) {
 *   console.log(`Total space: ${(totalBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 * }
 */
export const getTotalSpaceAsync = async (directory: string): Promise<number | undefined> => {
    return calculateDiskMetrics(await getStatFsAsync(directory))?.total
}

/**
 * Gets the used space in bytes for a directory's file system.
 *
 * @param directory - Path to the directory to check.
 * @returns Used space in bytes, or undefined on error.
 *
 * @example
 * const usedBytes = getUsedSpace('/home/user')
 * if (usedBytes !== undefined) {
 *   console.log(`Used space: ${(usedBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 * }
 */
export const getUsedSpace = (directory: string): number | undefined => {
    return calculateDiskMetrics(getStatFsSync(directory))?.used
}

/**
 * Gets the used space in bytes for a directory's file system asynchronously.
 *
 * @param directory - Path to the directory to check.
 * @returns Promise resolving to used space in bytes, or undefined on error.
 *
 * @example
 * const usedBytes = await getUsedSpaceAsync('/home/user')
 * if (usedBytes !== undefined) {
 *   console.log(`Used space: ${(usedBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 * }
 */
export const getUsedSpaceAsync = async (directory: string): Promise<number | undefined> => {
    return calculateDiskMetrics(await getStatFsAsync(directory))?.used
}

/**
 * Gets disk space usage information for a directory's file system.
 *
 * @param directory - Path to the directory to check.
 * @returns Object with free, total, used space in bytes and usage percentage, or undefined on error.
 *
 * @example
 * const usage = getDiskUsage('/home/user')
 * if (usage) {
 *   console.log(`Free: ${usage.free} bytes`)
 *   console.log(`Total: ${usage.total} bytes`)
 *   console.log(`Used: ${usage.used} bytes`)
 *   console.log(`Usage: ${usage.percentUsed.toFixed(1)}%`)
 * }
 */
export const getDiskUsage = (
    directory: string,
): undefined | { free: number; percentUsed: number; total: number; used: number } => {
    return calculateDiskMetrics(getStatFsSync(directory))
}

/**
 * Gets disk space usage information for a directory's file system asynchronously.
 *
 * @param directory - Path to the directory to check.
 * @returns Promise resolving to object with free, total, used space in bytes and usage percentage, or undefined on error.
 *
 * @example
 * const usage = await getDiskUsageAsync('/home/user')
 * if (usage) {
 *   console.log(`Free: ${usage.free} bytes`)
 *   console.log(`Total: ${usage.total} bytes`)
 *   console.log(`Used: ${usage.used} bytes`)
 *   console.log(`Usage: ${usage.percentUsed.toFixed(1)}%`)
 * }
 */
export const getDiskUsageAsync = async (
    directory: string,
): Promise<undefined | { free: number; percentUsed: number; total: number; used: number }> => {
    return calculateDiskMetrics(await getStatFsAsync(directory))
}
