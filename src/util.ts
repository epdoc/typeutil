export type Dict = { [key: string]: any };

const REGEX = {
  isTrue: new RegExp(/^(true|yes|on)$/, 'i'),
  isFalse: new RegExp(/^(false|no|off)$/, 'i'),
  customElement: new RegExp(/CustomElement$/),
  firstUppercase: new RegExp(/(^[A-Z])/),
  allUppercase: new RegExp(/([A-Z])/, 'g'),
  firstCapitalize: new RegExp(/^([a-z])/),
  allCapitalize: new RegExp(/(\_[a-z])/, 'gi'),
  tr: new RegExp(/^\[tr\](.+)$/),
  html: new RegExp(/[&<>"'\/]/, 'g'),
  instr: new RegExp(/^\[([^\]]+)\](.*)$/),
  camel2dash: new RegExp(/([a-z0-9])([A-Z])/, 'g'),
  dash2camel: new RegExp(/-([a-z])/, 'g'),
};

export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean';
}

export function isString(val: any): val is string {
  return typeof val === 'string';
}

export function isNumber(val: any): val is number {
  return typeof val === 'number' && !isNaN(val);
}

export type Integer = number;
export function isInteger(val: any): val is Integer {
  return isNumber(val) && Number.isInteger(val);
}

/**
 * Is 1, 2, 3, ...
 * @param val
 */
export function isPosInteger(val: any): val is Integer {
  return isInteger(val) && val > 0;
}

/**
 * Is 0, 1, 2, 3, ...
 * @param val
 */
export function isWholeNumber(val: any): val is Integer {
  return isInteger(val) && val >= 0;
}

/**
 * Is an Integer in the range specified
 * @param val
 */
export function isIntegerInRange(val: any, min: number, max: number): val is Integer {
  return isInteger(val) && val >= min && val <= max;
}

/**
 * Is a number in the range specified
 * @param val
 */
export function isNumberInRange(val: any, min: number, max: number): val is number {
  return isNumber(val) && val >= min && val <= max;
}

/**
 * Is > 0
 * @param val
 */
export function isPosNumber(val: any): val is number {
  return typeof val === 'number' && !isNaN(val) && val > 0;
}

export function isNonEmptyString(val: any): val is string {
  return typeof val === 'string' && val.length > 0;
}

export function isFunction(val: any): val is Function {
  return typeof val === 'function';
}

export function isDate(val: any): val is Date {
  return val instanceof Date;
}

export function isValidDate(val: any): val is Date {
  return val instanceof Date && !isNaN(val.getTime());
}

export function isArray(val: any): val is any[] {
  return Array.isArray(val);
}

export function isNonEmptyArray(val: any): val is any[] {
  return Array.isArray(val) && val.length > 0;
}

export function isRegExp(val: any): val is RegExp {
  return val instanceof RegExp;
}

export function isRegExpDef(val: any): val is RegExp {
  return isDict(val) && isNonEmptyString(val.pattern);
}

export function isNull(val: any): val is null {
  return val === null ? true : false;
}

export function isDefined(val: any) {
  return val !== undefined;
}
export function isDict(val: any): val is Dict {
  if (!isObject(val)) {
    return false;
  }
  return true;
}

/**
 * Is not undefined or null.
 * @param val - The value to be tested
 */
export function hasValue(val: any) {
  return val !== null && val !== undefined;
}

export function isEmpty(obj: Dict) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isError(val: any): val is Error {
  return val instanceof Error;
}

/**
 * An Object and NOT an array or Date
 * @param obj
 */
export function isObject(val: any) {
  return (
    hasValue(val) &&
    typeof val === 'object' &&
    !Array.isArray(val) &&
    !(val instanceof Date) &&
    !(val instanceof RegExp)
  );
}

export function pick(obj: Dict, ...args: any[]) {
  // eslint-disable-line no-extend-native
  const result: Dict = {};
  if (Array.isArray(args[0])) {
    args = args[0];
  }
  args.forEach((key) => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit(obj: Dict, ...args: any[]) {
  if (Array.isArray(args[0])) {
    args = args[0];
  }
  const keys = Object.keys(obj).filter((key) => args.indexOf(key) < 0);
  const newObj: Dict = {};
  keys.forEach((k) => {
    newObj[k] = obj[k];
  });
  return newObj;
}

// export function schemaTypeValidator(type: string) {
//   return Util.VAL_MAP[type];
// }

/**
 * Test if val is definitively true.
 * @param val
 * @returns true if val is true
 */
export function isTrue(val: any): boolean {
  if (typeof val === 'boolean') {
    return val;
  } else if (typeof val === 'number') {
    return val > 0 ? true : false;
  } else if (typeof val === 'string') {
    return val.length && REGEX.isTrue.test(val) ? true : false;
  }
  return false;
}

/**
 * Test if val is definitively false.
 * @param val
 * @returns true if val is false
 */
export function isFalse(val: any): boolean {
  if (typeof val === 'boolean') {
    return val === false ? true : false;
  } else if (typeof val === 'number') {
    return val === 0 ? true : false;
  } else if (typeof val === 'string') {
    return val.length && REGEX.isFalse.test(val) ? true : false;
  }
  return false;
}

export function asBoolean(val: any, defval = false): boolean {
  if (defval) {
    return isFalse(val) ? false : defval;
  }
  return isTrue(val) ? true : defval;
}

export type AsFloatOpts = {
  def?: number;
  commaAsDecimal?: boolean;
};

/**
 * Return val as a float. Handles thousands separators (comma).
 * @param val
 * @param opts
 */
export function asFloat(val: any, opts?: AsFloatOpts): number {
  if (typeof val === 'number') {
    return val;
  }
  let v: number;
  if (isNonEmptyString(val)) {
    let s: string;
    if (opts && opts.commaAsDecimal) {
      s = val.replace(/(\d)\.(\d)/g, '$1$2').replace(/(\d),/g, '$1.');
    } else {
      s = val.replace(/(\d),(\d)/g, '$1$2');
    }
    v = parseFloat(s);
  } else {
    v = NaN;
  }
  if (isNaN(v)) {
    if (opts && isNumber(opts.def)) {
      return opts.def;
    }
    return 0;
  }
  return v;
}

/**
 * Always returns a valid integer. Returns 0 if the val cannot be parsed or rounded to an integer.
 * @param val
 */
export function asInt(val: any): number {
  // for speed do this test first
  if (isNumber(val)) {
    return Number.isInteger(val) ? val : Math.round(val);
  } else if (isNonEmptyString(val)) {
    let v = parseFloat(val);
    if (isNumber(v)) {
      return Number.isInteger(v) ? v : Math.round(v);
    }
  }
  return 0;
}

/**
 * Return a RegExp or an object with pattern and flags properties as a RegExp.
 * Used to deserialize RegExp expressions in JSON. Will return undefined
 * otherwise.
 * @param val
 */
export function asRegExp(val: any): RegExp | undefined {
  if (isRegExp(val)) {
    return val;
  } else if (isDict(val) && isString(val.pattern)) {
    const keys: string[] = Object.keys(val);
    if (isString(val.flags) && keys.length === 2) {
      return new RegExp(val.pattern, val.flags);
    } else if (keys.length === 1) {
      return new RegExp(val.pattern);
    }
  }
}

/**
 *
 * @param n {number} number to pad with leading zeros.
 * @param width {number} total width of string (eg. 3 for '005').
 * @param [z='0'] {char} character with which to pad string.
 * @returns {String}
 */
export function pad(n: number, width: number, z: string = '0'): string {
  const sn = String(n);
  return sn.length >= width ? sn : new Array(width - sn.length + 1).join(z) + sn;
}

/**
 * Float precision that returns a set number of digits after the decimal
 * @param {number} num - number to round
 * @param {number} dec - number of digits after decimal
 * @return {number} num rounded
 */
export function roundNumber(num: number, dec: number = 3): number {
  const factor = Math.pow(10, dec);
  return Math.round(num * factor) / factor;
}

export type DeepCopyFn = (a: any, opts: DeepCopyOpts) => any;
export type DeepCopyOpts = {
  replace?: Dict;
  detectRegExp?: boolean;
  pre?: string;
  post?: string;
};

/**
 * Performs a deep copy of an object, returning the new object. Will optionally
 * replace strings if replace is a dictionary of string replacements. For
 * example, if replace = { home: 'hello' } then any string in `a` that contains
 * '{home}' will be replaced with well (eg. '{home}/world' becomes
 * 'hello/world'). The pre and post delimiters can be modified with opts.pre and
 * opts.post.
 * @param a - The object to be copied
 * @param replace Optional dictionary, of string replacements
 */
export function deepCopy(a: any, options?: DeepCopyOpts): any {
  let opts: DeepCopyOpts = deepCopySetDefaultOpts(options);
  if (a === undefined || a === null) {
    return a;
  } else if (typeof a === 'number') {
    return a;
  } else if (typeof a === 'string') {
    if (opts.replace) {
      let r = a;
      Object.keys(opts.replace).forEach((b) => {
        const m: string = opts.pre + b + opts.post;
        if (r.includes(m)) {
          // replacement string have special replacement patterns, so use a function to return the raw string
          r = r.replace(m, () => {
            // @ts-ignore
            return opts.replace[b];
          });
          // r = r.replace(m, opts.replace[b]);
        }
      });
      return r;
    } else {
      return a;
    }
  } else if (a instanceof Date || a instanceof RegExp) {
    return a;
  } else if (Array.isArray(a)) {
    const result = [];
    for (const b of a) {
      let r = deepCopy(b, opts);
      result.push(r);
    }
    return result;
  } else if (isObject(a)) {
    // @ts-ignore
    const re: RegExp = opts && opts.detectRegExp ? asRegExp(a) : undefined;
    if (re) {
      return re;
    } else {
      const result2: Dict = {};
      Object.keys(a).forEach((key) => {
        result2[key] = deepCopy(a[key], opts);
      });
      return result2;
    }
  }
  return a;
}

export function deepCopySetDefaultOpts(opts?: DeepCopyOpts): DeepCopyOpts {
  if (!opts) {
    opts = {};
  }
  if (!opts.pre) {
    opts.pre = '{';
  }
  if (!opts.post) {
    opts.post = '}';
  }
  return opts;
}

/**
 * Value comparator. Considers undefined, null, [] and {} to all be equal
 * @param a
 * @param b
 * @returns {boolean}
 */
export function deepEquals(a: any, b: any): boolean {
  const aSet = _isSet(a);
  const bSet = _isSet(b);
  if (!aSet && !bSet) {
    return true;
  }
  if (!aSet || !bSet) {
    return false;
  }
  if (a === b || a.valueOf() === b.valueOf()) {
    return true;
  }
  if (Array.isArray(a) && a.length !== b.length) {
    return false;
  }
  // if they are dates, they must had equal valueOf
  if (a instanceof Date) {
    return false;
  }
  // if they are strictly equal, they both need to be object at least
  if (!(a instanceof Object)) {
    return false;
  }
  if (!(b instanceof Object)) {
    return false;
  }
  // recursive object equality check
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (kb.length === ka.length) {
    return ka.every((k) => {
      return deepEquals(a[k], b[k]);
    });
  }
  return false;
}

export type CompareResult = -1 | 0 | 1;

/**
 * Compare two Dict objects using the property or properties specified in keys.
 * @param a
 * @param b
 * @param keys
 * @returns
 */
export function compareDictValue(a: Dict, b: Dict, ...keys: string[]): CompareResult {
  for (let kdx = 0; kdx < keys.length; ++kdx) {
    const key = keys[kdx];
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
  }
  return 0;
}

function _isSet(a: any): boolean {
  if (a === null || a === undefined) {
    return false;
  }
  if (Array.isArray(a) && !a.length) {
    return false;
  }
  if (a instanceof Date) {
    return true;
  }
  if (a instanceof Object && !Object.keys(a).length) {
    return false;
  }
  return true;
}

export function asError(...args: any[]): Error {
  let err: Error | undefined;
  const msg: string[] = [];
  if (args.length) {
    args.forEach((arg) => {
      if (arg instanceof Error) {
        if (!err) {
          err = arg;
        }
        msg.push(err.message);
      } else if (isString(arg)) {
        msg.push(arg);
      } else {
        msg.push(String(arg));
      }
    });
    if (!err) {
      err = new Error(msg.join(' '));
    } else {
      err.message = msg.join(' ');
    }
  }
  return err as Error;
}

export function delayPromise(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve();
    }, ms);
  });
}

/**
 * Careful using this method on minimized code where the name of the class might be changed
 * @param obj
 * @param name
 */
export function isClass(obj: any, name: string): boolean {
  return isObject(obj) && obj.constructor.name === name;
}

/**
 * Convert string of form 'myClass' to 'my-class'
 * @param str
 */
export function camel2dash(str: string): string {
  return str.replace(REGEX.camel2dash, '$1-$2').toLowerCase();
  // .replace(REGEX.firstUppercase, ([first]) => (first ? first.toLowerCase() : ''))
  // .replace(REGEX.allUppercase, ([letter]) => `-${letter ? letter.toLowerCase() : ''}`);
}

/**
 * Convert string of form 'myClass' to 'my-class'
 * @param str
 * @deprecated
 */
export function camelToDash(str: string): string {
  return str.replace(REGEX.camel2dash, '$1-$2').toLowerCase();
}

/**
 * Convert string of form 'my-class' to 'myClass'
 * @param str
 */
export function dash2camel(str: string): string {
  return str.replace(REGEX.dash2camel, function (k) {
    return k[1].toUpperCase();
  });
}

/**
 * Convert 'this_string_here' to 'This String Here'.
 * @param str
 * @returns
 */
export function underscoreCapitalize(str: string): string {
  return str
    .replace(REGEX.firstCapitalize, function ($1) {
      return $1.toUpperCase();
    })
    .replace(REGEX.allCapitalize, function ($1) {
      return $1.toUpperCase().replace('_', ' ');
    });
}
