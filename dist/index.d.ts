import path from 'node:path';

declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
declare const putError: (error: string) => void;
declare const makeDirectoryAsync: (directory: string) => Promise<void>;
declare const removeFileSync: (fileName: string) => void;
declare const removeFileASync: (fileName: string) => Promise<void>;
declare const fileExists: (fileName: string) => boolean;
declare const fileExistsAsync: (fileName: string) => Promise<boolean>;
declare const saveTextFileAsync: (fileName: string, data: string) => Promise<void>;
declare const saveTextFileSync: (fileName: string, data: string) => void;
declare const saveJsonAsync: (fileName: string, data: object) => Promise<void>;
declare const saveJson: (fileName: string, data: object) => void;
declare const readTextFileSync: (fileName: string) => string | undefined;
declare const readJsonSync: (fileName: string) => unknown;
declare const pathFormat: (t: path.FormatInputPathObject) => string;
declare const changeExtension: (pathInput: string, extension: string) => string;
declare const joinPaths: (path1: string, path2: string) => string;

type SortArgument<T> = keyof T | `-${string & keyof T}`;
declare const sortBy: <T extends object>(propertyNames: SortArgument<T>[]) => (a: T, b: T) => number;
declare const simpleNumberSort: (a: number | undefined | null, b: number | undefined | null) => number;
declare const simpleStringSort: (a: string | undefined | null, b: string | undefined | null) => number;

export { type SortArgument, changeExtension, fileExists, fileExistsAsync, isNodeError, joinPaths, makeDirectoryAsync, pathFormat, putError, readJsonSync, readTextFileSync, removeFileASync, removeFileSync, saveJson, saveJsonAsync, saveTextFileAsync, saveTextFileSync, simpleNumberSort, simpleStringSort, sortBy };
