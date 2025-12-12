export declare const putError: (error: unknown) => void;
/**
 * Type guard to check if an unknown error object is a standard Node.js error.
 */
export declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
/**
 * Creates directories recursively
 */
export declare const makeDirectoryAsync: (directory: string) => Promise<void>;
export declare const removeFileSync: (fileName: string) => void;
export declare const removeFileAsync: (fileName: string) => Promise<void>;
export declare const fileExists: (fileName: string) => boolean;
export declare const fileEmpty: (fileName: string) => boolean;
export declare const fileExistsAsync: (fileName: string) => Promise<boolean>;
/**
 * Saves a text file asynchronously using atomic write operation.
 */
export declare const saveTextFileAsync: (fileName: string, data: string) => Promise<void>;
/**
 * Saves a text file synchronously using atomic write operation.
 */
export declare const saveTextFileSync: (fileName: string, data: string) => void;
export declare const saveJsonAsync: (fileName: string, data: object) => Promise<void>;
export declare const saveJson: (fileName: string, data: object) => void;
/**
 * Reads a text file synchronously using atomically's read method.
 */
export declare const readTextFileSync: (fileName: string) => string | undefined;
export declare const readJsonSync: (fileName: string) => unknown;
/**
 * Reads a text file asynchronously using standard fsPromises.
 */
export declare const readTextFileAsync: (fileName: string) => Promise<string | undefined>;
export declare const readJsonAsync: <T = unknown>(fileName: string) => Promise<T | undefined>;
//# sourceMappingURL=file.d.ts.map