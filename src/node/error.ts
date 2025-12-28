/**
 * Common Node.js error codes as constants.
 */
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

/**
 * Logs an error message to console.error.
 * Extracts message from Error objects or converts to string.
 *
 * @param error - The error to log (Error object, string, or any value).
 *
 * @example
 * try {
 *   riskyOperation()
 * } catch (error) {
 *   putError(error)
 * }
 */
export const putError = (error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Request failed -->", message)
}

/**
 * Checks if an error is a Node.js system error with an error code.
 *
 * @param error - The error to check.
 * @returns True if error is a NodeJS.ErrnoException, false otherwise.
 *
 * @example
 * try {
 *   fs.readFileSync('missing.txt')
 * } catch (error) {
 *   if (isNodeError(error)) {
 *     console.log(`Error code: ${error.code}`)
 *   }
 * }
 */
export const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
    return error instanceof Error && "code" in error
}
