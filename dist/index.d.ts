type SortArgument<T> = keyof T | `-${string & keyof T}`;
declare const sortBy: <T extends object>(propertyNames: SortArgument<T>[]) => (a: T, b: T) => number;
declare const simpleNumberSort: (a: number | null | undefined, b: number | null | undefined) => number;
declare const simpleStringSort: (a: string | null | undefined, b: string | null | undefined) => number;

export { simpleNumberSort, simpleStringSort, sortBy };
