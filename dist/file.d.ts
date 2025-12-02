import path from "node:path";
export declare const putError: (error: unknown) => void;
export declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
/**
 * Make directories (recursive)
 */
export declare const makeDirectoryAsync: (directory: string) => Promise<void>;
export declare const removeFileSync: (fileName: string) => void;
export declare const removeFileAsync: (fileName: string) => Promise<void>;
export declare const fileExists: (fileName: string) => boolean;
export declare const fileEmpty: (fileName: string) => boolean;
export declare const fileExistsAsync: (fileName: string) => Promise<boolean>;
export declare const saveTextFileAsync: (fileName: string, data: string) => Promise<void>;
export declare const saveTextFileSync: (fileName: string, data: string) => void;
export declare const saveJsonAsync: (fileName: string, data: object) => Promise<void>;
export declare const saveJson: (fileName: string, data: object) => void;
export declare const readTextFileSync: (fileName: string) => string | undefined;
export declare const readJsonSync: (fileName: string) => unknown;
export declare const readTextFileAsync: (fileName: string) => Promise<string | undefined>;
export declare const readJsonAsync: <T = unknown>(fileName: string) => Promise<T | undefined>;
export declare const pathFormat: (t: path.FormatInputPathObject) => string;
export declare const changeExtension: (pathInput: string, extension: string) => string;
export declare const joinPaths: (path1: string, path2: string) => string;
//# sourceMappingURL=file.d.ts.map