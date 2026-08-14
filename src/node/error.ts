/** Common Node.js error codes as constants. */
export const errorCodes = {
    addressInUse: "EADDRINUSE",
    brokenPipe: "EPIPE",
    connectionRefused: "ECONNREFUSED",
    directoryNotEmpty: "ENOTEMPTY",
    fileExists: "EEXIST",
    fileNotFound: "ENOENT",
    invalidArgument: "EINVAL",
    noSpaceLeft: "ENOSPC",
    operationNotPermitted: "EPERM",
    permissionDenied: "EACCES",
    readOnlyFileSystem: "EROFS",
    timeout: "ETIMEDOUT",
    tooManyOpenFiles: "EMFILE",
} as const

/** Failure of a file-system operation (read, write, stat, mkdir, …), returned as the `error` of a `Result`. */
export type FileSystemError =
    | { readonly cause: unknown; readonly kind: "unknown"; readonly path: string }
    | { readonly kind: "not-found"; readonly path: string }

/** Failure to parse a file's content as JSON, returned as the `error` of a `Result`. */
export interface JsonParseError {
    readonly cause: unknown
    readonly kind: "parse-error"
    readonly path: string
}

/**
 * Checks if an error is a Node.js system error with an error code.
 *
 * @example
 *     try {
 *         fs.readFileSync("missing.txt")
 *     } catch (error) {
 *         if (isNodeError(error)) {
 *             console.log(`Error code: ${error.code}`)
 *         }
 *     }
 *
 * @param error - The error to check.
 * @returns True if error is a NodeJS.ErrnoException, false otherwise.
 */
export const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
    return error instanceof Error && "code" in error
}

/**
 * Builds a `FileSystemError` from a caught error, distinguishing "not found" (`ENOENT`) from anything else.
 *
 * @param error - The error caught from a file-system operation.
 * @param path - The path the operation was performed on, attached to the resulting error.
 * @returns A `FileSystemError` with `kind: "not-found"` for `ENOENT`, `kind: "unknown"` otherwise.
 */
export const toFileSystemError = (error: unknown, path: string): FileSystemError => {
    return isNodeError(error) && error.code === errorCodes.fileNotFound
        ? { kind: "not-found", path }
        : { cause: error, kind: "unknown", path }
}
