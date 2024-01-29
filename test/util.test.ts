import {
  asFloat,
  asInt,
  camelToDash,
  deepCopy,
  deepEquals,
  hasValue,
  isArray,
  isBoolean,
  isDate,
  isDefined,
  isError,
  isFunction,
  isInteger,
  isNonEmptyString,
  isNull,
  isNumber,
  isObject,
  isPosNumber,
  isRegExp,
  isString,
  isType,
  isValidDate,
  omit,
  pad,
  pick,
  utilObj as t,
  underscoreCapitalize,
} from '../src';

describe('util', () => {
  describe('type', () => {
    const obj = {
      a: 'b',
      c: 'd',
      e: 4,
    };

    it('isString', () => {
      expect(isString('string')).toBe(true);
      expect(t({ a: 'string' }).property('a').isString()).toBe(true);
      expect(
        t({ a: { b: 'string' } })
          .prop('a.b')
          .isString(),
      ).toBe(true);
      expect(
        t({ a: { b: 'string' } })
          .property('a.c')
          .isString(),
      ).toBe(false);
      expect(isString(4)).toBe(false);
    });

    it('isNonEmptyString', () => {
      let s = 'my string';
      expect(isNonEmptyString(s)).toBe(true);
      expect(s).toEqual('my string');
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(4)).toBe(false);
    });

    it('isArray', () => {
      expect(isArray(['string'])).toBe(true);
      expect(isArray(4)).toBe(false);
      expect(isArray({ a: 'string' })).toBe(false);
    });

    it('isBoolean', () => {
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(undefined)).toBe(false);
    });

    it('isNumber', () => {
      expect(isNumber(4)).toBe(true);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber({})).toBe(false);
    });

    it('isPosNumber', () => {
      expect(isPosNumber(4)).toBe(true);
      expect(isPosNumber(NaN)).toBe(false);
      expect(isPosNumber(-0.01)).toBe(false);
      expect(isPosNumber(0)).toBe(false);
    });

    it('isInteger', () => {
      expect(isInteger(4)).toBe(true);
      expect(isInteger(NaN)).toBe(false);
      expect(isInteger(0.2)).toBe(false);
      expect(isInteger(0)).toBe(true);
      expect(isInteger(-1)).toBe(true);
    });

    it('isFunction', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction(3)).toBe(false);
      expect(isFunction(false)).toBe(false);
      expect(isFunction(() => {})).toBe(true);
    });

    it('isNull', () => {
      expect(isNull(null)).toBe(true);
      expect(isNull(false)).toBe(false);
      expect(isNull(() => {})).toBe(false);
    });

    it('isDefined', () => {
      expect(isDefined(null)).toBe(true);
      expect(isDefined(undefined)).toBe(false);
      expect(isDefined(false)).toBe(true);
      expect(isDefined(() => {})).toBe(true);
    });

    it('hasValue', () => {
      expect(hasValue('test')).toBe(true);
      expect(hasValue(NaN)).toBe(true);
      expect(hasValue(0.2)).toBe(true);
      expect(hasValue(0)).toBe(true);
      expect(hasValue(undefined)).toBe(false);
      expect(hasValue(null)).toBe(false);
      expect(hasValue({})).toBe(true);
    });

    it('isRegExp', () => {
      expect(isRegExp(/^.*$/)).toBe(true);
      expect(isRegExp({})).toBe(false);
      expect(isRegExp(false)).toBe(false);
      expect(isRegExp(Date.now())).toBe(false);
      expect(isRegExp(() => {})).toBe(false);
    });

    it('isObject', () => {
      expect(isObject(/^.*$/)).toBe(false);
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(false)).toBe(false);
      expect(isRegExp(Date.now())).toBe(false);
      expect(isObject(() => {})).toBe(false);
      expect(isObject(undefined)).toBe(false);
    });

    it('isDate', () => {
      expect(isDate(/^.*$/)).toBe(false);
      expect(isDate({})).toBe(false);
      expect(isDate(false)).toBe(false);
      expect(isDate(233433)).toBe(false);
      expect(isDate(new Date())).toBe(true);
      expect(isDate(() => {})).toBe(false);
    });

    it('isValidDate', () => {
      expect(isValidDate(/^.*$/)).toBe(false);
      expect(isValidDate({})).toBe(false);
      expect(isValidDate(false)).toBe(false);
      expect(isValidDate(233433)).toBe(false);
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('//'))).toBe(false);
      expect(isValidDate(() => {})).toBe(false);
    });

    it('isError', () => {
      expect(isError(/^.*$/)).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError(false)).toBe(false);
      expect(isError(new Error())).toBe(true);
      expect(isError(() => {})).toBe(false);
    });
    it('isType', () => {
      expect(isType('string', 'string')).toBe(true);
      expect(isType(false, 'string|number')).toBe(false);
      expect(isType(false, ' string,number,  boolean')).toBe(true);
      expect(isType(34, ' string,boolean', 'number')).toBe(true);
      expect(isType(34, ' string,boolean', ['number'])).toBe(true);
      expect(isType({}, ' string,boolean', ['number'])).toBe(false);
      expect(isType({}, 'object')).toBe(true);
      expect(isType(34, 'date')).toBe(false);
      expect(() => {
        isType(34, 'xxx,yyy');
      }).toThrow('Invalid type [xxx,yyy]');
      expect(isType(new Date(), 'date')).toBe(true);
    });
    it('isType property', () => {
      expect(t({ a: 3 }).property('a').isType('number')).toBe(true);
      expect(t({ a: 3 }).property('a').isType('string')).toBe(false);
      expect(
        t({ a: { b: 3 } })
          .property('a.b')
          .isType('string|number'),
      ).toBe(true);
      expect(() => {
        t({ a: { b: 3 } }, { throw: true })
          .property('a.c')
          .isType('string|number');
      }).toThrow('Property a.c not found in object');
      expect(() => {
        t({ a: { b: 3 } }, { throw: true, src: 'test' })
          .property('a.c')
          .isType('string|number');
      }).toThrow('Property a.c not found in test');
    });
  });

  describe('utilObj', () => {
    it('value1', () => {
      expect(
        t({ a: { b: 3 } })
          .property('a.b')
          .value(),
      ).toBe(3);
    });
    it('value2', () => {
      expect(
        t({ a: { b: 3 } })
          .property('a')
          .prop('b')
          .value(),
      ).toBe(3);
    });
    it('value3', () => {
      expect(
        t({ a: { b: 3 } })
          .property('a')
          .reset()
          .prop('a.b')
          .value(),
      ).toBe(3);
    });

    it('setVal', () => {
      expect(
        t({ a: { b: 3 } })
          .prop('a.b')
          .setVal(5)
          .property('a')
          .reset()
          .prop('a.b')
          .value(),
      ).toBe(5);
    });
  });

  describe('deep', () => {
    const obj = {
      a: 'b',
      c: 'd',
      e: 4,
    };
    it('pick and deepEquals', () => {
      let result1 = deepEquals(pick(obj, 'a', 'e'), { a: 'b', e: 4 });
      expect(result1).toBe(true);
      let result2 = deepEquals(pick(obj, 'a', 'e'), { a: 'b', e: 5 });
      expect(result2).toBe(false);
      let result3 = deepEquals(pick(obj, ['a', 'c']), { a: 'b', c: 'd' });
      expect(result3).toBe(true);
    });

    it('omit and deepEquals', () => {
      let result1 = deepEquals(omit(obj, 'a', 'e'), { c: 'd' });
      expect(result1).toBe(true);
      let result2 = deepEquals(omit(obj, 'e'), { a: 'b', c: 'd' });
      expect(result2).toBe(true);
      let result3 = deepEquals(omit(obj, ['a', 'c']), { e: 4 });
      expect(result3).toBe(true);
      let result4 = deepEquals(omit(obj, 'e'), { a: 'b', c: 'f' });
      expect(result4).toBe(false);
    });
  });

  describe('deepCopy', () => {
    const obj = {
      a: 'b',
      c: '{home}/hello/world',
      e: 4,
      f: [{ a: '{home}/hello/world' }],
      g: { pattern: 'serial$', flags: 'i' },
      h: { pattern: '(a|bc)' },
    };
    const obj1 = {
      a: 'b',
      c: '<{home}>/hello/world',
      e: 4,
      f: [{ a: '<{home}>/hello/world' }],
      g: { pattern: 'serial$', flags: 'i' },
      h: { pattern: '(a|bc)' },
    };
    const obj2 = {
      a: 'b',
      c: 'well$$$/hello/world',
      e: 4,
      f: [{ a: 'well$$$/hello/world' }],
      g: { pattern: 'serial$', flags: 'i' },
      h: { pattern: '(a|bc)' },
    };
    const obj3 = {
      a: 'b',
      c: 'well$$$/hello/world',
      e: 4,
      f: [{ a: 'well$$$/hello/world' }],
      g: /serial$/i,
      h: /(a|bc)/,
    };
    const replace = { home: 'well$$$' };
    it('no replace', () => {
      let result1 = deepCopy(obj);
      let isEqual1: boolean = deepEquals(obj, result1);
      expect(isEqual1).toBe(true);
    });
    it('replace', () => {
      let result2 = deepCopy(obj, { replace: replace });
      let isEqual2: boolean = deepEquals(obj, result2);
      expect(isEqual2).toBe(false);
      expect(result2).toEqual(obj2);
      let isEqual3: boolean = deepEquals(obj2, result2);
      expect(isEqual3).toBe(true);
    });
    it('replace change delimiter', () => {
      let result1 = deepCopy(obj1, { replace: replace, pre: '<{', post: '}>' });
      let isEqual2: boolean = deepEquals(obj, result1);
      expect(isEqual2).toBe(false);
      expect(result1).toEqual(obj2);
      let isEqual3: boolean = deepEquals(obj2, result1);
      expect(isEqual3).toBe(true);
    });
    it('regexp', () => {
      let result3 = deepCopy(obj, { replace: replace, detectRegExp: true });
      expect(result3).toEqual(obj3);
      let isEqual4: boolean = deepEquals(obj, result3);
      expect(isEqual4).toBe(false);
      let isEqual5: boolean = deepEquals(obj3, result3);
      expect(isEqual5).toBe(true);
    });
  });

  describe('translate', () => {
    it('camelToDash', () => {
      expect(camelToDash('myStringHere')).toEqual('my-string-here');
      expect(camelToDash('MyStringHere')).toEqual('my-string-here');
    });
    it('underscoreCapitalize', () => {
      expect(underscoreCapitalize('my_string_here')).toEqual('My String Here');
      expect(underscoreCapitalize('anOTHer_String')).toEqual('AnOTHer String');
    });
    it('pad', () => {
      expect(pad(32, 4)).toEqual('0032');
      expect(pad(32, 4, 'a')).toEqual('aa32');
      expect(pad(32, 2)).toEqual('32');
    });
    it('asInt', () => {
      expect(asInt(32)).toEqual(32);
      expect(asInt(32.5)).toEqual(33);
      expect(asInt(9.49)).toEqual(9);
      expect(asInt('9.49')).toEqual(9);
      expect(asInt('11.5')).toEqual(12);
      expect(asInt('aba')).toEqual(0);
      expect(asInt([])).toEqual(0);
    });
    it('asFloat', () => {
      expect(asFloat(32)).toEqual(32);
      expect(asFloat(32.5)).toEqual(32.5);
      expect(asFloat('32.5')).toEqual(32.5);
      expect(asFloat('9.49')).toEqual(9.49);
      expect(asFloat('11.5')).toEqual(11.5);
      expect(asFloat('aba')).toEqual(0);
      expect(asFloat('aba', { def: 4 })).toEqual(4);
      expect(asFloat('32,222,456.55')).toEqual(32222456.55);
      expect(asFloat('32.222.456,55', { commaAsDecimal: true })).toEqual(32222456.55);
      expect(asFloat([])).toEqual(0);
    });
  });
});
