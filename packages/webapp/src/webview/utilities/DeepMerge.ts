/**
 * Performs deep merge on two objects. Parameters are not mutated.
 * Arrays are copied as references and are not merged.
 *
 * @param a - object one
 * @param b - object two
 * @returns - merged object
 */
export function deepMerge(a: any, b: any): Record<string, unknown> {
    const result = Object.keys(a).length ? deepMerge({}, a) : {};
    const keys = Object.keys(b);
    for (const key of keys) {
        const value = b[key];
        if (isObject(value)) {
            if (!result[key] || isObject(result[key])) {
                result[key] = deepMerge(result[key] ?? {}, value);
            } else {
                throw new Error('Object structures are not compatible!');
            }
        } else {
            result[key] = value;
        }
    }
    return result;
}

/**
 * Checks if passed item is object.
 *
 * @param item - item to check
 * @returns - true: is object; false: no object
 */
function isObject(item: unknown): boolean {
    if (!item) {
        return false;
    }
    return typeof item === 'object' && !Array.isArray(item);
}
