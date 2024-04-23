/**
 * Randomly pick `key` from an array.
 * @param obj Array to pick from.
 */
export declare function ranPick<O extends string[]>(obj: O = []): keyof typeof O;

export declare function nano<S extends string>(template: s, data: object): S;

/**
 * Object is typeof `object` / JSON Object
 */
export declare function isObj<O>(obj: O): boolean;

/**
 * Object is `null` or `undefined`
 */
export declare function isNull<O>(obj: O): boolean;

/**
 * Object is Blank
 */
export declare function isBlank<O>(obj: O): boolean;

/**
 * Object is Empty
 */
export declare function isEmpty<O>(obj: O): boolean;
