/**
 * Sort argument type.
 * keyof T for ascending, `-${string & keyof T}` for descending.
 */
export type SortArgument<T> = `-${keyof T & string}` | keyof T;
/**
 * Sort by a list of properties (in left-to-right order)
 * Properties prefixed with '-' are sorted in descending order
 * @example sortBy(['name', '-age']) // Sort by name ascending, then age descending
 */
export declare const sortBy: <T extends object>(propertyNames: SortArgument<T>[]) => (a: T, b: T) => number;
/**
 * Simple number comparison with null/undefined handling (pushes nullish values to the end).
 */
export declare function simpleNumberSort(a: number, b: number): number;
export declare function simpleNumberSort(a: null | number | undefined, b: null | number | undefined): number;
/**
 * Simple string comparison with null/undefined handling (pushes nullish values to the end).
 */
export declare function simpleStringSort(a: string, b: string): number;
export declare function simpleStringSort(a: null | string | undefined, b: null | string | undefined): number;
//# sourceMappingURL=sort.d.ts.map