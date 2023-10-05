export type Dict = {
    [key: string]: any;
};
export declare function isBoolean(val: any): val is boolean;
export declare function isString(val: any): val is string;
export declare function isNumber(val: any): val is number;
export declare function isInteger(val: any): val is number;
/**
 * Is 1, 2, 3, ...
 * @param val
 */
export declare function isPosInteger(val: any): val is number;
/**
 * Is > 0
 * @param val
 */
export declare function isPosNumber(val: any): val is number;
export declare function isNonEmptyString(val: any): val is string;
export declare function isFunction(val: any): boolean;
export declare function isDate(val: any): val is Date;
export declare function isValidDate(val: any): val is Date;
export declare function isArray(val: any): val is any[];
export declare function isNonEmptyArray(val: any): val is any[];
export declare function isRegExp(val: any): val is RegExp;
export declare function isNull(val: any): val is null;
export declare function isDefined(val: any): boolean;
export declare function isDict(val: any): val is Dict;
/**
 * Is not undefined or null.
 * @param val - The value to be tested
 */
export declare function hasValue(val: any): boolean;
export declare function isEmpty(obj: Dict): boolean;
export declare function isError(val: any): val is Error;
/**
 * An Object and NOT an array or Date
 * @param obj
 */
export declare function isObject(val: any): boolean;
export declare function pick(obj: Dict, ...args: any[]): Dict;
export declare function omit(obj: Dict, ...args: any[]): Dict;
export declare function isTrue(val: any): boolean;
export declare function isFalse(val: any): boolean;
export type AsFloatOpts = {
    def?: number;
    commaAsDecimal?: boolean;
};
/**
 * Return val as a float. Handles thousands separators (comma).
 * @param val
 * @param opts
 */
export declare function asFloat(val: any, opts?: AsFloatOpts): number;
/**
 * Always returns a valid integer. Returns 0 if the val cannot be parsed or rounded to an integer.
 * @param val
 */
export declare function asInt(val: any): number;
/**
 * Return a RegExp or an object with pattern and flags properties as a RegExp.
 * Used to deserialize RegExp expressions in JSON. Will return undefined
 * otherwise.
 * @param val
 */
export declare function asRegExp(val: any): RegExp;
/**
 *
 * @param n {number} number to pad with leading zeros.
 * @param width {number} total width of string (eg. 3 for '005').
 * @param [z='0'] {char} character with which to pad string.
 * @returns {String}
 */
export declare function pad(n: number, width: number, z?: string): string;
/**
 * Float precision that returns a set number of digits after the decimal
 * @param {number} num - number to round
 * @param {number} dec - number of digits after decimal
 * @return {number} num rounded
 */
export declare function roundNumber(num: number, dec?: number): number;
export type DeepCopyOpts = {
    replace?: Dict;
    detectRegExp?: boolean;
};
/**
 * Performs a deep copy of an object, returning the new object. Will optionally
 * replace strings if replace is a dictionary of string replacements. For
 * example, if replace = { home: 'hello' } then any string in `a` that contains
 * '{home}' will be replaced with well (eg. '{home}/world' becomes
 * 'hello/world').
 * @param a - The object to be copied
 * @param replace Optional dictionary, of string replacements
 */
export declare function deepCopy(a: any, opts?: DeepCopyOpts): any;
/**
 * Value comparator. Considers undefined, null, [] and {} to all be equal
 * @param a
 * @param b
 * @returns {boolean}
 */
export declare function deepEquals(a: any, b: any): boolean;
export declare function asError(...args: any[]): Error;
export declare function delayPromise(ms: number): Promise<void>;
/**
 * Careful using this method on minimized code where the name of the class might be changed
 * @param obj
 * @param name
 */
export declare function isClass(obj: any, name: string): boolean;
/**
 * Convert string of form 'myClass' to 'my-class'
 * @param str
 */
export declare function camelToDash(str: string): string;
/**
 * Convert 'this_string_here' to 'This String Here'.
 * @param str
 * @returns
 */
export declare function underscoreCapitalize(str: string): string;
/**
 * Verify that val is any one of the basic types.
 * @param val - The value to be tested
 * @param types
 */
export declare function isType(val: any, ...types: (string | string[])[]): boolean;
export declare function util(): Util;
export interface IUtilSource {
    toString(): string;
}
export type UtilOpts = {
    throw?: boolean;
    src?: string | IUtilSource;
};
export declare function utilObj(val: any, opts?: UtilOpts): Util;
export declare class Util {
    private _path?;
    private _throw;
    private _val?;
    private _src?;
    constructor(val?: any, opts?: UtilOpts);
    /**
     * Resets property path. Otherwise each call to prop() will add to the end of
     * the path. Example obj.reset().prop('a').prop('b')
     */
    reset(): this;
    prop(...path: string[]): this;
    property(...path: string[]): this;
    private source;
    throw(v?: boolean): this;
    val(): any;
    value(): any;
    protected _resolvePath(...path: (string | string[])[]): string[];
    setVal(value: any): this;
    setValue(object: Dict, value: any): this;
    asBoolean(): boolean;
    asInt(): number;
    asFloat(): number;
    asString(): string;
    isDict(): boolean;
    isBoolean(): boolean;
    isString(): boolean;
    isNumber(): boolean;
    isPosNumber(): boolean;
    isInteger(): boolean;
    isNonEmptyString(): boolean;
    isFunction(): boolean;
    isDate(): boolean;
    isValidDate(): boolean;
    isArray(): boolean;
    isNonEmptyArray(): boolean;
    isRegExp(): boolean;
    isNull(): boolean;
    isDefined(): boolean;
    hasValue(): boolean;
    isEmpty(): boolean;
    isError(): boolean;
    isObject(): boolean;
    isType(...types: (string | string[])[]): boolean;
}
