// src/index.ts
function isBoolean(val) {
  return typeof val === "boolean";
}
function isString(val) {
  return typeof val === "string";
}
function isNumber(val) {
  return typeof val === "number" && !isNaN(val);
}
function isInteger(val) {
  return isNumber(val) && Number.isInteger(val);
}
function isPosInteger(val) {
  return isInteger(val) && val > 0;
}
function isPosNumber(val) {
  return typeof val === "number" && !isNaN(val) && val > 0;
}
function isNonEmptyString(val) {
  return typeof val === "string" && val.length > 0;
}
function isFunction(val) {
  return typeof val === "function";
}
function isDate(val) {
  return val instanceof Date;
}
function isValidDate(val) {
  return val instanceof Date && !isNaN(val.getTime());
}
function isArray(val) {
  return Array.isArray(val);
}
function isNonEmptyArray(val) {
  return Array.isArray(val) && val.length > 0;
}
function isRegExp(val) {
  return val instanceof RegExp;
}
function isNull(val) {
  return val === null ? true : false;
}
function isDefined(val) {
  return val !== undefined;
}
function isDict(val) {
  if (!isObject(val)) {
    return false;
  }
  return true;
}
function hasValue(val) {
  return val !== null && val !== undefined;
}
function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
function isError(val) {
  return val instanceof Error;
}
function isObject(val) {
  return val !== null && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date) && !(val instanceof RegExp);
}
function pick(obj, ...args) {
  const result = {};
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
function omit(obj, ...args) {
  if (Array.isArray(args[0])) {
    args = args[0];
  }
  const keys = Object.keys(obj).filter((key) => args.indexOf(key) < 0);
  const newObj = {};
  keys.forEach((k) => {
    newObj[k] = obj[k];
  });
  return newObj;
}
function isTrue(val) {
  if (typeof val === "number") {
    return val > 0 ? true : false;
  } else if (typeof val === "string") {
    return val.length && !REGEX.isFalse.test(val) ? true : false;
  } else if (typeof val === "boolean") {
    return val;
  }
  return false;
}
function isFalse(val) {
  if (typeof val === "number") {
    return val === 0 ? true : false;
  } else if (typeof val === "string") {
    return val.length && !REGEX.isTrue.test(val) ? true : false;
  } else if (typeof val === "boolean") {
    return val;
  }
  return false;
}
function asFloat(val, opts) {
  if (typeof val === "number") {
    return val;
  }
  let v;
  if (isNonEmptyString(val)) {
    let s;
    if (opts && opts.commaAsDecimal) {
      s = val.replace(/(\d)\.(\d)/g, "$1$2").replace(/(\d),/g, "$1.");
    } else {
      s = val.replace(/(\d),(\d)/g, "$1$2");
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
function asInt(val) {
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
function asRegExp(val) {
  if (isRegExp(val)) {
    return val;
  } else if (isDict(val) && isString(val.pattern)) {
    const keys = Object.keys(val);
    if (isString(val.flags) && keys.length === 2) {
      return new RegExp(val.pattern, val.flags);
    } else if (keys.length === 1) {
      return new RegExp(val.pattern);
    }
  }
}
function pad(n, width, z = "0") {
  const sn = String(n);
  return sn.length >= width ? sn : new Array(width - sn.length + 1).join(z) + sn;
}
function roundNumber(num, dec = 3) {
  const factor = Math.pow(10, dec);
  return Math.round(num * factor) / factor;
}
function deepCopy(a, opts) {
  if (a === undefined || a === null) {
    return a;
  } else if (typeof a === "number") {
    return a;
  } else if (typeof a === "string") {
    if (opts && opts.replace) {
      let r = a;
      Object.keys(opts.replace).forEach((b) => {
        const m = "{" + b + "}";
        if (r.includes(m)) {
          r = r.replace(m, opts.replace[b]);
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
    const re = opts && opts.detectRegExp ? asRegExp(a) : undefined;
    if (re) {
      return re;
    } else {
      const result2 = {};
      Object.keys(a).forEach((key) => {
        result2[key] = deepCopy(a[key], opts);
      });
      return result2;
    }
  }
  return a;
}
function deepEquals(a, b) {
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
  if (a instanceof Date) {
    return false;
  }
  if (!(a instanceof Object)) {
    return false;
  }
  if (!(b instanceof Object)) {
    return false;
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (kb.length === ka.length) {
    return ka.every((k) => {
      return deepEquals(a[k], b[k]);
    });
  }
  return false;
}
function compareDictValue(a, b, key) {
  if (a[key] < b[key]) {
    return -1;
  }
  if (a[key] > b[key]) {
    return 1;
  }
  return 0;
}
var _isSet = function(a) {
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
};
function asError(...args) {
  let err;
  const msg = [];
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
      err = new Error(msg.join(" "));
    } else {
      err.message = msg.join(" ");
    }
  }
  return err;
}
function delayPromise(ms) {
  return new Promise((resolve) => {
    setTimeout(function() {
      resolve();
    }, ms);
  });
}
function isClass(obj, name) {
  return isObject(obj) && obj.constructor.name === name;
}
function camelToDash(str) {
  return str.replace(REGEX.firstUppercase, ([first]) => first.toLowerCase()).replace(REGEX.allUppercase, ([letter]) => `-${letter.toLowerCase()}`);
}
function underscoreCapitalize(str) {
  return str.replace(REGEX.firstCapitalize, function($1) {
    return $1.toUpperCase();
  }).replace(REGEX.allCapitalize, function($1) {
    return $1.toUpperCase().replace("_", " ");
  });
}
function isType(val, ...types) {
  let util = new Util(val);
  return util.isType(...types);
}
function util() {
  return new Util;
}
function utilObj(val, opts) {
  return new Util(val, opts);
}
var REGEX = {
  isTrue: new RegExp(/^true$/, "i"),
  isFalse: new RegExp(/^false$/, "i"),
  customElement: new RegExp(/CustomElement$/),
  firstUppercase: new RegExp(/(^[A-Z])/),
  allUppercase: new RegExp(/([A-Z])/, "g"),
  firstCapitalize: new RegExp(/^([a-z])/),
  allCapitalize: new RegExp(/(\_[a-z])/, "gi"),
  tr: new RegExp(/^\[tr\](.+)$/),
  html: new RegExp(/[&<>"'\/]/, "g"),
  instr: new RegExp(/^\[([^\]]+)\](.*)$/),
  typeSplit: new RegExp(/\s*[,\|]{1}\s*/)
};

class Util {
  _path = [];
  _throw = false;
  _val;
  _src;
  constructor(val, opts = {}) {
    this._val = val;
    this._throw = opts.throw === true ? true : false;
    this._src = opts.src;
  }
  reset() {
    this._path = [];
    return this;
  }
  prop(...path) {
    return this.property(...path);
  }
  property(...path) {
    this._path = this._path.concat(this._resolvePath(...path));
    return this;
  }
  source() {
    if (!this._src) {
      return "object";
    }
    if (isString(this._src)) {
      return this._src;
    }
    return this._src.toString();
  }
  throw(v) {
    this._throw = v === true ? true : false;
    return this;
  }
  val() {
    return this.value();
  }
  value() {
    let val = this._val;
    if (this._path.length) {
      for (let i = 0, n = this._path.length;i < n; ++i) {
        const k = this._path[i];
        if (val && (k in val)) {
          val = val[k];
        } else {
          if (this._throw) {
            throw new Error(`Property ${this._path.join(".")} not found in ${this.source()}`);
          }
          return;
        }
      }
    }
    return val;
  }
  _resolvePath(...path) {
    let a = [];
    path.forEach((arg) => {
      if (isString(arg)) {
        arg = arg.replace(/\[(\w+)\]/g, ".$1");
        arg = arg.replace(/^\./, "");
        const args = arg.split(".");
        a = [...a, ...args];
      } else if (isArray(arg)) {
        a = [...a, ...arg];
      }
    });
    return a;
  }
  setVal(value) {
    this.setValue(this._val, value);
    return this;
  }
  setValue(object, value) {
    let a = [];
    if (this._path && this._path.length && isDict(object)) {
      let obj = object;
      const n = this._path.length;
      for (let i = 0;i < n; ++i) {
        const k = this._path[i];
        if (obj) {
          if (i >= n - 1) {
            if (isDict(obj)) {
              obj[k] = value;
            }
          } else {
            if (!(k in obj)) {
              obj[k] = {};
            }
            obj = obj[k];
          }
        }
      }
    }
    return this;
  }
  asBoolean() {
    return isTrue(this.value());
  }
  asInt() {
    return asInt(this.value());
  }
  asFloat() {
    return asFloat(this.value());
  }
  asString() {
    return String(this.value());
  }
  isDict() {
    return isDict(this.value());
  }
  isBoolean() {
    return isBoolean(this.value());
  }
  isString() {
    return isString(this.value());
  }
  isNumber() {
    return isNumber(this.value());
  }
  isPosNumber() {
    return isPosNumber(this.value());
  }
  isInteger() {
    return isInteger(this.value());
  }
  isNonEmptyString() {
    return isNonEmptyString(this.value());
  }
  isFunction() {
    return isFunction(this.value());
  }
  isDate() {
    return isDate(this.value());
  }
  isValidDate() {
    return isValidDate(this.value());
  }
  isArray() {
    return isArray(this.value());
  }
  isNonEmptyArray() {
    return isNonEmptyArray(this.value());
  }
  isRegExp() {
    return isRegExp(this.value());
  }
  isNull() {
    return isNull(this.value());
  }
  isDefined() {
    return isDefined(this.value());
  }
  hasValue() {
    return hasValue(this.value());
  }
  isEmpty() {
    return isEmpty(this.value());
  }
  isError() {
    return isError(this.value());
  }
  isObject() {
    return isObject(this.value());
  }
  isType(...types) {
    let v = this.value();
    let ts = [];
    for (const t of types) {
      if (isNonEmptyString(t)) {
        ts = [...ts, ...t.trim().split(REGEX.typeSplit)];
      } else if (isArray(t)) {
        for (const t1 of t) {
          if (isNonEmptyString(t1)) {
            ts = [...ts, ...t1.split(REGEX.typeSplit)];
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
      let fn = "is" + t.charAt(0).toUpperCase() + t.slice(1);
      if (isFunction(this[fn])) {
        if (this[fn](v)) {
          return true;
        }
      } else {
        errors.push(t);
      }
    }
    if (errors.length) {
      throw new Error(`Invalid type [${errors.join(",")}]`);
    }
    return false;
  }
}
export {
  utilObj,
  util,
  underscoreCapitalize,
  roundNumber,
  pick,
  pad,
  omit,
  isValidDate,
  isType,
  isTrue,
  isString,
  isRegExp,
  isPosNumber,
  isPosInteger,
  isObject,
  isNumber,
  isNull,
  isNonEmptyString,
  isNonEmptyArray,
  isInteger,
  isFunction,
  isFalse,
  isError,
  isEmpty,
  isDict,
  isDefined,
  isDate,
  isClass,
  isBoolean,
  isArray,
  hasValue,
  delayPromise,
  deepEquals,
  deepCopy,
  compareDictValue,
  camelToDash,
  asRegExp,
  asInt,
  asFloat,
  asError,
  Util
};
