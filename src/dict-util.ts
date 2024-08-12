import {
  asBoolean,
  asFloat,
  asInt,
  asRegExp,
  hasValue,
  Integer,
  isArray,
  isBoolean,
  isDate,
  isDefined,
  isDict,
  isEmpty,
  isError,
  isFunction,
  isInteger,
  isNonEmptyArray,
  isNonEmptyString,
  isNull,
  isNumber,
  isObject,
  isPosInteger,
  isPosNumber,
  isRegExp,
  isRegExpDef,
  isString,
  isValidDate,
  isWholeNumber,
} from './util';

const REGEX = {
  typeSplit: new RegExp(/\s*[,\|]{1}\s*/),
};

/**
 * Verify that val is any one of the basic types.
 * @param val - The value to be tested
 * @param types
 */
export function isType(val: any, ...types: (string | string[])[]) {
  let util = new DictUtil(val);
  return util.isType(...types);
}

export interface IDictUtilSource {
  toString(): string;
}

export type DictUtilOpts = {
  throw?: boolean;
  src?: string | IDictUtilSource;
};

export function dictUtil(val: any, opts?: DictUtilOpts) {
  return new DictUtil(val, opts);
}

export class DictUtil {
  // protected _path?: string[] = [];
  // protected _throw: boolean = false;
  protected _val?: any;
  protected _opts: DictUtilOpts;
  // protected _src?: ITypeDictSource;

  constructor(val?: any, opts: DictUtilOpts = {}) {
    this._val = val;
    this._opts = opts;
    // this._throw = opts.throw === true ? true : false;
    // this._src = opts.src;
  }

  prop(...path: string[]): DictUtil {
    return this.property(...path);
  }

  /**
   * Retrieve the property at the nested path within this object.
   * @param path A path such as 'attributes.createdAt' or 'attribute', 'createdAt'
   * @returns TypeDict or undefined
   */
  property(...path: string[]): DictUtil {
    const p = DictUtil.resolvePath(...path);
    let val = this._val;
    if (p && p.length) {
      for (let i = 0, n = p.length; i < n; ++i) {
        const k = p[i];
        if (val && isObject(val) && val.hasOwnProperty(k)) {
          val = val[k];
        } else {
          if (this._opts.throw) {
            throw new Error(`Property ${p.join('.')} not found in ${this.source()}`);
          }
          val = undefined;
        }
      }
    }
    const opts: DictUtilOpts = {
      throw: this._opts.throw,
      src: [this._opts.src, ...p].join('.'),
    };
    return new DictUtil(val, opts);
  }

  private source() {
    if (!this._opts.src) {
      return 'object';
    }
    if (isString(this._opts.src)) {
      return this._opts.src;
    }
    return this._opts.src.toString();
  }

  throw(v?: boolean) {
    this._opts.throw = v === true ? true : false;
    return this;
  }

  /**
   * Return the raw value of this object
   * @returns
   */
  val(): any {
    return this._val;
  }

  value(): any {
    return this._val;
  }

  protected static resolvePath(...path: (string | string[])[]): string[] {
    let a: string[] = [];
    path.forEach((arg) => {
      if (isString(arg)) {
        arg = arg.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        arg = arg.replace(/^\./, ''); // strip a leading dot
        const args = arg.split('.');
        a = [...a, ...args];
      } else if (isArray(arg)) {
        a = [...a, ...arg];
      }
    });
    return a;
  }

  asBoolean(defval = false): boolean {
    return asBoolean(this._val);
  }

  asInt(defVal = 0): Integer {
    return asInt(this._val, defVal);
  }

  asFloat(defVal: number = 0, commaAsDecimal = false): number {
    return asFloat(this._val, { def: defVal, commaAsDecimal: commaAsDecimal });
  }

  asString(): string {
    return String(this._val);
  }

  asRegExp(): RegExp | undefined {
    return asRegExp(this._val);
  }

  isDict() {
    return isDict(this._val);
  }

  isBoolean() {
    return isBoolean(this._val);
  }

  isString() {
    return isString(this._val);
  }

  isNumber() {
    return isNumber(this._val);
  }

  isPosNumber() {
    return isPosNumber(this._val);
  }

  isInteger() {
    return isInteger(this._val);
  }

  isPosInteger() {
    return isPosInteger(this._val);
  }

  isWholeNumber() {
    return isWholeNumber(this._val);
  }

  isNonEmptyString() {
    return isNonEmptyString(this._val);
  }

  isFunction() {
    return isFunction(this._val);
  }

  isDate() {
    return isDate(this._val);
  }

  isValidDate() {
    return isValidDate(this._val);
  }

  isArray() {
    return isArray(this._val);
  }

  isNonEmptyArray() {
    return isNonEmptyArray(this._val);
  }

  isRegExp() {
    return isRegExp(this._val);
  }

  isRegExpDef() {
    return isRegExpDef(this._val);
  }

  isNull() {
    return isNull(this._val);
  }

  isDefined() {
    return isDefined(this._val);
  }

  hasValue() {
    return hasValue(this._val);
  }

  isEmpty() {
    return isEmpty(this._val);
  }

  isError() {
    return isError(this._val);
  }

  isObject() {
    return isObject(this._val);
  }

  isType(...types: (string | string[])[]) {
    let v = this._val;
    let ts: any[] = [];

    for (const t of types) {
      if (isNonEmptyString(t)) {
        ts = [...ts, ...t.trim().split(REGEX.typeSplit)];
      } else if (isArray(t)) {
        for (const t1 of t) {
          if (isNonEmptyString(t1)) {
            ts = [...ts, ...(t1 as string).split(REGEX.typeSplit)];
          }
        }
      }
    }
    let ts2 = [];
    for (const t of ts) {
      if (isString(t)) {
        let s = t.trim();
        if (s.length) {
          ts2.push(s);
        }
      }
    }
    let errors = [];
    for (const t of ts2) {
      let fn = 'is' + t.charAt(0).toUpperCase() + t.slice(1);
      // @ts-ignore
      if (isFunction(this[fn])) {
        // @ts-ignore
        if (this[fn](v)) {
          return true;
        }
      } else {
        errors.push(t);
      }
    }
    if (errors.length) {
      throw new Error(`Invalid type [${errors.join(',')}]`);
    }
    return false;
  }
}
