import type { Result } from "@/result.js"

import { err, isOk, ok } from "@/result.js"
import fs from "node:fs"
import fsPromises from "node:fs/promises"

import type { FileSystemError } from "../error.js"

import { toFileSystemError } from "../error.js"

// ============================================================================
// File System Statistics - Internal Helpers
// ============================================================================

/** Gets file system statistics for a directory synchronously. */
const getStatFsSync = (directory: string): Result<fs.StatsFs, FileSystemError> => {
    try {
        return ok(fs.statfsSync(directory))
    } catch (error: unknown) {
        return err(toFileSystemError(error, directory))
    }
}

/** Gets file system statistics for a directory asynchronously. */
const getStatFsAsync = async (directory: string): Promise<Result<fs.StatsFs, FileSystemError>> => {
    try {
        return ok(await fsPromises.statfs(directory))
    } catch (error: unknown) {
        return err(toFileSystemError(error, directory))
    }
}

/** Calculates disk space metrics from file system stats. */
const calculateDiskMetrics = (stat: fs.StatsFs) => {
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
 * @example
 *     const freeBytes = getFreeSpace("/home/user")
 *     if (freeBytes !== undefined) {
 *         console.log(`Free space: ${(freeBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 *     }
 *
 * @param directory - Path to the directory to check.
 * @returns Free space in bytes, or undefined on error.
 */
export const getFreeSpace = (directory: string): number | undefined => {
    const result = getStatFsSync(directory)
    return isOk(result) ? calculateDiskMetrics(result.value).free : undefined
}

/**
 * Gets the available free space in bytes for a directory's file system asynchronously.
 *
 * @example
 *     const freeBytes = await getFreeSpaceAsync("/home/user")
 *     if (freeBytes !== undefined) {
 *         console.log(`Free space: ${(freeBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 *     }
 *
 * @param directory - Path to the directory to check.
 * @returns Promise resolving to free space in bytes, or undefined on error.
 */
export const getFreeSpaceAsync = async (directory: string): Promise<number | undefined> => {
    const result = await getStatFsAsync(directory)
    return isOk(result) ? calculateDiskMetrics(result.value).free : undefined
}

/**
 * Gets the total space in bytes for a directory's file system.
 *
 * @example
 *     const totalBytes = getTotalSpace("/home/user")
 *     if (totalBytes !== undefined) {
 *         console.log(`Total space: ${(totalBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 *     }
 *
 * @param directory - Path to the directory to check.
 * @returns Total space in bytes, or undefined on error.
 */
export const getTotalSpace = (directory: string): number | undefined => {
    const result = getStatFsSync(directory)
    return isOk(result) ? calculateDiskMetrics(result.value).total : undefined
}

/**
 * Gets the total space in bytes for a directory's file system asynchronously.
 *
 * @example
 *     const totalBytes = await getTotalSpaceAsync("/home/user")
 *     if (totalBytes !== undefined) {
 *         console.log(`Total space: ${(totalBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 *     }
 *
 * @param directory - Path to the directory to check.
 * @returns Promise resolving to total space in bytes, or undefined on error.
 */
export const getTotalSpaceAsync = async (directory: string): Promise<number | undefined> => {
    const result = await getStatFsAsync(directory)
    return isOk(result) ? calculateDiskMetrics(result.value).total : undefined
}

/**
 * Gets the used space in bytes for a directory's file system.
 *
 * @example
 *     const usedBytes = getUsedSpace("/home/user")
 *     if (usedBytes !== undefined) {
 *         console.log(`Used space: ${(usedBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 *     }
 *
 * @param directory - Path to the directory to check.
 * @returns Used space in bytes, or undefined on error.
 */
export const getUsedSpace = (directory: string): number | undefined => {
    const result = getStatFsSync(directory)
    return isOk(result) ? calculateDiskMetrics(result.value).used : undefined
}

/**
 * Gets the used space in bytes for a directory's file system asynchronously.
 *
 * @example
 *     const usedBytes = await getUsedSpaceAsync("/home/user")
 *     if (usedBytes !== undefined) {
 *         console.log(`Used space: ${(usedBytes / 1024 / 1024 / 1024).toFixed(2)} GB`)
 *     }
 *
 * @param directory - Path to the directory to check.
 * @returns Promise resolving to used space in bytes, or undefined on error.
 */
export const getUsedSpaceAsync = async (directory: string): Promise<number | undefined> => {
    const result = await getStatFsAsync(directory)
    return isOk(result) ? calculateDiskMetrics(result.value).used : undefined
}

/**
 * Gets disk space usage information for a directory's file system.
 *
 * @example
 *     const usage = getDiskUsage("/home/user")
 *     if (usage) {
 *         console.log(`Free: ${usage.free} bytes`)
 *         console.log(`Total: ${usage.total} bytes`)
 *         console.log(`Used: ${usage.used} bytes`)
 *         console.log(`Usage: ${usage.percentUsed.toFixed(1)}%`)
 *     }
 *
 * @param directory - Path to the directory to check.
 * @returns Object with free, total, used space in bytes and usage percentage, or undefined on error.
 */
export const getDiskUsage = (
    directory: string,
): undefined | { free: number; percentUsed: number; total: number; used: number } => {
    const result = getStatFsSync(directory)
    return isOk(result) ? calculateDiskMetrics(result.value) : undefined
}

/**
 * Gets disk space usage information for a directory's file system asynchronously.
 *
 * @example
 *     const usage = await getDiskUsageAsync("/home/user")
 *     if (usage) {
 *         console.log(`Free: ${usage.free} bytes`)
 *         console.log(`Total: ${usage.total} bytes`)
 *         console.log(`Used: ${usage.used} bytes`)
 *         console.log(`Usage: ${usage.percentUsed.toFixed(1)}%`)
 *     }
 *
 * @param directory - Path to the directory to check.
 * @returns Promise resolving to object with free, total, used space in bytes and usage percentage, or undefined on
 *   error.
 */
export const getDiskUsageAsync = async (
    directory: string,
): Promise<undefined | { free: number; percentUsed: number; total: number; used: number }> => {
    const result = await getStatFsAsync(directory)
    return isOk(result) ? calculateDiskMetrics(result.value) : undefined
}
