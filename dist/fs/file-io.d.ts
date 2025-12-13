/**
 * Saves text to file asynchronously using atomic write.
 * Atomic write ensures file is not corrupted if process crashes during write.
 * Logs error but doesn't throw on failure.
 */
export declare const saveTextFileAsync: (fileName: string, data: string) => Promise<void>;
/**
 * Synchronous version of saveTextFileAsync.
 * Uses atomic write to prevent file corruption.
 */
export declare const saveTextFileSync: (fileName: string, data: string) => void;
/**
 * Saves an object as JSON file asynchronously.
 * Uses JSON.stringify with default formatting (no pretty-print).
 */
export declare const saveJsonAsync: (fileName: string, data: object) => Promise<void>;
/**
 * Synchronous version of saveJsonAsync.
 * Converts object to JSON string and saves atomically.
 */
export declare const saveJson: (fileName: string, data: object) => void;
/**
 * Saves binary data to file synchronously using atomic write.
 * Accepts Buffer for binary data or string for text-based binary formats.
 */
export declare const saveBinaryFile: (fileName: string, data: Buffer | string) => void;
/**
 * Saves image data to file.
 * Type-safe wrapper around saveBinaryFile that only accepts Buffer.
 */
export declare const saveImage: (fileName: string, data: Buffer) => void;
/**
 * Reads text file synchronously using atomic read operation.
 * Returns undefined if file doesn't exist or read fails.
 * Logs specific error message for missing files.
 */
export declare const readTextFileSync: (fileName: string) => string | undefined;
/**
 * Reads and parses JSON file synchronously.
 * Returns undefined if file doesn't exist or JSON is invalid.
 * Logs errors but doesn't throw.
 */
export declare const readJsonSync: (fileName: string) => unknown;
/**
 * Async version of readTextFileSync.
 * Reads text file and returns undefined on failure.
 */
export declare const readTextFileAsync: (fileName: string) => Promise<string | undefined>;
//# sourceMappingURL=file-io.d.ts.map