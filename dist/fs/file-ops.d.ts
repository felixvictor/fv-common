/**
 * Removes a file. Does nothing if file doesn't exist (force: true).
 */
export declare const removeFileSync: (fileName: string) => void;
/**
 * Async version of removeFileSync.
 * Logs error but doesn't throw on failure.
 */
export declare const removeFileAsync: (fileName: string) => Promise<void>;
/**
 * Checks if a file exists and is a regular file (not a directory).
 * @returns true if file exists, false otherwise
 */
export declare const fileExists: (fileName: string) => boolean;
/**
 * Checks if a file exists and has zero bytes.
 * @returns true if file exists and is empty, false if missing or has content
 */
export declare const fileEmpty: (fileName: string) => boolean;
/**
 * Async version of fileExists.
 * Checks if path exists and is a regular file.
 */
export declare const fileExistsAsync: (fileName: string) => Promise<boolean>;
//# sourceMappingURL=file-ops.d.ts.map