export declare function deepMergeObjects<T extends Record<string, any>>(base: T | null | undefined, incoming: Partial<T> | null | undefined): T;
export declare function unionArrays<T>(a: T[] | null | undefined, b: T[] | null | undefined): T[];
