/**
 * Logs error messages to console in a consistent format.
 * Extracts message from Error objects or converts other types to string.
 */
export declare const putError: (error: unknown) => void;
/**
 * Type guard to check if an unknown error is a Node.js system error.
 * Useful for checking specific error codes like ENOENT, EACCES, etc.
 */
export declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
/**
 * Creates a directory and all parent directories if they don't exist.
 * Does nothing if directory already exists.
 * Logs error but doesn't throw on failure.
 */
export declare const makeDirectorySync: (directory: string) => void;
/**
 * Async version of makeDirectorySync.
 * Creates directory structure recursively without throwing on existing directories.
 */
export declare const makeDirectoryAsync: (directory: string) => Promise<void>;
/**
 * Reads directory contents recursively.
 * Returns array of all file paths (including subdirectories).
 * @returns Array of relative file paths from the directory
 */
export declare const readDirectorySync: (directoryPath: string) => string[];
/**
 * Removes a directory and all its contents recursively.
 * Does nothing if directory doesn't exist (force: true).
 */
export declare const removeDirectorySync: (directoryPath: string) => void;
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
/**
 * Reads and parses JSON file asynchronously with type safety.
 * @template T - Expected type of the parsed JSON object
 * @returns Parsed object of type T, or undefined on failure
 */
export declare const readJsonAsync: <T = unknown>(fileName: string) => Promise<T | undefined>;
/**
 * Changes the file extension of a path.
 * Automatically adds leading dot if not provided.
 * @example changeExtension('/path/to/file.txt', 'md') → '/path/to/file.md'
 * @example changeExtension('/path/to/file.txt', '.json') → '/path/to/file.json'
 */
export declare const changeExtension: (filePath: string, extension: string) => string;
/**
 * Appends text to the filename (before extension).
 * Useful for creating variants like 'file-copy.txt' or 'image-thumb.jpg'.
 * @example appendToFileName('/path/to/file.txt', '-copy') → '/path/to/file-copy.txt'
 */
export declare const appendToFileName: (filePath: string, suffix: string) => string;
/**
 * Replaces the filename while keeping directory and extension.
 * @example changeFileName('/path/to/file.txt', 'newname') → '/path/to/newname.txt'
 */
export declare const changeFileName: (filePath: string, newName: string) => string;
//# sourceMappingURL=file.d.ts.map